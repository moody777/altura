import React, { useState } from 'react';
import { useAuth, UserRole } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { useNotifications } from '../contexts/NotificationContext';
import { Navigate } from 'react-router-dom';
import { 
  Building, 
  TrendingUp, 
  Briefcase, 
  Upload, 
  Sparkles, 
  MapPin, 
  FileText,
  Crown
} from 'lucide-react';

const Onboarding: React.FC = () => {
  const { user, updateUser, loading } = useAuth();
  const { createStartup, createJobSeeker, createInvestor } = useData();
  const { addNotification } = useNotifications();
  const [step, setStep] = useState(1);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B8860B]"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [formData, setFormData] = useState({
    role: '' as UserRole | '',
    
    // Personal Info (common)
    name: user?.name || '',
    email: user?.email || '',
    location: { city: '', country: '' },
    
    // Job Seeker specific
    resume: null as File | null,
    desiredSalary: 0,
    skills: [] as string[],
    resumeMethod: '' as 'upload' | 'fill' | '',
    
    // Comprehensive job seeker info
    education: [] as Array<{
      degree: string;
      field: string;
      institution: string;
      graduationYear: string;
      gpa: string;
    }>,
    experience: [] as Array<{
      company: string;
      position: string;
      startDate: string;
      endDate: string;
      description: string;
      current: boolean;
    }>,
    certifications: [] as string[],
    languages: [] as string[],
    personalInfo: {
      phone: '',
      linkedin: '',
      portfolio: '',
      bio: ''
    },
    
    // Startup specific
    companyName: '',
    companyDescription: '',
    type: '',
    sector: '',
    teamSize: '',
    fundingNeeds: '',
    hiringStatus: '',
    website: '',
    tags: [] as string[],
    
    // Investor specific
    investmentRange: '',
    sectors: [] as string[],
    geography: [] as string[],
    
    // Additional fields for startup and investor
    phone: '',
    linkedin: '',
    bio: ''
  });

  if (user?.onboardingComplete) {
    return <Navigate to="/" replace />;
  }

  const roles = [
    {
      id: 'job_seeker' as UserRole,
      title: 'Job Seeker',
      description: 'I want to work at an exciting startup',
      icon: Briefcase,
      color: 'bg-purple-50 border-purple-200 text-purple-700'
    },
    {
      id: 'startup' as UserRole,
      title: 'Startup',
      description: 'I have a startup and need funding or talent',
      icon: Building,
      color: 'bg-blue-50 border-blue-200 text-blue-700'
    },
    {
      id: 'investor' as UserRole,
      title: 'Investor',
      description: 'I invest in promising startups',
      icon: TrendingUp,
      color: 'bg-green-50 border-green-200 text-green-700'
    }
  ];

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setFormData({ ...formData, role });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, resume: file });
      
      // Simulate AI processing with Textract+Bedrock
      addNotification({
        type: 'info',
        title: 'Processing Resume',
        message: 'Using Textract+Bedrock to extract information...'
      });
      
      setTimeout(() => {
        addNotification({
          type: 'success',
          title: 'Resume Processed',
          message: 'Your resume has been analyzed and your profile has been updated.'
        });
        
        // Mock extracted data
        setFormData(prev => ({
          ...prev,
          skills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'Python'],
          desiredSalary: 100000,
          education: [{
            degree: 'Bachelor\'s',
            field: 'Computer Science',
            institution: 'University of Technology',
            graduationYear: '2022',
            gpa: '3.8'
          }],
          experience: [{
            company: 'Tech Corp',
            position: 'Software Developer',
            startDate: '2022-06-01',
            endDate: '',
            description: 'Developed web applications using React and Node.js',
            current: true
          }],
          certifications: ['AWS Certified Developer', 'Google Cloud Professional'],
          languages: ['English', 'Spanish']
        }));
      }, 2000);
    }
  };

  const optimizeDescription = async () => {
    if (!formData.companyDescription) return;
    
    addNotification({
      type: 'info',
      title: 'Optimizing Description',
      message: 'Using Bedrock to optimize business description...'
    });
    
    // Simulate AI optimization
    setTimeout(() => {
      const optimized = `${formData.companyDescription} We leverage cutting-edge technology to deliver innovative solutions that drive measurable business value and sustainable growth in today's competitive market.`;
      setFormData(prev => ({ ...prev, companyDescription: optimized }));
      
      addNotification({
        type: 'success',
        title: 'Description Optimized',
        message: 'Your business description has been enhanced for maximum impact.'
      });
    }, 1500);
  };

  const handleComplete = async () => {
    // Update user profile
    await updateUser({
      role: formData.role as UserRole,
      onboardingComplete: true,
      city: formData.location.city ? formData.location.city : undefined,
      country: formData.location.country ? formData.location.country : undefined,
      phone: formData.personalInfo.phone ? formData.personalInfo.phone : undefined,
      linkedin: formData.personalInfo.linkedin ? formData.personalInfo.linkedin : undefined,
      bio: formData.personalInfo.bio ? formData.personalInfo.bio : undefined,
      portfolio: formData.personalInfo.portfolio ? formData.personalInfo.portfolio : undefined
    });

    // Create startup if user selected startup role
    if (formData.role === 'startup' && user) {
      createStartup({
        name: formData.companyName,
        description: formData.companyDescription,
        type: formData.type as any,
        sector: formData.sector,
        city: formData.location.city,
        country: formData.location.country,
        teamSize: formData.teamSize,
        fundingNeeds: formData.fundingNeeds as any,
        hiringStatus: formData.hiringStatus as any,
        founderId: user.id,
        website: formData.website
      } as any);
    }

    // Create job seeker profile if user selected job_seeker role
    if (formData.role === 'job_seeker' && user) {
      createJobSeeker({
        userId: user.id,
        desiredSalary: formData.desiredSalary,
        skills: formData.skills,
        certifications: formData.certifications,
        languages: formData.languages,
      } as any);
    }

    // Create investor profile if user selected investor role
    if (formData.role === 'investor' && user) {
      createInvestor({
        userId: user.id,
        investmentRange: formData.investmentRange,
        sectors: formData.sectors,
      } as any);
    }
    
    addNotification({
      type: 'success',
      title: 'Welcome to Altura!',
      message: 'Your profile has been created successfully.'
    });
  };

  const getStepTitle = () => {
    if (step === 1) return 'Choose Your Role';
    if (!selectedRole) return '';
    
    switch (selectedRole) {
      case 'job_seeker':
        if (step === 2) return 'Resume Method';
        if (step === 3) return 'Personal Information';
        if (step === 4) return 'Education & Experience';
        if (step === 5) return 'Skills & Certifications';
        if (step === 6) return 'Desired Salary';
        break;
      case 'startup':
        if (step === 2) return 'Enter Personal Info';
        if (step === 3) return 'Enter Business Info';
        if (step === 4) return 'Optimize Description';
        break;
      case 'investor':
        if (step === 2) return 'Enter Personal Info';
        if (step === 3) return 'Enter Investment Budget';
        break;
    }
    return '';
  };

  const getMaxSteps = () => {
    switch (selectedRole) {
      case 'job_seeker': return 6;
      case 'startup': return 4;
      case 'investor': return 3;
      default: return 1;
    }
  };

  const renderRoleSelection = () => (
    <div className="space-y-4">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-[#B8860B] rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Crown className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Welcome to Altura</h2>
        <p className="text-gray-600">Choose your role to get started</p>
      </div>
      
      <div className="grid gap-4">
        {roles.map((role) => {
          const Icon = role.icon;
          return (
            <button
              key={role.id}
              onClick={() => handleRoleSelect(role.id)}
              className={`p-6 rounded-xl border-2 transition-all text-left hover:shadow-md ${
                selectedRole === role.id
                  ? 'border-[#B8860B] bg-[#B8860B]/10'
                  : 'border-gray-600 hover:border-gray-500'
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${role.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{role.title}</h3>
                  <p className="text-gray-300 text-sm">{role.description}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderJobSeekerResumeMethod = () => (
    <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white mb-4">How would you like to provide your information?</h2>
      
      <div className="grid gap-4">
        <button
          onClick={() => setFormData(prev => ({ ...prev, resumeMethod: 'upload' }))}
          className={`p-6 rounded-xl border-2 transition-all text-left hover:shadow-md ${
            formData.resumeMethod === 'upload'
              ? 'border-[#B8860B] bg-[#B8860B]/10'
              : 'border-gray-600 hover:border-gray-500'
          }`}
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-50 border-blue-200 text-blue-700 rounded-lg flex items-center justify-center">
              <Upload className="w-6 h-6" />
            </div>
            <div>
                      <h3 className="font-semibold text-white">Import CV</h3>
                      <p className="text-gray-300 text-sm">Upload your resume and we'll extract the information using Textract+Bedrock</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => setFormData(prev => ({ ...prev, resumeMethod: 'fill' }))}
          className={`p-6 rounded-xl border-2 transition-all text-left hover:shadow-md ${
            formData.resumeMethod === 'fill'
              ? 'border-[#B8860B] bg-[#B8860B]/10'
              : 'border-gray-600 hover:border-gray-500'
          }`}
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-50 border-green-200 text-green-700 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <div>
                      <h3 className="font-semibold text-white">Fill info from blank</h3>
                      <p className="text-gray-300 text-sm">Manually enter your information step by step</p>
            </div>
          </div>
        </button>
      </div>

      {formData.resumeMethod === 'upload' && (
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Upload your resume (PDF/DOCX)
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#B8860B] transition-colors">
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <label className="cursor-pointer">
              <span className="text-[#B8860B] font-medium">Click to upload</span>
              <span className="text-gray-600"> or drag and drop</span>
              <input
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
              />
            </label>
            {formData.resume && (
              <p className="mt-2 text-sm text-green-600">✓ {formData.resume.name}</p>
            )}
          </div>
        </div>
      )}

      {formData.resumeMethod === 'fill' && (
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-gray-600">You'll be able to add your skills, education, and experience in the following steps.</p>
          </div>
        </div>
      )}
    </div>
  );

  const renderJobSeekerPersonalInfo = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
          <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
          <input
            type="tel"
            value={formData.personalInfo.phone}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              personalInfo: { ...prev.personalInfo, phone: e.target.value }
            }))}
            className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-[#B8860B] focus:border-transparent text-white placeholder-gray-400"
            placeholder="+1 (555) 123-4567"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">LinkedIn Profile</label>
          <input
            type="url"
            value={formData.personalInfo.linkedin}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              personalInfo: { ...prev.personalInfo, linkedin: e.target.value }
            }))}
            className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-[#B8860B] focus:border-transparent text-white placeholder-gray-400"
            placeholder="https://linkedin.com/in/yourname"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Portfolio/Website</label>
        <input
          type="url"
          value={formData.personalInfo.portfolio}
          onChange={(e) => setFormData(prev => ({
            ...prev,
            personalInfo: { ...prev.personalInfo, portfolio: e.target.value }
          }))}
          className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-[#B8860B] focus:border-transparent text-white placeholder-gray-400"
          placeholder="https://yourportfolio.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Professional Bio</label>
        <textarea
          rows={3}
          value={formData.personalInfo.bio}
          onChange={(e) => setFormData(prev => ({
            ...prev,
            personalInfo: { ...prev.personalInfo, bio: e.target.value }
          }))}
          className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-[#B8860B] focus:border-transparent text-white placeholder-gray-400"
          placeholder="Tell us about yourself, your experience, and what you're looking for..."
        />
      </div>
    </div>
  );

  const renderJobSeekerEducationExperience = () => (
    <div className="space-y-4">
      
      {/* Education Section */}
      <div className="bg-gray-700/30 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-white mb-4">Education</h3>
        {formData.education.map((edu, index) => (
          <div key={index} className="border border-gray-600 rounded-lg p-4 mb-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Degree</label>
                <select
                  value={edu.degree}
                  onChange={(e) => {
                    const newEducation = [...formData.education];
                    newEducation[index] = { ...edu, degree: e.target.value };
                    setFormData(prev => ({ ...prev, education: newEducation }));
                  }}
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-[#B8860B] focus:border-transparent"
                >
                  <option value="">Select degree</option>
                  <option value="High School">High School</option>
                  <option value="Associate">Associate</option>
                  <option value="Bachelor's">Bachelor's</option>
                  <option value="Master's">Master's</option>
                  <option value="PhD">PhD</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Field of Study</label>
            <input
              type="text"
                  value={edu.field}
              onChange={(e) => {
                    const newEducation = [...formData.education];
                    newEducation[index] = { ...edu, field: e.target.value };
                    setFormData(prev => ({ ...prev, education: newEducation }));
              }}
              className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-[#B8860B] focus:border-transparent"
                  placeholder="Computer Science"
            />
          </div>
        </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Institution</label>
                <input
                  type="text"
                  value={edu.institution}
              onChange={(e) => {
                    const newEducation = [...formData.education];
                    newEducation[index] = { ...edu, institution: e.target.value };
                    setFormData(prev => ({ ...prev, education: newEducation }));
              }}
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-[#B8860B] focus:border-transparent"
                  placeholder="University Name"
            />
          </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Graduation Year</label>
                <input
                  type="number"
                  value={edu.graduationYear}
                  onChange={(e) => {
                    const newEducation = [...formData.education];
                    newEducation[index] = { ...edu, graduationYear: e.target.value };
                    setFormData(prev => ({ ...prev, education: newEducation }));
                  }}
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-[#B8860B] focus:border-transparent"
                  placeholder="2023"
                />
        </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">GPA (Optional)</label>
              <input
                type="text"
                value={edu.gpa}
                onChange={(e) => {
                  const newEducation = [...formData.education];
                  newEducation[index] = { ...edu, gpa: e.target.value };
                  setFormData(prev => ({ ...prev, education: newEducation }));
                }}
                className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-[#B8860B] focus:border-transparent"
                placeholder="3.8"
              />
            </div>
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setFormData(prev => ({
                  ...prev,
                  education: prev.education.filter((_, i) => i !== index)
                }))}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Remove Education
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setFormData(prev => ({
            ...prev,
            education: [...prev.education, {
              degree: '',
              field: '',
              institution: '',
              graduationYear: '',
              gpa: ''
            }]
          }))}
          className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-[#B8860B] hover:text-[#B8860B] transition-colors"
        >
          + Add Education
        </button>
      </div>

      {/* Experience Section */}
      <div className="bg-gray-700/30 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-white mb-4">Work Experience</h3>
        {formData.experience.map((exp, index) => (
          <div key={index} className="border border-gray-600 rounded-lg p-4 mb-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Company</label>
                <input
                  type="text"
                  value={exp.company}
                  onChange={(e) => {
                    const newExperience = [...formData.experience];
                    newExperience[index] = { ...exp, company: e.target.value };
                    setFormData(prev => ({ ...prev, experience: newExperience }));
                  }}
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-[#B8860B] focus:border-transparent"
                  placeholder="Company Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Position</label>
                <input
                  type="text"
                  value={exp.position}
                  onChange={(e) => {
                    const newExperience = [...formData.experience];
                    newExperience[index] = { ...exp, position: e.target.value };
                    setFormData(prev => ({ ...prev, experience: newExperience }));
                  }}
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-[#B8860B] focus:border-transparent"
                  placeholder="Job Title"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Start Date</label>
                <input
                  type="date"
                  value={exp.startDate}
                  onChange={(e) => {
                    const newExperience = [...formData.experience];
                    newExperience[index] = { ...exp, startDate: e.target.value };
                    setFormData(prev => ({ ...prev, experience: newExperience }));
                  }}
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-[#B8860B] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">End Date</label>
                <input
                  type="date"
                  value={exp.endDate}
                  onChange={(e) => {
                    const newExperience = [...formData.experience];
                    newExperience[index] = { ...exp, endDate: e.target.value };
                    setFormData(prev => ({ ...prev, experience: newExperience }));
                  }}
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-[#B8860B] focus:border-transparent"
                  disabled={exp.current}
                />
                <label className="flex items-center mt-2">
                  <input
                    type="checkbox"
                    checked={exp.current}
                    onChange={(e) => {
                      const newExperience = [...formData.experience];
                      newExperience[index] = { ...exp, current: e.target.checked };
                      setFormData(prev => ({ ...prev, experience: newExperience }));
                    }}
                    className="rounded border-gray-300 text-[#B8860B] focus:ring-[#B8860B]"
                  />
                  <span className="ml-2 text-sm text-gray-300">Currently working here</span>
                </label>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
              <textarea
                rows={3}
                value={exp.description}
                onChange={(e) => {
                  const newExperience = [...formData.experience];
                  newExperience[index] = { ...exp, description: e.target.value };
                  setFormData(prev => ({ ...prev, experience: newExperience }));
                }}
                className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-[#B8860B] focus:border-transparent"
                placeholder="Describe your responsibilities and achievements..."
              />
            </div>
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setFormData(prev => ({
                  ...prev,
                  experience: prev.experience.filter((_, i) => i !== index)
                }))}
                className="text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Remove Experience
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setFormData(prev => ({
            ...prev,
            experience: [...prev.experience, {
              company: '',
              position: '',
              startDate: '',
              endDate: '',
              description: '',
              current: false
            }]
          }))}
          className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-[#B8860B] hover:text-[#B8860B] transition-colors"
        >
          + Add Work Experience
        </button>
      </div>
    </div>
  );

  const renderJobSeekerSkillsCertifications = () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white mb-4">Skills & Certifications</h2>
      
      {/* Skills Section */}
      <div className="bg-gray-700/30 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-white mb-4">Technical Skills</h3>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Add Skills</label>
          <input
            type="text"
            placeholder="Enter a skill and press Enter"
            className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-[#B8860B] focus:border-transparent"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                const skill = e.currentTarget.value.trim();
                if (skill && !formData.skills.includes(skill)) {
                  setFormData(prev => ({
                    ...prev,
                    skills: [...prev.skills, skill]
                  }));
                  e.currentTarget.value = '';
                }
              }
            }}
          />
          <div className="flex flex-wrap gap-2 mt-3">
            {formData.skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-[#B8860B]/10 text-[#B8860B] rounded-full text-sm flex items-center gap-2"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    skills: prev.skills.filter((_, i) => i !== index)
                  }))}
                  className="text-[#B8860B] hover:text-red-500"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-2">Add your technical skills, programming languages, frameworks, and tools</p>
        </div>
      </div>

      {/* Certifications Section */}
      <div className="bg-gray-700/30 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-white mb-4">Certifications</h3>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Add Certifications</label>
          <input
            type="text"
            placeholder="Enter a certification and press Enter"
            className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-[#B8860B] focus:border-transparent"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                const cert = e.currentTarget.value.trim();
                if (cert && !formData.certifications.includes(cert)) {
                  setFormData(prev => ({
                    ...prev,
                    certifications: [...prev.certifications, cert]
                  }));
                  e.currentTarget.value = '';
                }
              }
            }}
          />
          <div className="flex flex-wrap gap-2 mt-3">
            {formData.certifications.map((cert, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-2"
              >
                {cert}
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    certifications: prev.certifications.filter((_, i) => i !== index)
                  }))}
                  className="text-blue-700 hover:text-red-500"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Languages Section */}
      <div className="bg-gray-700/30 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-white mb-4">Languages</h3>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Add Languages</label>
          <input
            type="text"
            placeholder="Enter a language and press Enter"
            className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-[#B8860B] focus:border-transparent"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                const lang = e.currentTarget.value.trim();
                if (lang && !formData.languages.includes(lang)) {
                  setFormData(prev => ({
                    ...prev,
                    languages: [...prev.languages, lang]
                  }));
                  e.currentTarget.value = '';
                }
              }
            }}
          />
          <div className="flex flex-wrap gap-2 mt-3">
            {formData.languages.map((lang, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm flex items-center gap-2"
              >
                {lang}
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    languages: prev.languages.filter((_, i) => i !== index)
                  }))}
                  className="text-green-700 hover:text-red-500"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderJobSeekerSalary = () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white mb-4">Enter desired salary</h2>
      
      {/* Skills Display */}
      {formData.skills.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Your Skills
          </label>
          <div className="flex flex-wrap gap-2">
            {formData.skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-[#B8860B]/10 text-[#B8860B] rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Single Salary Input */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
          Desired Annual Salary ($)
          </label>
          <input
            type="number"
          value={formData.desiredSalary || ''}
            onChange={(e) => setFormData(prev => ({
              ...prev,
            desiredSalary: parseInt(e.target.value) || 0
            }))}
            className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-[#B8860B] focus:border-transparent"
            placeholder="80000"
          />
        <p className="text-sm text-gray-500 mt-1">Enter your expected annual salary in USD</p>
      </div>
    </div>
  );

  const renderStartupPersonalInfo = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white mb-4">Additional Information</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-[#B8860B] focus:border-transparent"
            placeholder="+1 (555) 123-4567"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">LinkedIn Profile</label>
          <input
            type="url"
            value={formData.linkedin}
            onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
            className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-[#B8860B] focus:border-transparent"
            placeholder="https://linkedin.com/in/yourname"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <MapPin className="w-4 h-4 inline mr-1" />
            City
          </label>
          <input
            type="text"
            value={formData.location.city}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              location: { ...prev.location, city: e.target.value }
            }))}
            className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-[#B8860B] focus:border-transparent"
            placeholder="San Francisco"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Country</label>
          <input
            type="text"
            value={formData.location.country}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              location: { ...prev.location, country: e.target.value }
            }))}
            className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-[#B8860B] focus:border-transparent"
            placeholder="USA"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Professional Bio</label>
        <textarea
          rows={3}
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-[#B8860B] focus:border-transparent"
          placeholder="Tell us about your background and experience..."
        />
      </div>
    </div>
  );

  const renderStartupBusinessInfo = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white mb-4">Enter Business Info</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Company Name</label>
          <input
            type="text"
            value={formData.companyName}
            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
            className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-[#B8860B] focus:border-transparent"
            placeholder="Acme Inc."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Sector</label>
          <select
            value={formData.sector}
            onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
            className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-[#B8860B] focus:border-transparent"
          >
            <option value="">Select sector</option>
            <option value="AI/ML">AI/ML</option>
            <option value="FinTech">FinTech</option>
            <option value="HealthTech">HealthTech</option>
            <option value="CleanTech">CleanTech</option>
            <option value="EdTech">EdTech</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Company Description
        </label>
        <textarea
          rows={4}
          value={formData.companyDescription}
          onChange={(e) => setFormData({ ...formData, companyDescription: e.target.value })}
          className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-[#B8860B] focus:border-transparent"
          placeholder="Describe your startup..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Website (Optional)</label>
        <input
          type="url"
          value={formData.website}
          onChange={(e) => setFormData({ ...formData, website: e.target.value })}
          className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-[#B8860B] focus:border-transparent"
          placeholder="https://yourstartup.com"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-[#B8860B] focus:border-transparent"
          >
            <option value="">Select type</option>
            <option value="research">Research</option>
            <option value="profit">Profit</option>
            <option value="non-profit">Non-Profit</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Team Size</label>
          <select
            value={formData.teamSize}
            onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
            className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-[#B8860B] focus:border-transparent"
          >
            <option value="">Select size</option>
            <option value="1-2">1-2</option>
            <option value="2-5">2-5</option>
            <option value="5-10">5-10</option>
            <option value="10-20">10-20</option>
            <option value="20-50">20-50</option>
            <option value="50+">50+</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Funding Needs</label>
          <select
            value={formData.fundingNeeds}
            onChange={(e) => setFormData({ ...formData, fundingNeeds: e.target.value })}
            className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-[#B8860B] focus:border-transparent"
          >
            <option value="">Select amount</option>
            <option value="<100k">{"< $100k"}</option>
            <option value="100k-500k">$100k - $500k</option>
            <option value=">500k">{"> $500k"}</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Hiring Status</label>
        <select
          value={formData.hiringStatus}
          onChange={(e) => setFormData({ ...formData, hiringStatus: e.target.value })}
          className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-[#B8860B] focus:border-transparent"
        >
          <option value="">Select status</option>
          <option value="urgent">Urgent hiring</option>
          <option value="open">Open positions</option>
          <option value="not-hiring">Not hiring</option>
        </select>
      </div>
    </div>
  );

  const renderStartupOptimization = () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white mb-4">Bedrock to optimize business description and details</h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Current Description
        </label>
        <div className="p-4 bg-gray-700/30 rounded-lg border">
          <p className="text-gray-300">{formData.companyDescription || 'No description provided'}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={optimizeDescription}
        disabled={!formData.companyDescription}
        className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-[#B8860B] text-white rounded-lg hover:bg-[#A67C00] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Sparkles className="w-5 h-5" />
        <span>Optimize with Bedrock AI</span>
      </button>

      <div className="text-sm text-gray-600">
        <p>Our AI will enhance your business description to:</p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>Make it more compelling to investors</li>
          <li>Highlight key value propositions</li>
          <li>Improve clarity and impact</li>
          <li>Optimize for search and discovery</li>
        </ul>
      </div>
    </div>
  );

  const renderInvestorPersonalInfo = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white mb-4">Additional Information</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-[#B8860B] focus:border-transparent"
            placeholder="+1 (555) 123-4567"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">LinkedIn Profile</label>
          <input
            type="url"
            value={formData.linkedin}
            onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
            className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-[#B8860B] focus:border-transparent"
            placeholder="https://linkedin.com/in/yourname"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <MapPin className="w-4 h-4 inline mr-1" />
            City
          </label>
          <input
            type="text"
            value={formData.location.city}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              location: { ...prev.location, city: e.target.value }
            }))}
            className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-[#B8860B] focus:border-transparent"
            placeholder="New York"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Country</label>
          <input
            type="text"
            value={formData.location.country}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              location: { ...prev.location, country: e.target.value }
            }))}
            className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-[#B8860B] focus:border-transparent"
            placeholder="USA"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Professional Bio</label>
        <textarea
          rows={3}
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-[#B8860B] focus:border-transparent"
          placeholder="Tell us about your investment experience and focus areas..."
        />
      </div>
    </div>
  );

  const renderInvestorBudget = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white mb-4">Investment Range</h2>
      
        <div>
        <label className="block text-sm font-medium text-gray-300 mb-4">
          Select your investment range (EGP)
          </label>
        <div className="space-y-3">
          {[
            { value: '<100k', label: 'Less than 100,000 EGP' },
            { value: '100k-500k', label: '100,000 - 500,000 EGP' },
            { value: '>500k', label: 'More than 500,000 EGP' }
          ].map((option) => (
            <label key={option.value} className="flex items-center space-x-3 p-4 border border-gray-600 rounded-lg hover:border-[#B8860B] cursor-pointer">
          <input
                type="radio"
                name="investmentRange"
                value={option.value}
                checked={formData.investmentRange === option.value}
                onChange={(e) => setFormData({ ...formData, investmentRange: e.target.value })}
                className="text-[#B8860B] focus:ring-[#B8860B]"
              />
              <span className="text-gray-300 font-medium">{option.label}</span>
          </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Preferred Sectors
        </label>
        <div className="grid grid-cols-2 gap-2">
          {['AI/ML', 'FinTech', 'HealthTech', 'CleanTech', 'EdTech', 'E-commerce'].map((sector) => (
            <label key={sector} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.sectors.includes(sector)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setFormData(prev => ({ ...prev, sectors: [...prev.sectors, sector] }));
                  } else {
                    setFormData(prev => ({ ...prev, sectors: prev.sectors.filter(s => s !== sector) }));
                  }
                }}
                className="rounded border-gray-300 text-[#B8860B] focus:ring-[#B8860B]"
              />
              <span className="text-sm text-gray-300">{sector}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    if (step === 1) return renderRoleSelection();
    
    if (selectedRole === 'job_seeker') {
      if (step === 2) return renderJobSeekerResumeMethod();
      if (step === 3) return renderJobSeekerPersonalInfo();
      if (step === 4) return renderJobSeekerEducationExperience();
      if (step === 5) return renderJobSeekerSkillsCertifications();
      if (step === 6) return renderJobSeekerSalary();
    }
    
    if (selectedRole === 'startup') {
      if (step === 2) return renderStartupPersonalInfo();
      if (step === 3) return renderStartupBusinessInfo();
      if (step === 4) return renderStartupOptimization();
    }
    
    if (selectedRole === 'investor') {
      if (step === 2) return renderInvestorPersonalInfo();
      if (step === 3) return renderInvestorBudget();
    }
    
    return null;
  };

  const canProceed = () => {
    if (step === 1) return selectedRole !== null;
    
    if (selectedRole === 'job_seeker') {
      if (step === 2) return formData.resumeMethod !== '';
      if (step === 3) return formData.personalInfo.phone && formData.personalInfo.bio;
      if (step === 4) return formData.education.length > 0 && formData.education[0].degree && formData.education[0].institution;
      if (step === 5) return formData.skills.length > 0;
      if (step === 6) return formData.desiredSalary > 0;
    }
    
    if (selectedRole === 'startup') {
      if (step === 2) return formData.phone && formData.bio;
      if (step === 3) return formData.companyName && formData.sector && formData.companyDescription;
      if (step === 4) return true;
    }
    
    if (selectedRole === 'investor') {
      if (step === 2) return formData.phone && formData.bio;
      if (step === 3) return formData.investmentRange !== '';
    }
    
    return false;
  };

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center overflow-hidden">
      <div className="w-full max-w-2xl mx-4">
        <div className="bg-gray-800 rounded-2xl shadow-lg p-4 border border-gray-700 max-h-[90vh] overflow-y-auto">
          {/* Progress indicator */}
          {selectedRole && (
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm text-gray-300 mb-2">
                <span>Step {step} of {getMaxSteps()}</span>
                <span>{Math.round((step / getMaxSteps()) * 100)}% complete</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-[#B8860B] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(step / getMaxSteps()) * 100}%` }}
                ></div>
              </div>
            </div>
          )}

          <div className="mb-4">
            <h1 className="text-lg font-semibold text-white">{getStepTitle()}</h1>
          </div>

          {renderCurrentStep()}
          
          <div className="flex justify-between mt-6 pt-4 border-t border-gray-600">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="px-6 py-2 text-gray-300 hover:text-white transition-colors"
              >
                Back
              </button>
            )}
            
            <div className="ml-auto">
              {step < getMaxSteps() ? (
                <button
                  onClick={() => setStep(step + 1)}
                  disabled={!canProceed()}
                  className="px-6 py-2 bg-[#B8860B] text-white rounded-lg hover:bg-[#A67C00] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              ) : (
                <button
                  onClick={handleComplete}
                  disabled={!canProceed()}
                  className="px-6 py-2 bg-[#B8860B] text-white rounded-lg hover:bg-[#A67C00] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Complete Setup
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;