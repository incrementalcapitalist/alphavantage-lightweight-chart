/**
 * @file App.tsx
 * @version 3.6.1
 * @description Main application component with enhanced UI, custom Amplify Authenticator, and updated styling
 * to match the StockQuote component and ensure consistency across the app.
 */

// Import necessary dependencies
import React from "react"; // Import React for JSX support
import { Authenticator, ThemeProvider, View, Heading, Button, useTheme } from '@aws-amplify/ui-react'; // Import Amplify UI components
import { Amplify } from 'aws-amplify'; // Import Amplify for configuration
import '@aws-amplify/ui-react/styles.css'; // Import Amplify UI styles
import '@fontsource/pt-sans-narrow'; // Import PT Sans Narrow font
import logoImage from "../public/logo512.png"; // Import logo image
import StockQuote from "./components/StockQuote"; // Import StockQuote component
import theme from './AmplifyTheme'; // Import custom Amplify theme

// Amplify configuration
Amplify.configure({
  Auth: {
    Cognito: {
      // Use environment variables for Cognito configuration
      userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID, // User Pool ID from environment variable
      userPoolClientId: import.meta.env.VITE_COGNITO_CLIENT_ID, // User Pool Client ID from environment variable
    }
  }
});

/**
 * Custom components for Amplify Authenticator
 */
const components = {
  /**
   * Custom Header component for Authenticator
   * @returns {JSX.Element} Rendered Header component
   */
  Header() {
    const { tokens } = useTheme(); // Get theme tokens for consistent styling

    return (
      <View textAlign="center" padding={tokens.space.large}>
        {/* App logo */}
        <img
          src={logoImage}
          alt="App Logo"
          className="h-16 w-16 mx-auto mb-4" // Style logo with Tailwind classes
        />
        {/* App title */}
        <Heading
          level={3}
          className="text-3xl font-bold text-purple-200" // Style heading with Tailwind classes
          style={{ fontFamily: '"PT Sans Narrow", sans-serif' }} // Apply custom font
        >
          Essential Technical Analysis
        </Heading>
        <p>Powered by AlphaVantage & Lightweight Charts</p>
      </View>
    );
  },

  /**
   * Custom Footer component for Authenticator
   * @returns {JSX.Element} Rendered Footer component
   */
  Footer() {
    const { tokens } = useTheme(); // Get theme tokens for consistent styling

    return (
      <View textAlign="center" padding={tokens.space.large}>
        {/* Copyright notice */}
        <Button
          fontWeight="normal"
          onClick={() => {}} // Empty onClick handler
          size="small"
          variation="link"
          className="text-purple-300 hover:text-purple-200" // Style button with Tailwind classes
        >
          &copy; 2024 Incremental Capital LLC
        </Button>
      </View>
    );
  },
};

/**
 * Main application component
 * @returns {JSX.Element} The rendered App component
 *  * 
 * Authentication Flow:
 * 1. The Amplify Authenticator wraps the entire application.
 * 2. It handles sign-up, sign-in, and sign-out processes.
 * 3. Only authenticated users can access the StockQuote component.
 * 4. The custom Header component provides branding and improves UX.
 * 5. The Footer component displays copyright information.
 * 6. After authentication, users can access the main functionality and sign out.
 */
const App: React.FC = () => {
  return (
    // Wrap the entire application with ThemeProvider to apply our custom theme
    <ThemeProvider theme={theme}>
      {/* Create a full-height container with dark background and centered content */}
      <View className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        {/* Limit the width of the content for better readability on larger screens */}
        <View className="w-full max-w-md">
          {/* Amplify Authenticator component with custom styling */}
          <Authenticator
            hideSignUp={false} // Allow users to sign up
            components={components} // Use custom components defined above
            className="bg-gray-800 shadow-lg rounded-lg overflow-hidden" // Style Authenticator with Tailwind classes
          >
            {({ signOut, user }) => (
              // Container for authenticated content
              <View className="bg-gray-800 p-6 rounded-lg shadow-lg">
                {/* Render StockQuote component when user is authenticated */}
                <StockQuote />
                {/* Sign out button */}
                <Button
                  onClick={signOut} // Call signOut function when clicked
                  className="mt-8 w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition duration-150 ease-in-out" // Style button with Tailwind classes
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