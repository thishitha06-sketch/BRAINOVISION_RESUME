import { ResumeData } from './types';

export const sampleResumeData: ResumeData = {
  fullName: "Alex Rivera",
  professionalTitle: "Senior Full Stack Engineer",
  email: "alex.rivera@example.com",
  phone: "+1 (555) 019-2834",
  address: "San Francisco, CA",
  linkedin: "linkedin.com/in/alex-rivera-dev",
  github: "github.com/alexrivera-codes",
  portfolio: "alexrivera.dev",
  objective: "Result-driven Senior Software Engineer with 5+ years of experience specializing in building highly scalable React applications, robust Node.js microservices, and leading agile developer teams. Passionate about leveraging cloud architectures and modern UI/UX practices to deliver delightful user experiences.",
  education: [
    {
      id: "edu-1",
      degree: "Bachelor of Science in Computer Science",
      collegeName: "School of Engineering",
      university: "Stanford University",
      graduationYear: "2020",
      cgpa: "3.91 / 4.0"
    },
    {
      id: "edu-2",
      degree: "Associate of Science in Web Technologies",
      collegeName: "City College of San Francisco",
      university: "CCSF",
      graduationYear: "2017",
      cgpa: "4.0"
    }
  ],
  skills: [
    "React",
    "TypeScript",
    "Node.js",
    "Python",
    "SQL",
    "Tailwind CSS",
    "Docker",
    "Firebase",
    "Next.js",
    "Git",
    "RESTful APIs",
    "GraphQL"
  ],
  projects: [
    {
      id: "proj-1",
      title: "Enterprise Analytics Dashboard",
      technologies: "React, D3.js, TypeScript, Node.js",
      description: "Designed and built an interactive data visualization platform processing 10M+ events daily. Reduced client-side rendering latency by 45% using customized caching layers and memoization strategies."
    },
    {
      id: "proj-2",
      title: "Real-time Collaborative Whiteboard",
      technologies: "Socket.io, Express, React, HTML5 Canvas",
      description: "Developed a collaborative real-time drawing and brainstorming tool supporting up to 100 concurrent users per canvas with robust operational transformation (OT) sync logic."
    }
  ],
  experience: [
    {
      id: "exp-1",
      companyName: "TechNova Solutions",
      jobRole: "Senior Software Engineer",
      duration: "Jan 2022 - Present",
      responsibilities: "Lead a team of 4 frontend engineers building modular enterprise SaaS tools. Refactored legacy monolithic application into a micro-frontend architecture using Vite Federation, increasing deployment speed by 60%. Designed a custom UI components library adopted across 3 product lines."
    },
    {
      id: "exp-2",
      companyName: "Innovate Labs",
      jobRole: "Full Stack Developer",
      duration: "Aug 2020 - Dec 2021",
      responsibilities: "Developed and maintained REST APIs using Express and Node.js. Optimized Postgres queries reducing response times by 30%. Implemented responsive client dashboards using React and Tailwind CSS, increasing user engagement by 25%."
    }
  ],
  certifications: [
    {
      id: "cert-1",
      name: "AWS Certified Solutions Architect",
      issuer: "Amazon Web Services (AWS)",
      year: "2023"
    },
    {
      id: "cert-2",
      name: "Google Professional Cloud Dev",
      issuer: "Google Cloud Platform",
      year: "2022"
    }
  ],
  achievements: [
    "First place out of 150 teams in HackCC 2019 for building a smart energy grid optimizer.",
    "Recognized as Developer of the Year at TechNova Solutions (2023) for product delivery speed."
  ],
  languages: [
    "English (Native)",
    "Spanish (Conversational)",
    "Japanese (Beginner)"
  ],
  interests: [
    "Open Source Contributing",
    "Acoustic Guitar",
    "Bouldering & Rock Climbing",
    "Generative AI & LLMs"
  ]
};

export const emptyResumeData: ResumeData = {
  fullName: "",
  professionalTitle: "",
  email: "",
  phone: "",
  address: "",
  linkedin: "",
  github: "",
  portfolio: "",
  objective: "",
  education: [],
  skills: [],
  projects: [],
  experience: [],
  certifications: [],
  achievements: [],
  languages: [],
  interests: []
};
