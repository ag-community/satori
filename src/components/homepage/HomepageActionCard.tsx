import { Box, Paper, Typography, useTheme } from '@mui/material';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

export function ActionCard({
  icon,
  title,
  description,
  to,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  to?: string;
}) {
  const theme = useTheme();

  const content = (
    <Paper
      elevation={0}
      sx={{
        background: theme.palette.background.paper,
        borderRadius: 2,
        p: 2,
        flex: 1,
        minWidth: 0,
        mr: 2,
        '&:last-child': { mr: 0 },
        ...(to
          ? {
              cursor: 'pointer',
              transition: 'opacity 0.2s',
              '&:hover': { opacity: 0.85 },
            }
          : {}),
      }}
    >
      <Box display="flex" alignItems="center" mb={1}>
        <Box mr={1}>{icon}</Box>
        <Typography fontWeight={700}>{title}</Typography>
      </Box>
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
    </Paper>
  );

  if (to) {
    return (
      <Link
        to={to}
        style={{
          textDecoration: 'none',
          display: 'flex',
          flex: 1,
          minWidth: 0,
        }}
      >
        {content}
      </Link>
    );
  }

  return content;
}
