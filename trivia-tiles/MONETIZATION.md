# Monetization Strategy and Implementation Guide

This document outlines the monetization features implemented in the Trivia Tiles application, including the premium content model with Stripe and display advertising with Google AdSense.

## 1. Premium Content Model (Pay-per-Puzzles)

The application uses a "freemium" model where users can play their first 3 puzzles for free. After that, they must purchase puzzle credits to continue playing.

### How It Works

- **Puzzle Credits**: The `usePremiumContent` hook (`src/hooks/usePremiumContent.ts`) manages a user's puzzle credits.
  - **Free Plays**: The number of free puzzles played is tracked in `localStorage` under the key `playedPuzzles`.
  - **Paid Credits**: Purchased credits are tracked in `localStorage` under the key `purchasedCredits`.
- **The Paywall**: When a user runs out of credits (`hasAccess` is false), the `Paywall` component (`src/components/Paywall.tsx`) is displayed, prompting them to purchase more.
- **Purchasing**: A purchase gives the user 3 additional puzzle credits for $0.99.

### Stripe Integration

The payment process is handled securely by Stripe.

- **Backend**: The server (`server/index.js`) has a `/create-checkout-session` endpoint that communicates with the Stripe API to create a secure payment session.
  - **Security**: The Stripe Secret Key is stored securely on the server and is never exposed to the client. All product and price information is defined on the server to prevent tampering.
- **Frontend**: The `purchasePuzzles` function in `usePremiumContent` calls the backend endpoint and redirects the user to the Stripe Checkout page.
  - **Redirects**: After the payment process, Stripe redirects the user to either `/payment-success` or `/payment-canceled`.
  - **Adding Credits**: The `PaymentSuccess` component calls the `addCreditsOnSuccess` function to add the purchased credits to the user's account.

---

## 2. Google AdSense Integration

Display ads are used to generate revenue from all users, including those who have not purchased puzzle credits.

### Ad Placement Strategy

The goal is to display ads in a way that is not overly intrusive to the user experience.

- **Top Banner**: An ad is displayed at the top of the page, below the main title. This is a high-visibility placement that doesn't interfere with gameplay.
- **In-Content Banner**: A second ad is placed between the puzzle input and the "Found Words" list. This is a natural break in the user's flow.

### Implementation

- **Ad Component**: The `AdBanner` component (`src/components/AdBanner.tsx`) is a reusable component that wraps the AdSense ad code.
- **AdSense Script**: The main AdSense script is loaded asynchronously in `public/index.html` to avoid blocking the app's rendering.

---

## 3. Configuration and Environment Variables

To get the monetization features working in your environment, you need to configure the following environment variables.

### Client-Side (`client/.env`)

Create a `.env` file in the `trivia-tiles/client` directory and add the following:

```
# Stripe Publishable Key (safe to expose to the client)
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY_HERE

# Google AdSense Publisher ID
REACT_APP_AD_SENSE_PUBLISHER_ID=ca-pub-YOUR_PUBLISHER_ID_HERE

# Google AdSense Ad Slot IDs
REACT_APP_AD_SENSE_TOP_BANNER_SLOT_ID=YOUR_TOP_BANNER_SLOT_ID
REACT_APP_AD_SENSE_IN_CONTENT_SLOT_ID=YOUR_IN_CONTENT_SLOT_ID

# The base URL of your backend API
REACT_APP_API_URL=http://localhost:3001
```

### Server-Side (`server/.env`)

Create a `.env` file in the `trivia-tiles/server` directory and add the following:

```
# Stripe Secret Key (NEVER expose this to the client)
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY_HERE

# The base URL of your frontend application
CLIENT_URL=http://localhost:3000
```

### Where to Find Your Keys

- **Stripe**: Get your API keys from the [Stripe Dashboard](https://dashboard.stripe.com/apikeys).
- **Google AdSense**: Find your Publisher ID and create ad units (to get Slot IDs) in your [AdSense account](https://www.google.com/adsense).

By following this guide, you can effectively manage and customize the monetization features of the Trivia Tiles application. 