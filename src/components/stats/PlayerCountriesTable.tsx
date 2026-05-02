import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { PlayerCountry } from '../../adapters/shion/stats';
import { ALPHA2_COUNTRY_LIST, getFlagUrl } from '../../utils/countries';

export const PlayerCountriesTable = ({ data }: { data: PlayerCountry[] }) => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Paper
      elevation={0}
      sx={{ background: theme.palette.background.paper, borderRadius: 2, p: 2 }}
    >
      <Typography variant="subtitle1" fontWeight={700} mb={1}>
        {t('stats.player_countries')}
      </Typography>
      {data.length > 0 ? (
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    color: theme.palette.text.secondary,
                    fontWeight: 700,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  {t('stats.country')}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    color: theme.palette.text.secondary,
                    fontWeight: 700,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  {t('stats.players')}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.slice(0, 15).map((row) => (
                <TableRow key={row.country}>
                  <TableCell
                    sx={{
                      borderBottom: `1px solid ${theme.palette.action.hover}`,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <Box
                      component="img"
                      src={getFlagUrl(row.country.toUpperCase())}
                      sx={{ width: 16, height: 16 }}
                    />
                    {ALPHA2_COUNTRY_LIST[row.country.toUpperCase()] ||
                      row.country.toUpperCase()}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      borderBottom: `1px solid ${theme.palette.action.hover}`,
                    }}
                  >
                    {row.count.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Box
          sx={{
            height: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'text.secondary',
          }}
        >
          <Typography align="center">{t('common.loading')}</Typography>
        </Box>
      )}
    </Paper>
  );
};
