'use client';

import { useEffect } from 'react';

export function SessionEndTracker() {
  useEffect(() => {
    const handlePageHide = () => {
      // sendBeacon is specifically designed to send data right as a tab is closing
      navigator.sendBeacon('/api/track-end');
    };

    window.addEventListener('pagehide', handlePageHide);
    return () => {
      window.removeEventListener('pagehide', handlePageHide);
    };
  }, []);

  return null;
}
