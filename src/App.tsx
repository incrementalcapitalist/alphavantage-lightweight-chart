/**
 * @file App.tsx
 * @version 3.2.0
 * @description Main application component with CustomAuthenticator integration
 */

// Import necessary dependencies
import React from "react";
import { Amplify } from 'aws-amplify';
import '@aws-amplify/ui-react/styles.css';
import { AuthenticatorProps } from '@aws-amplify/ui-react';
import StockQuote from "./components/StockQuote";
import CustomAuthenticator from "./components/CustomAuthenticator";

// Configure Amplify with environment variables
Amplify.configure({
  Auth: {
    Cognito: {
      // Use environment variables for Cognito configuration
      userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
      userPoolClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
    }
  }
});

/**
 * AuthenticatedContent component to render the main application content when authenticated
 * @param {AuthenticatorProps} props - Authentication props
 * @returns {JSX.Element} The rendered authenticated content
 */
const AuthenticatedContent: React.FC<AuthenticatorProps> = ({ signOut, user }) => {
  return (
    <div className="min-h-screen bg-gray-900 py-6 flex flex-col justify-center sm:py-12">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          {/* Display a welcome message with the user's username */}
          <h1 className="text-3xl sm:text-4xl font-bold text-center text-purple-300 mb-8">
            Welcome, {user?.username || 'User'}!
          </h1>
          {/* Render the StockQuote component */}
          <StockQuote />
          {/* Render a sign-out button if signOut function is available */}
          {signOut && (
            <button
              onClick={() => signOut()}
              className="mt-8 w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
            >
              Sign Out
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Main application component
 * @returns {JSX.Element} The rendered App component
 */
const App: React.FC = () => {
  return (
    <CustomAuthenticator>
      {(authProps) => <AuthenticatedContent {...authProps} />}
    </CustomAuthenticator>
  );
};

// Export the App component as the default export
export default App;