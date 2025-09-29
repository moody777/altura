import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

export interface Startup {
  id: string;
  name: string;
  description: string;
  logo?: string;
  type: 'research' | 'profit' | 'non-profit';
  sector: string;
  location: {
    city: string;
    country: string;
    coordinates: [number, number];
  };
  teamSize: string;
  fundingNeeds: '<100k' | '100k-500k' | '>500k';
  hiringStatus: 'urgent' | 'open' | 'not-hiring';
  founderId: string;
  founderName: string;
  website?: string;
  tags: string[];
  likes: number;
  comments: number;
  createdAt: string;
}

// Updated Job interface with workMode instead of remote
export interface Job {
  id: string;
  startupId: string;
  title: string;
  description: string;
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  equity?: string;
  location: string;
  workMode: 'on-site' | 'remote' | 'hybrid';
  skills: string[];
  createdAt: string;
}

export interface Connection {
  id: string;
  fromUserId: string;
  toUserId: string;
  status: 'pending' | 'accepted' | 'declined';
  message?: string;
  createdAt: string;
}

export interface Message {
  id: string;
  connectionId: string;
  fromUserId: string;
  content: string;
  createdAt: string;
}

export interface Application {
  id: string;
  jobId: string;
  applicantName: string;
  email: string;
  experience: string;
  skills: string[];
  status: 'pending' | 'reviewed' | 'interviewed' | 'accepted' | 'rejected';
  appliedDate: string;
  resume: string;
  description: string;
}

export interface Investment {
  id: string;
  startupId: string;
  startupName: string;
  sector: string;
  stage: string;
  investmentAmount: number;
  equity: number;
  date: string;
  status: 'active' | 'exited' | 'written-off';
  currentValue: number;
  return: number;
  location: string;
  description: string;
  tags: string[];
}

export interface InvestmentOpportunity {
  id: string;
  startupName: string;
  sector: string;
  stage: string;
  fundingTarget: number;
  raised: number;
  daysLeft: number;
  matchScore: number;
  location: string;
  description: string;
  tags: string[];
  teamSize: string;
  revenue: string;
  avatar: string;
}

export interface Comment {
  id: number;
  user: string;
  avatar: string;
  content: string;
  timestamp: string;
  likes: number;
  replies?: Comment[];
}

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  company: string;
  status: 'pending' | 'reviewed' | 'interviewed' | 'accepted' | 'rejected' | 'applied' | 'interview';
  appliedDate: string;
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  location: string;
  workMode: string;
  remote: boolean;
  description: string;
  skills: string[];
  matchScore: number;
}

export interface JobRecommendation {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  workMode: string;
  remote: boolean;
  matchScore: number;
  skills: string[];
  description: string;
  postedDate: string;
  urgency: 'high' | 'medium' | 'low';
}

