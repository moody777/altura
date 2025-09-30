import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import type { Schema } from '../../amplify/data/resource'
import { generateClient } from 'aws-amplify/data'

const client = generateClient<Schema>()


interface DataContextType {
  startups: Schema["Startup"]["type"][];
  jobs: Schema["Job"]["type"][];
  investments: Schema["Investment"]["type"][];
  comments: Schema["Comment"]["type"][];
  jobApplications: Schema["JobApplication"]["type"][];
  jobSeekers: Schema["JobSeeker"]["type"][];
  investors: Schema["Investor"]["type"][];
  loading: boolean;
  searchStartups: (query: string, filters?: any) => Schema["Startup"]["type"][];
  likeStartup: (startupId: string) => Promise<void>;
  createStartup: (startupData: Omit<Schema["Startup"]["type"], 'id' | 'likes' | 'commentsNo' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  createJob: (jobData: Omit<Schema["Job"]["type"], 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  createJobSeeker: (jobSeekerData: Omit<Schema["JobSeeker"]["type"], 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  createInvestor: (investorData: Omit<Schema["Investor"]["type"], 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateApplicationStatus: (applicationId: string, status: Schema["JobApplication"]["type"]['status']) => Promise<void>;
  addComment: (startupId: string, content: string) => Promise<void>;
  likeComment: (commentId: string) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

// // Sample data
// const sampleStartups: Startup[] = [
//   {
//     id: 'startup-1',
//     name: 'TechFlow AI',
//     description: 'Revolutionary AI platform that automates complex business workflows with natural language processing.',
//     logo: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=400',
//     type: 'profit',
//     sector: 'AI/ML',
//     city: 'San Francisco',
//     country: 'USA',
//     teamSize: '5-10',
//     fundingNeeds: '100k-500k',
//     hiringStatus: 'urgent',
//     founderId: 'founder-1',
//     website: 'https://techflow.ai',
//     likes: 47,
//     comments: 12,
//     createdAt: '2024-01-15'
//   }
// ];

// const sampleJobs: Job[] = [
//   {
//     id: 'job-1',
//     startupId: 'startup-1',
//     title: 'Senior Frontend Developer',
//     description: 'Looking for an experienced React developer to build our next-generation AI interface.',
//     salary: { min: 80000, max: 120000 },
//     equity: '0.1-0.5%',
//     city: 'San Francisco',
//     country: 'USA',
//     workMode: 'remote'
//   }
// ];


// const sampleInvestments: Investment[] = [
//   {
//     id: 'inv-1',
//     startupId: 'startup-1',
//     startupName: 'TechFlow AI',
//     sector: 'AI/ML',
//     stage: 'Series A',
//     investmentAmount: 50000,
//     equity: 2.5,
//     date: '2023-08-15',
//     status: 'active',
//     currentValue: 75000,
//     return: 50,
//     location: 'San Francisco, CA',
//     description: 'AI-powered workflow automation platform',
//     tags: ['AI', 'Automation', 'B2B']
//   }
// ];


// const sampleComments: Comment[] = [
//   {
//     id: 1,
//     user: 'Sarah Johnson',
//     content: 'This startup has incredible potential! The AI technology they\'re developing could revolutionize the industry.',
//     timestamp: '2 hours ago',
//     likes: 12,
    
//   }
// ];

// const sampleJobApplications: JobApplication[] = [
//   {
//     id: 'app-1',
//     jobId: 'job-1',
//     applicantId: 'applicant-1',
//     status: 'pending',
//     workMode: 'remote',
//     description: 'Experienced full-stack developer with 5 years of experience building scalable web applications.',
//     matchScore: 95
//   }
// ];

// const sampleJobSeekers: JobSeeker[] = [
//   {
//     id: 'jobseeker-1',
//     userId: 'user-1',
//     desiredSalary: 100000,
//     skills: ['React', 'Node.js', 'TypeScript', 'AWS'],
//     education: [
//       {
//         degree: 'Bachelor of Science',
//         field: 'Computer Science',
//         institution: 'Stanford University',
//         graduationYear: '2020',
//         gpa: '3.8'
//       }
//     ],
//     experience: [
//       {
//         company: 'Tech Corp',
//         position: 'Senior Developer',
//         startDate: '2020-06',
//         endDate: '2023-12',
//         description: 'Led development of scalable web applications',
//         current: false
//       }
//     ],
//     certifications: ['AWS Certified Developer', 'Google Cloud Professional'],
//     languages: ['English', 'Spanish'],
//   }
// ];

// const sampleInvestors: Investor[] = [
//   {
//     id: 'investor-1',
//     userId: 'user-2',
//     investmentRange: '100k-1M',
//     sectors: ['AI/ML', 'Fintech', 'Healthcare'],
//   }
// ];


export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [startups, setStartups] = useState<Schema["Startup"]["type"][]>([]);
  const [jobs, setJobs] = useState<Schema["Job"]["type"][]>([]);
  const [investments, setInvestments] = useState<Schema["Investment"]["type"][]>([]);
  const [comments, setComments] = useState<Schema["Comment"]["type"][]>([]);
  const [jobApplications, setJobApplications] = useState<Schema["JobApplication"]["type"][]>([]);
  const [jobSeekers, setJobSeekers] = useState<Schema["JobSeeker"]["type"][]>([]);
  const [investors, setInvestors] = useState<Schema["Investor"]["type"][]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();


  const load = async () => {
    const { data: startups } = await client.models.Startup.list();
    const { data: jobs } = await client.models.Job.list();
    const { data: investments } = await client.models.Investment.list();
    const { data: comments } = await client.models.Comment.list();
    const { data: jobApplications } = await client.models.JobApplication.list();
    const { data: jobSeekers } = await client.models.JobSeeker.list();
    const { data: investors } = await client.models.Investor.list();
    setStartups(startups);
    setJobs(jobs);
    setInvestments(investments);
    setComments(comments);
    setJobApplications(jobApplications);
    setJobSeekers(jobSeekers);
    setInvestors(investors);
  };

  useEffect(() => {
    load();
    setLoading(false);
  }, []);

  
  const searchStartups = (query: string, filters?: any) => {
    let filtered = startups || [];
    
    if (query.trim()) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(startup =>
        startup.name.toLowerCase().includes(lowerQuery) ||
        startup.description.toLowerCase().includes(lowerQuery) ||
        startup.sector.toLowerCase().includes(lowerQuery)
      );
    }

    if (filters) {
      if (filters.sector && filters.sector !== 'all') {
        filtered = filtered.filter(s => s.sector === filters.sector);
      }
      if (filters.type && filters.type !== 'all') {
        filtered = filtered.filter(s => s.type === filters.type);
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

  const likeStartup = async (startupId: string) => {
    const startup = startups.find(s => s.id === startupId);
    if (startup) {
      await client.models.Startup.update({
        id: startupId,
        likes: (startup.likes || 0) + 1
      });
      load(); // Reload data
    }
  };

  const createStartup = async (startupData: Omit<Schema["Startup"]["type"], 'id' | 'likes' | 'commentsNo' | 'createdAt' | 'updatedAt'>) => {
    const { data: newStartup } = await client.models.Startup.create({
      ...startupData,
      likes: 0,
      commentsNo: 0
    });
    if (newStartup) {
      setStartups(prev => [...(prev || []), newStartup]);
    }
  };

  const createJob = async (jobData: Omit<Schema["Job"]["type"], 'id' | 'createdAt' | 'updatedAt'>) => {
    const { data: newJob } = await client.models.Job.create(jobData);
    if (newJob) {
      setJobs(prev => [...(prev || []), newJob]);
    }
  };

  const createJobSeeker = async (jobSeekerData: Omit<Schema["JobSeeker"]["type"], 'id' | 'createdAt' | 'updatedAt'>) => {
    const { data: newJobSeeker } = await client.models.JobSeeker.create(jobSeekerData);
    if (newJobSeeker) {
      setJobSeekers(prev => [...(prev || []), newJobSeeker]);
    }
  };

  const createInvestor = async (investorData: Omit<Schema["Investor"]["type"], 'id' | 'createdAt' | 'updatedAt'>) => {
    const { data: newInvestor } = await client.models.Investor.create(investorData);
    if (newInvestor) {
      setInvestors(prev => [...(prev || []), newInvestor]);
    }
  };

  const updateApplicationStatus = async (applicationId: string, status: Schema["JobApplication"]["type"]['status']) => {
    await client.models.JobApplication.update({
      id: applicationId,
      status
    });
    load(); // Reload data
  };

  const addComment = async (startupId: string, content: string) => {
    if (!user) return;

    await client.models.Comment.create({
      userId: user.id,
      startupId,
      content,
      timestamp: new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }),
      likes: 0
    });
    load(); // Reload data
  };

  const likeComment = async (commentId: string) => {
    const comment = comments.find(c => c.id === commentId);
    if (comment) {
      await client.models.Comment.update({
        id: commentId,
        likes: (comment.likes || 0) + 1
      });
      load(); // Reload data
    }
  };

  return (
    <DataContext.Provider value={{
      startups,
      jobs,
      investments,
      comments,
      jobApplications,
      jobSeekers,
      investors,
      loading,
      searchStartups,
      likeStartup,
      createStartup,
      createJob,
      createJobSeeker,
      createInvestor,
      updateApplicationStatus,
      addComment,
      likeComment
    }}>
      {children}
    </DataContext.Provider>
  );
};