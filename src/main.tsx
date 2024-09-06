/**
 * @file main.tsx
 * @version 3.0.0
 * @description Entry point for the React application with Amplify configuration.
 * This file sets up the React root, configures Amplify, and renders the main App component.
 */

// Import necessary dependencies
import React from 'react'; // Import React library for building user interfaces
import ReactDOM from 'react-dom/client'; // Import ReactDOM for rendering React components in the DOM
import { Amplify } from 'aws-amplify'; // Import Amplify for AWS service configuration
import App from './App'; // Import the main App component
import './css/index.css'; // Import global CSS styles

// Configure Amplify settings with environment variables
Amplify.configure({
  API: {
    REST: {
      StockQuoteAPI: {
        // Set the API endpoint using an environment variable
        endpoint: import.meta.env.VITE_LAMBDA_ALPHA_VANTAGE_API_ENDPOINT,
        // Set the AWS region using an environment variable
        region: import.meta.env.VITE_LAMBDA_ALPHA_VANTAGE_API_REGION
      }
    }
  }
});

/**
 * The main function to initialize and render the React application.
 * This function is immediately invoked when the script is run.
 */
(function main() {
  // Get the root element from the DOM
  const rootElement = document.getElementById('root');

  // Check if the root element exists
  if (!rootElement) {
    console.error('Root element not found. Make sure there is a DOM element with id "root".');
    return; // Exit the function if the root element doesn't exist
  }

  // Create a React root using the found DOM element
  const root = ReactDOM.createRoot(rootElement);

  // Render the App component within React's StrictMode
  root.render(
    // StrictMode is a tool for highlighting potential problems in an application
    <React.StrictMode>
      {/* App is the main component of our application */}
      <App />
    </React.StrictMode>
  );
})(); // Immediately invoke the main function

// Note: This file uses ECMAScript modules (ESM) syntax.
// The `.tsx` extension indicates that this is a TypeScript file that may contain JSX.