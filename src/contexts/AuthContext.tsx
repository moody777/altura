import React, { createContext, useContext, useState, useEffect } from 'react';
import { signUp as amplifySignUp, signIn as amplifySignIn, signOut as amplifySignOut, confirmSignUp as amplifyConfirmSignUp } from "aws-amplify/auth";
export type UserRole = 'startup' | 'investor' | 'job_seeker';

export interface User {
  id: string;
  email: string;
  name: string;
  role?: UserRole;
  onboardingComplete: boolean;
  city?: string;
  country?: string;
  phone?: string;
  linkedin?: string;
  bio?: string;
  portfolio?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  confirmSignUp: (email: string, confirmationCode: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [tempUser, setTempUser] = useState<User | null>(null);
  useEffect(() => {
    // Simulate checking for existing session
    const checkAuth = () => {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const signIn = async (email: string, _password: string) => {
    setLoading(true);
    
    try {
      await amplifySignIn({
        username: email,
        password: _password,
      });
      
      // Create a mock user object since we're not using real user data
      const mockUser: User = {
        id: `user-${Date.now()}`,
        email: email,
        name: email.split('@')[0],
        onboardingComplete: false,
      };
      
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
    } catch (error) {
      console.error('Sign in failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, _password: string, name: string) => {
    setLoading(true);
    
    try {
      await amplifySignUp({
        username: email,
        password: _password,
        options: {
          userAttributes: {
            email: email, 
          },
        },
      });
      
      // Create a mock user object
      const mockUser: User = {
        id: `user-${Date.now()}`,
        email: email,
        name: name,
        onboardingComplete: false,
      };
      setTempUser(mockUser);
    } catch (error) {
      console.error('Sign up failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };


  const confirmSignUp = async (email: string, confirmationCode: string) => {
    setLoading(true);
    
    try {
      const { isSignUpComplete, nextStep } = await amplifyConfirmSignUp({
        username: email,
        confirmationCode: confirmationCode
      });
      
      if (isSignUpComplete) {
        // Create a mock user object after successful confirmation
        
      setUser(tempUser);
       localStorage.setItem('user', JSON.stringify(tempUser));
      } else {
        // Handle additional steps if needed
        console.log('Additional steps required:', nextStep);
        throw new Error('Additional verification steps required');
      }
    } catch (error) {
      console.error('Sign up confirmation failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await amplifySignOut();
      setUser(null);
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Sign out failed:', error);
      throw error;
    }
  };

  const updateUser = async (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signIn,
      signUp,
      confirmSignUp,
      signOut,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};