'use client';

import { Box, Typography, List, Chip, Stack } from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';
import { Warning, WarningOctagon, Info, CheckCircle } from '@phosphor-icons/react';
import MainCard from '@/components/MainCard';

interface Finding {
  bucket: 'Critical' | 'High Impact' | 'Potential Blockers' | 'Remaining Risks';
  message: string;
  tool: string;
}

const getBucketColor = (bucket: string) => {
  switch (bucket) {
    case 'Critical': return '#f44336';
    case 'High Impact': return '#ff9800';
    case 'Potential Blockers': return '#2196f3';
    default: return '#4caf50';
  }
};

const getBucketIcon = (bucket: string) => {
  switch (bucket) {
    case 'Critical': return <WarningOctagon size={18} weight="thin" color="#f44336" />;
    case 'High Impact': return <Warning size={18} weight="thin" color="#ff9800" />;
    case 'Potential Blockers': return <Info size={18} weight="thin" color="#2196f3" />;
    default: return <CheckCircle size={18} weight="thin" color="#4caf50" />;
  }
};

export default function TriageSidebar({ findings }: { findings: Finding[] }) {
  const bucketCounts = findings.reduce((acc, f) => {
    acc[f.bucket] = (acc[f.bucket] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(bucketCounts).map(([label, value], id) => ({
    id,
    value,
    label,
    color: getBucketColor(label)
  }));

  return (
    <Box sx={{ height: '100%', overflowY: 'auto', pr: 1 }}>
      <Stack spacing={3}>
        <MainCard>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5 }}>
            Triage Feed
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
            Live 4-Bucket Audit Findings
          </Typography>

          <Box sx={{ height: 180, width: '100%', mb: 2, display: 'flex', justifyContent: 'center' }}>
            {chartData.length > 0 && (
              <PieChart
                series={[{
                  data: chartData,
                  innerRadius: 60,
                  outerRadius: 80,
                  paddingAngle: 5,
                  cornerRadius: 5,
                }]}
                width={280}
                height={180}
                slotProps={{ legend: { hidden: true } }}
              />
            )}
          </Box>

          <Stack direction="row" flexWrap="wrap" gap={1} justifyContent="center">
            {Object.entries(bucketCounts).map(([bucket, count]) => (
              <Chip
                key={bucket}
                label={`${bucket}: ${count}`}
                size="small"
                sx={{ 
                  fontSize: '0.65rem', 
                  height: 20, 
                  bgcolor: `${getBucketColor(bucket)}15`,
                  color: getBucketColor(bucket),
                  border: '1px solid',
                  borderColor: `${getBucketColor(bucket)}30`,
                  fontWeight: 700
                }}
              />
            ))}
          </Stack>
        </MainCard>

        <List sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 0 }}>
          {findings.map((f, i) => (
            <MainCard key={i} sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                {getBucketIcon(f.bucket)}
                <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase', color: getBucketColor(f.bucket), letterSpacing: 0.5 }}>
                  {f.bucket}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ fontSize: '0.85rem', lineHeight: 1.5, color: 'text.primary', fontWeight: 500 }}>
                {f.message}
              </Typography>
              <Box sx={{ mt: 1.5, pt: 1.5, borderTop: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 600 }}>
                  SOURCE: {f.tool.toUpperCase()}
                </Typography>
              </Box>
            </MainCard>
          ))}
        </List>
      </Stack>
    </Box>
  );
}
