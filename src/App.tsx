/**
 * @file App.tsx
 * @version 3.0.1
 * @description Main application component using default Amplify Authenticator
 */

// Import necessary dependencies
import React from "react";
import { Authenticator, ThemeProvider, View, Heading, Button, useTheme } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import '@aws-amplify/ui-react/styles.css';
import StockQuote from "./components/StockQuote";
import { createTheme } from '@aws-amplify/ui-react';

// Amplify configuration
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
      userPoolClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
    }
  }
});

// Custom theme
const theme = createTheme({
  name: 'custom-theme',
  tokens: {
    colors: {
      background: {
        primary: { value: '#1a202c' },
        secondary: { value: '#2d3748' },
      },
      font: {
        interactive: { value: '#a0aec0' },
      },
      brand: {
        primary: {
          10: { value: '{colors.purple.100}' },
          80: { value: '{colors.purple.800}' },
          90: { value: '{colors.purple.900}' },
          100: { value: '{colors.purple.1000}' },
        },
      },
    },
    components: {
      authenticator: {
        router: {
          borderWidth: { value: '0' },
          boxShadow: { value: 'none' },
        },
      },
    },
  },
});

/**
 * Main application component
 * @returns {JSX.Element} The rendered App component
 */
const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}> {/* Wrap the entire Authenticator component for the app with its theme */}
      {/* Wrap the entire app an with Authenticator component for user authentication */}
      <View className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <View className="w-full max-w-md">
          <Authenticator
            hideSignUp={false}
            components={{
              Header() {
                const { tokens } = useTheme();

                return (
                  <Heading
                    padding={`${tokens.space.xl} 0 0 ${tokens.space.xl}`}
                    level={3}
                  >
                    AlphaVantage Lightweight Charts
                  </Heading>
                );
              },
            }}
          >
            {({ signOut, user }) => (
              <View className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <Heading level={1} className="text-3xl font-bold text-center text-purple-300 mb-8">
                  Welcome, {user?.username}!
                </Heading>
                <StockQuote />
                <Button
                  onClick={signOut}
                  className="mt-8 w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
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