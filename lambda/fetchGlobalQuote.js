/**
 * @file index.js
 * @version 1.0.0
 * @description AWS Lambda function to fetch global quote data from AlphaVantage API
 */

const https = require('https');

// AlphaVantage API configuration
const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY;
const ALPHA_VANTAGE_BASE_URL = 'https://www.alphavantage.co/query';

/**
 * Fetches data from the specified URL
 * @param {string} url - The URL to fetch data from
 * @returns {Promise<Object>} A promise that resolves with the fetched data
 */
function fetchData(url) {
  return new Promise((resolve, reject) => {
    // Make an HTTPS GET request
    https.get(url, (response) => {
      let data = '';
      
      // Accumulate data as it's received
      response.on('data', (chunk) => data += chunk);
      
      // Resolve the promise with the parsed data when the response ends
      response.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (error) {
          reject(new Error('Failed to parse API response'));
        }
      });
    }).on('error', (error) => {
      // Reject the promise if there's an error with the request
      reject(error);
    });
  });
}

/**
 * Lambda function handler
 * @param {Object} event - The event object containing the request parameters
 * @returns {Promise<Object>} A promise that resolves with the API response
 */
exports.handler = async (event) => {
  try {
    // Extract symbol from various possible event structures
    const symbol = event.symbol || event.queryStringParameters?.symbol || event.arguments?.symbol;
    
    // Check if symbol is provided
    if (!symbol) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Symbol parameter is required" })
      };
    }

    // Construct the API URL for fetching the global quote
    const url = `${ALPHA_VANTAGE_BASE_URL}?function=GLOBAL_QUOTE&symbol=${encodeURIComponent(symbol)}&apikey=${ALPHA_VANTAGE_API_KEY}`;
    
    // Fetch data from the AlphaVantage API
    const data = await fetchData(url);
    
    // Check if the response contains an error message
    if (data['Error Message']) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: data['Error Message'] })
      };
    }
    
    // Extract the global quote data
    const quote = data['Global Quote'];
    
    // Check if quote data is available
    if (!quote || Object.keys(quote).length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'No data found for this symbol' })
      };
    }
    
    // Return the successful response
    return {
      statusCode: 200,
      body: JSON.stringify(quote)
    };
  } catch (error) {
    // Log the error and return a generic error response
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};