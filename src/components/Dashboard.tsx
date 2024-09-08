/**
 * @file Dashboard.tsx
 * @version 1.0.0
 * @description Main dashboard component for stock analysis, allowing users to input a stock symbol
 * and choose between real-time quotes and historical data visualization.
 * @author Incremental Capitalist
 * @copyright 2024 Incremental Capital LLC
 * @license GNU GENERAL PUBLIC LICENSE V3
 */

import React, { useState } from 'react'; // Import React and useState hook
import RealTimeQuote from './RealTimeQuote'; // Import RealTimeQuote component
import HistoricalChart from './HistoricalChart'; // Import HistoricalChart component

/**
 * @typedef {Object} FetchOption
 * @property {string} value - The value of the option
 * @property {string} label - The label to display for the option
 */

/**
 * Available options for data fetching
 * @type {FetchOption[]}
 */
const fetchOptions = [
  { value: 'realtime', label: 'Fetch Real-Time Quote' },
  { value: 'historical', label: 'Fetch Historical Data' },
];

/**
 * Dashboard component
 * @returns {JSX.Element} The rendered Dashboard component
 */
const Dashboard: React.FC = () => {
  // State for the entered stock symbol
  const [symbol, setSymbol] = useState<string>('');
  
  // State for the selected fetch option
  const [selectedOption, setSelectedOption] = useState<string>('realtime');
  
  // State to control whether to show the selected component
  const [showComponent, setShowComponent] = useState<boolean>(false);

  /**
   * Handles changes in the stock symbol input
   * @param {React.ChangeEvent<HTMLInputElement>} event - The input change event
   */
  const handleSymbolChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSymbol(event.target.value.toUpperCase()); // Convert input to uppercase
  };

  /**
   * Handles changes in the fetch option dropdown
   * @param {React.ChangeEvent<HTMLSelectElement>} event - The select change event
   */
  const handleOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
  };

  /**
   * Handles the form submission
   * @param {React.FormEvent<HTMLFormElement>} event - The form submit event
   */
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission behavior
    setShowComponent(true); // Show the selected component
  };

  return (
    <div className="bg-gray-900 text-purple-300 shadow-lg rounded-lg p-8 font-['PT_Sans_Narrow']">
      {/* Main title */}
      <h1 className="text-4xl font-bold mb-8 text-center text-purple-200 uppercase">
        Essential Technical Analysis
      </h1>
      
      {/* Input form */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="mb-4">
          <input
            type="text"
            value={symbol}
            onChange={handleSymbolChange}
            placeholder="Enter stock symbol (e.g., AAPL)"
            className="w-full p-3 bg-gray-800 border border-purple-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 text-lg text-center"
            required
          />
        </div>
        <div className="mb-4">
          <select
            value={selectedOption}
            onChange={handleOptionChange}
            className="w-full p-3 bg-gray-800 border border-purple-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white text-lg"
          >
            {fetchOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-purple-600 text-white p-3 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition duration-200 ease-in-out text-lg font-semibold uppercase"
        >
          Fetch Data
        </button>
      </form>

      {/* Render the selected component based on user choice */}
      {showComponent && (
        <div className="mt-8">
          {selectedOption === 'realtime' ? (
            <RealTimeQuote symbol={symbol} />
          ) : (
            <HistoricalChart symbol={symbol} />
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;