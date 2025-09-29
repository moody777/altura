# Altura - AI-Powered Startup Ecosystem

A premium web application connecting startups, investors, and job seekers through AI-powered matching and intelligent features.

## 🌟 Features

### Core User Roles
- **Startups**: Manage company profiles, post jobs, connect with investors
- **Investors**: Discover and track promising startups, manage investment portfolio  
- **Job Seekers**: Find exciting startup opportunities, AI-powered resume analysis

### AI-Powered Features
- **Resume Parsing**: Upload PDFs/DOCX → AI extracts skills and experience
- **Profile Optimization**: AI enhances startup descriptions for maximum impact
- **Smart Matching**: AI suggests relevant connections based on preferences
- **Job Generation**: AI assists in creating compelling job postings

### Premium Design
- Clean white & gold (#C9A227) theme with subtle dark text (#222)
- Responsive mobile-first design with smooth micro-interactions
- Apple-level attention to detail and sophisticated visual hierarchy
- Accessibility-focused with WCAG AA compliance

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Modern web browser

### Development Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production  
npm run build
```

### Environment Variables
Create a `.env` file for production AWS integration:
```env
VITE_AWS_REGION=us-east-1
VITE_COGNITO_USER_POOL_ID=your_user_pool_id
VITE_COGNITO_CLIENT_ID=your_client_id
VITE_APPSYNC_GRAPHQL_ENDPOINT=your_appsync_endpoint
VITE_S3_BUCKET=your_s3_bucket
```

## 🏗️ Architecture

### Frontend Stack
- **React 18** with TypeScript for type safety
- **Vite** for fast development and optimized builds
- **Tailwind CSS** for utility-first styling
- **React Router** for client-side routing
- **Lucide React** for premium iconography

### Backend Integration (AWS)
- **AWS Amplify** for hosting and CI/CD
- **Amazon Cognito** for authentication and user management
- **AWS AppSync** with GraphQL for real-time data
- **Amazon S3** for file storage (resumes, logos)
- **Amazon Textract** for document parsing
- **Amazon Bedrock** for AI text processing
- **Amazon OpenSearch** for advanced search capabilities

### Key Components
- **Context Providers**: Auth, Data, and Notifications
- **Protected Routes**: Role-based access control
- **Smart Search**: Advanced filtering with real-time results
- **Responsive Cards**: Startup, job, and user profile displays
- **Toast Notifications**: User feedback system

## 📱 User Experience

### Onboarding Flow
1. **Role Selection**: Choose between Startup, Investor, or Job Seeker
2. **Profile Creation**: Role-specific forms with AI assistance
3. **AI Enhancement**: Resume parsing or description optimization
4. **Location Setup**: Geographic preferences and availability

### Core Interactions
- **Explore Page**: Unified search with advanced filtering
- **Connection System**: Professional networking with messaging
- **Role-Specific Dashboards**: Tailored experiences per user type
- **Real-time Matching**: AI-powered suggestions and notifications

## 🔒 Security & Compliance

### Authentication
- AWS Cognito with email/OTP and social login options
- Role-based access control (RBAC) with Cognito Groups
- Secure session management and token refresh

### Data Protection
- Server-side input validation and sanitization
- Content moderation with AI guardrails
- Audit trail for all critical user actions
- HTTPS enforcement and secure headers

## 🌐 AWS Migration Guide

### From Demo to Production

1. **Setup AWS Amplify Gen 2**
   ```bash
   npm install -g @aws-amplify/cli
   amplify configure
   amplify init
   ```

2. **Configure Authentication**
   ```bash
   amplify add auth
   # Choose Cognito User Pools with Groups
   ```

3. **Setup GraphQL API**
   ```bash
   amplify add api
   # Choose GraphQL with user pool authorization
   ```

4. **Add AI Services**
   ```bash
   amplify add function
   # Create Lambda functions for Textract and Bedrock integration
   ```

5. **Deploy Infrastructure**
   ```bash
   amplify push
   ```

### Production Considerations
- **Environment Separation**: Dev/staging/production environments
- **Monitoring**: CloudWatch dashboards and alarms
- **Performance**: CDN configuration and caching strategies
- **Scaling**: Auto-scaling groups and load balancing
- **Backup**: Database and S3 backup strategies

## 📊 Sample Data

The application includes realistic sample data:
- 10 diverse startups across different sectors and stages
- 6 job postings with competitive salaries and equity
- 6 investor profiles with various focus areas
- Mock AI responses for development and testing

## 🧪 Testing

### Development Testing
```bash
# Run linting
npm run lint

# Type checking
npm run typecheck

# Build test
npm run build
```

### Production Testing
- Unit tests for utility functions and hooks
- Integration tests for user flows
- E2E tests for critical paths
- Performance testing with Lighthouse

## 🚀 Deployment

### Bolt Hosting (Current)
The demo is deployed on Bolt Hosting with all features functional.

### AWS Amplify (Production)
1. Connect GitHub repository to Amplify Console
2. Configure build settings and environment variables
3. Enable preview deployments for pull requests
4. Set up custom domain with SSL certificate

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎯 Roadmap

### Phase 1 (Current)
- ✅ Core user authentication and onboarding
- ✅ Premium UI/UX with responsive design
- ✅ Basic search and filtering
- ✅ Connection system foundation

### Phase 2 (Next)
- Real AWS Amplify integration
- Advanced AI matching algorithms
- Real-time messaging system
- Email notification system

### Phase 3 (Future)
- Video calls and virtual events
- Advanced analytics dashboard
- Mobile app (React Native)
- International expansion (i18n)

## 📞 Support

For questions, issues, or feature requests:
- Create an issue on GitHub
- Contact the development team
- Check the documentation wiki

---

Built with ❤️ using React, TypeScript, Tailwind CSS, and AWS services.