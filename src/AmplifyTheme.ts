/**
 * @file AmplifyTheme.ts
 * @version 1.4.0
 * @description Custom theme for Amplify UI components with improved contrast and legibility
 */

import { createTheme } from '@aws-amplify/ui-react';

/**
 * Custom theme for Amplify UI components
 */
const theme = createTheme({
  name: 'custom-dark-theme',
  tokens: {
    colors: {
      background: {
        primary: { value: '#1a202c' },    // Charcoal background
        secondary: { value: '#2d3748' },  // Lighter charcoal
      },
      font: {
        interactive: { value: '#e2e8f0' }, // Light gray for interactive elements
        primary: { value: '#ffffff' },     // White for primary text
        secondary: { value: '#a0aec0' },   // Light blue-gray for secondary text
      },
      brand: {
        primary: {
          10: { value: '#48bb78' },  // Green
          20: { value: '#38a169' },  // Darker green
          80: { value: '#2f855a' },  // Even darker green
          90: { value: '#276749' },  // Darkest green
          100: { value: '#22543d' }, // Very dark green
        }
      },
    },
    components: {
      authenticator: {
        // Customize the Authenticator component
        router: {
          borderWidth: { value: '0' },
          boxShadow: { value: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' },
        },
      },
      button: {
        // Customize the Button component
        primary: {
          backgroundColor: { value: '{colors.brand.primary.80}' },
          color: { value: '{colors.font.primary}' },
          _hover: {
            backgroundColor: { value: '{colors.brand.primary.90}' },
          },
          _focus: {
            backgroundColor: { value: '{colors.brand.primary.90}' },
            boxShadow: { value: '0 0 0 2px {colors.brand.primary.20}' },
          },
        },
      },
      fieldcontrol: {
        // Customize the FieldControl component
        color: { value: '{colors.font.primary}' },
        borderColor: { value: '{colors.background.secondary}' },
        _focus: {
          borderColor: { value: '{colors.brand.primary.20}' },
        },
      },
      heading: {
        // Customize the Heading component
        color: { value: '{colors.font.primary}' },
      },
      tabs: {
        // Customize the Tabs component
        item: {
          _hover: {
            color: { value: '{colors.brand.primary.20}' },
          },
          _active: {
            color: { value: '{colors.brand.primary.10}' },
            borderColor: { value: '{colors.brand.primary.10}' },
          },
        },
      },
    },
  },
});

export default theme;