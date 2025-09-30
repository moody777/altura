import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import type { Schema } from '../../amplify/data/resource'
import { generateClient } from 'aws-amplify/data'




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
  reload: () => Promise<void>;
  sendAIMessage: (message: string) => Promise<string>;
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
  const client = generateClient<Schema>();


  const load = async () => {
    try {
      setLoading(true);
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
      
      // Test the Recommendations function
      try {
        const { data: recommendations } = await client.queries.Recommendations({
          text: 'AI',
          indexName: 'Jobs',
        });
        console.log('Recommendations:', recommendations);
      } catch (recommendationError) {
        console.error('Failed to load recommendations:', recommendationError);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const reload = async () => {
    await load();
  };

  useEffect(() => {
    load();
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
      console.log('New startup created:', newStartup);
    }else{
      console.log('Failed to create startup');
    }
    load();
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

  const sendAIMessage = async (message: string): Promise<string> => {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    const lowerMessage = message.toLowerCase();
    
    // Check if message contains "roi"
    if (lowerMessage.includes('roi')) {
      return `ROI (Return on Investment) Explanation:

ROI is a key financial metric that measures the efficiency of an investment. It's calculated as:
ROI = (Net Profit / Cost of Investment) × 100%

**5 Other Important Startup Metrics:**

1. **Customer Acquisition Cost (CAC)** - The cost to acquire a new customer. Lower CAC means more efficient marketing.

2. **Customer Lifetime Value (CLV)** - Total revenue expected from a customer over their lifetime. CLV should be 3x higher than CAC.

3. **Monthly Recurring Revenue (MRR)** - Predictable monthly revenue from subscriptions. Essential for SaaS businesses.

4. **Burn Rate** - How quickly you're spending cash. Critical for runway planning and fundraising.

5. **Net Promoter Score (NPS)** - Measures customer satisfaction and likelihood to recommend your product. Scores above 50 are excellent.

**Pro Tip:** Focus on improving these metrics systematically rather than just chasing high ROI numbers. Sustainable growth comes from balanced metrics!`;
    }
    if (lowerMessage.includes('business model')) {
      return `**Business Model Overview:**

A business model describes how your startup creates, delivers, and captures value. Common types include:

- **B2B (Business-to-Business):** Selling products/services to other businesses.
- **B2C (Business-to-Consumer):** Selling directly to consumers.
- **Marketplace:** Connecting buyers and sellers, often taking a commission.
- **Subscription:** Charging customers a recurring fee for ongoing access.

**Key Questions:**
- Who are your target customers?
- What problem are you solving?
- How do you make money (revenue streams)?
- What are your main costs?

**Pro Tip:** Use the Business Model Canvas to map out your ideas and iterate quickly!`;
    }
    if (lowerMessage.includes('funding') || lowerMessage.includes('raise capital')) {
      return `**Startup Funding Stages:**

1. **Pre-seed:** Early funding from founders, friends, or family.
2. **Seed:** Initial investment to validate your idea, often from angel investors.
3. **Series A/B/C:** Larger rounds from venture capitalists to scale your business.

**Tips for Raising Capital:**
- Build a compelling pitch deck (problem, solution, traction, team, financials).
- Research investors who focus on your industry and stage.
- Be clear about how much you need and how you'll use it.

**Pro Tip:** Investors invest in teams as much as ideas. Highlight your team's strengths and vision!`;
    }
    if (lowerMessage.includes('mvp') || lowerMessage.includes('minimum viable product')) {
      return `**MVP (Minimum Viable Product) Guide:**

An MVP is the simplest version of your product that solves the core problem for your target users.

**Steps to Build an MVP:**
1. Identify the main problem and your target audience.
2. List essential features only—avoid "nice to have" extras.
3. Build quickly and launch to get real user feedback.
4. Iterate based on feedback and usage data.

**Pro Tip:** Don't wait for perfection. Launch early, learn fast, and improve!`;
    }
    if (lowerMessage.includes('market research')) {
      return `**Market Research Basics:**

Market research helps you understand your customers, competitors, and industry trends.

**How to Conduct Market Research:**
- **Surveys & Interviews:** Talk to potential customers to learn about their needs.
- **Competitor Analysis:** Study similar products and their strengths/weaknesses.
- **Industry Reports:** Use online resources for market size and growth trends.

Pro Tip: Validate your assumptions with real data before investing heavily in product development!`;
    }

    // Default responses for other messages
    const defaultResponses = [
      "That's a great question! Based on your startup's current stage, I'd recommend focusing on customer validation first. Have you conducted any user interviews?",
      "For hiring, I suggest creating a clear job description with specific skills and cultural fit requirements. What role are you looking to fill?",
      "Regarding funding, your startup seems to be in a good position. Consider preparing a pitch deck with clear metrics and growth projections.",
      "I can help you analyze your business model. What's your primary revenue stream, and how do you plan to scale it?",
      "For marketing strategy, I'd recommend starting with content marketing and social media presence. What's your target audience?",
      "That's an interesting challenge. Let me help you think through this systematically. What specific aspect would you like to focus on first?",
      "Based on your startup's sector, I suggest looking into industry-specific accelerators and networking events. Have you considered joining any startup communities?",
      "For product development, I recommend following the lean startup methodology. What's your current MVP status?",
      "Great point! Let me help you develop a strategy for that. What resources do you currently have available?",
      "I understand your concern. Many startups face similar challenges. Let's break this down into actionable steps. What's your biggest priority right now?"
    ];

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
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
      likeComment,
      reload,
      sendAIMessage
    }}>
      {children}
    </DataContext.Provider>
  );
};