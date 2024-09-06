# Essential Technical Analysis

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0) 

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Authentication](#authentication)
- [API Integration](#api-integration)
- [Styling](#styling)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Overview

This app is designed for trend and momentum traders. It uses Heikin-Ashi candles to help spot trends. Eventually, Essential Technical Analysis will be an AI-enhanced tool designed to reduce unforced errors in analyzing securities. Presently, it allows users to easily fetch and display real-time stock quotes using the Alpha Vantage API, with added features for historical data visualization and secure authentication.

## Features

- Real-time stock quote fetching
- Heikin-Ashi chart visualization for historical data
- AWS Amplify authentication integration
- Responsive design for various screen sizes
- User-friendly interface with input validation
- Comprehensive display of stock data in a formatted table
- Error handling for API requests and user inputs
- Keyboard accessibility (Enter key support for quote fetching)

## Technologies Used

- React: A JavaScript library for building user interfaces
- TypeScript: A typed superset of JavaScript that compiles to plain JavaScript
- Vite: A build tool that aims to provide a faster and leaner development experience for modern web projects
- Tailwind CSS: A utility-first CSS framework for rapidly building custom designs
- Alpha Vantage API: Provides realtime and historical financial market data
- AWS Amplify: A set of tools and services for building secure, scalable mobile and web applications
- Lightweight Charts: A financial lightweight charts library built with HTML5 canvas
- @fontsource/pt-sans-narrow: Custom typography for enhanced visual appeal
- ESLint: A tool for identifying and reporting on patterns found in ECMAScript/JavaScript code
- Prettier: An opinionated code formatter
- Vitest: A Vite-native unit test framework with a Jest-compatible API

## Getting Started

### Prerequisites

- Node.js (version 14.0.0 or later)
- npm (usually comes with Node.js)
- AWS account for Amplify and Cognito setup

### Installation

1. Clone the repository:
```bash
git clone git@github.com:incrementalcapitalist/essential-technical-analysis.git
cd essential-technical-analysis
```

2. Install dependencies:
```bash
npm install
```

3. Set up AWS Amplify and Cognito:
```bash
amplify init
amplify add auth
amplify push
```

4. Create a `.env` file in the root directory and add your API keys and Cognito details:
   ```
   VITE_ALPHA_VANTAGE_API_KEY=your_api_key_here
   VITE_COGNITO_USER_POOL_ID=your_user_pool_id
   VITE_COGNITO_CLIENT_ID=your_client_id
   ```

## Usage

To start the development server:

```
npm run dev
```

Open `http://localhost:5173` in your browser to view the application.

To build for production:

```
npm run build
```

## Project Structure

```
essential-technical-analysis/
│
├── src/
│   ├── components/
│   │   └── StockQuote.tsx
│   ├── css/
│   │   └── index.css
│   ├── App.tsx
│   ├── main.tsx
│   └── AmplifyTheme.ts
│
├── public/
│
├── tests/
│
├── .eslintrc.json
├── .prettierrc
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Authentication

This project uses AWS Amplify for authentication. The Amplify Authenticator component is integrated into the main App component, providing secure sign-up, sign-in, and sign-out functionality. Users must authenticate before accessing the stock quote and chart features.

## API Integration

This project uses the Alpha Vantage API to fetch stock quotes and historical data. Two endpoints are used:
- Global Quote: For current stock data
- Time Series (Daily): For historical data used in the Heikin-Ashi chart

The API key is stored in an environment variable for security. The `StockQuote` component handles the API requests and data processing for both current and historical data.

## Styling

Tailwind CSS is used for styling, providing a responsive and clean user interface. The styles are defined inline using Tailwind's utility classes, allowing for rapid development and easy maintenance. Custom fonts from @fontsource/pt-sans-narrow are used to enhance typography. AWS Amplify UI components are styled to match the overall theme of the application using a custom theme defined in AmplifyTheme.ts.

## Testing

Vitest is used for unit testing. To run tests:

```
npm run test
```

To generate a coverage report:

```
npm run coverage
```

## Deployment

This project is configured for easy deployment to AWS Amplify. The `package.json` and build settings are optimized for Amplify's build process.

Consider the following YAML for your Amplify configuration:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: dist
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

## Contributing

If you encounter any issues or have suggestions for improvements, feel free to open an issue or submit a pull request.

## License

This project is licensed under the GNU General Public License (GPL) v3.0. See the [LICENSE](LICENSE) file for more information.

### Why GPL v3?

The GPL v3 license enforces strong copyleft requirements and ensures that all derivative works of this project remain open source. This license also provides additional protections against patent claims, which aligns with the goal to keep contributions and derivatives freely available and to safeguard the project's integrity and freedom.