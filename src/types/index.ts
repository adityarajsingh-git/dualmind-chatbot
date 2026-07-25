export type ChatMode = 'recruitment' | 'employee-help';

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isSatisfactionCheck?: boolean;
  mode?: ChatMode;
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

export interface FAQ {
  question: string;
  answer: string;
  source?: string;
  /** Extra terms that should match this FAQ but don't appear in the question text */
  keywords?: string[];
}
