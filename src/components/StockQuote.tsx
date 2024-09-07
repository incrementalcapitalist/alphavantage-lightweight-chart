/**
 * @file StockQuote.tsx
 * @version 3.4.0
 * @description React component for fetching and displaying stock quotes with a Heikin-Ashi chart,
 * integrated with AWS Amplify v6, AWS Lambda, and API Gateway. This component provides a user interface
 * for entering a stock symbol, fetching real-time and historical data from separate endpoints, and displaying it in both
 * tabular format and as a Heikin-Ashi chart. This version includes enhanced error logging and handling.
 * 
 * Key Features:
 * - Real-time stock data fetching using AWS Amplify v6 from a dedicated Global Quote endpoint
 * - Historical data retrieval from a separate Historical Data endpoint
 * - Heikin-Ashi chart rendering using lightweight-charts
 * - Responsive design with Tailwind CSS
 * - Comprehensive error handling and logging
 * 
 * Dependencies:
 * - React (^18.0.0)
 * - AWS Amplify (^6.0.0)
 * - lightweight-charts (^4.0.0)
 * - Tailwind CSS (^3.0.0)
 * 
 * API Integration:
 * - Uses AWS API Gateway (configured as 'StockQuoteAPI' in Amplify)
 * - Endpoints:
 *   - /globalquote: Fetches real-time stock data
 *   - /historical: Retrieves historical stock data for charting
 * 
 * Heikin-Ashi Calculation:
 * Heikin-Ashi candlesticks are a variation of traditional candlesticks, designed to filter out market noise
 * and better identify trends. The calculation is as follows:
 * 
 * - HA Close = (Open + High + Low + Close) / 4
 * - HA Open = (Previous HA Open + Previous HA Close) / 2
 * - HA High = Max(High, HA Open, HA Close)
 * - HA Low = Min(Low, HA Open, HA Close)
 * 
 * This technique helps smooth price action and make trends more easily identifiable.
 * 
 * @author Incremental Capitalist
 * @copyright 2024 Incremental Capital LLC
 * @license GNU GENERAL PUBLIC LICENSE V3
 */

// Import necessary dependencies
import React, { useState, useEffect, useRef } from "react"; // Import React and necessary hooks for component functionality
import { createChart, IChartApi, ISeriesApi } from "lightweight-charts"; // Import chart creation functions and types from lightweight-charts
import { fetchAuthSession } from 'aws-amplify/auth'; // Import authentication and API functions from AWS Amplify
import { ApiError, get } from 'aws-amplify/api';

// Global type declarations to ensure TypeScript recognizes these global objects
declare global {
  // Declare URL and URLSearchParams as part of the Window interface
  interface Window {
    URL: typeof URL; // Ensure URL is available on the global Window object
    URLSearchParams: typeof URLSearchParams; // Ensure URLSearchParams is available on the global Window object
  }
}

// Type definitions

/**
 * Represents an API error
 * @typedef {Object} APIError
 * @property {string} message - Error message
 * @property {string} [code] - Optional error code
 */
type APIError = {
  message: string; // The error message
  code?: string; // An optional error code
};

/**
 * Represents stock data with string key-value pairs
 * @typedef {Object} StockData
 */
interface StockData {
  [key: string]: string; // Each property is a string, with a string key
}

/**
 * Represents the structure of the Alpha Vantage API response for historical data
 * @typedef {Object} AlphaVantageHistoricalResponse
 */
interface AlphaVantageHistoricalResponse {
  'Meta Data': {
    '1. Information': string;
    '2. Symbol': string;
    '3. Last Refreshed': string;
    '4. Output Size': string;
    '5. Time Zone': string;
  };
  'Time Series (Daily)': {
    [date: string]: {
      '1. open': string;
      '2. high': string;
      '3. low': string;
      '4. close': string;
      '5. adjusted close': string;
      '6. volume': string;
      '7. dividend amount': string;
      '8. split coefficient': string;
    };
  };
}

/**
 * Represents a single data point for Heikin-Ashi chart
 * @typedef {Object} HeikinAshiDataPoint
 * @property {string} time - Date/time of the data point
 * @property {number} open - Opening price
 * @property {number} high - Highest price
 * @property {number} low - Lowest price
 * @property {number} close - Closing price
 */
