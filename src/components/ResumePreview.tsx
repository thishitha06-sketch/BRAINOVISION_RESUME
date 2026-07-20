import React from 'react';
import { ResumeData, TemplateId } from '../types';
import { Mail, Phone, MapPin, Linkedin, Github, Globe, Award, Calendar, BookOpen, Briefcase, Code, Compass } from 'lucide-react';

interface ResumePreviewProps {
  data: ResumeData;
  templateId: TemplateId;
}

export default function ResumePreview({ data, templateId }: ResumePreviewProps) {
  // Safe helpers to prevent render crashes on undefined data
  const {
    fullName = "",
    professionalTitle = "",
    email = "",
    phone = "",
    address = "",
    linkedin = "",
    github = "",
    portfolio = "",
    objective = "",
    education = [],
    skills = [],
    projects = [],
    experience = [],
    certifications = [],
    achievements = [],
    languages = [],
    interests = []
  } = data || {};

  // Formats URLs for cleaner display
  const formatUrl = (url: string) => {
    if (!url) return '';
    return url.replace(/^(https?:\/\/)?(www\.)?/, '');
  };

  const renderProfessionalTemplate = () => {
    return (
      <div className="text-[#334155] font-sans px-8 py-10 bg-white" id="resume-preview-content">
        {/* Header */}
        <div className="text-center border-b pb-6 mb-6 border-slate-200">
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">{fullName || "Your Full Name"}</h1>
          <p className="text-lg font-medium text-blue-600 mt-1 uppercase tracking-wider">{professionalTitle || "Your Professional Title"}</p>
          
          <div className="flex flex-wrap justify-center gap-y-2 gap-x-4 mt-4 text-xs text-slate-500">
            {email && (
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {email}
              </span>
            )}
            {phone && (
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                {phone}
              </span>
            )}
            {address && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {address}
              </span>
            )}
            {linkedin && (
              <span className="flex items-center gap-1">
                <Linkedin className="w-3.5 h-3.5 text-slate-400" />
                <a href={`https://${formatUrl(linkedin)}`} target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-600">{formatUrl(linkedin)}</a>
              </span>
            )}
            {github && (
              <span className="flex items-center gap-1">
                <Github className="w-3.5 h-3.5 text-slate-400" />
                <a href={`https://${formatUrl(github)}`} target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-600">{formatUrl(github)}</a>
              </span>
            )}
            {portfolio && (
              <span className="flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                <a href={`https://${formatUrl(portfolio)}`} target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-600">{formatUrl(portfolio)}</a>
              </span>
            )}
          </div>
        </div>

        {/* Objective */}
        {objective && (
          <div className="mb-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-800 border-b pb-1 mb-2.5 border-slate-200 flex items-center gap-2">
              <Compass className="w-4 h-4 text-blue-600" /> Professional Summary
            </h2>
            <p className="text-xs leading-relaxed text-slate-600 text-justify">{objective}</p>
          </div>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-800 border-b pb-1 mb-3 border-slate-200 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-blue-600" /> Professional Experience
            </h2>
            <div className="space-y-4">
              {experience.map((exp, index) => (
                <div key={exp.id || index} className="break-inside-avoid">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xs font-bold text-slate-800">{exp.jobRole || "Job Role"}</h3>
                      <p className="text-xs text-blue-600 font-medium">{exp.companyName || "Company Name"}</p>
                    </div>
                    <span className="text-xs text-slate-400 italic flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {exp.duration || "Duration"}
                    </span>
                  </div>
                  {exp.responsibilities && (
                    <div className="mt-1.5 text-xs text-slate-600 leading-relaxed whitespace-pre-line list-disc pl-1">
                      {exp.responsibilities}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-800 border-b pb-1 mb-3 border-slate-200 flex items-center gap-2">
              <Code className="w-4 h-4 text-blue-600" /> Skills & Expertises
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((skill, idx) => (
                <span key={idx} className="bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-sm font-medium border border-slate-200">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-800 border-b pb-1 mb-3 border-slate-200 flex items-center gap-2">
              <Code className="w-4 h-4 text-blue-600" /> Key Projects
            </h2>
            <div className="space-y-4">
              {projects.map((proj, index) => (
                <div key={proj.id || index} className="break-inside-avoid">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xs font-bold text-slate-800">{proj.title || "Project Title"}</h3>
                    {proj.technologies && (
                      <span className="text-[10px] font-mono bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded">
                        {proj.technologies}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{proj.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education & Certifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {education.length > 0 && (
            <div className="break-inside-avoid">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-800 border-b pb-1 mb-3 border-slate-200 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-600" /> Education
              </h2>
              <div className="space-y-3">
                {education.map((edu, index) => (
                  <div key={edu.id || index}>
                    <h3 className="text-xs font-bold text-slate-800">{edu.degree || "Degree"}</h3>
                    <p className="text-xs text-slate-600">{edu.collegeName}{edu.university ? `, ${edu.university}` : ""}</p>
                    <div className="flex justify-between text-[11px] text-slate-400 mt-0.5">
                      <span>Class of {edu.graduationYear || "Year"}</span>
                      {edu.cgpa && <span className="font-semibold text-slate-500">CGPA: {edu.cgpa}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {certifications.length > 0 && (
            <div className="break-inside-avoid">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-800 border-b pb-1 mb-3 border-slate-200 flex items-center gap-2">
                <Award className="w-4 h-4 text-blue-600" /> Certifications
              </h2>
              <div className="space-y-2">
                {certifications.map((cert, index) => (
                  <div key={cert.id || index} className="flex justify-between items-start gap-2">
                    <div>
                      <h3 className="text-xs font-bold text-slate-800 leading-tight">{cert.name || "Certification"}</h3>
                      <p className="text-[11px] text-slate-500">{cert.issuer}</p>
                    </div>
                    {cert.year && <span className="text-[11px] text-slate-400 font-mono shrink-0">{cert.year}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom grid (Languages, Achievements, Interests) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 border-t border-slate-100">
          {languages.length > 0 && (
            <div className="break-inside-avoid">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Languages</h4>
              <ul className="text-xs text-slate-600 space-y-1 pl-1">
                {languages.map((lang, idx) => (
                  <li key={idx} className="flex items-center gap-1.5">• {lang}</li>
                ))}
              </ul>
            </div>
          )}

          {achievements.length > 0 && (
            <div className="break-inside-avoid md:col-span-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Key Achievements</h4>
              <ul className="text-xs text-slate-600 space-y-1.5 pl-1">
                {achievements.map((ach, idx) => (
                  <li key={idx} className="leading-normal flex items-start gap-1.5">
                    <span className="text-blue-500 mt-0.5 shrink-0">✔</span>
                    <span>{ach}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {interests.length > 0 && achievements.length === 0 && (
            <div className="break-inside-avoid">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Interests</h4>
              <div className="flex flex-wrap gap-1">
                {interests.map((interest, idx) => (
                  <span key={idx} className="bg-slate-50 text-slate-600 text-[11px] px-2 py-0.5 rounded border border-slate-100">
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderModernTemplate = () => {
    return (
      <div className="text-slate-700 font-sans bg-white flex flex-col md:flex-row min-h-[1000px] border border-slate-100" id="resume-preview-content">
        {/* Left Sidebar (Dark Blue theme) */}
        <div className="w-full md:w-[280px] bg-slate-900 text-slate-200 p-6 flex flex-col gap-6 shrink-0 print:w-[240px] print:bg-slate-900 print:text-slate-200">
          <div className="text-center md:text-left mt-4 border-b border-slate-800 pb-6">
            <h1 className="text-2xl font-bold tracking-tight text-white leading-tight">{fullName || "Your Full Name"}</h1>
            <p className="text-xs font-medium text-blue-400 uppercase tracking-widest mt-2">{professionalTitle || "Your Title"}</p>
          </div>

          {/* Contact Details */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 border-b border-slate-800 pb-1">Contact</h2>
            <div className="space-y-3.5 text-[11px] text-slate-300">
              {email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span className="truncate">{email}</span>
                </div>
              )}
              {phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>{phone}</span>
                </div>
              )}
              {address && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span className="line-clamp-2">{address}</span>
                </div>
              )}
              {linkedin && (
                <div className="flex items-center gap-2">
                  <Linkedin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <a href={`https://${formatUrl(linkedin)}`} target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-300 truncate">{formatUrl(linkedin)}</a>
                </div>
              )}
              {github && (
                <div className="flex items-center gap-2">
                  <Github className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <a href={`https://${formatUrl(github)}`} target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-300 truncate">{formatUrl(github)}</a>
                </div>
              )}
              {portfolio && (
                <div className="flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <a href={`https://${formatUrl(portfolio)}`} target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-300 truncate">{formatUrl(portfolio)}</a>
                </div>
              )}
            </div>
          </div>

          {/* Skills tags in sidebar */}
          {skills.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 border-b border-slate-800 pb-1">Skills</h2>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill, idx) => (
                  <span key={idx} className="bg-slate-800 text-slate-200 text-[10px] px-2 py-1 rounded font-medium border border-slate-700/50">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 border-b border-slate-800 pb-1">Languages</h2>
              <ul className="text-[11px] text-slate-300 space-y-1.5 pl-1">
                {languages.map((lang, idx) => (
                  <li key={idx} className="flex items-center gap-1.5">• {lang}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Interests */}
          {interests.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 border-b border-slate-800 pb-1">Interests</h2>
              <div className="flex flex-wrap gap-1">
                {interests.map((interest, idx) => (
                  <span key={idx} className="bg-slate-800 text-slate-300 text-[10px] px-2 py-0.5 rounded border border-slate-700">
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right main panel */}
        <div className="flex-1 p-8 flex flex-col gap-6">
          {/* Objective */}
          {objective && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2 border-b-2 border-blue-500 pb-1 w-fit">About Me</h2>
              <p className="text-xs leading-relaxed text-slate-600 text-justify">{objective}</p>
            </div>
          )}

          {/* Experience */}
          {experience.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-3 border-b-2 border-blue-500 pb-1 w-fit">Experience</h2>
              <div className="space-y-4">
                {experience.map((exp, index) => (
                  <div key={exp.id || index} className="break-inside-avoid relative pl-3 border-l-2 border-slate-100">
                    <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-blue-500 border border-white"></div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xs font-bold text-slate-800">{exp.jobRole || "Job Role"}</h3>
                        <p className="text-xs text-slate-500">{exp.companyName || "Company Name"}</p>
                      </div>
                      <span className="text-[11px] text-slate-400 italic font-mono shrink-0">
                        {exp.duration || "Duration"}
                      </span>
                    </div>
                    {exp.responsibilities && (
                      <div className="mt-1.5 text-xs text-slate-600 leading-relaxed whitespace-pre-line pl-1">
                        {exp.responsibilities}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-3 border-b-2 border-blue-500 pb-1 w-fit">Projects</h2>
              <div className="space-y-3.5">
                {projects.map((proj, index) => (
                  <div key={proj.id || index} className="break-inside-avoid bg-slate-50 p-3 rounded border border-slate-100">
                    <div className="flex justify-between items-start flex-wrap gap-1">
                      <h3 className="text-xs font-bold text-slate-800">{proj.title || "Project Title"}</h3>
                      {proj.technologies && (
                        <span className="text-[10px] font-mono text-blue-600 bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded">
                          {proj.technologies}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{proj.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {education.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-3 border-b-2 border-blue-500 pb-1 w-fit">Education</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {education.map((edu, index) => (
                  <div key={edu.id || index} className="break-inside-avoid">
                    <h3 className="text-xs font-bold text-slate-800">{edu.degree || "Degree"}</h3>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">{edu.collegeName}{edu.university ? `, ${edu.university}` : ""}</p>
                    <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                      <span>Graduated {edu.graduationYear || "Year"}</span>
                      {edu.cgpa && <span className="font-semibold text-slate-500">CGPA: {edu.cgpa}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications & Achievements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certifications.length > 0 && (
              <div className="break-inside-avoid">
                <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2 border-b-2 border-blue-500 pb-1 w-fit">Certifications</h2>
                <div className="space-y-1.5">
                  {certifications.map((cert, index) => (
                    <div key={cert.id || index} className="text-xs text-slate-600">
                      <span className="font-semibold text-slate-800">{cert.name}</span> - {cert.issuer} <span className="text-slate-400">({cert.year})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {achievements.length > 0 && (
              <div className="break-inside-avoid">
                <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2 border-b-2 border-blue-500 pb-1 w-fit">Achievements</h2>
                <ul className="text-xs text-slate-600 space-y-1 pl-1">
                  {achievements.map((ach, idx) => (
                    <li key={idx} className="flex items-start gap-1">
                      <span className="text-blue-500 shrink-0">✔</span>
                      <span>{ach}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderMinimalTemplate = () => {
    return (
      <div className="text-slate-800 font-mono text-xs px-10 py-12 bg-white flex flex-col gap-6 leading-relaxed" id="resume-preview-content">
        {/* Simple Top Header */}
        <div className="border-b-2 border-slate-900 pb-4">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{fullName || "Your Full Name"}</h1>
          <p className="text-xs uppercase tracking-widest text-slate-500 font-bold mt-1">{professionalTitle || "Your Professional Title"}</p>
          
          <div className="flex flex-wrap gap-y-1.5 gap-x-6 mt-3 text-[11px] text-slate-500">
            {email && <span>EMAIL: {email}</span>}
            {phone && <span>TEL: {phone}</span>}
            {address && <span>ADDR: {address}</span>}
            {linkedin && <span>LINKEDIN: {formatUrl(linkedin)}</span>}
            {github && <span>GITHUB: {formatUrl(github)}</span>}
            {portfolio && <span>WEB: {formatUrl(portfolio)}</span>}
          </div>
        </div>

        {/* Career Objective */}
        {objective && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
            <span className="font-bold text-slate-900 uppercase">SUMMARY //</span>
            <p className="md:col-span-3 text-slate-600 leading-normal text-justify font-sans">{objective}</p>
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 border-t border-slate-200 pt-4">
            <span className="font-bold text-slate-900 uppercase">SKILLS //</span>
            <div className="md:col-span-3 flex flex-wrap gap-2">
              {skills.map((skill, idx) => (
                <span key={idx} className="bg-slate-100 text-slate-800 text-[11px] px-2 py-0.5 border border-slate-300 rounded-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 border-t border-slate-200 pt-4">
            <span className="font-bold text-slate-900 uppercase">EXPERIENCE //</span>
            <div className="md:col-span-3 space-y-4">
              {experience.map((exp, index) => (
                <div key={exp.id || index} className="break-inside-avoid">
                  <div className="flex justify-between items-start font-sans">
                    <div>
                      <h3 className="font-bold text-slate-900">{exp.jobRole || "Job Role"}</h3>
                      <p className="text-slate-500 font-semibold">{exp.companyName}</p>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400 shrink-0">{exp.duration}</span>
                  </div>
                  {exp.responsibilities && (
                    <div className="mt-1 text-slate-600 font-sans leading-relaxed whitespace-pre-line text-justify pl-1">
                      {exp.responsibilities}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 border-t border-slate-200 pt-4">
            <span className="font-bold text-slate-900 uppercase">PROJECTS //</span>
            <div className="md:col-span-3 space-y-3">
              {projects.map((proj, index) => (
                <div key={proj.id || index} className="break-inside-avoid">
                  <div className="flex justify-between items-center gap-2">
                    <h3 className="font-bold text-slate-900">{proj.title}</h3>
                    {proj.technologies && (
                      <span className="text-[10px] text-slate-400 font-mono">[{proj.technologies}]</span>
                    )}
                  </div>
                  <p className="text-slate-600 mt-1 font-sans leading-normal">{proj.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 border-t border-slate-200 pt-4">
            <span className="font-bold text-slate-900 uppercase">EDUCATION //</span>
            <div className="md:col-span-3 space-y-3">
              {education.map((edu, index) => (
                <div key={edu.id || index} className="break-inside-avoid">
                  <div className="flex justify-between items-start font-sans">
                    <div>
                      <h3 className="font-bold text-slate-900">{edu.degree}</h3>
                      <p className="text-slate-600 text-xs">{edu.collegeName}{edu.university ? `, ${edu.university}` : ""}</p>
                    </div>
                    <div className="text-right text-[11px] font-mono text-slate-400 shrink-0">
                      <div>CLASS OF {edu.graduationYear}</div>
                      {edu.cgpa && <div className="font-bold text-slate-600">CGPA: {edu.cgpa}</div>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications & Achievements */}
        {(certifications.length > 0 || achievements.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 border-t border-slate-200 pt-4">
            <span className="font-bold text-slate-900 uppercase">CREDENTIALS //</span>
            <div className="md:col-span-3 space-y-3">
              {certifications.length > 0 && (
                <div>
                  <h4 className="font-bold text-slate-800 uppercase text-[11px] mb-1.5">// Certifications</h4>
                  {certifications.map((cert, index) => (
                    <div key={cert.id || index} className="text-slate-600">
                      - {cert.name} / <span className="font-semibold">{cert.issuer}</span> ({cert.year})
                    </div>
                  ))}
                </div>
              )}
              {achievements.length > 0 && (
                <div>
                  <h4 className="font-bold text-slate-800 uppercase text-[11px] mb-1.5">// Achievements</h4>
                  <ul className="space-y-1">
                    {achievements.map((ach, idx) => (
                      <li key={idx} className="text-slate-600">- {ach}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Languages & Interests */}
        {(languages.length > 0 || interests.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 border-t border-slate-200 pt-4">
            <span className="font-bold text-slate-900 uppercase">EXTRA //</span>
            <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {languages.length > 0 && (
                <div>
                  <h4 className="font-bold text-slate-800 uppercase text-[11px] mb-1">// Languages</h4>
                  <div className="text-slate-600">{languages.join(", ")}</div>
                </div>
              )}
              {interests.length > 0 && (
                <div>
                  <h4 className="font-bold text-slate-800 uppercase text-[11px] mb-1">// Interests</h4>
                  <div className="text-slate-600">{interests.join(", ")}</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  const getTemplate = () => {
    switch (templateId) {
      case 'modern':
        return renderModernTemplate();
      case 'minimal':
        return renderMinimalTemplate();
      case 'professional':
      default:
        return renderProfessionalTemplate();
    }
  };

  return (
    <div className="shadow-lg border border-slate-200/60 rounded-md overflow-hidden bg-white max-w-[21cm] mx-auto min-h-[29.7cm] print:shadow-none print:border-none print:m-0 print:p-0 print:max-w-none print:min-h-0" id="resume-preview-area">
      {getTemplate()}
    </div>
  );
}
