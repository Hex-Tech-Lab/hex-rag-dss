'use client';

import { useEffect, useState } from 'react';
import TriageSidebar from '@/components/organisms/dashboard/TriageSidebar';
import { ScraperFinding } from '@/types';

/**
 * Client-side Triage Feed
 * Fetches findings after mount to prevent SSR crashes and hydration errors.
 */
export default function TriageFeedClient({ initialFindings }: { initialFindings: ScraperFinding[] }) {
  const [findings, setFindings] = useState<ScraperFinding[]>(initialFindings);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // In a future step, we can add a refresh trigger here
    // For now, we just ensure it's mounted correctly
  }, []);

  return <TriageSidebar findings={findings} />;
}
