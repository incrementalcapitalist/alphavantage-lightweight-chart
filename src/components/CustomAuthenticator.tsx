/**
 * @file CustomAuthenticator.tsx
 * @version 2.1.0
 * @description Revised Custom Authenticator component compatible with the latest Amplify UI React library.
 */

// Import necessary components and types from React and Amplify UI
import React, { ReactNode } from 'react';
import {
  Authenticator,
  View,
  Image,
  Text,
  Heading,
  useTheme,
  useAuthenticator,
  ButtonGroup,
  Button,
  AuthenticatorProps,
} from '@aws-amplify/ui-react';

// Define the structure for authentication props
interface AuthProps {
  signOut?: () => void;
  user?: any; // We'll use 'any' for now as the exact type is unclear
}

/**
 * Custom Header component for the Authenticator
 * @returns {JSX.Element} The rendered Header component
 */
const Header: React.FC = () => {
  // Use the useTheme hook to access theme tokens
  const { tokens } = useTheme();
  
  return (
    // Create a container for the header with centered text and padding
    <View textAlign="center" padding={tokens.space.large}>
      {/* Logo */}
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
};

/**
 * Custom Footer component for the Authenticator
 * @returns {JSX.Element} The rendered Footer component
 */
const Footer: React.FC = () => {
  // Use the useTheme hook to access theme tokens
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
};

/**
 * Custom SignIn component
 * @param {React.PropsWithChildren} props - Props passed to the SignIn component
 * @returns {JSX.Element} The rendered SignIn component
 */
const SignIn: React.FC<React.PropsWithChildren> = ({ children }) => {
  // Use the useTheme hook to access theme tokens
  const { tokens } = useTheme();
  // Use the useAuthenticator hook to access authentication functions
  const { toResetPassword } = useAuthenticator();

  return (
    <View>
      {/* Header for the SignIn form */}
      <Heading
        padding={`${tokens.space.xl} 0 0 ${tokens.space.xl}`}
        level={3}
      >
        Sign in to your account
      </Heading>
      {/* Render the default sign-in fields */}
      {children}
      {/* Footer for the SignIn form */}
      <View textAlign="center">
        <ButtonGroup>
          <Button
            fontWeight="normal"
            onClick={toResetPassword}
            size="small"
            variation="link"
          >
            Forgot your password?
          </Button>
        </ButtonGroup>
      </View>
    </View>
  );
};

/**
 * Custom SignUp component
 * @param {React.PropsWithChildren} props - Props passed to the SignUp component
 * @returns {JSX.Element} The rendered SignUp component
 */
const SignUp: React.FC<React.PropsWithChildren> = ({ children }) => {
  // Use the useTheme hook to access theme tokens
  const { tokens } = useTheme();
  // Use the useAuthenticator hook to access authentication functions
  const { toSignIn } = useAuthenticator();

  return (
    <View>
      {/* Header for the SignUp form */}
      <Heading
        padding={`${tokens.space.xl} 0 0 ${tokens.space.xl}`}
        level={3}
      >
        Create a new account
      </Heading>

      {/* Render the default sign-up fields */}
      {children}
      
      {/* Footer for the SignUp form */}
      <View textAlign="center">
        <Button
          fontWeight="normal"
          onClick={toSignIn}
          size="small"
          variation="link"
        >
          Already have an account? Sign in
        </Button>
      </View>
    </View>
  );
};

// Define custom components for the Authenticator
const components = {
  Header,
  Footer,
  SignIn,
  SignUp,
};

/**
 * Props interface for the CustomAuthenticator component
 * @interface CustomAuthenticatorProps
 * @extends {Omit<AuthenticatorProps, 'children'>}
 * @property {(authProps: AuthProps) => ReactNode} children - Function that renders the authenticated content
 */
interface CustomAuthenticatorProps extends Omit<AuthenticatorProps, 'children'> {
  children: (authProps: AuthProps) => ReactNode;
}

/**
 * CustomAuthenticator component
 * @param {CustomAuthenticatorProps} props - The component props
 * @returns {JSX.Element} The rendered CustomAuthenticator component
 */
const CustomAuthenticator: React.FC<CustomAuthenticatorProps> = ({ children, ...props }) => {
  return (
    // Use the Amplify Authenticator component with our custom components
    <Authenticator {...props} components={components}>
      {/* Render the children (the main app content) when authenticated */}
      {(authProps) => children(authProps as AuthProps)}
    </Authenticator>
  );
};

// Export the CustomAuthenticator component as the default export
export default CustomAuthenticator;