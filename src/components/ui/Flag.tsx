import Box from '@mui/material/Box';

import { getFlagUrl } from '@/lib/countries';

export function Flag({ countryCode }: { countryCode: string }) {
  const code = countryCode?.toUpperCase();
  if (!code || code === 'XX') {
    return <span>[?]</span>;
  }
  return (
    <Box
      component="img"
      src={getFlagUrl(code)}
      alt={code}
      title={code}
      sx={{
        height: 14,
        width: 'auto',
        verticalAlign: 'middle',
        display: 'inline-block',
      }}
    />
  );
}
