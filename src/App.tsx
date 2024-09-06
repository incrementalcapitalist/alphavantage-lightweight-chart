/**
 * @file App.tsx
 * @version 3.6.3
 * @description Main application component with enhanced UI, custom Amplify Authenticator, and updated styling
 * to match the StockQuote component and ensure consistency across the app. Includes improvements to layout
 * and styling of the authentication dialog.
 */

// Import necessary dependencies
import React from "react"; // Import React for JSX support
import { Authenticator, ThemeProvider, View, Heading, Button, useTheme, Text } from '@aws-amplify/ui-react'; // Import Amplify UI components
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
      <View textAlign="center" padding={tokens.space.medium}> {/* Use medium padding for a more compact layout */}
        {/* App logo */}
        <img
          src={logoImage}
          alt="App Logo"
          className="h-16 w-16 mx-auto mb-2"
        />
        {/* Style logo with Tailwind classes, reduced bottom margin */}
        {/* App title */}
        <Heading
          level={3}
          className="text-2xl font-bold text-purple-200 mb-1" 
          style={{ fontFamily: '"PT Sans Narrow", sans-serif' }} 
        > {/* Reduced font size and added bottom margin */}
          Essential Technical Analysis
        </Heading> {/* Apply custom font */}
        {/* Subtitle with highlighted styling */}
        <Text
          className="text-sm font-medium" 
          style={{ color: theme.tokens.colors.brand.secondary['80'].value }} 
        > {/* Smaller font size for subtitle */}
          Powered by AlphaVantage & Lightweight Charts
        </Text> {/* Use orange color from theme */}
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
      <View textAlign="center" padding={tokens.space.small}> {/* Use small padding for a more compact footer */}
        {/* Copyright notice */}
        <Text
          className="text-xs text-gray-400" 
        > {/* Smaller font size and lighter color for copyright text */}
          &copy; 2024 Incremental Capital LLC
        </Text>
      </View>
    );
  },
};

/**
 * Main application component
 * @returns {JSX.Element} The rendered App component
 * 
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
      <View className="min-h-screen bg-gray-800 flex items-center justify-center p-4">
        {/* Limit the width of the content for better readability on larger screens */}
        <View className="w-full max-w-lg"> {/* max-w-lg ensures the content doesn't overflow the container */}
          {/* Amplify Authenticator component with custom styling */}
          <Authenticator
            hideSignUp={false} // Allow users to sign up
            components={components} // Use custom components defined above
            className="bg-gray-800 shadow-xl rounded-lg overflow-hidden" // Style Authenticator with Tailwind classes
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