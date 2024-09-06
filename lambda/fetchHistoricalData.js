/**
 * @file fetchHistoricalData.js
 * @version 1.0.0
 * @description AWS Lambda function to fetch historical stock data from Alpha Vantage API
 * @author Incremental Capitalist
 * @copyright 2024 Incremental Capital LLC
 * @license GNU GENERAL PUBLIC LICENSE V3
 */

/**
 * @typedef {Object} APIGatewayProxyEvent
 * @property {Object} queryStringParameters - Query string parameters from the API Gateway event
 * @property {string} queryStringParameters.symbol - The stock symbol to fetch data for
 * @property {string} [queryStringParameters.function_type] - The Alpha Vantage function type (default: 'TIME_SERIES_DAILY')
 */

/**
 * @typedef {Object} LambdaResponse
 * @property {number} statusCode - HTTP status code of the response
 * @property {Object} headers - HTTP headers of the response
 * @property {string} body - JSON stringified body of the response
 */

/**
 * Lambda function handler to fetch historical stock data from Alpha Vantage
 * @async
 * @function
 * @param {APIGatewayProxyEvent} event - The API Gateway proxy event
 * @returns {Promise<LambdaResponse>} The Lambda function response
 */
exports.handler = async (event) => {
    // Retrieve the Alpha Vantage API key from environment variables
    const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
    
    // Extract the stock symbol from query parameters
    const symbol = event.queryStringParameters.symbol;
    
    // Extract the function type from query parameters, defaulting to 'TIME_SERIES_DAILY'
    const functionType = event.queryStringParameters.function_type || 'TIME_SERIES_DAILY';
    
    // Construct the URL for the Alpha Vantage API request
    const url = `https://www.alphavantage.co/query?function=${functionType}&symbol=${symbol}&apikey=${apiKey}`;
    
    try {
        // Fetch data from Alpha Vantage API
        const response = await fetch(url);
        
        // Parse the JSON response
        const data = await response.json();
        
        // Check if the API returned an error message
        if (data['Error Message']) {
            throw new Error(data['Error Message']);
        }
        
        // Return a successful response with the fetched data
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*", // Allow requests from any origin
                "Access-Control-Allow-Headers": "Content-Type", // Allow the Content-Type header
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET" // Allow OPTIONS, POST, and GET methods
            },
            body: JSON.stringify(data) // Stringify the data for the response body
        };
    } catch (error) {
        // Log the error for debugging purposes
        console.error('Error fetching historical data from Alpha Vantage:', error);
        
        // Return an error response
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch historical data from Alpha Vantage' })
        };
    }
};

/**
 * Instructions for updating the app's configuration:
 * 
 * 1. Open your main entry file (e.g., main.tsx or App.tsx)
 * 2. Import the Amplify configuration function:
 *    import { Amplify } from 'aws-amplify';
 * 
 * 3. Add or update the Amplify configuration:
 * 
 * Amplify.configure({
 *   API: {
 *     endpoints: [
 *       {
 *         name: "StockQuoteAPI",
 *         endpoint: "https://your-api-gateway-url.amazonaws.com/prod"
 *       }
 *     ]
 *   }
 * });
 * 
 * Replace 'https://your-api-gateway-url.amazonaws.com/prod' with your actual API Gateway URL.
 * 
 * 4. If you have separate configurations for different environments, make sure to update all relevant files.
 * 
 * 5. In your StockQuote component, update the API calls to use the new endpoint:
 * 
 * const { data } = await API.get('StockQuoteAPI', '/historical', {
 *   queryStringParameters: {
 *     symbol: symbol,
 *     function_type: 'TIME_SERIES_DAILY'
 *   }
 * });
 * 
 * This configuration allows your React application to communicate with the newly created API Gateway and Lambda function.
 */