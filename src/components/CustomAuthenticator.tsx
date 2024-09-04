/**
 * @file CustomAuthenticator.tsx
 * @version 2.0.0
 * @description Simplified Custom Authenticator component for manually created Cognito user pool
 */

import React, { useState, useEffect } from 'react';
import { Auth } from 'aws-amplify';

/**
 * Props interface for the CustomAuthenticator component
 */
interface CustomAuthenticatorProps {
  children: React.ReactNode;
}

/**
 * CustomAuthenticator component
 * @param {CustomAuthenticatorProps} props - The component props
 * @returns {JSX.Element} The rendered CustomAuthenticator component
 */
const CustomAuthenticator: React.FC<CustomAuthenticatorProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkAuthState();
  }, []);

  // Function to check the current authentication state
  const checkAuthState = async () => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      setIsAuthenticated(true);
      setUser(user);
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  // Function to handle sign in
  const signIn = async (username: string, password: string) => {
    try {
      const user = await Auth.signIn(username, password);
      setIsAuthenticated(true);
      setUser(user);
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  // Function to handle sign out
  const signOut = async () => {
    try {
      await Auth.signOut();
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // If the user is authenticated, render the children
  if (isAuthenticated) {
    return (
      <div>
        {React.Children.map(children, child => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, { user, signOut });
          }
          return child;
        })}
      </div>
    );
  }

  // If not authenticated, render a simple sign-in form
  return (
    <div>
      <h2>Sign In</h2>
      <form onSubmit={(e) => {
        e.preventDefault();
        const username = (e.target as any).username.value;
        const password = (e.target as any).password.value;
        signIn(username, password);
      }}>
        <input name="username" type="text" placeholder="Username" required />
        <input name="password" type="password" placeholder="Password" required />
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
};

export default CustomAuthenticator;