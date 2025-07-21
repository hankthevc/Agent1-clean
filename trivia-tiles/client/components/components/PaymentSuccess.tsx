import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

/**
 * ==============================================================================
 * Payment Success Component
 * ==============================================================================
 * 
 * This component is displayed when a user is redirected back to the app
 * after a successful payment through Stripe.
 * 
 * It confirms the purchase and provides a clear path back to the game.
 * 
 * ==============================================================================
 */

interface PaymentSuccessProps {
  /**
   * This function should be called to add the purchased credits to the user's account.
   */
  onSuccess: () => void;
}

export const PaymentSuccess: React.FC<PaymentSuccessProps> = ({ onSuccess }) => {
  // Call the onSuccess function once when the component mounts
  useEffect(() => {
    onSuccess();
  }, [onSuccess]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-10 max-w-lg w-full">
        <svg className="w-24 h-24 text-green-500 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Payment Successful!</h1>
        <p className="text-gray-600 mb-8">
          Thank you for your purchase. 3 new puzzle credits have been added to your account.
        </p>
        <Link
          to="/"
          className="bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-transform transform hover:scale-105"
        >
          Back to the Puzzles
        </Link>
      </div>
    </div>
  );
}; 