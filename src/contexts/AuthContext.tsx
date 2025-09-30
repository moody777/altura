import React, { createContext, useContext, useState, useEffect } from 'react';
import { signUp as amplifySignUp, signIn as amplifySignIn, signOut as amplifySignOut, confirmSignUp as amplifyConfirmSignUp, getCurrentUser } from "aws-amplify/auth";
import type { Schema } from '../../amplify/data/resource';
import { generateClient } from 'aws-amplify/data';

const client = generateClient<Schema>();
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
  clearAuthState: () => Promise<void>;
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
        // First check if there's a saved user in localStorage
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          setUser(userData);
        } else {
          // Check if there's an active Amplify session
          try {
            const currentUser = await getCurrentUser();
            if (currentUser) {
              // User is authenticated in Amplify but not in our app state
              // Clear the session to force re-authentication
              await amplifySignOut();
            }
          } catch (error) {
            // No active session, which is expected
            console.log('No active Amplify session');
          }
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
      // Check if user is already signed in
      if (user) {
        throw new Error('User is already signed in. Please sign out first.');
      }

      await amplifySignIn({
        username: email,
        password: _password,
      });
      
      // Retry logic to handle authentication propagation delay
      let users: any[] | null = null;
      let retries = 0;
      const maxRetries = 3;
      
      while (!users && retries < maxRetries) {
        try {
          console.log(`Fetching user from database (attempt ${retries + 1})`);
          const result = await client.models.User.list({
            
          });
          users = result.data;
          break;
        } catch (error) {
          console.log(`Database query failed (attempt ${retries + 1}):`, error);
          retries++;
          if (retries < maxRetries) {
            // Wait before retrying
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
      }
      
      console.log('users:', users);
      if (users && users.length > 0) {
        const dbUser = users[0];
        const userObj: User = {
          id: dbUser.id || '',
          email: dbUser.email || '',
          name: dbUser.name || '',
          role: dbUser.role as UserRole,
          onboardingComplete: dbUser.onboardingComplete || false,
          city: dbUser.city || undefined,
          country: dbUser.country || undefined,
          phone: dbUser.phone || undefined,
          linkedin: dbUser.linkedin || undefined,
          bio: dbUser.bio || undefined,
          portfolio: dbUser.portfolio || undefined,
        };
        console.error('user fetched:');
        setUser(userObj);
        localStorage.setItem('user', JSON.stringify(userObj));
      } else {
        // User authenticated with Amplify but not in our database
        // This shouldn't happen in normal flow, but handle gracefully
        if (retries >= maxRetries) {
          throw new Error('Unable to fetch user data. Please try again.');
        } else {
          throw new Error('User account not found. Please contact support.');
        }
      }
    } catch (error: any) {
      console.error('Sign in failed:', error);
      
      // Handle specific Amplify errors
      if (error.name === 'UserAlreadyAuthenticatedException') {
        throw new Error('You are already signed in. Please sign out first.');
      }
      
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
          id: newUser.id || '',
          email: newUser.email || '',
          name: newUser.name || '',
          role: newUser.role as UserRole,
          onboardingComplete: newUser.onboardingComplete || false,
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

  const clearAuthState = async () => {
    try {
      // Force clear all authentication state
      await amplifySignOut();
    } catch (error) {
      // Ignore errors, we just want to clear state
    }
    setUser(null);
    setTempUser(null);
    localStorage.removeItem('user');
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
      clearAuthState,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};