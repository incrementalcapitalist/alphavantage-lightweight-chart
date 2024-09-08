/**
 * @file RealTimeQuote.tsx
 * @version 1.1.0
 * @description Component for fetching and displaying real-time stock quotes.
 * @author Incremental Capitalist
 * @copyright 2024 Incremental Capital LLC
 * @license GNU GENERAL PUBLIC LICENSE V3
 */

import React, { useState, useEffect } from 'react'; // Import React and necessary hooks
const API_BASE_URL = 'https://6kdp1igdoe.execute-api.us-east-1.amazonaws.com/production'; // Define the API base URL

/**
 * Interface for stock data
 * @interface StockData
 */
interface StockData {
  [key: string]: string;
}

/**
 * Interface for API error
 * @interface APIError
 */
interface APIError {
  message: string;
}

/**
 * Props for RealTimeQuote component
 * @interface RealTimeQuoteProps
 */
interface RealTimeQuoteProps {
  symbol: string;
}

/**
 * RealTimeQuote component
 * @param {RealTimeQuoteProps} props - The component props
 * @returns {JSX.Element} The rendered RealTimeQuote component
 */
const RealTimeQuote: React.FC<RealTimeQuoteProps> = ({ symbol }) => {
  // State for storing the fetched stock data
  const [stockData, setStockData] = useState<StockData | null>(null);
  
  // State for storing any errors that occur during API calls
  const [error, setError] = useState<APIError | null>(null);
  
  // State for tracking the loading status of API calls
  const [loading, setLoading] = useState<boolean>(true);

  /**
   * Fetches real-time stock data from the API
   */
  useEffect(() => {
    const fetchRealTimeData = async () => {
      try {
        // Construct the API URL for fetching global quote data
        const url = `${API_BASE_URL}/globalquote?symbol=${encodeURIComponent(symbol)}`;
        
        // Fetch data from the API
        const response = await fetch(url);
        
        // Check if the response is ok
        if (!response.ok) {
          throw new Error(`API returned status ${response.status}`);
        }
        
        // Parse the JSON response
        const data = await response.json();

        // Check if the response contains an error message
        if (data.error) {
          throw new Error(data.error);
        }

        // Set the fetched stock data in the component state
        setStockData(data);
      } catch (err) {
        // Handle and set any errors that occur during the fetch
        console.error('Error fetching real-time data:', err);
        setError({ message: err instanceof Error ? err.message : 'An unknown error occurred' });
      } finally {
        // Set loading to false when the fetch is complete
        setLoading(false);
      }
    };

    // Call the fetchRealTimeData function
    fetchRealTimeData();
  }, [symbol]); // Re-run the effect when the symbol changes

  /**
   * Formats the key names for display
   * @param {string} key - The key to format
   * @returns {string} The formatted key
   */
  const formatKey = (key: string): string => {
    // Split the key by ". " and take the second part if it exists
    // Then replace camelCase with spaces before each capital letter
    return key.split(". ")[1]?.replace(/([A-Z])/g, " $1").trim() || key;
  };

  // Render loading state
  if (loading) {
    return <div className="text-center">Loading real-time data...</div>;
  }

  // Render error state
  if (error) {
    return <div className="text-center text-red-500">Error: {error.message}</div>;
  }

  // Render stock data
  return (
    <div className="overflow-x-auto">
      <h2 className="text-2xl font-semibold mb-4 text-center text-purple-300">Real-Time Quote for {symbol}</h2>
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
          {stockData && Object.entries(stockData).map(([key, value]) => (
            <tr key={key} className="hover:bg-gray-800 transition-colors duration-150">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-purple-200">
                {formatKey(key)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-300">
                {value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RealTimeQuote;