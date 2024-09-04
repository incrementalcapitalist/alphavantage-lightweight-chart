/**
 * @file CustomAuthenticator.tsx
 * @version 1.1.0
 * @description Custom Authenticator component with additional styling and functionality
 */

// Import necessary components and hooks from Amplify UI React
import React from 'react';
import {
  Authenticator,
  View,
  Image,
  Text,
  Heading,
  useTheme,
  useAuthenticator,
  AuthenticatorProps
} from '@aws-amplify/ui-react';

/**
 * Custom components for the Authenticator
 */
const components = {
  // Custom Header component for the Authenticator
  Header() {
    // Use the useTheme hook to access the current theme tokens
    const { tokens } = useTheme();
    
    return (
      // Create a container for the header with centered text and padding
      <View textAlign="center" padding={tokens.space.large}>
        <Image
          alt="App logo"
          src="/logo192.png"
          height="50px"
        />
        {/* Add a heading for the app name */}
        <Heading
          padding={`${tokens.space.xl} 0 0 ${tokens.space.xl}`}
          level={3}
        >
          Alpha Vantage Stock Quotation App
        </Heading>
      </View>
    );
  },
  
  // Custom Footer component for the Authenticator
  Footer() {
    // Use the useTheme hook to access the current theme tokens
    const { tokens } = useTheme();
    return (
      // Create a container for the footer with centered text and padding
      <View textAlign="center" padding={tokens.space.large}>
        {/* Copyright notice */}
        <Text color={tokens.colors.neutral[80]}>
          &copy; 2024 Incremental Capital LLC. All rights reserved.
        </Text>
      </View>
    );
  },
};

/**
 * Props interface for the CustomAuthenticator component
 */
interface CustomAuthenticatorProps {
  children: (props: AuthenticatorProps) => React.ReactNode;
}

/**
 * CustomAuthenticator component
 * @param {CustomAuthenticatorProps} props - The component props
 * @returns {JSX.Element} The rendered CustomAuthenticator component
 */
const CustomAuthenticator: React.FC<CustomAuthenticatorProps> = ({ children }) => {
  return (
    // Use the Amplify Authenticator component with our custom components
    <Authenticator components={components}>
      {(authProps) => children(authProps)}
    </Authenticator>
  );
};

// Export the CustomAuthenticator component as the default export
export default CustomAuthenticator;