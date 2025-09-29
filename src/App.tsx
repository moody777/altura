import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Onboarding from './pages/Onboarding';
import MyStartup from './pages/MyStartup';
import MyJobs from './pages/MyJobs';
import MyInvestments from './pages/MyInvestments';
import Connections from './pages/Connections';
import Profile from './pages/Profile';
import StartupDetail from './pages/StartupDetail';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1f2937 0%, #374151 50%, #1f2937 100%)',
        backgroundAttachment: 'fixed'
      }}
    >
      <AuthProvider>
        <DataProvider>
          <NotificationProvider>
            <Router>
              <Routes>
                <Route path="/auth" element={<Auth />} />
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/" element={<Layout />}>
                  <Route index element={<Home />} />
                  <Route path="/startup/:id" element={<StartupDetail />} />
                  <Route path="/my-startup" element={
                    <ProtectedRoute requiredRole="startup">
                      <MyStartup />
                    </ProtectedRoute>
                  } />
                  <Route path="/my-jobs" element={
                    <ProtectedRoute requiredRole="job_seeker">
                      <MyJobs />
                    </ProtectedRoute>
                  } />
                  <Route path="/my-investments" element={
                    <ProtectedRoute requiredRole="investor">
                      <MyInvestments />
                    </ProtectedRoute>
                  } />
                  <Route path="/connections" element={
                    <ProtectedRoute>
                      <Connections />
                    </ProtectedRoute>
                  } />
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } />
                </Route>
              </Routes>
            </Router>
          </NotificationProvider>
        </DataProvider>
      </AuthProvider>
    </div>
  );
}

export default App;