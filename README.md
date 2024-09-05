# Basic Technical Analysis

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
- [API Integration](#api-integration)
- [Styling](#styling)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Overview

This app is designed for trend and momentum traders. It uses Heikin-Ashi candles to help spot trends.
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

- React with TypeScript
- Vite
- Tailwind CSS
- Alpha Vantage API
- AWS Amplify for authentication
- Lightweight Charts for data visualization
- @fontsource/pt-sans-narrow for custom typography
- ESLint, Prettier, Vitest

## Getting Started

### Prerequisites

- Node.js (version 14.0.0 or later)
- npm (usually comes with Node.js)
- AWS account for Amplify and Cognito setup

### Installation

1. Clone the repository

```bash
  git clone git@github.com:incrementalcapitalist/alphavantage-lightweight-chart.git
  cd alphavantage-lightweight-chart
  ```
2. Install dependencies

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

```bash
  VITE_ALPHA_VANTAGE_API_KEY=your_api_key_here
  VITE_COGNITO_USER_POOL_ID=your_user_pool_id
  VITE_COGNITO_CLIENT_ID=your_client_id
```

## Authentication

This project uses AWS Amplify for authentication. The Amplify Authenticator component is integrated into the main App component, providing secure sign-up, sign-in, and sign-out functionality.

## Usage

To start the development server:

```
npm run dev
```

Open `http://localhost:3000` in your browser to view the application.

To build for production:

```
npm run build
```

## Project Structure

```
alphavantage-lightweight-chart/
│
├── src/
│   ├── components/
│   │   └── StockQuote.tsx
│   ├── src/
│   │   └── index.css
│   ├── App.tsx
│   └── main.tsx
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

## API Integration

This project uses the Alpha Vantage API to fetch stock quotes and historical data. Two endpoints are used:
- Global Quote: For current stock data
- Time Series (Daily): For historical data used in the Heikin-Ashi chart

## Styling

Tailwind CSS is used for styling, along with custom fonts from @fontsource/pt-sans-narrow. AWS Amplify UI components are styled to match the overall theme of the application.

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

Consider the following YAML:

```
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