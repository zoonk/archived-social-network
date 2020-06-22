import { useState, useCallback, useEffect } from 'react';

/**
 * Check if a media query meets its target.
 * Forked from https://github.com/vercel/next-site/blob/master/components/media-query.js
 */
const useMediaQuery = (width: string | number) => {
  const [targetReached, setTargetReached] = useState(false);

  const updateTarget = useCallback((e) => {
    if (e.matches) {
      setTargetReached(true);
    } else {
      setTargetReached(false);
    }
  }, []);

  useEffect(() => {
    const media = window.matchMedia(`(max-width: ${width}px)`);
    media.addListener(updateTarget);

    // Check on mount (callback is not called until a change occurs)
    if (media.matches) {
      setTargetReached(true);
    }

    return () => media.removeListener(updateTarget);
  }, [updateTarget, width]);

  return targetReached;
};

export default useMediaQuery;
