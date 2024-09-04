/**
 * @file App.tsx
 * @version 3.0.0
 * @description Main application component using default Amplify Authenticator
 */

// Import necessary dependencies
import React from "react";
import { Authenticator, ThemeProvider, View, Heading, Button } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import '@aws-amplify/ui-react/styles.css';
import StockQuote from "./components/StockQuote";
import theme from './AmplifyTheme';

// Amplify configuration
Amplify.configure({
  Auth: {
    Cognito: {
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
    <ThemeProvider theme={theme}> {/* Wrap the entire Authenticator component for the app with its theme */}
      <Authenticator> 
        {/* Wrap the entire app an with Authenticator component for user authentication */}
        {({ signOut, user }) => (
          <View className="min-h-screen bg-gray-900 py-6 flex flex-col justify-center sm:py-12">
            <View className="px-4 sm:px-6 lg:px-8">
              <View className="max-w-md mx-auto">
                <Heading level={1} className="text-3xl sm:text-4xl font-bold text-center text-purple-300 mb-8">
                  AlphaVantage Lightweight Charts
                </Heading>
                <StockQuote />
                {signOut && (
                  <Button
                    onClick={signOut}
                    className="mt-8 w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
                  >
                    Sign Out
                  </Button>
                )}
              </View>
            </View>
          </View>
        )}
      </Authenticator>
    </ThemeProvider>
  );
};

// Export the App component as the default export
export default App;