import Box from '@mui/material/Box';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { useColorScheme } from '@mui/material/styles';

import { CONTROL_HEIGHT, DEFAULT_THEME, THEMES, type Theme } from '@/lib/theme';

export function ThemeSelector() {
  const { colorScheme, setColorScheme } = useColorScheme();
  const current: Theme = THEMES.some((t) => t.value === colorScheme)
    ? (colorScheme as Theme)
    : DEFAULT_THEME;

  return (
    <Select<Theme>
      size="small"
      value={current}
      onChange={(e) => {
        const next = e.target.value;
        if (THEMES.some((t) => t.value === next)) {
          setColorScheme(next);
        }
      }}
      renderValue={(value) => {
        const theme = THEMES.find((t) => t.value === value) ?? THEMES[0];
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {theme.label}
          </Box>
        );
      }}
      inputProps={{ 'aria-label': 'theme selector' }}
      sx={{ height: CONTROL_HEIGHT }}
    >
      {THEMES.map((theme) => (
        <MenuItem key={theme.value} value={theme.value}>
          <ListItemText>{theme.label}</ListItemText>
        </MenuItem>
      ))}
    </Select>
  );
}
