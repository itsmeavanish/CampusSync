import { User, Club, Channel, Message, Session, Resource } from '../types';

export const mockUser: User = {
  id: '1',
  name: 'Alex Kumar',
  email: 'alex@university.edu',
  avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
  role: 'admin',
  clubId: '1',
  bio: 'Passionate developer and GDG lead. Love building innovative solutions and helping others learn.',
  skills: ['JavaScript', 'React', 'Node.js', 'Python', 'Machine Learning'],
  year: '3rd Year',
  department: 'Computer Science',
  isOnline: true,
  lastSeen: new Date()
};

export const mockClubs: Club[] = [
  {
    id: '1',
    name: 'Google Developer Student Club',
    description: 'Learn, build, and grow with Google technologies',
    logo: 'https://images.pexels.com/photos/5926389/pexels-photo-5926389.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
    memberCount: 245,
    admins: ['1'],
    createdAt: new Date('2024-01-15')
  },
  {
    id: '2',
    name: 'AI/ML Research Club',
    description: 'Exploring artificial intelligence and machine learning',
    logo: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
    memberCount: 189,
    admins: ['2'],
    createdAt: new Date('2024-02-01')
  },
  {
    id: '3',
    name: 'Cybersecurity Society',
    description: 'Learning ethical hacking and security practices',
    logo: 'https://images.pexels.com/photos/5380664/pexels-photo-5380664.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
    memberCount: 156,
    admins: ['3'],
    createdAt: new Date('2024-01-20')
  }
];

export const mockChannels: Channel[] = [
  {
    id: '1',
    name: 'general',
    description: 'General discussions and announcements',
    clubId: '1',
    type: 'general',
    messageCount: 1247
  },
  {
    id: '2',
    name: 'q-and-a',
    description: 'Ask questions and get help from the community',
    clubId: '1',
    type: 'qna',
    messageCount: 856
  },
  {
    id: '3',
    name: 'resources',
    description: 'Share and access study materials',
    clubId: '1',
    type: 'resources',
    messageCount: 234
  },
  {
    id: '4',
    name: 'sessions',
    description: 'DSA practice and tech sessions',
    clubId: '1',
    type: 'sessions',
    messageCount: 189
  }
];

export const mockMessages: Message[] = [
  {
    id: '1',
    content: 'Welcome to GDSC! We\'re excited to have you join our community of developers and learners.',
    author: mockUser,
    channelId: '1',
    timestamp: new Date(Date.now() - 3600000),
    isPinned: true,
    type: 'announcement'
  },
  {
    id: '2',
    content: 'Can someone help me understand the difference between async/await and promises in JavaScript?',
    author: {
      id: '2',
      name: 'Priya Singh',
      email: 'priya@university.edu',
      avatar: 'https://images.pexels.com/photos/3992656/pexels-photo-3992656.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      role: 'member',
      clubId: '1',
      isOnline: true,
      department: 'Information Technology',
      year: '2nd Year'
    },
    channelId: '2',
    timestamp: new Date(Date.now() - 1800000),
    isPinned: false,
    type: 'question'
  },
  {
    id: '3',
    content: 'Great question! Async/await is syntactic sugar over promises. It makes asynchronous code look more like synchronous code...',
    author: {
      id: '3',
      name: 'Rahul Sharma',
      email: 'rahul@university.edu',
      avatar: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      role: 'member',
      clubId: '1',
      isOnline: false,
      department: 'Computer Science',
      year: '4th Year',
      lastSeen: new Date(Date.now() - 3600000)
    },
    channelId: '2',
    timestamp: new Date(Date.now() - 1740000),
    isPinned: false,
    type: 'answer'
  }
];

export const mockSessions: Session[] = [
  {
    id: '1',
    title: 'DSA Deep Dive: Binary Trees',
    description: 'Comprehensive session on binary tree algorithms and problem-solving techniques',
    instructor: mockUser,
    clubId: '1',
    startTime: new Date(Date.now() + 86400000), // Tomorrow
    duration: 120,
    type: 'dsa',
    maxParticipants: 50,
    participants: ['1', '2', '3'],
    meetingLink: 'https://meet.google.com/abc-defg-hij'
  },
  {
    id: '2',
    title: 'Introduction to Cloud Computing',
    description: 'Learn the basics of Google Cloud Platform and modern cloud architecture',
    instructor: {
      id: '4',
      name: 'Dr. Sarah Wilson',
      email: 'sarah@university.edu',
      avatar: 'https://images.pexels.com/photos/3992657/pexels-photo-3992657.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      role: 'admin',
      clubId: '1',
      department: 'Computer Science',
      bio: 'Professor and researcher in cloud computing and distributed systems.'
    },
    clubId: '1',
    startTime: new Date(Date.now() + 172800000), // Day after tomorrow
    duration: 90,
    type: 'tech-talk',
    maxParticipants: 100,
    participants: ['1', '2'],
    meetingLink: 'https://meet.google.com/xyz-uvwx-123'
  }
];

