/**
 * @file main.tsx
 * @version 2.0.0
 * @description Entry point for the React application with Amplify configuration
 */

import React from 'react' // Import React
import ReactDOM from 'react-dom/client' // Import ReactDOM for rendering
import { Amplify } from 'aws-amplify' // Import Amplify for configuration
import config from './amplifyconfiguration.json' // Import Amplify configuration
import App from './App' // Import the main App component
import './css/index.css' // Import global CSS styles

// Configure Amplify with the imported configuration
Amplify.configure(config)

// Create a root for React and render the App component
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)