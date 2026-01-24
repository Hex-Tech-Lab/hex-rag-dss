import { generateComparisonMatrix } from '@/lib/intelligence/compare';
import ComparisonView from '@/sections/components/compare/ComparisonView';

export default async function ComparePage({ 
  searchParams 
}: { 
  searchParams: Promise<{ altA?: string, altB?: string, topic?: string }> 
}) {
  const { altA = 'Freedom System', altB = 'OpenSpec' } = await searchParams;

  const data = await generateComparisonMatrix(altA, altB);

  return <ComparisonView data={data} altA={altA} altB={altB} />;
}