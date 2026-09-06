import Box from '@mui/material/Box';
import MuiPagination from '@mui/material/Pagination';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';

interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
}: PaginationProps) {
  const { t } = useTranslation();
  const totalPages = pageSize > 0 ? Math.ceil(total / pageSize) : 1;
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);
  const clampedPage = Math.min(Math.max(page, 1), totalPages);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 1.5,
        mt: 1.5,
      }}
    >
      <Typography variant="body2" sx={{ m: 0, color: 'text.secondary' }}>
        {t('pagination.displayed_rows', { from, to, total })}
      </Typography>
      <MuiPagination
        size="small"
        count={totalPages}
        page={clampedPage}
        onChange={(_event, next) => onPageChange(next)}
        shape="rounded"
      />
    </Box>
  );
}
