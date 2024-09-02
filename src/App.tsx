/**
 * @file App.tsx
 * @version 1.1.0
 * @description Main application component with authentication and stock quote functionality
 */

import React from "react";
import { Authenticator } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import '@aws-amplify/ui-react/styles.css';
import StockQuote from "./components/StockQuote";

// TODO: Import and configure Amplify here
// Amplify.configure({ ... });

/**
 * Main application component
 * @returns {JSX.Element} The rendered App component
 */
const App: React.FC = () => {
  return (
    // Wrap the entire app with Authenticator component for user authentication
    <Authenticator>
      {({ signOut, user }) => (
        // Main container with dark theme background and full height
        <div className="min-h-screen bg-gray-900 py-6 flex flex-col justify-center sm:py-12">
          {/* Content container with responsive padding */}
          <div className="px-4 sm:px-6 lg:px-8">
            {/* Centered content with maximum width */}
            <div className="max-w-md mx-auto">
              {/* Application title */}
              <h1 className="text-3xl sm:text-4xl font-bold text-center text-purple-300 mb-8">
                Alpha Vantage Stock Quotation App
              </h1>
              {/* Stock quote component */}
              <StockQuote />
              {/* Sign out button */}
              <button
                onClick={signOut}
                className="mt-8 w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </Authenticator>
  );
};

export default App;