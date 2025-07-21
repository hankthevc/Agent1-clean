import type { AppProps } from 'next/app';
import React from 'react';

/**
 * Next.js App component
 * 
 * This wraps all pages and provides global layout and styling.
 */
export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
