import React, { useEffect } from 'react';

/**
 * ==============================================================================
 * AdBanner Component
 * ==============================================================================
 * 
 * This component is responsible for displaying a Google AdSense ad unit.
 * It handles the script injection and ad rendering logic.
 * 
 * To use this, you need a Google AdSense account and an ad unit created.
 * 
 * ==============================================================================
 */

interface AdBannerProps {
  /**
   * Your AdSense Publisher ID (e.g., "ca-pub-1234567890123456").
   * It's recommended to store this in an environment variable.
   */
  publisherId: string;
  
  /**
   * The ID of the ad slot this banner should display.
   */
  slotId: string;
  
  /**
   * Ad-layout for responsive ads.
   */
  adLayout?: string;

  /**
   * Ad-format for responsive ads.
   */
  adFormat?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({
  publisherId,
  slotId,
  adLayout = 'in-article',
  adFormat = 'fluid',
}) => {
  useEffect(() => {
    try {
      // This is the standard AdSense script loader
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error('AdSense script failed to push ad:', e);
    }
  }, []);

  // Basic validation to ensure essential props are provided
  if (!publisherId || !slotId) {
    console.warn('AdBanner component requires a publisherId and slotId.');
    return null; // Don't render if misconfigured
  }

  return (
    <div className="ad-container my-4 text-center">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={publisherId}
        data-ad-slot={slotId}
        data-ad-layout={adLayout}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
}; 