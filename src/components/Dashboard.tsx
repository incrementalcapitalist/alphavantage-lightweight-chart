/**
 * @file Dashboard.tsx
 * @version 1.2.1
 * @description Main dashboard component for stock analysis, allowing users to input a stock symbol
 * and choose between real-time quotes and historical data visualization. This component serves as
 * the central hub for user interaction in the Essential Technical Analysis application.
 * @author Incremental Capitalist
 * @copyright 2024 Incremental Capital LLC
 * @license GNU GENERAL PUBLIC LICENSE V3
 */

// Import React and useState hook for component state management
import React, { useState } from 'react';

// Import RealTimeQuote component for displaying current stock data
import RealTimeQuote from './RealTimeQuote';

// Import HistoricalChart component for displaying historical stock data
import HistoricalChart from './HistoricalChart';

/**
 * Represents an option for data fetching in the toggle button group
 * @interface FetchOption
 */
interface FetchOption {
  /** The internal value used by the application */
  value: string;
  /** The user-friendly label displayed in the UI */
  label: string;
}

/**
 * Available options for data fetching
 * @type {FetchOption[]}
 * @description Defines the choices presented to the user for data retrieval
 */
const fetchOptions: FetchOption[] = [
  { value: 'realtime', label: 'Fetch Real-Time Quote' },
  { value: 'historical', label: 'Fetch Historical Data' },
];

/**
 * Dashboard component
 * @function
 * @returns {JSX.Element} The rendered Dashboard component
 * @description This component manages the main user interface for stock data analysis.
 * It allows users to enter a stock symbol and choose between viewing real-time quotes
 * or historical data charts using a toggle button group for improved UX.
 */
const Dashboard: React.FC = () => {
  // State for the entered stock symbol
  const [symbol, setSymbol] = useState<string>('');
  
  // State for the selected fetch option (realtime or historical)
  const [selectedOption, setSelectedOption] = useState<string>('realtime');
  
  // State to control whether to show the selected data component
  const [showComponent, setShowComponent] = useState<boolean>(false);

  /**
   * Handles changes in the stock symbol input
   * @function
   * @param {React.ChangeEvent<HTMLInputElement>} event - The input change event
   * @description Updates the symbol state with the user's input, converting it to uppercase
   */
  const handleSymbolChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Convert input to uppercase for consistency and set it as the new symbol state
    setSymbol(event.target.value.toUpperCase());
  };

  /**
   * Handles changes in the fetch option toggle button group
   * @function
   * @param {React.ChangeEvent<HTMLInputElement>} event - The radio input change event
   * @description Updates the selectedOption state based on the user's selection
   */
  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Set the new selected option based on the radio button value
    setSelectedOption(event.target.value);
  };

  /**
   * Handles the form submission
   * @function
   * @param {React.FormEvent<HTMLFormElement>} event - The form submit event
   * @description Prevents default form submission and triggers the display of the selected component
   */
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    // Prevent the default form submission behavior
    event.preventDefault();
    // Show the selected data component by setting showComponent to true
    setShowComponent(true);
  };

  return (
    // Main container for the dashboard with styling
    <div className="bg-gray-900 text-purple-300 shadow-lg rounded-lg p-8 font-['PT_Sans_Narrow']">
      {/* Main title of the dashboard */}
      <h1 className="text-4xl font-bold mb-8 text-center text-purple-200 uppercase">
        Essential Technical Analysis
      </h1>
      
      {/* Input form for stock symbol and data type selection */}
      <form onSubmit={handleSubmit} className="mb-8">
        {/* Stock symbol input field */}
        <div className="mb-4">
          <input
            type="text" // Input type for text entry
            value={symbol} // Controlled input value
            onChange={handleSymbolChange} // Event handler for input changes
            placeholder="Enter stock symbol (e.g., AAPL)" // Placeholder text for user guidance
            className="w-full p-3 bg-gray-800 border border-purple-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 text-lg text-center"
            required // Make this field required
          />
        </div>

        {/* Improved data type selection using radio buttons styled as toggle buttons */}
        <div className="mb-4 flex justify-center">
          {/* Map through fetchOptions to create toggle buttons */}
          {fetchOptions.map((option) => (
            <label key={option.value} className="inline-flex items-center mr-4">
              {/* Hidden radio input for accessibility and state management */}
              <input
                type="radio"
                value={option.value}
                checked={selectedOption === option.value}
                onChange={handleOptionChange}
                className="hidden" // Hide the default radio button
              />
              {/* Styled span to create the visual toggle button */}
              <span
                className={`px-4 py-2 rounded-md text-sm font-medium cursor-pointer transition-colors duration-200 ease-in-out ${
                  selectedOption === option.value
                    ? 'bg-purple-600 text-white' // Styles for selected state
                    : 'bg-gray-700 text-purple-300 hover:bg-gray-600' // Styles for unselected state with hover effect
                }`}
              >
                {option.label} {/* Display the user-friendly label */}
              </span>
            </label>
          ))}
        </div>

        {/* Submit button to fetch data */}
        <button
          type="submit"
          className="w-full bg-purple-600 text-white p-3 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition duration-200 ease-in-out text-lg font-semibold uppercase"
        >
          Fetch Data
        </button>
      </form>

      {/* Conditional rendering of the selected data component */}
      {showComponent && (
        <div className="mt-8">
          {/* Render RealTimeQuote for realtime option, otherwise render HistoricalChart */}
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

// Export the Dashboard component as the default export
export default Dashboard;