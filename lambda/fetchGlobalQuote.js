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
 * Constructs the API URL with parameters
 * @param {string} baseUrl - The base URL of the API
 * @param {Object} params - The parameters to be added to the URL
 * @returns {string} The constructed URL
 */
function constructApiUrl(baseUrl, params) {
  // Create a new URL object
  const url = new URL(baseUrl);
  
  // Append each parameter to the URL's search params
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });
  
  // Return the complete URL as a string
  return url.toString();
}

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
      response.on('data', (chunk) => {
        data += chunk;
      });
      
      // Resolve the promise with the complete data when the response ends
      response.on('end', () => {
        resolve(JSON.parse(data));
      });
    }).on('error', (error) => {
      // Reject the promise if there's an error
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
  // Extract the stock symbol from the event object
  const symbol = event.arguments.symbol;
  
  // Construct the API URL for fetching the global quote
  const apiUrl = constructApiUrl(ALPHA_VANTAGE_BASE_URL, {
    function: 'GLOBAL_QUOTE',
    symbol: symbol,
    apikey: ALPHA_VANTAGE_API_KEY,
  });
  
  try {
    // Fetch data from the AlphaVantage API
    const data = await fetchData(apiUrl);
    
    // Check if the response contains an error message
    if (data['Error Message']) {
      throw new Error(data['Error Message']);
    }
    
    // Extract the global quote data
    const quote = data['Global Quote'];
    
    // Check if quote data is available
    if (!quote || Object.keys(quote).length === 0) {
      throw new Error('No data found for this symbol');
    }
    
    // Return the successful response
    return quote;
  } catch (error) {
    // Throw an error to be handled by the GraphQL resolver
    throw new Error(`Failed to fetch global quote: ${error.message}`);
  }
};