interface DataContextType {
  startups: Startup[];
  jobs: Job[];
  connections: Connection[];
  messages: Message[];
  applications: Application[];
  investments: Investment[];
  investmentOpportunities: InvestmentOpportunity[];
  comments: Comment[];
  jobApplications: JobApplication[];
  jobRecommendations: JobRecommendation[];
  loading: boolean;
  searchStartups: (query: string, filters?: any) => Startup[];
  likeStartup: (startupId: string) => void;
  createStartup: (startupData: Omit<Startup, 'id' | 'likes' | 'comments' | 'createdAt'>) => void;
  createJob: (jobData: Omit<Job, 'id' | 'createdAt'>) => void;
  createConnection: (toUserId: string, message?: string) => void;
  updateConnection: (connectionId: string, status: 'accepted' | 'declined') => void;
  sendMessage: (connectionId: string, content: string) => void;
  updateApplicationStatus: (applicationId: string, status: Application['status']) => void;
  addComment: (startupId: string, content: string) => void;
  likeComment: (commentId: number) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

// Sample data
const sampleStartups: Startup[] = [
  {
    id: 'startup-1',
    name: 'TechFlow AI',
    description: 'Revolutionary AI platform that automates complex business workflows with natural language processing.',
    logo: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=400',
    type: 'profit',
    sector: 'AI/ML',
    location: { city: 'San Francisco', country: 'USA', coordinates: [-122.4194, 37.7749] },
    teamSize: '5-10',
    fundingNeeds: '100k-500k',
    hiringStatus: 'urgent',
    founderId: 'founder-1',
    founderName: 'Sarah Chen',
    website: 'https://techflow.ai',
    tags: ['AI', 'B2B', 'SaaS'],
    likes: 47,
    comments: 12,
    createdAt: '2024-01-15'
  },
  {
    id: 'startup-2',
    name: 'EcoTrack',
    description: 'Sustainable supply chain tracking platform helping companies reduce their carbon footprint.',
    logo: 'https://images.pexels.com/photos/3183153/pexels-photo-3183153.jpeg?auto=compress&cs=tinysrgb&w=400',
    type: 'research',
    sector: 'CleanTech',
    location: { city: 'Berlin', country: 'Germany', coordinates: [13.4050, 52.5200] },
    teamSize: '2-5',
    fundingNeeds: '<100k',
    hiringStatus: 'open',
    founderId: 'founder-2',
    founderName: 'Max Weber',
    tags: ['Sustainability', 'B2B', 'Analytics'],
    likes: 23,
    comments: 5,
    createdAt: '2024-01-20'
  },
  {
    id: 'startup-3',
    name: 'HealthSync',
    description: 'Telemedicine platform connecting patients with specialists worldwide through AI-powered matching.',
    logo: 'https://images.pexels.com/photos/3183156/pexels-photo-3183156.jpeg?auto=compress&cs=tinysrgb&w=400',
    type: 'non-profit',
    sector: 'HealthTech',
    location: { city: 'Toronto', country: 'Canada', coordinates: [-79.3832, 43.6532] },
    teamSize: '20-50',
    fundingNeeds: '>500k',
    hiringStatus: 'urgent',
    founderId: 'founder-3',
    founderName: 'Dr. Priya Patel',
    website: 'https://healthsync.io',
    tags: ['Healthcare', 'AI', 'Global'],
    likes: 89,
    comments: 24,
    createdAt: '2024-01-10'
  }
];

const sampleJobs: Job[] = [
  {
    id: 'job-1',
    startupId: 'startup-1',
    title: 'Senior Frontend Developer',
    description: 'Looking for an experienced React developer to build our next-generation AI interface.',
    salary: { min: 80000, max: 120000, currency: 'EGP' },
    equity: '0.1-0.5%',
    location: 'Cairo, Egypt',
    workMode: 'remote',
    skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS'],
    createdAt: '2024-01-25'
  },
  {
    id: 'job-2',
    startupId: 'startup-3',
    title: 'Product Manager',
    description: 'Drive product strategy for our telemedicine platform serving millions of users.',
    salary: { min: 90000, max: 140000, currency: 'EGP' },
    equity: '0.2-0.8%',
    location: 'Alexandria, Egypt',
    workMode: 'hybrid',
    skills: ['Product Strategy', 'Healthcare', 'Analytics', 'Agile'],
    createdAt: '2024-01-22'
  }
];

const sampleApplications: Application[] = [
  {
    id: 'app-1',
    jobId: 'job-1',
    applicantName: 'Ahmed Hassan',
    email: 'ahmed.hassan@email.com',
    experience: '5 years',
    skills: ['React', 'Node.js', 'TypeScript', 'MongoDB'],
    status: 'pending',
    appliedDate: '2024-01-15',
    resume: 'ahmed_hassan_resume.pdf',
    description: 'Experienced full-stack developer with 5 years of experience building scalable web applications. Passionate about clean code and modern development practices. Led a team of 3 developers in my previous role and successfully delivered multiple projects on time.'
  },
  {
    id: 'app-2',
    jobId: 'job-1',
    applicantName: 'Sarah Mohamed',
    email: 'sarah.mohamed@email.com',
    experience: '3 years',
    skills: ['Vue.js', 'Python', 'Django', 'PostgreSQL'],
    status: 'reviewed',
    appliedDate: '2024-01-14',
    resume: 'sarah_mohamed_resume.pdf',
    description: 'Frontend specialist with strong backend knowledge. I love creating intuitive user interfaces and have experience with both Vue.js and React ecosystems. I\'m particularly interested in working with startups that are making a positive impact.'
  },
  {
    id: 'app-3',
    jobId: 'job-1',
    applicantName: 'Omar Ali',
    email: 'omar.ali@email.com',
    experience: '7 years',
    skills: ['React', 'Next.js', 'AWS', 'Docker'],
    status: 'interviewed',
    appliedDate: '2024-01-13',
    resume: 'omar_ali_resume.pdf',
    description: 'Senior software engineer with extensive experience in cloud architecture and DevOps. I\'ve worked with startups from seed stage to Series B, helping them scale their technical infrastructure. I\'m excited about the opportunity to contribute to your team\'s growth.'
  }
];

const sampleInvestments: Investment[] = [
  {
    id: 'inv-1',
    startupId: 'startup-1',
    startupName: 'TechFlow AI',
    sector: 'AI/ML',
    stage: 'Series A',
    investmentAmount: 50000,
    equity: 2.5,
    date: '2023-08-15',
    status: 'active',
    currentValue: 75000,
    return: 50,
    location: 'San Francisco, CA',
    description: 'AI-powered workflow automation platform',
    tags: ['AI', 'Automation', 'B2B']
  },
  {
    id: 'inv-2',
    startupId: 'startup-2',
    startupName: 'EcoTrack',
    sector: 'CleanTech',
    stage: 'Seed',
    investmentAmount: 25000,
    equity: 5.0,
    date: '2023-06-20',
    status: 'active',
    currentValue: 30000,
    return: 20,
    location: 'Berlin, Germany',
    description: 'Sustainable supply chain tracking platform',
    tags: ['Biotech', 'Agriculture', 'Sustainability']
  },
  {
    id: 'inv-3',
    startupId: 'startup-3',
    startupName: 'QuantumSecure',
    sector: 'Cybersecurity',
    stage: 'Pre-seed',
    investmentAmount: 75000,
    equity: 15.0,
    date: '2023-11-01',
    status: 'active',
    currentValue: 90000,
    return: 20,
    location: 'London, UK',
    description: 'Quantum-resistant cybersecurity',
    tags: ['Quantum', 'Security', 'DeepTech']
  }
];

const sampleInvestmentOpportunities: InvestmentOpportunity[] = [
  {
    id: 'opp-1',
    startupName: 'DataFlow Analytics',
    sector: 'AI/ML',
    stage: 'Series A',
    fundingTarget: 2000000,
    raised: 1200000,
    daysLeft: 15,
    matchScore: 92,
    location: 'New York, NY',
    description: 'Advanced data analytics platform for enterprise customers',
    tags: ['AI', 'Analytics', 'Enterprise'],
    teamSize: '8-12',
    revenue: 'Growing',
    avatar: 'DF'
  },
  {
    id: 'opp-2',
    startupName: 'HealthTech Solutions',
    sector: 'HealthTech',
    stage: 'Seed',
    fundingTarget: 800000,
    raised: 400000,
    daysLeft: 28,
    matchScore: 88,
    location: 'Austin, TX',
    description: 'Telemedicine platform connecting patients with specialists',
    tags: ['HealthTech', 'Telemedicine', 'B2B'],
    teamSize: '5-8',
    revenue: 'Pre-revenue',
    avatar: 'HS'
  },
  {
    id: 'opp-3',
    startupName: 'EcoEnergy Systems',
    sector: 'CleanTech',
    stage: 'Series A',
    fundingTarget: 3000000,
    raised: 1800000,
    daysLeft: 42,
    matchScore: 85,
    location: 'Seattle, WA',
    description: 'Renewable energy management and optimization platform',
    tags: ['CleanTech', 'Energy', 'IoT'],
    teamSize: '12-15',
    revenue: 'Growing',
    avatar: 'ES'
  }
];

const sampleComments: Comment[] = [
  {
    id: 1,
    user: 'Sarah Johnson',
    avatar: 'SJ',
    content: 'This startup has incredible potential! The AI technology they\'re developing could revolutionize the industry.',
    timestamp: '2 hours ago',
    likes: 12,
    replies: [
      {
        id: 2,
        user: 'Mike Chen',
        avatar: 'MC',
        content: 'I agree! The team is very experienced and the market opportunity is huge.',
        timestamp: '1 hour ago',
        likes: 5
      }
    ]
  },
  {
    id: 3,
    user: 'Alex Rodriguez',
    avatar: 'AR',
    content: 'The funding round looks promising. I\'m particularly interested in their B2B approach.',
    timestamp: '4 hours ago',
    likes: 8
  },
  {
    id: 4,
    user: 'Emily Davis',
    avatar: 'ED',
    content: 'Has anyone tried their beta product? I\'d love to hear about the user experience.',
    timestamp: '6 hours ago',
    likes: 3
  }
];

const sampleJobApplications: JobApplication[] = [
  {
    id: 'app-1',
    jobId: 'job-1',
    jobTitle: 'Senior Frontend Developer',
    companyName: 'TechFlow AI',
    company: 'TechFlow AI',
    status: 'applied',
    appliedDate: '2024-01-15',
    salary: { min: 120000, max: 150000, currency: 'USD' },
    location: 'San Francisco, CA',
    workMode: 'Remote',
    remote: true,
    description: 'We are looking for a senior frontend developer to join our AI team...',
    skills: ['React', 'TypeScript', 'Node.js', 'GraphQL'],
    matchScore: 95
  },
  {
    id: 'app-2',
    jobId: 'job-2',
    jobTitle: 'Full Stack Engineer',
    companyName: 'DataFlow AI',
    company: 'DataFlow AI',
    status: 'interview',
    appliedDate: '2024-01-12',
    salary: { min: 100000, max: 130000, currency: 'USD' },
    location: 'New York, NY',
    workMode: 'Hybrid',
    remote: false,
    description: 'Join our team to build scalable data analytics platforms...',
    skills: ['React', 'Python', 'PostgreSQL', 'AWS'],
    matchScore: 88
  },
  {
    id: 'app-3',
    jobId: 'job-3',
    jobTitle: 'React Developer',
    companyName: 'StartupXYZ',
    company: 'StartupXYZ',
    status: 'rejected',
    appliedDate: '2024-01-08',
    salary: { min: 80000, max: 100000, currency: 'USD' },
    location: 'Austin, TX',
    workMode: 'Remote',
    remote: true,
    description: 'We need a React developer to help build our MVP...',
    skills: ['React', 'JavaScript', 'CSS', 'Git'],
    matchScore: 75
  }
];

const sampleJobRecommendations: JobRecommendation[] = [
  {
    id: 'rec-1',
    title: 'Senior React Developer',
    company: 'InnovateTech',
    location: 'Seattle, WA',
    salary: { min: 110000, max: 140000, currency: 'USD' },
    workMode: 'Remote',
    remote: true,
    matchScore: 92,
    skills: ['React', 'TypeScript', 'Redux', 'Jest'],
    description: 'Lead the development of our next-generation web applications using React and modern JavaScript frameworks.',
    postedDate: '2024-01-16',
    urgency: 'high'
  },
  {
    id: 'rec-2',
    title: 'Frontend Engineer',
    company: 'CloudScale',
    location: 'Remote',
    salary: { min: 95000, max: 120000, currency: 'USD' },
    workMode: 'Remote',
    remote: true,
    matchScore: 85,
    skills: ['React', 'Vue.js', 'CSS', 'Webpack'],
    description: 'Build beautiful and performant user interfaces for our cloud infrastructure platform.',
    postedDate: '2024-01-15',
    urgency: 'medium'
  },
  {
    id: 'rec-3',
    title: 'JavaScript Developer',
    company: 'FinTech Solutions',
    location: 'Chicago, IL',
    salary: { min: 85000, max: 110000, currency: 'USD' },
    workMode: 'On-site',
    remote: false,
    matchScore: 78,
    skills: ['JavaScript', 'Node.js', 'MongoDB', 'Express'],
    description: 'Develop financial applications and trading interfaces using modern JavaScript technologies.',
    postedDate: '2024-01-14',
    urgency: 'low'
  }
];

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [startups, setStartups] = useState<Startup[]>(sampleStartups);
  const [jobs, setJobs] = useState<Job[]>(sampleJobs);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [applications, setApplications] = useState<Application[]>(sampleApplications);
  const [investments, setInvestments] = useState<Investment[]>(sampleInvestments);
  const [investmentOpportunities, setInvestmentOpportunities] = useState<InvestmentOpportunity[]>(sampleInvestmentOpportunities);
  const [comments, setComments] = useState<Comment[]>(sampleComments);
  const [jobApplications, setJobApplications] = useState<JobApplication[]>(sampleJobApplications);
  const [jobRecommendations, setJobRecommendations] = useState<JobRecommendation[]>(sampleJobRecommendations);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const searchStartups = (query: string, filters?: any) => {
    let filtered = startups;
    
    if (query.trim()) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(startup =>
        startup.name.toLowerCase().includes(lowerQuery) ||
        startup.description.toLowerCase().includes(lowerQuery) ||
        startup.sector.toLowerCase().includes(lowerQuery) ||
        startup.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
      );
    }

