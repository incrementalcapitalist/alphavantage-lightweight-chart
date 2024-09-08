/**
 * @file StockQuote.tsx
 * @version 3.5.0
 * @description React component for fetching and displaying stock quotes with a Heikin-Ashi chart,
 * integrated with AWS API Gateway. This component provides a user interface for entering a stock symbol,
 * fetching real-time and historical data from separate endpoints, and displaying it in both
 * tabular format and as a Heikin-Ashi chart. This version includes enhanced error handling and
 * compatibility with the new API response format.
 * 
 * Key Features:
 * - Real-time stock data fetching from a dedicated Global Quote endpoint
 * - Historical data retrieval from a separate Historical Data endpoint
 * - Heikin-Ashi chart rendering using lightweight-charts
 * - Responsive design with Tailwind CSS
 * - Comprehensive error handling and logging
 * 
 * Dependencies:
 * - React (^18.0.0)
 * - lightweight-charts (^4.0.0)
 * - Tailwind CSS (^3.0.0)
 * 
 * API Integration:
 * - Uses AWS API Gateway
 * - Endpoints:
 *   - /globalquote: Fetches real-time stock data
 *   - /historicaldata: Retrieves historical stock data for charting
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

// Import necessary dependencies from React and lightweight-charts
import React, { useState, useEffect, useRef } from "react";
import { createChart, IChartApi, ISeriesApi } from "lightweight-charts";

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
 * Represents the structure of the historical data response
 * @typedef {Object} HistoricalDataResponse
 */
interface HistoricalDataResponse {
  data: {
    date: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }[];
  metadata: {
    symbol: string;
    dataPoints: number;
    oldestDate: string;
    newestDate: string;
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
  const API_BASE_URL = 'https://6kdp1igdoe.execute-api.us-east-1.amazonaws.com/production'; // Base URL for the API

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
      // Fetch global quote data
      const globalQuoteResponse = await fetch(`${API_BASE_URL}/globalquote?symbol=${symbol}`);
      
      // Check if the response is not OK (i.e., not 2xx status)
      if (!globalQuoteResponse.ok) {
        throw new Error(`API returned status ${globalQuoteResponse.status}`);
      }

      // Parse the JSON response
      const globalQuoteData = await globalQuoteResponse.json();

      // Check if the response contains an error message
      if (globalQuoteData.error) {
        throw new Error(globalQuoteData.error);
      }

      setStockData(globalQuoteData); // Set the stock data in the component state

      // Fetch historical data
      await fetchHistoricalData(symbol);
    } catch (err) {
      handleError(err); // Handle any errors that occur during the fetch
    } finally {
      setLoading(false); // Set loading to false when the fetch is complete (whether successful or not)
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
      // Fetch historical data from the API
      const response = await fetch(`${API_BASE_URL}/historicaldata?symbol=${symbol}`);
  
      // Check if the response is not OK (i.e., not 2xx status)
      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }
  
      // Parse the JSON response
      const responseData = await response.json();
      const data: HistoricalDataResponse = JSON.parse(responseData.body);
  
      // Check if the response contains an error message
      if ('error' in data) {
        throw new Error(data.error as string);
      }
  
      // Check if the data property is an array
      if (!Array.isArray(data.data)) {
        throw new Error('Invalid response format: data is not an array');
      }
  
      // Calculate Heikin-Ashi data from the historical data
      const heikinAshiData: HeikinAshiDataPoint[] = calculateHeikinAshi(data.data);
      
      // Update the state with the calculated Heikin-Ashi data
      setHeikinAshiData(heikinAshiData);
  
      // Log metadata if available
      if (data.metadata) {
        console.log('Historical data metadata:', data.metadata);
      }
    } catch (error) {
      // Log the error to the console
      console.error('Error fetching historical data:', error);
      
      // Set an error message in the component state
      if (error instanceof Error) {
        setError({ message: `Failed to fetch historical data: ${error.message}` });
      } else {
        setError({ message: 'An unknown error occurred while fetching historical data' });
      }
    }
  };

  /**
   * Calculates Heikin-Ashi candles from time series data
   * @function calculateHeikinAshi
   * @param {HistoricalDataResponse['data']} data - The historical price data
   * @returns {HeikinAshiDataPoint[]} The calculated Heikin-Ashi data
   */
  const calculateHeikinAshi = (data: HistoricalDataResponse['data']): HeikinAshiDataPoint[] => {
    const heikinAshiData: HeikinAshiDataPoint[] = []; // Array to store Heikin-Ashi data points
    let prevHA: HeikinAshiDataPoint | null = null; // Previous Heikin-Ashi data point

    // Iterate through each entry in the time series
    data.forEach((item, index) => {
      const { date, open, high, low, close } = item;

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
      {/* Main title */}
      <h1 className="text-4xl font-bold mb-8 text-center text-purple-200 uppercase">
        Essential Technical Analysis
      </h1>
      {/* Subtitle */}
      <h2 className="text-2xl font-semibold mb-6 text-center text-purple-300 uppercase">
        Price Pattern
      </h2>
      {/* Input field for stock symbol */}
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
      {/* Button to fetch data */}
      <button
        onClick={fetchStockData}  // Trigger fetchStockData when button is clicked
        disabled={loading} // Disable button when loading
        className="w-full bg-purple-600 text-white p-3 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition duration-200 ease-in-out disabled:opacity-50 text-lg font-semibold uppercase"
        aria-busy={loading}
      >
        {loading ? "FETCHING DATA..." : "Lightweight Chart"}
      </button>
      {/* Error message display */}
      {error && (
        <p className="text-center mt-4 text-red-400 bg-red-900 p-3 rounded-md uppercase" role="alert">
          Error: {error.message}
        </p>
      )}
      {/* Chart container */}
      <div className="mt-8 p-4 bg-gray-800 rounded-lg shadow-inner">
        <div ref={chartContainerRef} className="w-full h-[400px]"></div>
      </div>
      {/* Stock data table */}
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