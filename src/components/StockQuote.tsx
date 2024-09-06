/**
 * @file StockQuote.tsx
 * @version 3.1.0
 * @description React component for fetching and displaying stock quotes with a Heikin-Ashi chart,
 * integrated with AWS Amplify v6, AWS Lambda, and API Gateway.
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
 */

// Import necessary dependencies
import React, { useState, useEffect, useRef } from "react"; // React and its hooks for component logic
import { createChart, IChartApi, ISeriesApi } from "lightweight-charts"; // Library for creating financial charts
import { fetchAuthSession } from 'aws-amplify/auth'; // Amplify v6 auth session fetching
import { get, isCancelError } from 'aws-amplify/api'; // Amplify v6 API for making GET requests
import { Amplify } from 'aws-amplify'; // Amplify core for configuration

// Global type declarations
declare global {
  interface Window {
    URL: typeof URL; // Ensure URL is available on the global Window object
    URLSearchParams: typeof URLSearchParams; // Ensure URLSearchParams is available on the global Window object
  }
}

// Type definitions

/**
 * Represents an API error
 */
type APIError = {
  message: string; // Error message
  code?: string; // Optional error code
};

/**
 * Represents stock data with string key-value pairs
 */
interface StockData {
  [key: string]: string;
}

/**
 * Represents the structure of the Alpha Vantage API response
 */
interface AlphaVantageResponse {
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
  'Global Quote'?: {
    [key: string]: string;
  };
}

/**
 * Represents a single data point for Heikin-Ashi chart
 */
interface HeikinAshiDataPoint {
  time: string; // Date/time of the data point
  open: number; // Opening price
  high: number; // Highest price
  low: number; // Lowest price
  close: number; // Closing price
}


/**
 * StockQuote Component
 * @returns {JSX.Element} The rendered StockQuote component
 */
