import { Paper, useTheme } from "@mui/material";
import { ReactNode } from "react";

export function CardSection({ children, sx }: { children: ReactNode; sx?: any }) {
  const theme = useTheme();
  return (
    <Paper
      elevation={0}
      sx={{
        background: theme.palette.primary.main,
        borderRadius: 3,
        p: { xs: 2, sm: 3 },
        mb: 3,
        ...sx,
      }}
    >
      {children}
    </Paper>
  );
}