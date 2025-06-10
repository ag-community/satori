import { Box, Paper, Typography, useTheme } from "@mui/material";
import { ReactNode } from "react";

export function ActionCard({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  const theme = useTheme();
  return (
    <Paper
      elevation={0}
      sx={{
        background: "#181818",
        borderRadius: 2,
        p: 2,
        flex: 1,
        minWidth: 0,
        mr: 2,
        "&:last-child": { mr: 0 },
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
}