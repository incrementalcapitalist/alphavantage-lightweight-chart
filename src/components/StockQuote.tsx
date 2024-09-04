/**
 * @file StockQuote.tsx
 * @version 1.3.0
 * @description React component for fetching and displaying stock quotes with a Heikin-Ashi chart
 */

import React, { useState, useEffect, useRef } from "react";
import { createChart, IChartApi, ISeriesApi } from "lightweight-charts";

// Global type declarations
declare global {
  interface Window {
    URL: typeof URL;
    URLSearchParams: typeof URLSearchParams;
  }
}

// Type definitions
type APIError = {
  message: string;
  code?: string;
};

interface StockData {
  [key: string]: string;
}

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

interface ChartDataPoint {
  time: string;
  value: number;
}

interface HeikinAshiDataPoint {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

/**
 * StockQuote Component
 * @returns {JSX.Element} The rendered StockQuote component
 */
const StockQuote: React.FC = () => {
  // State hooks
  const [symbol, setSymbol] = useState<string>("");
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [error, setError] = useState<APIError | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [historicalData, setHistoricalData] = useState<ChartDataPoint[]>([]);
  const [heikinAshiData, setHeikinAshiData] = useState<HeikinAshiDataPoint[]>([]);

  // Ref hooks
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const heikinAshiSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);

  /**
   * Constructs API URL with parameters
   * @param {string} baseUrl - The base URL of the API
   * @param {Record<string, string>} params - The parameters to be added to the URL
   * @returns {string} The constructed URL
   */
  const constructApiUrl = (baseUrl: string, params: Record<string, string>): string => {
    const url = new URL(baseUrl);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
    return url.toString();
  };

