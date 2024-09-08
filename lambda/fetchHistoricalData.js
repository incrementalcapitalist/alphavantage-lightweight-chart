/**
 * @file index.js
 * @version 1.2.1
 * @description AWS Lambda function to fetch comprehensive historical stock data from AlphaVantage API, accommodating stocks with limited history
 * @author Incremental Capitalist
 * @copyright 2024 Incremental Capital LLC
 * @license GNU GENERAL PUBLIC LICENSE V3
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
  const url = new URL(baseUrl);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });
  return url.toString();
}

/**
 * Fetches data from the specified URL
 * @param {string} url - The URL to fetch data from
 * @returns {Promise<Object>} A promise that resolves with the fetched data
 * @throws {Error} If there's an error fetching or parsing the data
 */
function fetchData(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      let data = '';
      response.on('data', (chunk) => data += chunk);
      response.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (error) {
          reject(new Error('Failed to parse API response'));
        }
      });
    }).on('error', (error) => reject(error));
  });
}

/**
 * Processes the raw historical data
 * @param {Object} data - The raw data from AlphaVantage API
 * @returns {Array} An array of processed historical data points, sorted by date ascending
 */
function processHistoricalData(data) {
  const timeSeries = data['Time Series (Daily)'];
  return Object.entries(timeSeries)
    .map(([date, values]) => ({
      date,
      open: parseFloat(values['1. open']),
      high: parseFloat(values['2. high']),
      low: parseFloat(values['3. low']),
      close: parseFloat(values['4. close']),
      volume: parseInt(values['5. volume'])
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort by date ascending
}

/**
 * Analyzes the historical data
 * @param {Array} data - The processed historical data
 * @returns {Object} An object containing analysis results including data points count, date range, and data completeness flags
 */
function analyzeHistoricalData(data) {
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  
  const hasFullYearData = data.length >= 252; // Approximately one year of trading days
  const hasRecentData = new Date(data[data.length - 1].date) >= oneYearAgo;
  
  return {
    dataPoints: data.length,
    oldestDate: data[0].date,
    newestDate: data[data.length - 1].date,
    hasFullYearData,
    hasRecentData
  };
}

/**
 * Lambda function handler
 * @param {Object} event - The event object containing the request parameters
 * @returns {Promise<Object>} A promise that resolves with the API response
 */
exports.handler = async (event) => {
  try {
    // Extract parameters from the event object
    const symbol = event.symbol || event.queryStringParameters?.symbol;

    // Validate input parameters
    if (!symbol) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Symbol parameter is required" })
      };
    }

    // Construct the API URL for fetching historical data
    const url = constructApiUrl(ALPHA_VANTAGE_BASE_URL, {
      function: 'TIME_SERIES_DAILY',
      symbol: symbol,
      outputsize: 'full', // Always fetch full dataset
      apikey: ALPHA_VANTAGE_API_KEY
    });

    // Fetch data from the AlphaVantage API
    const data = await fetchData(url);

    // Check if the response contains an error message
    if (data['Error Message']) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: data['Error Message'] })
      };
    }

    // Process the historical data
    const processedData = processHistoricalData(data);

    // Analyze the historical data
    const analysisResult = analyzeHistoricalData(processedData);

    // Prepare warnings if necessary
    const warnings = [];
    if (!analysisResult.hasFullYearData) {
      warnings.push("Less than one year of historical data available.");
    }
    if (!analysisResult.hasRecentData) {
      warnings.push("The most recent data point is more than a year old.");
    }

    // Return the response with data and metadata
    return {
      statusCode: 200,
      body: JSON.stringify({
        data: processedData,
        metadata: {
          symbol: symbol,
          dataPoints: analysisResult.dataPoints,
          oldestDate: analysisResult.oldestDate,
          newestDate: analysisResult.newestDate,
          warnings: warnings
        }
      })
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