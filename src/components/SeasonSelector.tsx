import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { api } from '@/lib/api/client';
import type { SeasonDto } from '@/lib/api/types';

interface SeasonSelectorProps {
  value: number;
  onChange: (seasonId: number) => void;
  minHeight?: number;
}

export function SeasonSelector({
  value,
  onChange,
  minHeight = 34,
}: SeasonSelectorProps) {
  const { t } = useTranslation();

  const { data: seasons } = useQuery({
    queryKey: ['seasons'],
    queryFn: () => api.fetchSeasons(),
  });

  const seasonLabel = (season: SeasonDto): string =>
    season.is_active ? `${season.name} ${t('season.active')}` : season.name;

  return (
    <FormControl size="small" sx={{ minWidth: 170 }}>
      <InputLabel id="season-filter-label">{t('season.select')}</InputLabel>
      <Select<number>
        labelId="season-filter-label"
        id="season-filter"
        size="small"
        value={value}
        label={t('season.select')}
        onChange={(e) => onChange(Number(e.target.value))}
        sx={{ minHeight }}
      >
        {seasons?.map((season) => (
          <MenuItem key={season.id} value={season.id}>
            {seasonLabel(season)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
