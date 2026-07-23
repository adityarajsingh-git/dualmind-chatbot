export type ChatMode = 'recruitment' | 'employee-help';

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'text' | 'file' | 'suggestion';
  metadata?: {
    fileType?: string;
    fileName?: string;
    suggestions?: string[];
  };
}

export interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
}

export interface JobRole {
  id: string;
  title: string;
  department: string;
  requirements: string[];
  description: string;
  experience: string;
  location: string;
}

export interface InsurancePlan {
  id: string;
  name: string;
  type: 'health' | 'life' | 'motor' | 'travel';
  premium: number;
  coverage: number;
  features: string[];
  description: string;
  company: string;
}

export interface ResumeData {
  name: string;
  email: string;
  phone: string;
  skills: string[];
  experience: number;
  education: string;
  previousRoles: string[];
}

export interface Language {
  code: string;
  name: string;
  flag: string;
}

export interface FAQ {
  question: string;
  answer: string;
  source?: string;
}
