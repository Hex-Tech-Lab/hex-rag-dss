import { getSupabase } from '@/lib/supabase';
import DecisionsView from '@/sections/decisions/DecisionsView';

/**
 * Decision Log Screen (Action 10.2)
 * Lists all "New Truths" recorded in the system.
 */
export default async function DecisionsPage() {
  const supabase = await getSupabase();
  const { data: decisions } = await supabase
    .from('decisions')
    .select('*')
    .eq('is_active', true)
    .order('decided_at', { ascending: false });

  return <DecisionsView decisions={decisions || []} />;
}