import React from 'react';

/**
 * ==============================================================================
 * Paywall Component
 * ==============================================================================
 * 
 * This component is displayed when a user has exhausted their free puzzle plays
 * and needs to purchase credits to continue.
 * 
 * It serves as a clear call-to-action to monetize the application.
 * 
 * ==============================================================================
 */

interface PaywallProps {
  /**
   * The function to call when the user clicks the purchase button.
   * This should trigger the Stripe Checkout flow.
   */
  onPurchase: () => void;
  
  /**
   * A boolean to indicate if the app is currently redirecting to Stripe.
   * Used to show a loading state on the button.
   */
  isRedirecting: boolean;

  /**
   * The number of free puzzles the user has already played.
   */
  freePuzzlesPlayed: number;
}

export const Paywall: React.FC<PaywallProps> = ({ onPurchase, isRedirecting, freePuzzlesPlayed }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full text-center transform transition-all scale-100 opacity-100">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">You're on a Roll!</h2>
        <p className="text-gray-600 mb-6">
          You've played all {freePuzzlesPlayed} of your free puzzles.
          <br />
          Ready for more trivia fun?
        </p>
        <div className="bg-gray-100 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-semibold text-indigo-600">Get 3 More Puzzles</h3>
          <p className="text-5xl font-extrabold text-gray-900 my-2">$0.99</p>
          <p className="text-sm text-gray-500">One-time payment</p>
        </div>
        <button
          onClick={onPurchase}
          disabled={isRedirecting}
          className="w-full bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-transform transform hover:scale-105 disabled:bg-indigo-400 disabled:cursor-not-allowed"
        >
          {isRedirecting ? 'Redirecting to secure payment...' : 'Purchase Puzzles'}
        </button>
        <p className="text-xs text-gray-400 mt-4">
          Payments are securely processed by Stripe.
        </p>
      </div>
    </div>
  );
}; 