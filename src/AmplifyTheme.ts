/**
 * @file AmplifyTheme.ts
 * @version 1.1.0
 * @description Custom theme for AWS Amplify UI components, updated to match the new color scheme
 * 
 * This file defines a custom theme for Amplify UI components to match the overall
 * design of the Basic Technical Analysis application. It overrides default styles
 * to ensure consistency with the app's color scheme and typography.
 */

import { createTheme } from '@aws-amplify/ui-react';

/**
 * Custom theme for Amplify UI components
 */
const theme = createTheme({
  name: 'custom-theme',
  tokens: {
    colors: {
      background: {
        primary: { value: '#1E293B' },    // Dark blue background
        secondary: { value: '#111827' },  // Darker background for contrast
      },
      font: {
        interactive: { value: '#94A3B8' }, // Light gray for interactive elements
        primary: { value: '#E2E8F0' },     // Light gray for primary text
        secondary: { value: '#94A3B8' },   // Slightly darker gray for secondary text
      },
      brand: {
        primary: {
          10: { value: '#FAF5FF' },  // Very light purple
          20: { value: '#E9D5FF' },  // Light purple
          80: { value: '#A855F7' },  // Medium purple
          90: { value: '#9333EA' },  // Dark purple
          100: { value: '#7E22CE' }, // Very dark purple
        }
      },
    },
    components: {
      authenticator: {
        // Style the main authenticator container
        router: {
          borderWidth: { value: '1px' },
          borderColor: { value: '{colors.brand.primary.80}' },
          boxShadow: { value: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' },
          backgroundColor: { value: '{colors.background.secondary}' },
        },
      },
      button: {
        // Style the buttons
        primary: {
          backgroundColor: { value: '{colors.brand.primary.80}' },
          color: { value: '{colors.background.primary}' },
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
        // Style the input fields
        color: { value: '{colors.font.primary}' },
        borderColor: { value: '{colors.brand.primary.80}' },
        _focus: {
          borderColor: { value: '{colors.brand.primary.80}' },
        },
      },
      heading: {
        // Style the headings
        color: { value: '{colors.brand.primary.20}' },
      },
      tabs: {
        // Style the tabs
        item: {
          _hover: {
            color: { value: '{colors.brand.primary.80}' },
          },
          _active: {
            color: { value: '{colors.brand.primary.80}' },
            borderColor: { value: '{colors.brand.primary.80}' },
          },
        },
      },
      // Add styles for other components as needed
    },
  },
});

export default theme;