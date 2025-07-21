import React from 'react';
import { Link } from 'react-router-dom';

/**
 * ==============================================================================
 * Payment Canceled Component
 * ==============================================================================
 * 
 * This component is displayed when a user cancels the Stripe Checkout process
 * and is redirected back to the app.
 * 
 * It provides a clear, no-blame message and an easy way to return to the game.
 * 
 * ==============================================================================
 */

export const PaymentCanceled: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-10 max-w-lg w-full">
        <svg className="w-24 h-24 text-yellow-500 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Payment Canceled</h1>
        <p className="text-gray-600 mb-8">
          Your transaction was not completed. You can return to the puzzle and purchase later if you wish.
        </p>
        <Link
          to="/"
          className="bg-gray-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-300 transition-transform transform hover:scale-105"
        >
          Return to Game
        </Link>
      </div>
    </div>
  );
}; 