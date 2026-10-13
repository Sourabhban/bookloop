export type BookStatus = 'available' | 'requested' | 'borrowed' | 'reserved';

export interface Milestone {
  id: string;
  date: string;
  type: 'donated' | 'borrowed' | 'returned' | 'circulated';
  holderName: string;
  department: string;
  handoverPoint: string;
  verified: boolean;
  notes?: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  edition: string;
  subject: string;
  courseCode: string;
  coverImage: string;
  status: BookStatus;
  ownerName: string;
  ownerDept: string;
  exchangeLocationId: string;
  exchangeLocationName: string;
  condition: 'Like New' | 'Good' | 'Fair';
  totalLoops: number;
  qrCode: string;
  summary: string;
  keyTopics: string[];
  syllabusMatch: number;
  needBasedEligible: boolean;
  donorNotes?: string;
  milestones: Milestone[];
  registeredDate: string;
}

export interface ExchangeLocation {
  id: string;
  name: string;
  category: 'Central Library' | 'Campus Kiosk' | 'Dept Lounge' | 'Hostel Hub';
  area: string;
  address: string;
  timings: string;
  coordinator: string;
  coordinatorPhone: string;
  lat: number;
  lng: number;
  booksCount: number;
  activeLendersCount: number;
  verified: boolean;
  features: string[];
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  iconName: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
  category: 'sharing' | 'reading' | 'community';
}

export interface UserProfile {
  id: string;
  name: string;
  role: 'student' | 'coordinator' | 'faculty';
  department: string;
  studentId: string;
  email: string;
  points: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  hoursRead: number;
  badges: Badge[];
  activeLoans: string[];
  donatedBookIds: string[];
  wishlist: string[];
}

export interface NeedBasedRequest {
  id: string;
  studentAnonId: string;
  courseName: string;
  bookTitle: string;
  urgency: 'urgent' | 'moderate';
  semester: string;
  department: string;
  status: 'pending' | 'approved' | 'fulfilled';
  dateRequested: string;
  assignedCoordinator: string;
  decisionNotes?: string;
}

export interface DepartmentStanding {
  department: string;
  booksShared: number;
  studentsParticipating: number;
  rank: number;
  topSubject: string;
}

export interface SmartMatchResult {
  recommendedBook: Book;
  matchScore: number;
  matchReason: string;
  similarAlternative?: string;
  curriculumNotes: string;
}
