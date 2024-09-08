/**
 * @file App.tsx
 * @version 4.0.0
 * @description Main application component with enhanced UI, custom Amplify Authenticator, and updated styling.
 * Now uses the Dashboard component instead of StockQuote.
 * @author Incremental Capitalist
 * @copyright 2024 Incremental Capital LLC
 * @license GNU GENERAL PUBLIC LICENSE V3
 */

// Import React for JSX support and type checking
import React from "react";

// Import necessary components and hooks from Amplify UI React library
import { 
  Authenticator, // Provides authentication UI
  ThemeProvider, // Allows application of custom themes
  View, // A layout component for structuring content
  Heading, // For rendering headings
  Button, // For rendering buttons
  useTheme, // Hook to access the current theme
  Text // For rendering text
} from '@aws-amplify/ui-react';

// Import Amplify UI styles
import '@aws-amplify/ui-react/styles.css';

// Import PT Sans Narrow font for custom typography
import '@fontsource/pt-sans-narrow';

// Import logo image for branding
import logoImage from "../public/logo512.png";

// Import the new Dashboard component
import Dashboard from "./components/Dashboard"; 

// Import custom Amplify theme (simplified version)
import theme from './AmplifyTheme';

/**
 * Custom components for Amplify Authenticator
 * @type {Object}
 */
const components = {
  /**
   * Custom Header component for Authenticator
   * @returns {JSX.Element} Rendered Header component
   */
  Header() {
    // Access theme tokens for consistent styling
    const { tokens } = useTheme();

    return (
      // Container for header content with center alignment and medium padding
      <View textAlign="center" padding={tokens.space.medium}>
        {/* App logo */}
        <img
          src={logoImage}
          alt="App Logo"
          className="h-16 w-16 mx-auto mb-2" // Tailwind classes for sizing and spacing
        />
        {/* App title */}
        <Heading
          level={3}
          className="text-2xl font-bold text-purple-200 mb-1" // Tailwind classes for text styling
          style={{ fontFamily: '"PT Sans Narrow", sans-serif' }} // Custom font application
        >
          Essential Technical Analysis
        </Heading>
        {/* Subtitle with highlighted styling */}
        <Text className="text-sm font-medium text-orange-500">
          Powered by AlphaVantage & Lightweight Charts
        </Text>
      </View>
    );
  },

  /**
   * Custom Footer component for Authenticator
   * @returns {JSX.Element} Rendered Footer component
   */
  Footer() {
    // Access theme tokens for consistent styling
    const { tokens } = useTheme();

    return (
      // Container for footer content with center alignment and small padding
      <View textAlign="center" padding={tokens.space.small}>
        {/* Copyright notice */}
        <Text className="text-xs text-gray-400"> {/* Tailwind classes for text styling */}
          &copy; 2024 Incremental Capital LLC
        </Text>
      </View>
    );
  },
};

/**
 * Main application component
 * @returns {JSX.Element} The rendered App component
 */
const App: React.FC = () => {
  return (
    // Apply custom theme to entire application
    <ThemeProvider theme={theme}>
      {/* Full-height container with dark background and centered content */}
      <View className="min-h-screen bg-gray-800 flex items-center justify-center p-4">
        {/* Limit content width for better readability */}
        <View className="w-full max-w-lg">
          {/* Amplify Authenticator component with custom styling */}
          <Authenticator
            hideSignUp={false} // Allow users to sign up
            components={components} // Use custom header and footer components
            className="bg-gray-800 shadow-xl rounded-lg overflow-hidden" // Tailwind classes for styling
          >
            {({ signOut, user }) => (
              // Container for authenticated content
              <View className="bg-gray-800 p-6 rounded-lg shadow-lg">
                {/* Render Dashboard component when user is authenticated */}
                <Dashboard />
                {/* Sign out button */}
                <Button
                  onClick={signOut} // Trigger sign out action
                  className="mt-8 w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
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

/**
 * @typedef {Object} AuthenticatorProps
 * @property {boolean} hideSignUp - Whether to hide the sign-up option
 * @property {Object} components - Custom components for the Authenticator
 * @property {string} className - CSS classes for styling the Authenticator
 */

/**
 * @typedef {Object} AuthenticatorRenderProps
 * @property {Function} signOut - Function to sign out the user
 * @property {Object} user - Current authenticated user object
 */

/**
 * @typedef {Object} Theme
 * @property {Object} tokens - Theme tokens for consistent styling
 * @property {Object} tokens.space - Spacing tokens
 */