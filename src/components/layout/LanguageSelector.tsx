import Box from '@mui/material/Box';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { useTranslation } from 'react-i18next';

import { getFlagUrl } from '@/lib/countries';
import { availableLocales } from '@/lib/i18n';
import { CONTROL_HEIGHT } from '@/lib/theme';

type Locale = (typeof availableLocales)[number];

const languages: { code: Locale; flag: string; label: string }[] = [
  { code: 'en', flag: 'us', label: 'English' },
  { code: 'es', flag: 'es', label: 'Español' },
  { code: 'br', flag: 'br', label: 'Português (Brasil)' },
  { code: 'tr', flag: 'tr', label: 'Türkçe' },
  { code: 'ru', flag: 'ru', label: 'Русский' },
];

export function LanguageSelector() {
  const { i18n } = useTranslation();
  const current = i18n.language.split('-')[0] as Locale;
  const active = languages.find((l) => l.code === current) ?? languages[0];

  const options = languages.filter((l) => availableLocales.includes(l.code));

  return (
    <Select<Locale>
      size="small"
      value={active.code}
      onChange={(e) => {
        void i18n.changeLanguage(e.target.value);
      }}
      renderValue={(code) => {
        const l = languages.find((x) => x.code === code) ?? active;
        return <FlagImg code={l.flag} alt={l.label} />;
      }}
      title={active.label}
      inputProps={{ 'aria-label': 'language selector' }}
      sx={{ height: CONTROL_HEIGHT }}
    >
      {options.map((l) => (
        <MenuItem key={l.code} value={l.code}>
          <FlagImg code={l.flag} alt={l.label} />
          <ListItemText>{l.label}</ListItemText>
        </MenuItem>
      ))}
    </Select>
  );
}

function FlagImg({ code, alt }: { code: string; alt: string }) {
  return (
    <Box
      component="img"
      src={getFlagUrl(code.toUpperCase())}
      alt={alt}
      sx={{ height: 14, width: 18, borderRadius: '2px' }}
    />
  );
}