const StockQuote: React.FC = () => {
  // State hooks
  const [symbol, setSymbol] = useState<string>(""); // State for storing the stock symbol
  const [stockData, setStockData] = useState<StockData | null>(null); // State for storing fetched stock data
  const [error, setError] = useState<APIError | null>(null); // State for storing any errors
  const [loading, setLoading] = useState<boolean>(false); // State for tracking loading status
  const [heikinAshiData, setHeikinAshiData] = useState<HeikinAshiDataPoint[]>([]); // State for storing Heikin-Ashi chart data

  // Ref hooks
  const chartContainerRef = useRef<HTMLDivElement>(null); // Ref for the chart container div
  const chartRef = useRef<IChartApi | null>(null); // Ref for the chart instance
  const heikinAshiSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null); // Ref for the Heikin-Ashi candlestick series

  /**
   * Fetches stock data from the AWS Lambda function via API Gateway
   */
  const fetchStockData = async () => {
    // Input validation
    if (!symbol.trim()) {
      setError({ message: "Please enter a stock symbol" }); // Set error if symbol is empty
      return;
    }

    // Reset states
    setLoading(true); // Set loading state to true
    setError(null); // Clear any previous errors
    setStockData(null); // Clear any previous stock data

    try {
      // Ensure we have a valid auth session before making the API call
      await fetchAuthSession();

      // Fetch data using AWS API Gateway through Amplify v6 API
      const { body } = await get({
        apiName: 'StockQuoteAPI', // Name of the API configured in Amplify
        path: '/globalquote', // Path for the global quote endpoint
        options: {
          queryParams: {
            symbol: symbol // Pass the stock symbol as a query parameter
          }
        }
      }).response; // Access the response property of the returned object

      // Parse the response body as JSON
      const globalQuoteResponse = await body.json();

      console.log("Global Quote Response:", globalQuoteResponse); // Log the response for debugging

      // Error handling
      if ('error' in isCancelError) {
        // If the response contains an error property, throw an error
        throw new Error(JSON.stringify(isCancelError));
      }

      // Set the stock data, accessing the 'Global Quote' property of the response
      setStockData(globalQuoteResponse as StockData);

      // Fetch historical data for the chart
      await fetchHistoricalData(symbol);
    } catch (err) {
      handleError(err); // Handle any errors that occur during the fetch
    } finally {
      setLoading(false); // Set loading state to false when fetch is complete
    }
  };

  /**
   * Fetches historical data for the given symbol
   * @param {string} symbol - The stock symbol
   */
  const fetchHistoricalData = async (symbol: string): Promise<void> => {
    try {
      // Fetch historical data using Amplify v6 API
      const { body } = await get({
        apiName: 'StockQuoteAPI', // Name of the API configured in Amplify
        path: '/historical', // Path for the historical data endpoint
        options: {
          queryParams: {
            symbol: symbol // Pass the stock symbol as a query parameter
          }
        }
      }).response; // Access the response property of the returned object

      // Parse the response body as JSON
      const jsonData = await body.json();
      
      // Type guard to check if jsonData is AlphaVantageResponse
      if (!isAlphaVantageResponse(jsonData)) {
        throw new Error('Invalid response format');
      }

      const data: AlphaVantageResponse = jsonData;

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
   * Type guard function to check if the data is AlphaVantageResponse
   * @param {any} data - The data to check
   * @returns {boolean} True if the data is AlphaVantageResponse, false otherwise
   */
  function isAlphaVantageResponse(data: any): data is AlphaVantageResponse {
    return (
      data &&
      typeof data === 'object' &&
      'Meta Data' in data &&
      'Time Series (Daily)' in data
    );
  }

  /**
   * Calculates Heikin-Ashi candles from time series data
   * @param {AlphaVantageResponse['Time Series (Daily)']} timeSeries - The time series data
   * @returns {HeikinAshiDataPoint[]} The calculated Heikin-Ashi data
   */
  const calculateHeikinAshi = (timeSeries: AlphaVantageResponse['Time Series (Daily)']): HeikinAshiDataPoint[] => {
    const heikinAshiData: HeikinAshiDataPoint[] = [];
    let prevHA: HeikinAshiDataPoint | null = null;

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
   * @param {unknown} err - The error to handle
   */
  const handleError = (err: unknown) => {
    if (err instanceof Error) {
      setError({ message: err.message }); // Set error message if it's an Error instance
    } else if (typeof err === "string") {
      setError({ message: err }); // Set error message if it's a string
    } else {
      setError({ message: "An unknown error occurred" }); // Set a generic error message for unknown error types
    }
  };

  // Effect hook for creating and updating the chart
  useEffect(() => {
    if (heikinAshiData.length > 0 && chartContainerRef.current) {
      if (!chartRef.current) {
        // Create the chart if it doesn't exist
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

      if (!heikinAshiSeriesRef.current) {
        // Add the Heikin-Ashi candlestick series if it doesn't exist
        heikinAshiSeriesRef.current = chartRef.current.addCandlestickSeries({
          upColor: '#8B5CF6', // Purple for up days
          downColor: '#f97316', // Orange for down days
          borderUpColor: '#8B5CF6',
          borderDownColor: '#f97316',
          wickUpColor: '#8B5CF6',
          wickDownColor: '#f97316',
        });
      }

      // Set the data and fit the chart content
      heikinAshiSeriesRef.current.setData(heikinAshiData);
      chartRef.current.timeScale().fitContent();
    }
  }, [heikinAshiData]); // This effect runs whenever heikinAshiData changes

  /**
   * Handles key press events in the input field
   * @param {React.KeyboardEvent<HTMLInputElement>} event - The key press event
   */
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      fetchStockData(); // Trigger fetchStockData when Enter key is pressed
    }
  };

  /**
   * Formats the key names for display
   * @param {string} key - The key to format
   * @returns {string} The formatted key
   */
  const formatKey = (key: string): string => {
    return key.split(". ")[1]?.replace(/([A-Z])/g, " $1").trim() || key;
  };

  // Render the component
  return (
    <div className="bg-gray-900 text-purple-300 shadow-lg rounded-lg p-8 font-['PT_Sans_Narrow']">
      <h2 className="text-3xl font-bold mb-6 text-purple-200 border-b border-purple-700 pb-2 text-center">
        BASIC PRICE ANALYSIS
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
        onClick={fetchStockData} // Trigger fetchStockData when button is clicked
        disabled={loading} // Disable button when loading
        className="w-full bg-purple-600 text-white p-3 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition duration-200 ease-in-out disabled:opacity-50 text-lg font-semibold"
        aria-busy={loading}
      >
        {loading ? "FETCHING DATA..." : "FETCH QUOTE"}
      </button>
      {error && (
        <p className="mt-4 text-red-400 bg-red-900 p-3 rounded-md" role="alert">
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