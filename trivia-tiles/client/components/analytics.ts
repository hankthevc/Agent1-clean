import ReactGA from 'react-ga4';

/**
 * Google Analytics 4 (GA4) Integration
 * 
 * This module initializes GA4 and provides helper functions for tracking
 * user interactions and game events throughout the Trivia Tiles application.
 */

// Your Google Analytics Measurement ID
const GA4_MEASUREMENT_ID = "G-3620466257";

/**
 * INITIALIZE GOOGLE ANALYTICS
 * 
 * This function sets up the GA4 tracking script with your Measurement ID.
 * It should be called once when the application starts, typically in the
 * main App component or index.tsx file.
 * 
 * We check for the production environment to avoid sending tracking
 * events during development, which keeps your analytics data clean.
 */
export const initGA = () => {
  if (process.env.NODE_ENV === 'production' && GA4_MEASUREMENT_ID) {
    ReactGA.initialize(GA4_MEASUREMENT_ID);
    console.log("Google Analytics initialized.");
  } else {
    console.log("Google Analytics is in development mode or Measurement ID is missing.");
  }
};

/**
 * TRACK EVENT
 * 
 * This is the core function for sending custom events to GA4.
 * It allows you to track specific user interactions with detailed context.
 * 
 * @param {string} category - A high-level grouping for your event (e.g., 'Puzzle', 'Trivia').
 * @param {string} action - The specific action the user took (e.g., 'Submit Word', 'Unlock Clue').
 * @param {string} [label] - Optional: Provides additional context (e.g., the submitted word, the unlocked clue).
 * @param {number} [value] - Optional: A numerical value associated with the event (e.g., score, time taken).
 * 
 * EXAMPLE:
 * trackEvent('Puzzle', 'Submit Word', 'apple', 10);
 */
export const trackEvent = (category: string, action: string, label?: string, value?: number) => {
  if (process.env.NODE_ENV === 'production' && GA4_MEASUREMENT_ID) {
    ReactGA.event({
      category,
      action,
      label,
      value
    });
  } else {
    // Log events to the console in development for debugging
    console.log(`[GA Event] Category: ${category}, Action: ${action}, Label: ${label}, Value: ${value}`);
  }
};

/**
 * TRACK PAGE VIEW
 * 
 * This function tracks page views, which is useful for single-page applications
 * where the page doesn't fully reload on navigation.
 * 
 * @param {string} path - The path of the page being viewed (e.g., window.location.pathname).
 * 
 * EXAMPLE:
 * trackPageView('/leaderboard');
 */
export const trackPageView = (path: string) => {
  if (process.env.NODE_ENV === 'production' && GA4_MEASUREMENT_ID) {
    ReactGA.send({ hitType: "pageview", page: path });
  } else {
    console.log(`[GA PageView] Path: ${path}`);
  }
}; 