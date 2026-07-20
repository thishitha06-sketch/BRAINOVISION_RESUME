import React, { useState } from 'react';
import { ResumeData, EducationEntry, ProjectEntry, ExperienceEntry, CertificationEntry } from '../types';
import { 
  User, BookOpen, Code, Briefcase, FileText, Award, 
  Trash2, Plus, Sparkles, Languages, Lightbulb, RefreshCw, AlertCircle, X, HelpCircle
} from 'lucide-react';

interface ResumeFormProps {
  data: ResumeData;
  onChange: (newData: ResumeData) => void;
  onReset: () => void;
}

export default function ResumeForm({ data, onChange, onReset }: ResumeFormProps) {
  // Navigation: accordion state
  const [activeSection, setActiveSection] = useState<string>('personal');
  
  // Local state for adding individual list items
  const [newSkill, setNewSkill] = useState<string>('');
  const [newLanguage, setNewLanguage] = useState<string>('');
  const [newAchievement, setNewAchievement] = useState<string>('');
  const [newInterest, setNewInterest] = useState<string>('');

  // AI Loading indicators
  const [loadingObjective, setLoadingObjective] = useState(false);
  const [loadingSkills, setLoadingSkills] = useState(false);
  const [loadingExpIndex, setLoadingExpIndex] = useState<number | null>(null);
  const [loadingProjIndex, setLoadingProjIndex] = useState<number | null>(null);

  // Error Messages
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  // Popular skills shortcuts for quick adding
  const popularSkills = ["React", "Node.js", "TypeScript", "Python", "Java", "C++", "SQL", "HTML", "CSS", "JavaScript", "AWS", "Git"];

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? '' : section);
  };

  // Helper: general key change
  const handleFieldChange = (key: keyof ResumeData, value: any) => {
    onChange({
      ...data,
      [key]: value
    });

    // Validations
    if (key === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (value && !emailRegex.test(value)) {
        setEmailError('Please enter a valid email address.');
      } else {
        setEmailError('');
      }
    }
    if (key === 'phone') {
      const phoneRegex = /^[\d\s()+-]{7,20}$/;
      if (value && !phoneRegex.test(value)) {
        setPhoneError('Please enter a valid phone number format.');
      } else {
        setPhoneError('');
      }
    }
  };

  // Helper: List Updates (Education, Experience, Projects, Certifications)
  const addEducation = () => {
    const newEdu: EducationEntry = {
      id: `edu-${Date.now()}`,
      degree: '',
      collegeName: '',
      university: '',
      graduationYear: '',
      cgpa: ''
    };
    handleFieldChange('education', [...data.education, newEdu]);
  };

  const updateEducation = (index: number, fields: Partial<EducationEntry>) => {
    const updated = [...data.education];
    updated[index] = { ...updated[index], ...fields };
    handleFieldChange('education', updated);
  };

  const removeEducation = (index: number) => {
    const updated = data.education.filter((_, i) => i !== index);
    handleFieldChange('education', updated);
  };

  const addExperience = () => {
    const newExp: ExperienceEntry = {
      id: `exp-${Date.now()}`,
      companyName: '',
      jobRole: '',
      duration: '',
      responsibilities: ''
    };
    handleFieldChange('experience', [...data.experience, newExp]);
  };

  const updateExperience = (index: number, fields: Partial<ExperienceEntry>) => {
    const updated = [...data.experience];
    updated[index] = { ...updated[index], ...fields };
    handleFieldChange('experience', updated);
  };

  const removeExperience = (index: number) => {
    const updated = data.experience.filter((_, i) => i !== index);
    handleFieldChange('experience', updated);
  };

  const addProject = () => {
    const newProj: ProjectEntry = {
      id: `proj-${Date.now()}`,
      title: '',
      technologies: '',
      description: ''
    };
    handleFieldChange('projects', [...data.projects, newProj]);
  };

  const updateProject = (index: number, fields: Partial<ProjectEntry>) => {
    const updated = [...data.projects];
    updated[index] = { ...updated[index], ...fields };
    handleFieldChange('projects', updated);
  };

  const removeProject = (index: number) => {
    const updated = data.projects.filter((_, i) => i !== index);
    handleFieldChange('projects', updated);
  };

  const addCertification = () => {
    const newCert: CertificationEntry = {
      id: `cert-${Date.now()}`,
      name: '',
      issuer: '',
      year: ''
    };
    handleFieldChange('certifications', [...data.certifications, newCert]);
  };

  const updateCertification = (index: number, fields: Partial<CertificationEntry>) => {
    const updated = [...data.certifications];
    updated[index] = { ...updated[index], ...fields };
    handleFieldChange('certifications', updated);
  };

  const removeCertification = (index: number) => {
    const updated = data.certifications.filter((_, i) => i !== index);
    handleFieldChange('certifications', updated);
  };

  // Tag list management helpers
  const handleAddTag = (key: 'skills' | 'languages' | 'achievements' | 'interests', value: string, setter: (val: string) => void) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    if (!data[key].includes(trimmed)) {
      handleFieldChange(key, [...data[key], trimmed]);
    }
    setter('');
  };

  const handleRemoveTag = (key: 'skills' | 'languages' | 'achievements' | 'interests', index: number) => {
    const updated = data[key].filter((_, i) => i !== index);
    handleFieldChange(key, updated);
  };

  // ================= AI ACTION SERVICES =================

  // 1. Generate Career Objective summary with AI
  const handleAIGenerateObjective = async () => {
    if (!data.professionalTitle) {
      alert("Please provide a 'Professional Title' under Personal Information first, so the AI knows your background.");
      return;
    }
    setLoadingObjective(true);
    try {
      const response = await fetch("/api/ai/objective", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          professionalTitle: data.professionalTitle,
          skills: data.skills,
          details: data.objective // Uses current summary as helpful context if exists
        })
      });
      const resData = await response.json();
      if (resData.result) {
        handleFieldChange('objective', resData.result);
      } else if (resData.error) {
        alert("AI Service Alert: " + resData.error);
      }
    } catch (err: any) {
      alert("Failed to connect to AI Service. Ensure the server is online.");
    } finally {
      setLoadingObjective(false);
    }
  };

  // 2. Suggest relevant Skills with AI
  const handleAISuggestSkills = async () => {
    if (!data.professionalTitle) {
      alert("Please enter a 'Professional Title' under Personal Information so the AI can recommend skills for your job profile.");
      return;
    }
    setLoadingSkills(true);
    try {
      const response = await fetch("/api/ai/suggest-skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ professionalTitle: data.professionalTitle })
      });
      const resData = await response.json();
      if (resData.result && Array.isArray(resData.result)) {
        // Merge without duplicates
        const uniqueSkills = Array.from(new Set([...data.skills, ...resData.result]));
        handleFieldChange('skills', uniqueSkills);
      } else if (resData.error) {
        alert("AI Service Alert: " + resData.error);
      }
    } catch (err) {
      alert("Failed to connect to AI Service.");
    } finally {
      setLoadingSkills(false);
    }
  };

  // 3. Refine Experience Responsibilities with AI
  const handleAIRefineExperience = async (index: number) => {
    const exp = data.experience[index];
    if (!exp.jobRole || !exp.responsibilities) {
      alert("Please fill in the Job Role and current Responsibilities draft first, then click refine.");
      return;
    }
    setLoadingExpIndex(index);
    try {
      const response = await fetch("/api/ai/refine-experience", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: exp.companyName,
          jobRole: exp.jobRole,
          responsibilities: exp.responsibilities
        })
      });
      const resData = await response.json();
      if (resData.result) {
        updateExperience(index, { responsibilities: resData.result });
      } else if (resData.error) {
        alert("AI Service Alert: " + resData.error);
      }
    } catch (err) {
      alert("Failed to refine responsibilities.");
    } finally {
      setLoadingExpIndex(null);
    }
  };

  // 4. Refine Project Description with AI
  const handleAIRefineProject = async (index: number) => {
    const proj = data.projects[index];
    if (!proj.title || !proj.description) {
      alert("Please fill in the Project Title and Description draft first, then click refine.");
      return;
    }
    setLoadingProjIndex(index);
    try {
      const response = await fetch("/api/ai/refine-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: proj.title,
          technologies: proj.technologies,
          description: proj.description
        })
      });
      const resData = await response.json();
      if (resData.result) {
        updateProject(index, { description: resData.result });
      } else if (resData.error) {
        alert("AI Service Alert: " + resData.error);
      }
    } catch (err) {
      alert("Failed to refine project description.");
    } finally {
      setLoadingProjIndex(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* 1. Personal Information */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden transition-all duration-200">
        <button
          onClick={() => toggleSection('personal')}
          className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/40 font-semibold text-slate-800 dark:text-slate-100 hover:bg-slate-100/70 dark:hover:bg-slate-800 transition-colors"
        >
          <span className="flex items-center gap-2.5">
            <User className="w-5 h-5 text-blue-600" />
            Personal Information
          </span>
          <span className="text-slate-400 text-xs">{activeSection === 'personal' ? '▲' : '▼'}</span>
        </button>

        {activeSection === 'personal' && (
          <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-150 dark:border-slate-700">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">Full Name</label>
              <input
                type="text"
                placeholder="Alex Rivera"
                value={data.fullName}
                onChange={(e) => handleFieldChange('fullName', e.target.value)}
                className="w-full text-sm px-3.5 py-2 rounded-lg border border-slate-250 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">Professional Title</label>
              <input
                type="text"
                placeholder="Senior Full Stack Engineer"
                value={data.professionalTitle}
                onChange={(e) => handleFieldChange('professionalTitle', e.target.value)}
                className="w-full text-sm px-3.5 py-2 rounded-lg border border-slate-250 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5 flex justify-between">
                <span>Email Address</span>
                {emailError && <span className="text-rose-500 normal-case flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {emailError}</span>}
              </label>
              <input
                type="email"
                placeholder="alex.rivera@example.com"
                value={data.email}
                onChange={(e) => handleFieldChange('email', e.target.value)}
                className={`w-full text-sm px-3.5 py-2 rounded-lg border dark:bg-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                  emailError ? 'border-rose-300 focus:border-rose-500' : 'border-slate-250 dark:border-slate-700 focus:border-blue-500'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5 flex justify-between">
                <span>Phone Number</span>
                {phoneError && <span className="text-rose-500 normal-case flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {phoneError}</span>}
              </label>
              <input
                type="tel"
                placeholder="+1 (555) 019-2834"
                value={data.phone}
                onChange={(e) => handleFieldChange('phone', e.target.value)}
                className={`w-full text-sm px-3.5 py-2 rounded-lg border dark:bg-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                  phoneError ? 'border-rose-300 focus:border-rose-500' : 'border-slate-250 dark:border-slate-700 focus:border-blue-500'
                }`}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">Home Address / Location</label>
              <input
                type="text"
                placeholder="San Francisco, CA"
                value={data.address}
                onChange={(e) => handleFieldChange('address', e.target.value)}
                className="w-full text-sm px-3.5 py-2 rounded-lg border border-slate-250 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">LinkedIn Profile Link</label>
              <input
                type="text"
                placeholder="linkedin.com/in/username"
                value={data.linkedin}
                onChange={(e) => handleFieldChange('linkedin', e.target.value)}
                className="w-full text-sm px-3.5 py-2 rounded-lg border border-slate-250 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">GitHub Profile Link</label>
              <input
                type="text"
                placeholder="github.com/username"
                value={data.github}
                onChange={(e) => handleFieldChange('github', e.target.value)}
                className="w-full text-sm px-3.5 py-2 rounded-lg border border-slate-250 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">Portfolio Website</label>
              <input
                type="text"
                placeholder="myportfolio.dev"
                value={data.portfolio}
                onChange={(e) => handleFieldChange('portfolio', e.target.value)}
                className="w-full text-sm px-3.5 py-2 rounded-lg border border-slate-250 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* 2. Career Objective with AI summary builder */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden transition-all duration-200">
        <button
          onClick={() => toggleSection('objective')}
          className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/40 font-semibold text-slate-800 dark:text-slate-100 hover:bg-slate-100/70 dark:hover:bg-slate-800 transition-colors"
        >
          <span className="flex items-center gap-2.5">
            <FileText className="w-5 h-5 text-blue-600" />
            Career Objective / Summary
          </span>
          <span className="text-slate-400 text-xs">{activeSection === 'objective' ? '▲' : '▼'}</span>
        </button>

        {activeSection === 'objective' && (
          <div className="p-5 border-t border-slate-150 dark:border-slate-700 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-medium text-slate-400">CHARACTER COUNT: {data.objective?.length || 0} (RECOMMENDED 300-500)</span>
              
              <button
                type="button"
                onClick={handleAIGenerateObjective}
                disabled={loadingObjective}
                className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 font-bold hover:text-blue-700 disabled:opacity-60 transition-colors"
              >
                {loadingObjective ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    AI Crafting...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    AI Auto-Generate
                  </>
                )}
              </button>
            </div>

            <textarea
              rows={4}
              placeholder="Describe your career milestones, key proficiencies, and what you aim to contribute to the organization."
              value={data.objective}
              onChange={(e) => handleFieldChange('objective', e.target.value)}
              className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-slate-250 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
            <p className="text-[11px] text-slate-400 leading-normal">
              💡 <span className="font-semibold text-slate-500 dark:text-slate-300">Tip:</span> Ensure you have filled in your "Professional Title" under Personal Info so Gemini can tailor this beautifully to your industry!
            </p>
          </div>
        )}
      </div>

      {/* 3. Skills with tag rendering */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden transition-all duration-200">
        <button
          onClick={() => toggleSection('skills')}
          className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/40 font-semibold text-slate-800 dark:text-slate-100 hover:bg-slate-100/70 dark:hover:bg-slate-800 transition-colors"
        >
          <span className="flex items-center gap-2.5">
            <Code className="w-5 h-5 text-blue-600" />
            Skills ({data.skills.length})
          </span>
          <span className="text-slate-400 text-xs">{activeSection === 'skills' ? '▲' : '▼'}</span>
        </button>

        {activeSection === 'skills' && (
          <div className="p-5 border-t border-slate-150 dark:border-slate-700 space-y-4">
            {/* Input fields */}
            <div className="flex gap-2">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Enter a skill (e.g. Docker, TypeScript)"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag('skills', newSkill, setNewSkill))}
                  className="w-full text-sm px-3.5 py-2 rounded-lg border border-slate-250 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
              <button
                type="button"
                onClick={() => handleAddTag('skills', newSkill, setNewSkill)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-1 shadow-sm transition-colors"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>

            {/* AI Skill Suggestion button */}
            <div className="flex justify-between items-center flex-wrap gap-2 pt-1">
              <span className="text-xs font-bold text-slate-500">QUICK SKILL RECOMMANDER:</span>
              <button
                type="button"
                onClick={handleAISuggestSkills}
                disabled={loadingSkills}
                className="bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 hover:bg-blue-100 text-xs font-bold px-3 py-1.5 rounded-lg border border-blue-150 dark:border-blue-900 flex items-center gap-1 transition-colors"
              >
                {loadingSkills ? (
                  <>
                    <RefreshCw className="w-3 h-3 animate-spin" /> Analyzing Job Title...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-blue-500" /> AI Recommended Skills
                  </>
                )}
              </button>
            </div>

            {/* Render added skills */}
            {data.skills.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 p-3.5 bg-slate-50 dark:bg-slate-900/40 border border-slate-150 dark:border-slate-700/80 rounded-xl">
                {data.skills.map((skill, idx) => (
                  <span key={idx} className="bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs px-2.5 py-1 rounded-lg border border-blue-100 dark:border-blue-900 font-semibold flex items-center gap-1">
                    {skill}
                    <button type="button" onClick={() => handleRemoveTag('skills', idx)} className="hover:text-rose-600 text-blue-400">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No skills added yet. Add manually above or use the AI Recommendations.</p>
            )}

            {/* Shortcuts */}
            <div className="pt-2">
              <span className="block text-xs font-semibold text-slate-400 mb-2">POPULAR QUICK TOGGLES:</span>
              <div className="flex flex-wrap gap-1.5">
                {popularSkills.map((sk) => {
                  const exists = data.skills.includes(sk);
                  return (
                    <button
                      key={sk}
                      type="button"
                      onClick={() => {
                        if (exists) {
                          handleFieldChange('skills', data.skills.filter(s => s !== sk));
                        } else {
                          handleFieldChange('skills', [...data.skills, sk]);
                        }
                      }}
                      className={`text-[11px] px-2.5 py-1 rounded-md border font-medium transition-all ${
                        exists 
                          ? 'bg-blue-600 text-white border-blue-600' 
                          : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-500'
                      }`}
                    >
                      {sk}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. Experience with AI description refiner */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden transition-all duration-200">
        <button
          onClick={() => toggleSection('experience')}
          className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/40 font-semibold text-slate-800 dark:text-slate-100 hover:bg-slate-100/70 dark:hover:bg-slate-800 transition-colors"
        >
          <span className="flex items-center gap-2.5">
            <Briefcase className="w-5 h-5 text-blue-600" />
            Professional Experience ({data.experience.length})
          </span>
          <span className="text-slate-400 text-xs">{activeSection === 'experience' ? '▲' : '▼'}</span>
        </button>

        {activeSection === 'experience' && (
          <div className="p-5 border-t border-slate-150 dark:border-slate-700 space-y-6">
            {data.experience.map((exp, index) => (
              <div key={exp.id || index} className="p-4 bg-slate-50 dark:bg-slate-900/30 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4 relative">
                <button
                  type="button"
                  onClick={() => removeExperience(index)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-rose-600 transition-colors p-1"
                  title="Remove Experience"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <h4 className="text-xs font-bold text-blue-600 uppercase tracking-widest flex items-center gap-1">
                  Entry #{index + 1}
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Company Name</label>
                    <input
                      type="text"
                      placeholder="TechNova Corp"
                      value={exp.companyName}
                      onChange={(e) => updateExperience(index, { companyName: e.target.value })}
                      className="w-full text-sm px-3.5 py-1.5 rounded-lg border border-slate-250 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Job Role</label>
                    <input
                      type="text"
                      placeholder="Senior Software Engineer"
                      value={exp.jobRole}
                      onChange={(e) => updateExperience(index, { jobRole: e.target.value })}
                      className="w-full text-sm px-3.5 py-1.5 rounded-lg border border-slate-250 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Duration</label>
                    <input
                      type="text"
                      placeholder="Jan 2022 - Present"
                      value={exp.duration}
                      onChange={(e) => updateExperience(index, { duration: e.target.value })}
                      className="w-full text-sm px-3.5 py-1.5 rounded-lg border border-slate-250 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Responsibilities & Key Deliverables</label>
                      
                      <button
                        type="button"
                        onClick={() => handleAIRefineExperience(index)}
                        disabled={loadingExpIndex === index}
                        className="flex items-center gap-1 text-[11px] text-blue-600 dark:text-blue-400 font-bold hover:text-blue-700 disabled:opacity-60 transition-colors"
                      >
                        {loadingExpIndex === index ? (
                          <>
                            <RefreshCw className="w-3 h-3 animate-spin" /> Refining Text...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3 h-3 text-blue-500" /> AI Refine Bullet Points
                          </>
                        )}
                      </button>
                    </div>

                    <textarea
                      rows={3}
                      placeholder="• Lead a team of 4 engineers...&#10;• Optimized React state, reducing latency by 20%..."
                      value={exp.responsibilities}
                      onChange={(e) => updateExperience(index, { responsibilities: e.target.value })}
                      className="w-full text-sm px-3.5 py-2 rounded-lg border border-slate-250 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addExperience}
              className="w-full border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:bg-blue-50/20 text-slate-600 dark:text-slate-300 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-1 transition-all"
            >
              <Plus className="w-4 h-4" /> Add Experience Entry
            </button>
          </div>
        )}
      </div>

      {/* 5. Education */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden transition-all duration-200">
        <button
          onClick={() => toggleSection('education')}
          className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/40 font-semibold text-slate-800 dark:text-slate-100 hover:bg-slate-100/70 dark:hover:bg-slate-800 transition-colors"
        >
          <span className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-blue-600" />
            Education History ({data.education.length})
          </span>
          <span className="text-slate-400 text-xs">{activeSection === 'education' ? '▲' : '▼'}</span>
        </button>

        {activeSection === 'education' && (
          <div className="p-5 border-t border-slate-150 dark:border-slate-700 space-y-6">
            {data.education.map((edu, index) => (
              <div key={edu.id || index} className="p-4 bg-slate-50 dark:bg-slate-900/30 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4 relative">
                <button
                  type="button"
                  onClick={() => removeEducation(index)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-rose-600 transition-colors p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <h4 className="text-xs font-bold text-blue-600 uppercase tracking-widest flex items-center gap-1">
                  Education #{index + 1}
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Degree / Specialization</label>
                    <input
                      type="text"
                      placeholder="Bachelor of Science in CS"
                      value={edu.degree}
                      onChange={(e) => updateEducation(index, { degree: e.target.value })}
                      className="w-full text-sm px-3.5 py-1.5 rounded-lg border border-slate-250 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">College Name</label>
                    <input
                      type="text"
                      placeholder="School of Engineering"
                      value={edu.collegeName}
                      onChange={(e) => updateEducation(index, { collegeName: e.target.value })}
                      className="w-full text-sm px-3.5 py-1.5 rounded-lg border border-slate-250 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">University Name</label>
                    <input
                      type="text"
                      placeholder="Stanford University"
                      value={edu.university}
                      onChange={(e) => updateEducation(index, { university: e.target.value })}
                      className="w-full text-sm px-3.5 py-1.5 rounded-lg border border-slate-250 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Graduation Year</label>
                    <input
                      type="text"
                      placeholder="2020"
                      value={edu.graduationYear}
                      onChange={(e) => updateEducation(index, { graduationYear: e.target.value })}
                      className="w-full text-sm px-3.5 py-1.5 rounded-lg border border-slate-250 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">CGPA / Percentage</label>
                    <input
                      type="text"
                      placeholder="3.91 / 4.0 or 85%"
                      value={edu.cgpa}
                      onChange={(e) => updateEducation(index, { cgpa: e.target.value })}
                      className="w-full text-sm px-3.5 py-1.5 rounded-lg border border-slate-250 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addEducation}
              className="w-full border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:bg-blue-50/20 text-slate-600 dark:text-slate-300 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-1 transition-all"
            >
              <Plus className="w-4 h-4" /> Add Education
            </button>
          </div>
        )}
      </div>

      {/* 6. Projects */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden transition-all duration-200">
        <button
          onClick={() => toggleSection('projects')}
          className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/40 font-semibold text-slate-800 dark:text-slate-100 hover:bg-slate-100/70 dark:hover:bg-slate-800 transition-colors"
        >
          <span className="flex items-center gap-2.5">
            <Code className="w-5 h-5 text-blue-600" />
            Key Projects ({data.projects.length})
          </span>
          <span className="text-slate-400 text-xs">{activeSection === 'projects' ? '▲' : '▼'}</span>
        </button>

        {activeSection === 'projects' && (
          <div className="p-5 border-t border-slate-150 dark:border-slate-700 space-y-6">
            {data.projects.map((proj, index) => (
              <div key={proj.id || index} className="p-4 bg-slate-50 dark:bg-slate-900/30 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4 relative">
                <button
                  type="button"
                  onClick={() => removeProject(index)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-rose-600 transition-colors p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <h4 className="text-xs font-bold text-blue-600 uppercase tracking-widest">
                  Project #{index + 1}
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Project Title</label>
                    <input
                      type="text"
                      placeholder="Enterprise Analytics App"
                      value={proj.title}
                      onChange={(e) => updateProject(index, { title: e.target.value })}
                      className="w-full text-sm px-3.5 py-1.5 rounded-lg border border-slate-250 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Technologies Used</label>
                    <input
                      type="text"
                      placeholder="React, TypeScript, GraphQL"
                      value={proj.technologies}
                      onChange={(e) => updateProject(index, { technologies: e.target.value })}
                      className="w-full text-sm px-3.5 py-1.5 rounded-lg border border-slate-250 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Project Description</label>
                      <button
                        type="button"
                        onClick={() => handleAIRefineProject(index)}
                        disabled={loadingProjIndex === index}
                        className="flex items-center gap-1 text-[11px] text-blue-600 dark:text-blue-400 font-bold hover:text-blue-700 disabled:opacity-60 transition-colors"
                      >
                        {loadingProjIndex === index ? (
                          <>
                            <RefreshCw className="w-3 h-3 animate-spin" /> Refining Text...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3 h-3 text-blue-500" /> AI Refine Description
                          </>
                        )}
                      </button>
                    </div>

                    <textarea
                      rows={3}
                      placeholder="Describe the main objectives, what technology stack was built, and the eventual impact or output of the project."
                      value={proj.description}
                      onChange={(e) => updateProject(index, { description: e.target.value })}
                      className="w-full text-sm px-3.5 py-2 rounded-lg border border-slate-250 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addProject}
              className="w-full border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:bg-blue-50/20 text-slate-600 dark:text-slate-300 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-1 transition-all"
            >
              <Plus className="w-4 h-4" /> Add Project
            </button>
          </div>
        )}
      </div>

      {/* 7. Certifications */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden transition-all duration-200">
        <button
          onClick={() => toggleSection('certifications')}
          className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/40 font-semibold text-slate-800 dark:text-slate-100 hover:bg-slate-100/70 dark:hover:bg-slate-800 transition-colors"
        >
          <span className="flex items-center gap-2.5">
            <Award className="w-5 h-5 text-blue-600" />
            Certifications ({data.certifications.length})
          </span>
          <span className="text-slate-400 text-xs">{activeSection === 'certifications' ? '▲' : '▼'}</span>
        </button>

        {activeSection === 'certifications' && (
          <div className="p-5 border-t border-slate-150 dark:border-slate-700 space-y-6">
            {data.certifications.map((cert, index) => (
              <div key={cert.id || index} className="p-4 bg-slate-50 dark:bg-slate-900/30 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4 relative">
                <button
                  type="button"
                  onClick={() => removeCertification(index)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-rose-600 transition-colors p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <h4 className="text-xs font-bold text-blue-600 uppercase tracking-widest">
                  Certification #{index + 1}
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Certification Name</label>
                    <input
                      type="text"
                      placeholder="AWS Certified Solutions Architect"
                      value={cert.name}
                      onChange={(e) => updateCertification(index, { name: e.target.value })}
                      className="w-full text-sm px-3.5 py-1.5 rounded-lg border border-slate-250 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Issuing Body</label>
                    <input
                      type="text"
                      placeholder="Amazon Web Services"
                      value={cert.issuer}
                      onChange={(e) => updateCertification(index, { issuer: e.target.value })}
                      className="w-full text-sm px-3.5 py-1.5 rounded-lg border border-slate-250 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Year Achieved</label>
                    <input
                      type="text"
                      placeholder="2023"
                      value={cert.year}
                      onChange={(e) => updateCertification(index, { year: e.target.value })}
                      className="w-full text-sm px-3.5 py-1.5 rounded-lg border border-slate-250 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addCertification}
              className="w-full border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:bg-blue-50/20 text-slate-600 dark:text-slate-300 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-1 transition-all"
            >
              <Plus className="w-4 h-4" /> Add Certification
            </button>
          </div>
        )}
      </div>

      {/* 8. Extra sections (Languages, Achievements, Interests) */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden transition-all duration-200">
        <button
          onClick={() => toggleSection('extra')}
          className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/40 font-semibold text-slate-800 dark:text-slate-100 hover:bg-slate-100/70 dark:hover:bg-slate-800 transition-colors"
        >
          <span className="flex items-center gap-2.5">
            <Languages className="w-5 h-5 text-blue-600" />
            Languages, Achievements & Interests
          </span>
          <span className="text-slate-400 text-xs">{activeSection === 'extra' ? '▲' : '▼'}</span>
        </button>

        {activeSection === 'extra' && (
          <div className="p-5 border-t border-slate-150 dark:border-slate-700 space-y-6">
            {/* Languages known */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Languages Known</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. English (Native), Spanish"
                  value={newLanguage}
                  onChange={(e) => setNewLanguage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag('languages', newLanguage, setNewLanguage))}
                  className="flex-1 text-sm px-3.5 py-1.5 rounded-lg border border-slate-250 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => handleAddTag('languages', newLanguage, setNewLanguage)}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {data.languages.map((lang, idx) => (
                  <span key={idx} className="bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 font-semibold flex items-center gap-1">
                    {lang}
                    <button type="button" onClick={() => handleRemoveTag('languages', idx)} className="hover:text-rose-600 text-slate-400">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-700">
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Achievements</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Hackathon winner 2023, Published a research paper"
                  value={newAchievement}
                  onChange={(e) => setNewAchievement(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag('achievements', newAchievement, setNewAchievement))}
                  className="flex-1 text-sm px-3.5 py-1.5 rounded-lg border border-slate-250 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => handleAddTag('achievements', newAchievement, setNewAchievement)}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                >
                  Add
                </button>
              </div>
              <ul className="space-y-1.5 mt-2">
                {data.achievements.map((ach, idx) => (
                  <li key={idx} className="bg-slate-50 dark:bg-slate-900/40 p-2 text-xs text-slate-700 dark:text-slate-300 rounded border border-slate-150 dark:border-slate-700/85 flex justify-between items-center gap-2">
                    <span className="leading-relaxed">{ach}</span>
                    <button type="button" onClick={() => handleRemoveTag('achievements', idx)} className="text-slate-400 hover:text-rose-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Interests */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-700">
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Interests / Hobbies</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Bouldering, Playing Acoustic Guitar"
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag('interests', newInterest, setNewInterest))}
                  className="flex-1 text-sm px-3.5 py-1.5 rounded-lg border border-slate-250 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => handleAddTag('interests', newInterest, setNewInterest)}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {data.interests.map((interest, idx) => (
                  <span key={idx} className="bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 font-semibold flex items-center gap-1">
                    {interest}
                    <button type="button" onClick={() => handleRemoveTag('interests', idx)} className="hover:text-rose-600 text-slate-400">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Reset & Populate shortcuts */}
      <div className="flex justify-between items-center pt-2 gap-4">
        <button
          type="button"
          onClick={onReset}
          className="text-xs text-rose-600 dark:text-rose-400 hover:text-rose-700 font-semibold flex items-center gap-1.5 border border-rose-200 hover:border-rose-300 hover:bg-rose-50/25 px-3 py-2 rounded-lg transition-all"
        >
          <Trash2 className="w-4 h-4" /> Reset Form
        </button>

        <span className="text-[11px] text-slate-400 text-right">
          All changes auto-saved to live preview
        </span>
      </div>
    </div>
  );
}
