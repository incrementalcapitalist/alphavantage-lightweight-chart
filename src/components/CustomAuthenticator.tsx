/**
 * @file CustomAuthenticator.tsx
 * @version 1.4.0
 * @description Custom Authenticator component with additional styling and functionality,
 * aligned with the latest Cognito User Pool configuration and Amplify UI React library.
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
  TextField,
  PasswordField,
  PhoneNumberField,
  CheckboxField,
  UseAuthenticator, // Updated from UseAuthenticatorOutput
} from '@aws-amplify/ui-react';

// Define custom components for the Authenticator
const components = {
  // Custom Header component for the Authenticator
  Header() {
    // Use the useTheme hook to access theme tokens
    const { tokens } = useTheme();
    
    return (
      // Create a container for the header with centered text and padding
      <View textAlign="center" padding={tokens.space.large}>
        {/* Add your logo here. Replace '/path/to/your/logo.png' with your actual logo path */}
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
  },

  // Custom SignIn component
  SignIn: {
    // Header for the SignIn form
    Header() {
      // Use the useTheme hook to access theme tokens
      const { tokens } = useTheme();
      return (
        // Create a heading for the sign-in form
        <Heading
          padding={`${tokens.space.xl} 0 0 ${tokens.space.xl}`}
          level={3}
        >
          Sign in to your account
        </Heading>
      );
    },
    // Footer for the SignIn form
    Footer() {
      // Use the useAuthenticator hook to access authentication functions
      const { toResetPassword } = useAuthenticator();
      return (
        // Create a container for the footer with centered text
        <View textAlign="center">
          {/* Group the buttons together */}
          <ButtonGroup>
            {/* Button to navigate to the reset password page */}
            <Button
              fontWeight="normal"
              // Check if toResetPassword is available before using it
              onClick={toResetPassword ? toResetPassword : () => console.log('Reset password not available')}
              size="small"
              variation="link"
            >
              Forgot your password?
            </Button>
          </ButtonGroup>
        </View>
      );
    },
  },

  // Custom SignUp component
  SignUp: {
    // Header for the SignUp form
    Header() {
      // Use the useTheme hook to access theme tokens
      const { tokens } = useTheme();
      return (
        // Create a heading for the sign-up form
        <Heading
          padding={`${tokens.space.xl} 0 0 ${tokens.space.xl}`}
          level={3}
        >
          Create a new account
        </Heading>
      );
    },
    // Custom form fields for the SignUp form
    FormFields() {
      return (
        <>
          {/* Email field (used as username) */}
          <TextField
            label="Email"
            name="email"
            placeholder="Enter your email"
            required
          />
          {/* Password field */}
          <PasswordField
            label="Password"
            name="password"
            placeholder="Enter your password"
            required
          />
          {/* Phone number field */}
          <PhoneNumberField
            label="Phone Number"
            name="phone_number"
            placeholder="Enter your phone number"
            required
          />
          {/* Terms and conditions checkbox */}
          <CheckboxField
            label="I agree to the terms and conditions"
            name="terms"
            value="yes"
            required
          />
        </>
      );
    },
    // Footer for the SignUp form
    Footer() {
      // Use the useAuthenticator hook to access authentication functions
      const { toSignIn } = useAuthenticator();
      return (
        // Create a container for the footer with centered text
        <View textAlign="center">
          {/* Button to navigate back to the sign-in page */}
          <Button
            fontWeight="normal"
            onClick={toSignIn}
            size="small"
            variation="link"
          >
            Already have an account? Sign in
          </Button>
        </View>
      );
    },
  },
};

/**
 * Props interface for the CustomAuthenticator component
 * @interface CustomAuthenticatorProps
 * @property {(authProps: UseAuthenticator) => ReactNode} children - Function that renders the authenticated content
 */
interface CustomAuthenticatorProps {
  children: (authProps: UseAuthenticator) => ReactNode;
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
      {/* Render the children (the main app content) when authenticated */}
      {children}
    </Authenticator>
  );
};

// Export the CustomAuthenticator component as the default export
export default CustomAuthenticator;