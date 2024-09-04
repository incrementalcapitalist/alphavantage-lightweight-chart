/**
 * @file App.tsx
 * @version 3.5.0
 * @description Main application component with enhanced UI, custom Amplify Authenticator, and updated styling
 */

// Import necessary dependencies
import React from "react";
import { Authenticator, ThemeProvider, View, Heading, Button, useTheme } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import '@aws-amplify/ui-react/styles.css';
import StockQuote from "./components/StockQuote";
import theme from './AmplifyTheme';

// Import Google Font
import '@fontsource/pt-sans-narrow';

// Amplify configuration
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
 * Main application component
 * @returns {JSX.Element} The rendered App component
 */
const App: React.FC = () => {
  return (
    // Wrap the entire application with ThemeProvider to apply our custom theme
    <ThemeProvider theme={theme}>
      {/* Create a full-height container with white background and centered content */}
      <View className="min-h-screen bg-white flex items-center justify-center p-4">
        {/* Limit the width of the content for better readability on larger screens */}
        <View className="w-full max-w-md">
          {/* Amplify Authenticator component with custom header */}
          <Authenticator
            hideSignUp={false} // Allow users to sign up
            components={{
              // Custom header component for the Authenticator
              Header() {
                return (
                  <View className="bg-white w-full py-4">
                    <Heading
                      level={3}
                      className="text-center text-2xl text-emerald-600"
                      style={{ fontFamily: '"PT Sans Narrow", sans-serif' }}
                    >
                      AlphaVantage Lightweight Charts
                    </Heading>
                  </View>
                );
              },
              Footer() {
                return (
                  <View textAlign="center" padding="1rem">
                    <Button
                      fontWeight="normal"
                      onClick={() => {}}
                      size="small"
                      variation="link"
                    >
                      &copy; 2024 Incremental Capital LLC
                    </Button>
                  </View>
                );
              },
            }}
          >
            {({ signOut, user }) => (
              // Container for authenticated content
              <View className="bg-gray-800 p-6 rounded-lg shadow-lg">
                {/* Welcome message with user's email */}
                <Heading level={1} className="text-3xl font-bold text-center text-purple-300 mb-8">
                  Welcome, {user?.username}!
                </Heading>
                {/* StockQuote component for displaying stock information */}
                <StockQuote />
                {/* Sign out button */}
                <Button
                  onClick={signOut}
                  className="mt-8 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
                >
                  Sign Out
                </Button>
              </View>
            )}
          </Authenticator>
        </View>
      </View>
    </ThemeProvider>
  );
};

// Export the App component as the default export
export default App;