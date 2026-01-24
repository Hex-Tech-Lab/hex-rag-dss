import { useState, useEffect } from 'react';

/**
 * 10x Stability Hook
 * Ensures client-only rendering to prevent hydration mismatches (#418).
 */
export function useHasMounted() {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  return hasMounted;
}
