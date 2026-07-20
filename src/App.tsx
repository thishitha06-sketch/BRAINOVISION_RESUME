import React, { useState, useEffect } from 'react';
import { ResumeData, TemplateId, SavedResume } from './types';
import { sampleResumeData, emptyResumeData } from './sampleData';
import ResumeForm from './components/ResumeForm';
import ResumePreview from './components/ResumePreview';
import { 
  Sparkles, FileText, Download, Printer, Save, Upload, Sun, Moon, 
  RefreshCw, FileCode, CheckCircle2, Layout, Layers, HelpCircle, ArrowRight,
  Trash2, Lightbulb
} from 'lucide-react';

export default function App() {
  // General UI States
  const [showLanding, setShowLanding] = useState<boolean>(true);
  const [templateId, setTemplateId] = useState<TemplateId>('professional');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit'); // Mobile toggle tab
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  // Resume Data States
  const [resumeData, setResumeData] = useState<ResumeData>(emptyResumeData);
  const [resumeTitle, setResumeTitle] = useState<string>("My Resume");
  const [activeResumeId, setActiveResumeId] = useState<string | null>(null);

  // Saved Resumes list state
  const [savedResumes, setSavedResumes] = useState<SavedResume[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Custom dialog modal states
  const [activeModal, setActiveModal] = useState<{
    type: 'confirm-reset' | 'confirm-delete' | 'prompt-save';
    title: string;
    message: string;
    inputVal?: string;
    onConfirm: (val?: string) => void;
  } | null>(null);
  const [modalInput, setModalInput] = useState<string>("");

  useEffect(() => {
    if (activeModal) {
      setModalInput(activeModal.inputVal || "");
    } else {
      setModalInput("");
    }
  }, [activeModal]);

  // Toggle Dark Mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Load from local storage on initial load
  useEffect(() => {
    const localData = localStorage.getItem('local_resume_data');
    if (localData) {
      try {
        setResumeData(JSON.parse(localData));
      } catch (e) {
        console.error("Failed to parse local resume data.");
      }
    }
    const localTemplate = localStorage.getItem('local_template_id');
    if (localTemplate) {
      setTemplateId(localTemplate as TemplateId);
    }

    // Load saved resumes list
    const list = localStorage.getItem('local_saved_resumes');
    if (list) {
      try {
        setSavedResumes(JSON.parse(list));
      } catch (e) {
        console.error("Failed to parse saved resumes.");
      }
    }
  }, []);

  // Helper: Trigger UI notifications
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Sync / Auto-Save resume data locally whenever it changes
  const handleDataChange = (newData: ResumeData) => {
    setResumeData(newData);
    localStorage.setItem('local_resume_data', JSON.stringify(newData));
  };

  // Change Template preference
  const handleTemplateChange = (id: TemplateId) => {
    setTemplateId(id);
    localStorage.setItem('local_template_id', id);
    triggerToast(`Switched to ${id.toUpperCase()} layout!`);
  };

  // Reset current form state
  const handleResetForm = () => {
    setActiveModal({
      type: 'confirm-reset',
      title: 'Clear Resume Form',
      message: 'Are you sure you want to clear the entire form? This action will reset all sections to empty and cannot be undone.',
      onConfirm: () => {
        handleDataChange(emptyResumeData);
        setActiveResumeId(null);
        setResumeTitle("My Resume");
        triggerToast("Form cleared successfully.");
        setActiveModal(null);
      }
    });
  };

  // One-click Populate Sample Data
  const handlePopulateSample = () => {
    handleDataChange(sampleResumeData);
    setResumeTitle("Alex Rivera - Senior Resume");
    triggerToast("Sample resume loaded! Try switching templates.");
  };

  // JSON Save Backup file
  const handleSaveJSON = () => {
    const dataStr = JSON.stringify({
      title: resumeTitle,
      templateId,
      data: resumeData
    }, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${resumeTitle.replace(/\s+/g, '_')}_backup.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    triggerToast("JSON backup downloaded!");
  };

  // JSON Load File upload
  const handleLoadJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    const file = event.target.files?.[0];
    if (!file) return;

    fileReader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target?.result as string);
        if (parsed.data) {
          handleDataChange(parsed.data);
          if (parsed.title) setResumeTitle(parsed.title);
          if (parsed.templateId) setTemplateId(parsed.templateId as TemplateId);
          triggerToast("Backup loaded successfully!");
        } else {
          // Fallback if uploading pure resume data without wrapper
          handleDataChange(parsed);
          triggerToast("Resume data loaded successfully!");
        }
      } catch (err) {
        alert("Invalid file format. Please upload a valid AI Resume Builder JSON file.");
      }
    };
    fileReader.readAsText(file);
  };

  // Print/Download PDF action
  const handlePrint = () => {
    window.print();
  };

  // ================= STORAGE / SAVE ACTIONS =================

  // Save resume locally in browser's localStorage list
  const handleSaveResume = () => {
    setActiveModal({
      type: 'prompt-save',
      title: 'Save Resume Version',
      message: 'Enter a name/title for this resume version:',
      inputVal: resumeTitle,
      onConfirm: (finalTitle) => {
        const title = (finalTitle || '').trim() || "My Resume";
        setResumeTitle(title);

        const resumeId = activeResumeId || `resume-${Date.now()}`;
        const savedObj: SavedResume = {
          id: resumeId,
          userId: 'local-user',
          title,
          data: resumeData,
          templateId,
          updatedAt: Date.now()
        };

        try {
          const currentList = [...savedResumes];
          const idx = currentList.findIndex(r => r.id === resumeId);
          if (idx >= 0) {
            currentList[idx] = savedObj;
          } else {
            currentList.push(savedObj);
          }
          const sorted = currentList.sort((a, b) => b.updatedAt - a.updatedAt);
          setSavedResumes(sorted);
          localStorage.setItem('local_saved_resumes', JSON.stringify(sorted));
          setActiveResumeId(resumeId);
          triggerToast("Saved successfully to browser storage!");
        } catch (err: any) {
          console.error(err);
          triggerToast("Failed to save resume: " + err.message);
        }
        setActiveModal(null);
      }
    });
  };

  // Load selected saved resume into active workspace
  const handleLoadSavedResume = (resume: SavedResume) => {
    setResumeData(resume.data);
    setResumeTitle(resume.title);
    setTemplateId(resume.templateId);
    setActiveResumeId(resume.id);
    triggerToast(`Loaded "${resume.title}" successfully!`);
    setShowLanding(false);
  };

  // Delete saved resume
  const handleDeleteSavedResume = (resumeId: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Avoid triggering load
    setActiveModal({
      type: 'confirm-delete',
      title: 'Delete Saved Resume',
      message: 'Are you sure you want to delete this saved resume from browser storage?',
      onConfirm: () => {
        try {
          const filtered = savedResumes.filter(r => r.id !== resumeId);
          setSavedResumes(filtered);
          localStorage.setItem('local_saved_resumes', JSON.stringify(filtered));
          if (activeResumeId === resumeId) {
            setActiveResumeId(null);
          }
          triggerToast("Deleted successfully.");
        } catch (err: any) {
          triggerToast("Failed to delete resume: " + err.message);
        }
        setActiveModal(null);
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      
      {/* 1. Global Interactive Notifications (Toasts) */}
      {toastMessage && (
        <div className="toast fixed bottom-5 right-5 z-50 bg-slate-900 text-slate-100 dark:bg-white dark:text-slate-900 text-xs px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-slate-800 dark:border-slate-200 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* 2. Top Navigation Bar (Hidden during Print) */}
      <nav id="dashboard-toolbar" className="no-print bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700/80 sticky top-0 z-30 px-4 py-3 shadow-sm transition-colors duration-200">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          
          {/* Logo Title */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setShowLanding(true)}>
            <div className="bg-blue-600 text-white p-2 rounded-lg shadow-md shadow-blue-500/10">
              <Sparkles className="w-5 h-5 text-amber-300 fill-amber-300" />
            </div>
            <div>
              <span className="text-md font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-300">
                AI Resume Builder
              </span>
              <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-0.5">Offline Resume Workspace</span>
            </div>
          </div>

          {/* Quick Controls */}
          <div className="flex items-center gap-2.5">
            {/* Dark Mode toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-lg transition-colors"
              title="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Load JSON Input Shortcut */}
            <label className="p-2 cursor-pointer text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-semibold" title="Upload Backup JSON">
              <Upload className="w-4 h-4" />
              <span className="hidden md:inline">Load Backup</span>
              <input type="file" accept=".json" onChange={handleLoadJSON} className="hidden" />
            </label>

            <span className="h-5 w-px bg-slate-200 dark:bg-slate-700 hidden sm:inline"></span>

            {/* Status indicator */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/60 rounded-lg text-xs text-emerald-700 dark:text-emerald-400 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Offline Ready
            </div>
          </div>
        </div>
      </nav>

      {/* 3. Landing Hero Section or Workspace */}
      {showLanding ? (
        <div className="flex-1 flex flex-col justify-center max-w-5xl mx-auto px-4 py-12 md:py-20 animate-fade-in no-print">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Hero text */}
            <div className="md:col-span-7 space-y-6 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900 px-3.5 py-1.5 rounded-full text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" />
                Gemini 3.5 AI Enabled
              </div>
              
              <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none text-slate-900 dark:text-white">
                Build a Breathtaking Resume in{' '}
                <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">Seconds</span>.
              </h1>
              
              <p className="text-slate-500 dark:text-slate-400 text-sm md:text-md leading-relaxed max-w-xl">
                Design bulletproof professional summaries, optimize work experience, suggest missing technologies, and save multiple versions completely offline in your browser.
              </p>

              <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-2">
                <button
                  onClick={() => setShowLanding(false)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-6 py-3 rounded-xl shadow-lg shadow-blue-500/15 flex items-center gap-1.5 transition-all hover:translate-x-1"
                >
                  Create New Resume <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    handlePopulateSample();
                    setShowLanding(false);
                  }}
                  className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-350 dark:hover:border-slate-600 text-slate-700 dark:text-slate-200 font-semibold text-sm px-6 py-3 rounded-xl transition-all"
                >
                  Explore Sample Data
                </button>
              </div>

              {/* Status information */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200 dark:border-slate-800 text-center md:text-left">
                <div>
                  <span className="block text-xl font-bold text-slate-800 dark:text-white">3</span>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Premium Layouts</span>
                </div>
                <div>
                  <span className="block text-xl font-bold text-slate-800 dark:text-white">Offline</span>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Local storage fallback</span>
                </div>
                <div>
                  <span className="block text-xl font-bold text-slate-800 dark:text-white">1-Click</span>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">PDF Download / Print</span>
                </div>
              </div>
            </div>

            {/* Saved Resumes List (Right hand side of landing card) */}
            <div className="md:col-span-5 bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-blue-500" />
                Saved Resumes ({savedResumes.length})
              </h3>

              <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
                {savedResumes.length > 0 ? (
                  savedResumes.map((resume) => (
                    <div
                      key={resume.id}
                      onClick={() => handleLoadSavedResume(resume)}
                      className="p-3 bg-slate-50 hover:bg-blue-50/50 dark:bg-slate-900/40 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-750 rounded-xl cursor-pointer flex justify-between items-center transition-all duration-150"
                    >
                      <div className="truncate">
                        <span className="block text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{resume.title}</span>
                        <span className="block text-[10px] text-slate-400 uppercase font-bold tracking-widest mt-0.5">{resume.templateId} • {new Date(resume.updatedAt).toLocaleDateString()}</span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleDeleteSavedResume(resume.id, e)}
                        className="text-slate-400 hover:text-rose-600 p-1.5"
                        title="Delete Resume"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic text-center py-6">You haven't saved any resumes locally yet.</p>
                )}
              </div>

              <div className="pt-2 border-t border-slate-150 dark:border-slate-700">
                <button
                  onClick={() => setShowLanding(false)}
                  className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-bold py-2.5 rounded-xl transition-all"
                >
                  Start Fresh Workspace
                </button>
              </div>
            </div>

          </div>
        </div>
      ) : (
        /* Workspace split grid */
        <div className="flex-1 max-w-[1600px] w-full mx-auto p-4 flex flex-col gap-4 animate-fade-in">
          
          {/* Active Workspace Header (Toolbar Controls) */}
          <div id="dashboard-header" className="no-print bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-sm transition-colors duration-200">
            
            {/* Version title and back to home */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowLanding(true)}
                className="text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors"
              >
                ◀ Return Home
              </button>
              <span className="text-slate-300 dark:text-slate-600 text-xs">|</span>
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={resumeTitle}
                  onChange={(e) => setResumeTitle(e.target.value)}
                  className="bg-transparent text-sm font-bold border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:outline-none dark:text-white"
                  title="Rename Version"
                />
              </div>
            </div>

            {/* Workspace Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Load Sample Data button */}
              <button
                onClick={handlePopulateSample}
                className="bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all"
                title="Populate Form with demo details"
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                <span>Demo Data</span>
              </button>

              {/* JSON export backup */}
              <button
                onClick={handleSaveJSON}
                className="bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all"
                title="Download JSON file backup"
              >
                <FileCode className="w-3.5 h-3.5 text-blue-500" />
                <span>Save JSON</span>
              </button>

              {/* Save version button */}
              <button
                onClick={handleSaveResume}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
                title="Save current version to browser storage"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Version</span>
              </button>

              {/* PDF Print / Export */}
              <button
                onClick={handlePrint}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-500/10 transition-all hover:scale-102"
                title="Print or export to PDF directly"
              >
                <Printer className="w-4 h-4" />
                <span>PDF / Print</span>
              </button>
            </div>
          </div>

          {/* Template Layout Selection bar (Hidden in Print) */}
          <div className="no-print bg-slate-100 dark:bg-slate-800/40 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3 transition-colors">
            
            {/* Desktop Tabs */}
            <div className="flex gap-1.5">
              {(['professional', 'modern', 'minimal'] as TemplateId[]).map((id) => (
                <button
                  key={id}
                  onClick={() => handleTemplateChange(id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                    templateId === id
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 hover:bg-white/40 dark:hover:bg-slate-800'
                  }`}
                >
                  {id}
                </button>
              ))}
            </div>

            {/* Mobile Form/Preview view toggler (only visible on small displays) */}
            <div className="md:hidden flex bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-0.5">
              <button
                onClick={() => setActiveTab('edit')}
                className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                  activeTab === 'edit'
                    ? 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                Edit Form
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                  activeTab === 'preview'
                    ? 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                Live Resume
              </button>
            </div>
          </div>

          {/* Core Split Grid Workspace */}
          <div id="main-workspace-grid" className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
            
            {/* Left sidebar Form block */}
            <div
              id="form-sidebar-container"
              className={`no-print md:col-span-5 space-y-4 ${
                activeTab === 'edit' ? 'block' : 'hidden md:block'
              }`}
            >
              <div className="bg-slate-50 dark:bg-slate-900 sticky top-24 max-h-[calc(100vh-180px)] overflow-y-auto pr-1">
                <ResumeForm
                  data={resumeData}
                  onChange={handleDataChange}
                  onReset={handleResetForm}
                />
              </div>
            </div>

            {/* Right live preview rendering card */}
            <div
              id="preview-section-wrapper"
              className={`md:col-span-7 ${
                activeTab === 'preview' ? 'block' : 'hidden md:block'
              }`}
            >
              <div className="bg-slate-100 dark:bg-slate-950/20 md:p-4 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 transition-colors">
                <ResumePreview
                  data={resumeData}
                  templateId={templateId}
                />
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 4. Footer (Hidden in print) */}
      <footer className="no-print mt-auto py-6 text-center border-t border-slate-200 dark:border-slate-800/60 bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-500 text-[11px] font-medium transition-colors">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div>
            AI Resume Builder • Google AI Studio Build Applet
          </div>
          <div className="flex gap-4">
            <span>Offline-First</span>
            <span>PDF Export Stylesheet</span>
            <span>Gemini Refined Text</span>
          </div>
        </div>
      </footer>

      {/* Custom Alert/Confirm/Prompt Modal */}
      {activeModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl w-full max-w-md overflow-hidden transform duration-200 scale-100">
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${
                  activeModal.type === 'confirm-delete' 
                    ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400' 
                    : activeModal.type === 'confirm-reset'
                    ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400'
                    : 'bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400'
                }`}>
                  {activeModal.type === 'confirm-delete' ? (
                    <Trash2 className="w-5 h-5" />
                  ) : activeModal.type === 'confirm-reset' ? (
                    <Trash2 className="w-5 h-5" />
                  ) : (
                    <Save className="w-5 h-5" />
                  )}
                </div>
                <h3 className="text-md font-bold text-slate-900 dark:text-white">
                  {activeModal.title}
                </h3>
              </div>
              
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {activeModal.message}
              </p>

              {activeModal.type === 'prompt-save' && (
                <div className="pt-1">
                  <input
                    type="text"
                    value={modalInput}
                    onChange={(e) => setModalInput(e.target.value)}
                    placeholder="e.g. Full Stack Engineer Resume v2"
                    className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-250 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        activeModal.onConfirm(modalInput);
                      }
                    }}
                  />
                </div>
              )}
            </div>

            <div className="bg-slate-50 dark:bg-slate-900/60 px-6 py-4 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-700/50">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  activeModal.onConfirm(modalInput);
                }}
                className={`px-4 py-2 text-xs font-semibold text-white rounded-xl shadow-sm transition-all ${
                  activeModal.type === 'confirm-delete'
                    ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-500/10'
                    : activeModal.type === 'confirm-reset'
                    ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-500/10'
                    : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/10'
                }`}
              >
                {activeModal.type === 'confirm-delete' 
                  ? 'Delete' 
                  : activeModal.type === 'confirm-reset'
                  ? 'Clear Form'
                  : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