export const mockResources: Resource[] = [
  {
    id: '1',
    title: 'Data Structures and Algorithms Notes',
    description: 'Comprehensive notes covering all major DSA topics with examples',
    category: 'notes',
    fileUrl: '#',
    uploadedBy: mockUser,
    clubId: '1',
    downloadCount: 156,
    uploadDate: new Date(Date.now() - 604800000) // 1 week ago
  },
  {
    id: '2',
    title: 'Previous Year Question Papers - CS301',
    description: 'Collection of previous year papers for Computer Networks course',
    category: 'past-papers',
    fileUrl: '#',
    uploadedBy: {
      id: '5',
      name: 'Prof. Kumar',
      email: 'kumar@university.edu',
      avatar: 'https://images.pexels.com/photos/2380794/pexels-photo-2380794.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      role: 'admin',
      clubId: '1',
      department: 'Computer Science'
    },
    clubId: '1',
    downloadCount: 89,
    uploadDate: new Date(Date.now() - 1209600000) // 2 weeks ago
  },
  {
    id: '3',
    title: 'React.js Complete Tutorial Series',
    description: 'Step-by-step guide to building modern web applications with React',
    category: 'tutorials',
    fileUrl: '#',
    uploadedBy: mockUser,
    clubId: '1',
    downloadCount: 234,
    uploadDate: new Date(Date.now() - 259200000) // 3 days ago
  }
];

// Additional mock users for direct messaging
export const mockUsers: User[] = [
  mockUser,
  {
    id: '2',
    name: 'Priya Singh',
    email: 'priya@university.edu',
    avatar: 'https://images.pexels.com/photos/3992656/pexels-photo-3992656.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    role: 'member',
    clubId: '1',
    isOnline: true,
    department: 'Information Technology',
    year: '2nd Year',
    bio: 'Frontend developer passionate about UI/UX design.',
    skills: ['React', 'CSS', 'JavaScript', 'Figma']
  },
  {
    id: '3',
    name: 'Rahul Sharma',
    email: 'rahul@university.edu',
    avatar: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    role: 'member',
    clubId: '1',
    isOnline: false,
    department: 'Computer Science',
    year: '4th Year',
    lastSeen: new Date(Date.now() - 3600000),
    bio: 'Backend developer and competitive programmer.',
    skills: ['Java', 'Spring Boot', 'MySQL', 'AWS']
  },
  {
    id: '4',
    name: 'Dr. Sarah Wilson',
    email: 'sarah@university.edu',
    avatar: 'https://images.pexels.com/photos/3992657/pexels-photo-3992657.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    role: 'admin',
    clubId: '1',
    department: 'Computer Science',
    bio: 'Professor and researcher in cloud computing and distributed systems.',
    isOnline: true,
    skills: ['Cloud Computing', 'Distributed Systems', 'Research']
  },
  {
    id: '6',
    name: 'Ananya Patel',
    email: 'ananya@university.edu',
    avatar: 'https://images.pexels.com/photos/3992658/pexels-photo-3992658.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    role: 'member',
    clubId: '1',
    isOnline: true,
    department: 'Data Science',
    year: '3rd Year',
    bio: 'Data scientist interested in machine learning and AI.',
    skills: ['Python', 'TensorFlow', 'Data Analysis', 'Machine Learning']
  }
];

// Mock direct messages
export const mockDirectMessages = [
  {
    id: '1',
    content: 'Hey! How are you doing with the React project?',
    senderId: '2',
    receiverId: '1',
    timestamp: new Date(Date.now() - 3600000),
    isRead: true,
    type: 'text' as const
  },
  {
    id: '2',
    content: 'Going well! Just finished the authentication part. How about your backend work?',
    senderId: '1',
    receiverId: '2',
    timestamp: new Date(Date.now() - 3500000),
    isRead: true,
    type: 'text' as const
  },
  {
    id: '3',
    content: 'Can you help me with the DSA problem we discussed yesterday?',
    senderId: '3',
    receiverId: '1',
    timestamp: new Date(Date.now() - 1800000),
    isRead: false,
    type: 'text' as const
  }
];