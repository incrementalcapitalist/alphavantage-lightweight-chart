/**
 * @file AmplifyTheme.ts
 * @version 1.0.0
 * @description Custom theme for AWS Amplify UI components
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
        primary: { value: '#ffffff' },    // White background
        secondary: { value: '#1a202c' },  // Charcoal for secondary backgrounds
      },
      font: {
        interactive: { value: '#2d3748' }, // Lighter charcoal for interactive elements
        primary: { value: '#1f2937' },     // Very dark gray for primary text
        secondary: { value: '#6b7280' },   // Medium gray for secondary text
      },
      brand: {
        primary: {
          10: { value: '#d1fae5' },  // Very light green
          20: { value: '#a7f3d0' },  // Light green
          80: { value: '#059669' },  // Emerald green
          90: { value: '#047857' },  // Dark emerald green
          100: { value: '#065f46' }, // Very dark emerald green
        }
      },
    },
    components: {
      authenticator: {
        // Style the main authenticator container
        router: {
          borderWidth: { value: '1px' },
          borderColor: { value: '{colors.background.secondary}' },
          boxShadow: { value: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' },
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
        borderColor: { value: '{colors.background.secondary}' },
        _focus: {
          borderColor: { value: '{colors.brand.primary.80}' },
        },
      },
      heading: {
        // Style the headings
        color: { value: '{colors.brand.primary.80}' },
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
    },
  },
});

export default theme;