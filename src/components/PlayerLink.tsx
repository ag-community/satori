import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { Avatar } from '@/components/ui/Avatar';

interface PlayerLinkProps {
  playerId: number;
  name: string;
  avatarUrl?: string;
  size?: number;
  children?: ReactNode;
}

export function PlayerLink({
  playerId,
  name,
  avatarUrl,
  size = 24,
  children,
}: PlayerLinkProps) {
  return (
    <Box
      component={Link}
      to={`/player/${playerId}`}
      sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
    >
      <Avatar url={avatarUrl} alt={name} size={size} />
      <Typography component="span" sx={{ fontSize: 'inherit' }}>
        {name}
      </Typography>
      {children}
    </Box>
  );
}
