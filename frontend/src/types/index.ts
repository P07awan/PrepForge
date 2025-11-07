export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'CANDIDATE' | 'INTERVIEWER' | 'ADMIN';
  subscription: 'FREE' | 'BASIC' | 'PREMIUM' | 'ENTERPRISE';
  profileImage?: string;
  bio?: string;
  skills?: string[];
  createdAt: string;
}

export interface AIInterview {
  id: string;
  userId: string;
  interviewType: InterviewType;
  topic: string;
  difficulty: Difficulty;
  duration: number;
  status: InterviewStatus;
  score?: number;
  feedback?: any;
  questions?: Question[];
  responses?: Response[];
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
}

export interface LiveInterview {
  id: string;
  candidateId: string;
  interviewerId?: string;
  interviewType: InterviewType;
  topic: string;
  scheduledAt: string;
  duration: number;
  status: InterviewStatus;
  roomId: string;
  meetingUrl?: string;
  score?: number;
  feedback?: any;
  analytics?: any;
  candidate?: Partial<User>;
  interviewer?: Partial<User>;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
}

export interface Question {
  id: string;
  questionText: string;
  questionType: QuestionType;
  expectedAnswer?: string;
  difficulty: Difficulty;
  topic: string;
  order: number;
  timeAsked: string;
}

export interface Response {
  id: string;
  questionId: string;
  responseText: string;
  audioUrl?: string;
  responseTime: number;
  confidence?: number;
  technicalScore?: number;
  communicationScore?: number;
  aiAnalysis?: any;
  createdAt: string;
}

export type InterviewType =
  | 'TECHNICAL'
  | 'HR'
  | 'APTITUDE'
  | 'BEHAVIORAL'
  | 'DOMAIN_SPECIFIC'
  | 'CODING'
  | 'SYSTEM_DESIGN';

export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

export type InterviewStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export type QuestionType =
  | 'MULTIPLE_CHOICE'
  | 'CODING'
  | 'OPEN_ENDED'
  | 'BEHAVIORAL'
  | 'TECHNICAL';

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

export interface ApiError {
  error: string;
  errors?: Array<{ msg: string; param: string }>;
}
