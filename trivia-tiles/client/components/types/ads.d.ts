/**
 * ==============================================================================
 * TypeScript Declaration for Google AdSense
 * ==============================================================================
 * 
 * This file extends the global Window interface to include the `adsbygoogle`
 * object that is injected by the Google AdSense script.
 * 
 * This prevents TypeScript errors when accessing `window.adsbygoogle`.
 * 
 * ==============================================================================
 */

export {};

declare global {
  interface Window {
    adsbygoogle?: any[];
  }
} 