export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'admin' | 'member';
  clubId: string;
  bio?: string;
  skills?: string[];
  year?: string;
  department?: string;
  isOnline?: boolean;
  lastSeen?: Date;
}

export interface Club {
  id: string;
  name: string;
  description: string;
  logo: string;
  memberCount: number;
  admins: string[];
  createdAt: Date;
  members: string[]; // Array of member user IDs
  pendingApprovals?: ClubApplication[]; // Pending club applications
}

export interface ClubApplication {
  id: string;
  clubName: string;
  description: string;
  applicantId: string;
  applicant: User;
  presidencyProof: string; // URL to uploaded proof document
  status: 'pending' | 'approved' | 'rejected';
  appliedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
}

export interface Channel {
  id: string;
  name: string;
  description: string;
  clubId: string;
  type: 'general' | 'qna' | 'resources' | 'sessions';
  messageCount: number;
}

export interface Message {
  id: string;
  content: string;
  author: User;
  channelId: string;
  timestamp: Date;
  isPinned: boolean;
  type: 'message' | 'question' | 'answer' | 'announcement';
  attachments?: Attachment[];
  reactions?: Reaction[];
  readBy?: string[]; // Array of user IDs who have read this message
}

export interface DirectMessage {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  timestamp: Date;
  isRead: boolean;
  type: 'text' | 'file' | 'image';
}

export interface Reaction {
  id: string;
  emoji: string;
  userId: string;
  userName: string;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: 'file' | 'image' | 'video';
  size: string;
}

export interface Session {
  id: string;
  title: string;
  description: string;
  instructor: User;
  clubId: string;
  startTime: Date;
  duration: number;
  type: 'dsa' | 'tech-talk' | 'workshop' | 'meetup';
  maxParticipants: number;
  participants: string[];
  meetingLink?: string;
  isLive?: boolean;
  roomId?: string;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  category: 'notes' | 'syllabus' | 'past-papers' | 'tutorials' | 'books';
  fileUrl: string;
  uploadedBy: User;
  clubId: string;
  downloadCount: number;
  uploadDate: Date;
  tags?: string[];
}

export interface VideoCall {
  id: string;
  sessionId?: string;
  participants: CallParticipant[];
  isActive: boolean;
  startTime: Date;
  endTime?: Date;
}

export interface CallParticipant {
  userId: string;
  userName: string;
  avatar: string;
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
  isScreenSharing: boolean;
  stream?: MediaStream;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
}