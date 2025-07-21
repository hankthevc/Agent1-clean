import { useState, useEffect, useCallback } from 'react';
import { loadStripe } from '@stripe/stripe-js';

/**
 * ==============================================================================
 * usePremiumContent Hook
 * ==============================================================================
 * 
 * This hook manages the user's access to premium content, specifically the
 * number of puzzles they can play. It implements a "first 3 free" model
 * and handles the process of purchasing more puzzle credits via Stripe.
 * 
 * Features:
 *  - Tracks puzzle plays and purchased credits using localStorage.
 *  - Provides a simple `hasAccess` boolean to lock or unlock content.
 *  - Initiates the Stripe Checkout flow to purchase more puzzles.
 * 
 * ==============================================================================
 */

// Your Stripe publishable key. Replace with your actual key in a .env file.
const STRIPE_PUBLISHABLE_KEY = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_YOUR_PUBLISHABLE_KEY_HERE';
const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

const FREE_PUZZLE_LIMIT = 3;

export const usePremiumContent = () => {
  const [playedPuzzles, setPlayedPuzzles] = useState<number>(() => {
    const saved = localStorage.getItem('playedPuzzles');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [purchasedCredits, setPurchasedCredits] = useState<number>(() => {
    const saved = localStorage.getItem('purchasedCredits');
    return saved ? parseInt(saved, 10) : 0;
  });
  
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Persist state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('playedPuzzles', playedPuzzles.toString());
  }, [playedPuzzles]);

  useEffect(() => {
    localStorage.setItem('purchasedCredits', purchasedCredits.toString());
  }, [purchasedCredits]);
  
  /**
   * Check if the user has access to play a puzzle.
   * Access is granted if they are within the free limit or have purchased credits.
   */
  const hasAccess = playedPuzzles < FREE_PUZZLE_LIMIT || purchasedCredits > 0;
  
  /**
   * Call this function when a user successfully completes a puzzle
   * to decrement their available credits (free or paid).
   */
  const consumeCredit = useCallback(() => {
    if (purchasedCredits > 0) {
      setPurchasedCredits(prev => prev - 1);
    } else if (playedPuzzles < FREE_PUZZLE_LIMIT) {
      setPlayedPuzzles(prev => prev + 1);
    }
  }, [playedPuzzles, purchasedCredits]);

  /**
   * Initiates the Stripe Checkout flow to purchase more puzzles.
   */
  const purchasePuzzles = useCallback(async () => {
    setIsRedirecting(true);
    try {
      // 1. Get a checkout session ID from the server
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3001'}/create-checkout-session`, {
        method: 'POST',
      });
      
      const { sessionId, error } = await response.json();
      
      if (error) {
        console.error("Error from server:", error);
        alert("Failed to create payment session. Please try again.");
        setIsRedirecting(false);
        return;
      }
      
      // 2. Redirect to Stripe Checkout
      const stripe = await stripePromise;
      if (stripe) {
        const { error: stripeError } = await stripe.redirectToCheckout({ sessionId });
        if (stripeError) {
          console.error("Stripe redirect error:", stripeError.message);
          alert("Could not redirect to payment page. Please check your connection or try again later.");
        }
      }
    } catch (err) {
      console.error("Purchase initiation error:", err);
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setIsRedirecting(false);
    }
  }, []);
  
  /**
   * This function should be called when the user returns to the app
   * after a successful purchase. It adds the purchased credits.
   */
  const addCreditsOnSuccess = useCallback(() => {
    setPurchasedCredits(prev => prev + 3); // Each purchase gives 3 credits
  }, []);

  return {
    hasAccess,
    playedPuzzles,
    purchasedCredits,
    freePuzzlesRemaining: Math.max(0, FREE_PUZZLE_LIMIT - playedPuzzles),
    isRedirecting,
    consumeCredit,
    purchasePuzzles,
    addCreditsOnSuccess,
  };
}; 