interface HeikinAshiDataPoint {
  time: string; // The date/time for this data point
  open: number; // The opening price
  high: number; // The highest price
  low: number; // The lowest price
  close: number; // The closing price
}

/**
 * StockQuote Component
 * @returns {JSX.Element} The rendered StockQuote component
 */
const StockQuote: React.FC = () => {
  // State hooks
  const [symbol, setSymbol] = useState<string>(""); // State hook for storing the stock symbol entered by the user
  const [stockData, setStockData] = useState<StockData | null>(null); // State hook for storing the fetched stock data
  const [error, setError] = useState<APIError | null>(null); // State hook for storing any errors that occur during API calls
  const [loading, setLoading] = useState<boolean>(false); // State hook for tracking the loading status of API calls
  const [heikinAshiData, setHeikinAshiData] = useState<HeikinAshiDataPoint[]>([]); // State hook for storing the calculated Heikin-Ashi chart data

  // Ref hooks
  const chartContainerRef = useRef<HTMLDivElement>(null); // Ref hook for the chart container div element
  const chartRef = useRef<IChartApi | null>(null); // Ref hook for storing the chart instance
  const heikinAshiSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null); // Ref hook for storing the Heikin-Ashi candlestick series

  /**
   * Fetches stock data from the AWS Lambda function via API Gateway
   * @async
   * @function fetchStockData
   */
  const fetchStockData = async () => {
    // Input validation: check if the symbol is empty
    if (!symbol.trim()) {
      setError({ message: "Please enter a stock symbol" }); // Set an error if the symbol is empty
      return; // Exit the function early if no symbol is provided
    }

    // Reset states before making the API call
    setLoading(true); // Indicate that data fetching has started
    setError(null); // Clear any previous errors
    setStockData(null); // Clear any previous stock data

    try {
      // Ensure we have a valid auth session before making the API call
      await fetchAuthSession();

      // Prepare the request details for logging and debugging
      const requestDetails = {
        apiName: 'StockQuoteAPI', // Name of the API configured in Amplify
        path: '/globalquote', // Endpoint path for global quote data
        options: {
          queryParams: {
            symbol: symbol // Pass the stock symbol as a query parameter
          }
        }
      };

      // Log the request details for debugging purposes
      console.log("Request details:", JSON.stringify(requestDetails, null, 2));

      // Make the API call using Amplify's get function
      const { body, statusCode, headers } = await get(requestDetails).response;

      // Log the response status and headers for debugging
      console.log("Response status:", statusCode);
      console.log("Response headers:", headers);

      // Parse the response body as JSON
      const globalQuoteResponse = await body.json();

      // Log the parsed response for debugging
      console.log("Global Quote Response:", globalQuoteResponse);

      // Check if the status code indicates an error
      if (statusCode !== 200) {
        throw new Error(`API returned status ${statusCode}: ${JSON.stringify(globalQuoteResponse)}`);
      }

      // Check if the response contains an error message
      if (error) {
        throw new Error();
      }

      // Set the stock data in the component state
      setStockData(globalQuoteResponse as StockData);

      // Fetch historical data for the chart
      await fetchHistoricalData(symbol);
    } catch (err) {
      // Handle any errors that occur during the fetch
      handleError(err);
    } finally {
      // Set loading to false when the fetch is complete (whether successful or not)
      setLoading(false);
    }
  };

  /**
   * Fetches historical data for the given symbol
   * @async
   * @function fetchHistoricalData
   * @param {string} symbol - The stock symbol
   */
  const fetchHistoricalData = async (symbol: string): Promise<void> => {
    try {
      // Fetch historical data using Amplify v6 API
      const { body } = await get({
        apiName: 'HistoricalDataAPI', // Name of the API configured in Amplify for historical data
        path: '/historical', // Path for the historical data endpoint
        options: {
          queryParams: {
            symbol: symbol // Pass the stock symbol as a query parameter
          }
        }
      }).response; // Access the response property of the returned object

      // Parse the response body as JSON
      const jsonData = await body.json();
      
      // Type guard to check if jsonData is AlphaVantageHistoricalResponse
      if (!isAlphaVantageHistoricalResponse(jsonData)) {
        throw new Error('Invalid response format');
      }

      const data: AlphaVantageHistoricalResponse = jsonData;

      // Check for error message in the response
      if ('Error Message' in data) {
        throw new Error(data['Error Message'] as string);
      }

      const timeSeries = data['Time Series (Daily)'];
      if (!timeSeries) {
        throw new Error('No time series data found');
      }

      // Calculate Heikin-Ashi data from the time series
      const heikinAshiData: HeikinAshiDataPoint[] = calculateHeikinAshi(timeSeries);
      setHeikinAshiData(heikinAshiData); // Update the state with calculated Heikin-Ashi data
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch historical data: ${error.message}`);
      }
      throw new Error('An unknown error occurred while fetching historical data');
    }
  };

  /**
   * Type guard function to check if the data is AlphaVantageHistoricalResponse
   * @function isAlphaVantageHistoricalResponse
   * @param {any} data - The data to check
   * @returns {boolean} True if the data is AlphaVantageHistoricalResponse, false otherwise
   */
  function isAlphaVantageHistoricalResponse(data: any): data is AlphaVantageHistoricalResponse {
    // Check if data is an object and has the required properties
    return (
      data &&
      typeof data === 'object' &&
      'Meta Data' in data &&
      'Time Series (Daily)' in data
    );
  }

  /**
   * Calculates Heikin-Ashi candles from time series data
   * @function calculateHeikinAshi
   * @param {AlphaVantageHistoricalResponse['Time Series (Daily)']} timeSeries - The time series data
   * @returns {HeikinAshiDataPoint[]} The calculated Heikin-Ashi data
   */
  const calculateHeikinAshi = (timeSeries: AlphaVantageHistoricalResponse['Time Series (Daily)']): HeikinAshiDataPoint[] => {
    const heikinAshiData: HeikinAshiDataPoint[] = []; // Array to store Heikin-Ashi data points
    let prevHA: HeikinAshiDataPoint | null = null; // Previous Heikin-Ashi data point

    // Iterate through each entry in the time series
    Object.entries(timeSeries).forEach(([date, values], index) => {
      const open = parseFloat(values['1. open']); // Parse open price
      const high = parseFloat(values['2. high']); // Parse high price
      const low = parseFloat(values['3. low']); // Parse low price
      const close = parseFloat(values['4. close']); // Parse close price

      let haOpen, haClose, haHigh, haLow;

      if (index === 0) {
        // For the first candle, use regular values
        haOpen = open;
        haClose = close;
      } else {
        // Calculate Heikin-Ashi values
        haOpen = (prevHA!.open + prevHA!.close) / 2;
        haClose = (open + high + low + close) / 4;
      }

      // Calculate Heikin-Ashi high and low
      haHigh = Math.max(high, haOpen, haClose);
      haLow = Math.min(low, haOpen, haClose);

      // Create a new Heikin-Ashi data point
      const haCandle: HeikinAshiDataPoint = {
        time: date,
        open: haOpen,
        high: haHigh,
        low: haLow,
        close: haClose
      };

      heikinAshiData.push(haCandle); // Add the calculated Heikin-Ashi candle to the array
      prevHA = haCandle; // Store the current candle as previous for the next iteration
    });

    return heikinAshiData.reverse(); // Reverse the array to get chronological order
  };

  /**
   * Handles and sets errors
   * @function handleError
   * @param {unknown} err - The error to handle
   */
  const handleError = (err: unknown) => {
    // Log the full error details to the console for debugging
    console.error("Error details:", err);
    
    // Determine the error message based on the type of error
    let errorMessage: string;
    if (err instanceof Error) {
      // If it's an Error object, use its message property
      errorMessage = err.message;
    } else if (typeof err === "string") {
      // If it's a string, use it directly
      errorMessage = err;
    } else {
      // For any other type, use a generic error message
      errorMessage = "An unknown error occurred";
    }
    
    // Set the error state with the determined message
    setError({ message: errorMessage });
  };

  // Effect hook for creating and updating the chart
  useEffect(() => {
    // Check if we have Heikin-Ashi data and a valid chart container reference
    if (heikinAshiData.length > 0 && chartContainerRef.current) {
      // If the chart doesn't exist, create it
      if (!chartRef.current) {
        chartRef.current = createChart(chartContainerRef.current, {
          width: chartContainerRef.current.clientWidth,
          height: 400,
          layout: {
            background: { color: '#111827' }, // Dark background
            textColor: '#C4B5FD', // Light purple text
          },
          grid: {
            vertLines: { visible: false }, // Hide vertical grid lines
            horzLines: { visible: false }, // Hide horizontal grid lines
          },
          rightPriceScale: {
            visible: false, // Hide the right price scale
          },
          timeScale: {
            visible: false, // Hide the time scale
          },
        });
      }

      // If the Heikin-Ashi series doesn't exist, create it
      if (!heikinAshiSeriesRef.current) {
        heikinAshiSeriesRef.current = chartRef.current.addCandlestickSeries({
          upColor: '#A855F7', // Purple color for up days
          downColor: '#F97316', // Orange color for down days
          borderUpColor: '#A855F7', // Border color for up days
          borderDownColor: '#F97316', // Border color for down days
          wickUpColor: '#A855F7', // Wick color for up days
          wickDownColor: '#F97316', // Wick color for down days
        });
      }

      // Set the Heikin-Ashi data to the candlestick series
      heikinAshiSeriesRef.current.setData(heikinAshiData);
      // Adjust the visible time range to fit all the data
      chartRef.current.timeScale().fitContent();
    }
  }, [heikinAshiData]); // This effect runs whenever heikinAshiData changes

  /**
   * Handles key press events in the input field
   * @function handleKeyPress
   * @param {React.KeyboardEvent<HTMLInputElement>} event - The key press event
   */
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      fetchStockData(); // Trigger fetchStockData when Enter key is pressed
    }
  };

  /**
   * Formats the key names for display
   * @function formatKey
   * @param {string} key - The key to format
   * @returns {string} The formatted key
   */
  const formatKey = (key: string): string => {
    // Split the key by ". " and take the second part if it exists
    // Then replace camelCase with spaces before each capital letter
    return key.split(". ")[1]?.replace(/([A-Z])/g, " $1").trim() || key;
  };

  // Render the component
  return (
    <div className="bg-gray-900 text-purple-300 shadow-lg rounded-lg p-8 font-['PT_Sans_Narrow']">
      <h1 className="text-4xl font-bold mb-8 text-center text-purple-200 uppercase">
        Essential Technical Analysis
      </h1>
      <h2 className="text-2xl font-semibold mb-6 text-center text-purple-300 uppercase">
        Price Pattern
      </h2>
      <div className="mb-6">
        <input
          type="text"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value.toUpperCase())} // Update symbol state, converting to uppercase
          onKeyPress={handleKeyPress} // Handle key press events
          placeholder="Enter stock symbol (e.g., AAPL)"
          className="w-full p-3 bg-gray-800 border border-purple-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 text-lg text-center"
          aria-label="Stock Symbol"
        />
      </div>
      <button
        onClick={fetchStockData}  // Trigger fetchStockData when button is clicked
        disabled={loading} // Disable button when loading
        className="w-full bg-purple-600 text-white p-3 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition duration-200 ease-in-out disabled:opacity-50 text-lg font-semibold uppercase"
        aria-busy={loading}
      >
        {loading ? "FETCHING DATA..." : "Lightweight Chart"}
      </button>
      {error && (
        <p className="text-center mt-4 text-red-400 bg-red-900 p-3 rounded-md uppercase" role="alert">
          Error: {error.message}
        </p>
      )}
      <div className="mt-8 p-4 bg-gray-800 rounded-lg shadow-inner">
        <div ref={chartContainerRef} className="w-full h-[400px]"></div>
      </div>
      {stockData && (
        <div className="mt-8 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-800">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-purple-300 uppercase tracking-wider">
                  Field
                </th>
                <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-purple-300 uppercase tracking-wider">
                  Value
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-900 divide-y divide-gray-800">
              {Object.entries(stockData).map(([key, value]) => (
                <tr key={key} className="hover:bg-gray-800 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-purple-200">
                    {formatKey(key)} {/* Display formatted key */}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-300">
                    {value} {/* Display corresponding value */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StockQuote; // Export the StockQuote component as the default export