  /**
   * Fetches stock data from the API
   */
  const fetchStockData = async () => {
    // Input validation
    if (!symbol.trim()) {
      setError({ message: "Please enter a stock symbol" });
      return;
    }

    // Reset states
    setLoading(true);
    setError(null);
    setStockData(null);

    try {
      // Construct API URL for global quote
      const apiUrl = constructApiUrl('https://www.alphavantage.co/query', {
        function: 'GLOBAL_QUOTE',
        symbol,
        apikey: import.meta.env.VITE_ALPHA_VANTAGE_API_KEY,
      });

      // Fetch data
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: AlphaVantageResponse = await response.json();
      console.log("Global Quote Response:", data);

      // Error handling
      if ('Error Message' in data) {
        throw new Error(data['Error Message'] as string);
      }

      const quote = data['Global Quote'];
      if (!quote || Object.keys(quote).length === 0) {
        throw new Error("No data found for this symbol");
      }

      setStockData(quote);
      await fetchHistoricalData(symbol);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetches historical data for the given symbol
   * @param {string} symbol - The stock symbol
   */
  const fetchHistoricalData = async (symbol: string): Promise<void> => {
    try {
      // Construct API URL for TIME_SERIES_DAILY_ADJUSTED
      let apiUrl = constructApiUrl('https://www.alphavantage.co/query', {
        function: 'TIME_SERIES_DAILY_ADJUSTED',
        symbol,
        apikey: import.meta.env.VITE_ALPHA_VANTAGE_API_KEY,
      });

      let response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      let data: AlphaVantageResponse = await response.json();
      console.log("Historical Data Response:", data);

      if ('Error Message' in data) {
        throw new Error(data['Error Message'] as string);
      }

      let timeSeries = data['Time Series (Daily)'];
      if (!timeSeries) {
        // Fallback to TIME_SERIES_DAILY if ADJUSTED is not available
        apiUrl = constructApiUrl('https://www.alphavantage.co/query', {
          function: 'TIME_SERIES_DAILY',
          symbol,
          apikey: import.meta.env.VITE_ALPHA_VANTAGE_API_KEY,
        });

        response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        data = await response.json();
        console.log("Historical Data Response (Alternative Endpoint):", data);

        if ('Error Message' in data) {
          throw new Error(data['Error Message'] as string);
        }

        timeSeries = data['Time Series (Daily)'];
        if (!timeSeries) {
          throw new Error('No time series data found');
        }
      }

      const heikinAshiData: HeikinAshiDataPoint[] = calculateHeikinAshi(timeSeries);
      setHeikinAshiData(heikinAshiData);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch historical data: ${error.message}`);
      }
      throw new Error('An unknown error occurred while fetching historical data');
    }
  };

  /**
   * Calculates Heikin-Ashi candles from time series data
   * @param {AlphaVantageResponse['Time Series (Daily)']} timeSeries - The time series data
   * @returns {HeikinAshiDataPoint[]} The calculated Heikin-Ashi data
   */
  const calculateHeikinAshi = (timeSeries: AlphaVantageResponse['Time Series (Daily)']): HeikinAshiDataPoint[] => {
    const heikinAshiData: HeikinAshiDataPoint[] = [];
    let prevHA: HeikinAshiDataPoint | null = null;

    Object.entries(timeSeries).forEach(([date, values], index) => {
      const open = parseFloat(values['1. open']);
      const high = parseFloat(values['2. high']);
      const low = parseFloat(values['3. low']);
      const close = parseFloat(values['4. close']);

      let haOpen, haClose, haHigh, haLow;

      if (index === 0) {
        haOpen = open;
        haClose = close;
      } else {
        haOpen = (prevHA!.open + prevHA!.close) / 2;
        haClose = (open + high + low + close) / 4;
      }

      haHigh = Math.max(high, haOpen, haClose);
      haLow = Math.min(low, haOpen, haClose);

      const haCandle: HeikinAshiDataPoint = {
        time: date,
        open: haOpen,
        high: haHigh,
        low: haLow,
        close: haClose
      };

      heikinAshiData.push(haCandle);
      prevHA = haCandle;
    });

    return heikinAshiData.reverse();
  };

  /**
   * Handles and sets errors
   * @param {unknown} err - The error to handle
   */
  const handleError = (err: unknown) => {
    if (err instanceof Error) {
      setError({ message: err.message });
    } else if (typeof err === "string") {
      setError({ message: err });
    } else {
      setError({ message: "An unknown error occurred" });
    }
  };

  // Effect hook for creating and updating the chart
  useEffect(() => {
    if (heikinAshiData.length > 0 && chartContainerRef.current) {
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

      if (!heikinAshiSeriesRef.current) {
        heikinAshiSeriesRef.current = chartRef.current.addCandlestickSeries({
          upColor: '#FFFFFF', // White for up days
          downColor: '#8B5CF6', // Purple for down days
          borderUpColor: '#FFFFFF',
          borderDownColor: '#8B5CF6',
          wickUpColor: '#FFFFFF',
          wickDownColor: '#8B5CF6',
        });
      }

      heikinAshiSeriesRef.current.setData(heikinAshiData);
      chartRef.current.timeScale().fitContent();
    }
  }, [heikinAshiData]);

  /**
   * Handles key press events in the input field
   * @param {React.KeyboardEvent<HTMLInputElement>} event - The key press event
   */
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      fetchStockData();
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
    <div className="bg-gray-900 text-purple-300 shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-purple-200">
        Stock Quote Fetcher
      </h2>
      <div className="mb-4">
        <input
          type="text"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value.toUpperCase())}
          onKeyPress={handleKeyPress}
          placeholder="Enter stock symbol (e.g., AAPL)"
          className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400"
          aria-label="Stock Symbol"
        />
      </div>
      <button
        onClick={fetchStockData}
        disabled={loading}
        className="w-full bg-purple-600 text-white p-2 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition duration-200 ease-in-out disabled:opacity-50"
        aria-busy={loading}
      >
        {loading ? "Loading..." : "Fetch Quote"}
      </button>
      {error && (
        <p className="mt-4 text-red-400" role="alert">
          Error: {error.message}
        </p>
      )}
      <div className="mt-6 p-4 bg-gray-800 rounded-lg shadow-inner">
        <div ref={chartContainerRef} className="w-full h-[400px]"></div>
      </div>
      {stockData && (
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-800">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">
                  Field
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">
                  Value
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-900 divide-y divide-gray-800">
              {Object.entries(stockData).map(([key, value]) => (
                <tr key={key}>
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
      )}
    </div>
  );
};

export default StockQuote;