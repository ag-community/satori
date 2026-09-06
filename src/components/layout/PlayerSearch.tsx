import SearchIcon from '@mui/icons-material/Search';
import Autocomplete, {
  type AutocompleteRenderInputParams,
} from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import { useQuery } from '@tanstack/react-query';
import {
  type HTMLAttributes,
  useEffect,
  useId,
  useMemo,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Avatar } from '@/components/ui/Avatar';
import { api } from '@/lib/api/client';
import type { PlayerDto } from '@/lib/api/types';
import { CONTROL_HEIGHT } from '@/lib/theme';

function useDebounced<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timeout);
  }, [value, delayMs]);
  return debounced;
}

function renderPlayerOption(
  props: HTMLAttributes<HTMLLIElement>,
  option: PlayerDto,
) {
  return (
    <li {...props}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
        <Avatar
          url={option.steam_avatar_url}
          alt={option.steam_name}
          size={24}
        />
        <Box
          component="span"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {option.steam_name}
        </Box>
      </Box>
    </li>
  );
}

export function PlayerSearch() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const id = useId();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const debouncedQuery = useDebounced(query.trim(), 300);

  const enabled = debouncedQuery.length >= 2;

  const { data, isFetching } = useQuery({
    queryKey: ['player-search', debouncedQuery],
    queryFn: () => api.searchPlayers(debouncedQuery),
    enabled,
    select: (players) => players.slice(0, 8),
  });

  const options = useMemo(() => data ?? [], [data]);

  return (
    <Autocomplete<PlayerDto, false, false, false>
      id={id}
      sx={{
        width: { xs: 130, sm: 150 },
        height: CONTROL_HEIGHT,
        '& .MuiOutlinedInput-root': {
          height: CONTROL_HEIGHT,
        },
      }}
      size="small"
      options={options}
      filterOptions={(x) => x}
      clearOnBlur
      getOptionLabel={(option) => option.steam_name}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      renderInput={(params: AutocompleteRenderInputParams) => (
        <TextField
          {...params}
          placeholder={t('navbar.search')}
          aria-label={t('navbar.search')}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <SearchIcon sx={{ color: 'action.active', mr: 1 }} />
            ),
            endAdornment: (
              <>
                {isFetching ? (
                  <CircularProgress color="inherit" size={18} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      renderOption={renderPlayerOption}
      open={open && enabled && (isFetching || options.length > 0)}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      onInputChange={(_event, value) => setQuery(value)}
      onChange={(_event, player) => {
        setOpen(false);
        if (player) navigate(`/player/${player.id}`);
      }}
      noOptionsText={t('navbar.no_results')}
      loading={isFetching}
      loadingText={t('navbar.searching')}
    />
  );
}
