export interface User {
  id: string;
  email: string;
  role: 'school_admin' | 'super_admin';
  schoolId?: string;
  schoolName?: string;
  name: string;
  avatar?: string;
}

export interface Entity {
  id: string;
  name: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  logo?: string;
  status: 'pending' | 'approved' | 'rejected';
  registeredAt: string;
  totalStudents: number;
  eventsJoined: number;
}

export interface Event {
  id: string;
  name: string;
  category: 'academic' | 'sporting';
  type: string;
  description: string;
  date: string;
  venue: string;
  fee: number;
  maxParticipants: number;
  currentParticipants: number;
  rules: string[];
  ageGroups: string[];
  status: 'draft' | 'active' | 'completed';
}

export interface Participant {
  id: string;
  name: string;
  age: number;
  grade: string;
  category: string;
  schoolId: string;
  schoolName: string;
  photo?: string;
  documents: string[];
  eventsRegistered: string[];
  results: ParticipantResult[];
}

export interface ParticipantResult {
  eventId: string;
  eventName: string;
  position?: number;
  score?: number;
  time?: string;
  status: 'pending' | 'completed';
  certificate?: string;
}

export interface Payment {
  id: string;
  schoolId: string;
  schoolName: string;
  amount: number;
  method: 'card' | 'bank_transfer' | 'cash';
  status: 'pending' | 'completed' | 'failed';
  date: string;
  invoiceNumber: string;
  eventsIncluded: string[];
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success';
  targetSchools?: string[];
  createdAt: string;
  createdBy: string;
}

export interface Match {
  id: string;
  round: number;
  position: number;
  participant1?: string;
  participant2?: string;
  school1?: string;
  school2?: string;
  winner?: string;
  score?: string;
  status: 'pending' | 'ongoing' | 'completed';
  scheduledTime?: string;
  venue?: string;
}

export interface CompetitionDraw {
  id: string;
  eventId: string;
  eventName: string;
  drawType: 'single_elimination' | 'double_elimination' | 'round_robin' | 'group_stage';
  totalParticipants: number;
  totalRounds: number;
  matches: Match[];
  status: 'draft' | 'published' | 'ongoing' | 'completed';
  createdAt: string;
  createdBy: string;
}