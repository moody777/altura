import React, { createContext, useContext, useState, useEffect } from 'react';
import { signUp as amplifySignUp, signIn as amplifySignIn, signOut as amplifySignOut, confirmSignUp as amplifyConfirmSignUp } from "aws-amplify/auth";
import type { Schema } from '../../amplify/data/resource';
import { generateClient } from 'aws-amplify/data';

const client = generateClient<Schema>();
export type UserRole = 'startup' | 'investor' | 'job_seeker';

export interface User {
  id: string | null;
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
    // Check for existing session
    const checkAuth = async () => {
      try {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          setUser(userData);
        }
      } catch (error) {
        console.error('Error loading saved user:', error);
        // Clear invalid user data
        localStorage.removeItem('user');
        setUser(null);
      } finally {
        setLoading(false);
      }
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
      
      // Fetch user from database
      const { data: users } = await client.models.User.list({
        filter: { email: { eq: email } }
      });
      
      if (users && users.length > 0) {
        const dbUser = users[0];
        const userObj: User = {
          id: dbUser.id,
          email: dbUser.email,
          name: dbUser.name,
          role: dbUser.role as UserRole,
          onboardingComplete: dbUser.onboardingComplete,
          city: dbUser.city || undefined,
          country: dbUser.country || undefined,
          phone: dbUser.phone || undefined,
          linkedin: dbUser.linkedin || undefined,
          bio: dbUser.bio || undefined,
          portfolio: dbUser.portfolio || undefined,
        };
        
        setUser(userObj);
        localStorage.setItem('user', JSON.stringify(userObj));
      } else {
        throw new Error('User not found in database');
      }
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
      
      // Create user in database
      const { data: newUser } = await client.models.User.create({
        email: email,
        name: name,
        role: 'startup', // Default role, will be updated during onboarding
        onboardingComplete: false,
      });
      
      if (newUser) {
        const userObj: User = {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role as UserRole,
          onboardingComplete: newUser.onboardingComplete,
          city: newUser.city || undefined,
          country: newUser.country || undefined,
          phone: newUser.phone || undefined,
          linkedin: newUser.linkedin || undefined,
          bio: newUser.bio || undefined,
          portfolio: newUser.portfolio || undefined,
        };
        setTempUser(userObj);
      }
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
    setLoading(true);
    try {
      await amplifySignOut();
      setUser(null);
      setTempUser(null);
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Sign out failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (updates: Partial<User>) => {
    if (user) {
      // Update user in database
      await client.models.User.update({
        id: user.id,
        ...updates
      });
      
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