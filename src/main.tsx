/**
 * @file main.tsx
 * @version 3.2.0
 * @description Entry point for the React application with complete Amplify configuration.
 * This file sets up the React root, configures Amplify for both API endpoints (Global Quote and Historical Data) and Auth,
 * and renders the main App component. It centralizes all Amplify configurations and ensures proper initialization before rendering the app.
 * @author Incremental Capitalist
 * @copyright 2024 Incremental Capital LLC
 * @license GNU GENERAL PUBLIC LICENSE V3
 */

import React from 'react'; // Import React for JSX support and type checking
import ReactDOM from 'react-dom/client'; // Import ReactDOM for rendering React components in the browser
import { Amplify } from 'aws-amplify'; // Import Amplify for AWS service configuration
import App from './App'; // Import the main App component
import './css/index.css'; // Import global CSS styles

/**
 * Configure Amplify settings with environment variables.
 * This setup includes configurations for both API endpoints (Global Quote and Historical Data) and Auth.
 * @see https://docs.amplify.aws/lib/client-configuration/configuring-amplify/q/platform/js/
 */
Amplify.configure({
  // Configure API settings for REST endpoints
  API: {
    REST: {
      // Configuration for the Global Quote API
      StockQuoteAPI: {
        // Set the API endpoint for Global Quote using an environment variable
        endpoint: import.meta.env.VITE_LAMBDA_ALPHA_VANTAGE_API_ENDPOINT,
        // Set the AWS region using an environment variable
        region: import.meta.env.VITE_LAMBDA_ALPHA_VANTAGE_API_REGION
      },
      // Configuration for the Historical Data API
      HistoricalDataAPI: {
        // Set the API endpoint for Historical Data using an environment variable
        endpoint: import.meta.env.VITE_LAMBDA_ALPHA_VANTAGE_HISTORICAL_DATA_API_ENDPOINT,
        // Set the AWS region using an environment variable (assuming it's the same as the Global Quote API)
        region: import.meta.env.VITE_LAMBDA_ALPHA_VANTAGE_API_REGION
      }
    }
  },
  // Configure Auth settings for Amazon Cognito
  Auth: {
    Cognito: {
      // Set the Cognito User Pool ID using an environment variable
      userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
      // Set the Cognito App Client ID using an environment variable
      userPoolClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
    }
  }
});

/**
 * The main function to initialize and render the React application.
 * This function is immediately invoked when the script is run.
 * It sets up the React root and renders the App component within StrictMode.
 */
(function main() {
  // Get the root element from the DOM
  const rootElement = document.getElementById('root');

  // Check if the root element exists
  if (!rootElement) {
    // Log an error if the root element is not found
    console.error('Root element not found. Make sure there is a DOM element with id "root".');
    return; // Exit the function if the root element doesn't exist
  }

  // Create a React root using the found DOM element
  const root = ReactDOM.createRoot(rootElement);

  // Render the App component within React's StrictMode
  root.render(
    // StrictMode is a tool for highlighting potential problems in an application
    // It activates additional checks and warnings for its descendants
    <React.StrictMode>
      {/* App is the main component of our application */}
      <App />
    </React.StrictMode>
  );
})(); // Immediately invoke the main function

// Note: This file uses ECMAScript modules (ESM) syntax.
// The `.tsx` extension indicates that this is a TypeScript file that may contain JSX.

/**
 * @typedef {Object} AmplifyConfig
 * @property {Object} API - Configuration for API
 * @property {Object} API.REST - REST API configuration
 * @property {Object} API.REST.StockQuoteAPI - Global Quote API endpoint configuration
 * @property {string} API.REST.StockQuoteAPI.endpoint - Global Quote API endpoint URL
 * @property {string} API.REST.StockQuoteAPI.region - AWS region for the Global Quote API
 * @property {Object} API.REST.HistoricalDataAPI - Historical Data API endpoint configuration
 * @property {string} API.REST.HistoricalDataAPI.endpoint - Historical Data API endpoint URL
 * @property {string} API.REST.HistoricalDataAPI.region - AWS region for the Historical Data API
 * @property {Object} Auth - Configuration for Authentication
 * @property {Object} Auth.Cognito - Amazon Cognito specific configuration
 * @property {string} Auth.Cognito.userPoolId - Cognito User Pool ID
 * @property {string} Auth.Cognito.userPoolClientId - Cognito App Client ID
 */

/**
 * @typedef {Object} Environment
 * @property {string} VITE_LAMBDA_ALPHA_VANTAGE_API_ENDPOINT - API endpoint for Global Quote
 * @property {string} VITE_LAMBDA_ALPHA_VANTAGE_HISTORICAL_DATA_API_ENDPOINT - API endpoint for Historical Data
 * @property {string} VITE_LAMBDA_ALPHA_VANTAGE_API_REGION - AWS region for Alpha Vantage APIs
 * @property {string} VITE_COGNITO_USER_POOL_ID - Cognito User Pool ID
 * @property {string} VITE_COGNITO_CLIENT_ID - Cognito App Client ID
 */