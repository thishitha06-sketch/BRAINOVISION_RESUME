export interface EducationEntry {
  id: string;
  degree: string;
  collegeName: string;
  university: string;
  graduationYear: string;
  cgpa: string;
}

export interface ProjectEntry {
  id: string;
  title: string;
  technologies: string;
  description: string;
}

export interface ExperienceEntry {
  id: string;
  companyName: string;
  jobRole: string;
  duration: string;
  responsibilities: string;
}

export interface CertificationEntry {
  id: string;
  name: string;
  issuer: string;
  year: string;
}

export interface ResumeData {
  fullName: string;
  professionalTitle: string;
  email: string;
  phone: string;
  address: string;
  linkedin: string;
  github: string;
  portfolio: string;
  objective: string;
  education: EducationEntry[];
  skills: string[];
  projects: ProjectEntry[];
  experience: ExperienceEntry[];
  certifications: CertificationEntry[];
  achievements: string[];
  languages: string[];
  interests: string[];
}

export type TemplateId = 'professional' | 'modern' | 'minimal';

export interface SavedResume {
  id: string;
  userId: string;
  title: string;
  data: ResumeData;
  templateId: TemplateId;
  updatedAt: number;
}
