/**
 * @file CustomAuthenticator.tsx
 * @version 3.1.0
 * @description Final revision of Custom Authenticator component to resolve typing issues
 */

// Import necessary components and types from React and Amplify UI
import React, { ReactElement } from 'react';
import {
  Authenticator,
  ThemeProvider,
  View,
  Image,
  useTheme,
  Heading,
  useAuthenticator,
  AuthenticatorProps,
} from '@aws-amplify/ui-react';

// Define the structure for authentication props
interface AuthProps {
  signOut?: () => void;
  user?: any; // We'll use 'any' for now as the exact type is unclear
}

/**
 * Custom components for the Authenticator
 */
const components = {
  Header() {
    const { tokens } = useTheme();

    return (
      <View textAlign="center" padding={tokens.space.large}>
        <Image
          alt="App logo"
          src="/logo192.png"
          height="50px"
        />
        <Heading
          padding={`${tokens.space.xl} 0 0 ${tokens.space.xl}`}
          level={3}
        >
          Alpha Vantage Stock Quotation App
        </Heading>
      </View>
    );
  },

  Footer() {
    const { tokens } = useTheme();

    return (
      <View textAlign="center" padding={tokens.space.large}>
        <p>&copy; 2024 Incremental Capital LLC. All rights reserved.</p>
      </View>
    );
  },
};

/**
 * Props interface for the CustomAuthenticator component
 */
interface CustomAuthenticatorProps {
  children: (authProps: AuthProps) => ReactElement;
}

/**
 * CustomAuthenticator component
 * @param {CustomAuthenticatorProps} props - The component props
 * @returns {JSX.Element} The rendered CustomAuthenticator component
 */
const CustomAuthenticator: React.FC<CustomAuthenticatorProps> = ({ children }) => {
  return (
    <ThemeProvider>
      <Authenticator components={components}>
        {(authProps: AuthenticatorProps) => {
          const auth = useAuthenticator();
          return children({
            signOut: auth.signOut,
            user: auth.user,
          });
        }}
      </Authenticator>
    </ThemeProvider>
  );
};

// Export the CustomAuthenticator component as the default export
export default CustomAuthenticator;