    if (filters) {
      if (filters.sector && filters.sector !== 'all') {
        filtered = filtered.filter(s => s.sector === filters.sector);
      }
      if (filters.stage && filters.stage !== 'all') {
        filtered = filtered.filter(s => s.stage === filters.stage);
      }
      if (filters.hiringStatus && filters.hiringStatus !== 'all') {
        filtered = filtered.filter(s => s.hiringStatus === filters.hiringStatus);
      }
      if (filters.fundingNeeds && filters.fundingNeeds !== 'all') {
        filtered = filtered.filter(s => s.fundingNeeds === filters.fundingNeeds);
      }
    }

    return filtered;
  };

  const likeStartup = (startupId: string) => {
    setStartups(prev => prev.map(startup =>
      startup.id === startupId
        ? { ...startup, likes: startup.likes + 1 }
        : startup
    ));
  };

  const createStartup = (startupData: Omit<Startup, 'id' | 'likes' | 'comments' | 'createdAt'>) => {
    const newStartup: Startup = {
      ...startupData,
      id: `startup-${Date.now()}`,
      likes: 0,
      comments: 0,
      createdAt: new Date().toISOString()
    };
    setStartups(prev => [...prev, newStartup]);
  };

  const createJob = (jobData: Omit<Job, 'id' | 'createdAt'>) => {
    const newJob: Job = {
      ...jobData,
      id: `job-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setJobs(prev => [...prev, newJob]);
  };

  const createConnection = (toUserId: string, message?: string) => {
    if (!user) return;
    
    const newConnection: Connection = {
      id: `conn-${Date.now()}`,
      fromUserId: user.id,
      toUserId,
      status: 'pending',
      message,
      createdAt: new Date().toISOString()
    };

    setConnections(prev => [...prev, newConnection]);
  };

  const updateConnection = (connectionId: string, status: 'accepted' | 'declined') => {
    setConnections(prev => prev.map(conn =>
      conn.id === connectionId ? { ...conn, status } : conn
    ));
  };

  const sendMessage = (connectionId: string, content: string) => {
    if (!user) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      connectionId,
      fromUserId: user.id,
      content,
      createdAt: new Date().toISOString()
    };

    setMessages(prev => [...prev, newMessage]);
  };

  const updateApplicationStatus = (applicationId: string, status: Application['status']) => {
    setApplications(prev => 
      prev.map(app => 
        app.id === applicationId 
          ? { ...app, status }
          : app
      )
    );
  };

  const addComment = (startupId: string, content: string) => {
    if (!user) return;

    const newComment: Comment = {
      id: Date.now(),
      user: user.name,
      avatar: user.name.charAt(0),
      content,
      timestamp: 'Just now',
      likes: 0
    };

    setComments(prev => [...prev, newComment]);
  };

  const likeComment = (commentId: number) => {
    setComments(prev => 
      prev.map(comment => 
        comment.id === commentId 
          ? { ...comment, likes: comment.likes + 1 }
          : comment
      )
    );
  };

  return (
    <DataContext.Provider value={{
      startups,
      jobs,
      connections,
      messages,
      applications,
      investments,
      investmentOpportunities,
      comments,
      jobApplications,
      jobRecommendations,
      loading,
      searchStartups,
      likeStartup,
      createStartup,
      createJob,
      createConnection,
      updateConnection,
      sendMessage,
      updateApplicationStatus,
      addComment,
      likeComment
    }}>
      {children}
    </DataContext.Provider>
  );
};