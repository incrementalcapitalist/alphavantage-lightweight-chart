/**
 * @file HistoricalChart.tsx
 * @version 1.1.0
 * @description Component for fetching historical stock data and rendering a Heikin-Ashi chart.
 * @author Incremental Capitalist
 * @copyright 2024 Incremental Capital LLC
 * @license GNU GENERAL PUBLIC LICENSE V3
 */

import React, { useState, useEffect, useRef } from 'react'; // Import React and necessary hooks
import { createChart, IChartApi, ISeriesApi } from 'lightweight-charts'; // Import chart creation and interface types from lightweight-charts

const API_BASE_URL = 'https://6kdp1igdoe.execute-api.us-east-1.amazonaws.com/production'; // Define the API base URL

/**
 * Interface for historical data point
 * @interface HistoricalDataPoint
 */
interface HistoricalDataPoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

/**
 * Interface for Heikin-Ashi data point
 * @interface HeikinAshiDataPoint
 */
interface HeikinAshiDataPoint {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

/**
 * Interface for API error
 * @interface APIError
 */
interface APIError {
  message: string;
}

/**
 * Props for HistoricalChart component
 * @interface HistoricalChartProps
 */
interface HistoricalChartProps {
  symbol: string;
}

/**
 * HistoricalChart component
 * @param {HistoricalChartProps} props - The component props
 * @returns {JSX.Element} The rendered HistoricalChart component
 */
const HistoricalChart: React.FC<HistoricalChartProps> = ({ symbol }) => {
  // State for storing the calculated Heikin-Ashi chart data
  const [heikinAshiData, setHeikinAshiData] = useState<HeikinAshiDataPoint[]>([]);
  
  // State for storing any errors that occur during API calls
  const [error, setError] = useState<APIError | null>(null);
  
  // State for tracking the loading status of API calls
  const [loading, setLoading] = useState<boolean>(true);

  // Ref for the chart container div element
  const chartContainerRef = useRef<HTMLDivElement>(null);
  
  // Ref for storing the chart instance
  const chartRef = useRef<IChartApi | null>(null);
  
  // Ref for storing the Heikin-Ashi candlestick series
  const heikinAshiSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);

  /**
   * Fetches historical stock data from the API
   */
  useEffect(() => {
    const fetchHistoricalData = async () => {
      try {
        // Construct the API URL for fetching historical data
        const url = `${API_BASE_URL}/historicaldata?symbol=${encodeURIComponent(symbol)}`;
        
        // Fetch data from the API
        const response = await fetch(url);
        
        // Check if the response is ok
        if (!response.ok) {
          throw new Error(`API returned status ${response.status}`);
        }
        
        // Parse the JSON response
        const responseData = await response.json();
        const data = JSON.parse(responseData.body);

        // Check if the response contains an error message
        if (data.error) {
          throw new Error(data.error);
        }

        // Calculate Heikin-Ashi data from the historical data
        const heikinAshiData = calculateHeikinAshi(data.data);
        
        // Update the state with the calculated Heikin-Ashi data
        setHeikinAshiData(heikinAshiData);
      } catch (err) {
        // Handle and set any errors that occur during the fetch
        console.error('Error fetching historical data:', err);
        setError({ message: err instanceof Error ? err.message : 'An unknown error occurred' });
      } finally {
        // Set loading to false when the fetch is complete
        setLoading(false);
      }
    };

    // Call the fetchHistoricalData function
    fetchHistoricalData();
  }, [symbol]); // Re-run the effect when the symbol changes

  /**
   * Calculates Heikin-Ashi candles from time series data
   * @param {HistoricalDataPoint[]} data - The historical price data
   * @returns {HeikinAshiDataPoint[]} The calculated Heikin-Ashi data
   */
  const calculateHeikinAshi = (data: HistoricalDataPoint[]): HeikinAshiDataPoint[] => {
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
   * Effect hook for creating and updating the chart
   */
  useEffect(() => {
    // Check if we have Heikin-Ashi data and a valid chart container reference
    if (heikinAshiData.length > 0 && chartContainerRef.current) {
      // If the chart doesn't exist, create it
      if (!chartRef.current) {
        chartRef.current = createChart(chartContainerRef.current, {
          width: chartContainerRef.current.clientWidth, // Set chart width to container width
          height: 400, // Set chart height
          layout: {
            background: { color: '#111827' }, // Set dark background color
            textColor: '#C4B5FD', // Set light purple text color
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
          upColor: '#A855F7', // Set purple color for up days
          downColor: '#F97316', // Set orange color for down days
          borderUpColor: '#A855F7', // Set border color for up days
          borderDownColor: '#F97316', // Set border color for down days
          wickUpColor: '#A855F7', // Set wick color for up days
          wickDownColor: '#F97316', // Set wick color for down days
        });
      }

      // Set the Heikin-Ashi data to the candlestick series
      heikinAshiSeriesRef.current.setData(heikinAshiData);
      // Adjust the visible time range to fit all the data
      chartRef.current.timeScale().fitContent();
    }
  }, [heikinAshiData]); // This effect runs whenever heikinAshiData changes

  // Render loading state
  if (loading) {
    return <div className="text-center">Loading historical data...</div>;
  }

  // Render error state
  if (error) {
    return <div className="text-center text-red-500">Error: {error.message}</div>;
  }

  // Render the chart
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4 text-center text-purple-300">Historical Chart for {symbol}</h2>
      <div ref={chartContainerRef} className="w-full h-[400px]"></div>
    </div>
  );
};

export default HistoricalChart;