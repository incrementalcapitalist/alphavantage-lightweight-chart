/**
 * @file AmplifyTheme.ts
 * @version 1.2.0
 * @description Custom theme for Amplify UI components with stricter type compliance
 */

import { createTheme, ThemeProvider, Theme } from '@aws-amplify/ui-react';

const theme = createTheme({
  name: 'dark-purple-theme',
  tokens: {
    colors: {
      background: {
        primary: { value: '#111827' },
        secondary: { value: '#1F2937' },
      },
      font: {
        interactive: { value: '#C4B5FD' },
        primary: { value: '#FFFFFF' },
        secondary: { value: '#A78BFA' },
      },
      brand: {
        primary: {
          10: { value: '#8B5CF6' },
          20: { value: '#7C3AED' },
          80: { value: '#6D28D9' },
          90: { value: '#5B21B6' },
          100: { value: '#4C1D95' },
        }
      },
    },
    components: {
      button: {
        primary: {
          backgroundColor: { value: '{colors.brand.primary.80}' },
          _hover: {
            backgroundColor: { value: '{colors.brand.primary.90}' },
          },
        },
      },
      fieldcontrol: {
        borderColor: { value: '{colors.background.secondary}' },
      },
      authenticator: {
        router: {
          borderColor: { value: '{colors.background.secondary}' },
        },
      },
    },
  },
});

export default theme;