/**
 * @file AmplifyTheme.ts
 * @version 1.2.2
 * @description Custom theme for AWS Amplify UI components using createTheme
 * 
 * This file defines a custom theme for Amplify UI components to match the overall
 * design of the Essential Technical Analysis application. It overrides default styles
 * to ensure consistency with the app's color scheme and typography.
 * 
 * The theme is created using the createTheme function from AWS Amplify UI React library.
 * It defines custom colors, component styles, and other design tokens that are used
 * throughout the application to maintain a cohesive look and feel.
 * 
 * Key Features:
 * - Custom color palette with primary, secondary, and tertiary colors
 * - Consistent styling for Amplify UI components (buttons, inputs, tabs, etc.)
 * - Dark mode optimized design
 * - Typography and spacing adjustments
 * 
 * Usage:
 * Import this theme in your main App component and wrap your application with
 * the ThemeProvider component from Amplify UI React, passing this theme as a prop.
 * 
 * Example:
 * ```
 * import theme from './AmplifyTheme';
 * import { ThemeProvider } from '@aws-amplify/ui-react';
 * 
 * function App() {
 *   return (
 *     <ThemeProvider theme={theme}>
 *       <StockQuote>
 *     </ThemeProvider>
 *   );
 * }
 * ```
 * 
 * Customization:
 * To modify the theme, adjust the values in the `tokens` object. You can add new
 * color variants, change existing colors, or modify component-specific styles.
 * 
 * @see https://ui.docs.amplify.aws/react/theming for more information on Amplify UI theming
 * 
 * @author Incremental Capitalist
 * @copyright 2024 Incremental Capital LLC
 * @license GNU GENERAL PUBLIC LICENSE V3
 */

// Import the createTheme function from AWS Amplify UI React library
import { createTheme } from '@aws-amplify/ui-react';

/**
 * Custom theme for Amplify UI components
 */
const theme = createTheme({
  // Name of the custom theme
  name: 'custom-theme',
  
  // Define the theme tokens (colors, typography, spacing, etc.)
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
        },
        secondary: {
          80: { value: '#F97316' },  // Orange (secondary color)
        },
        tertiary: {
          80: { value: '#1F2937' },  // Charcoal (tertiary color)
        },
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
    },
  },
});

// Export the created theme
export default theme;