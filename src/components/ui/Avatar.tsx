import PersonIcon from '@mui/icons-material/Person';
import MuiAvatar from '@mui/material/Avatar';

export function Avatar({
  url,
  alt,
  size = 64,
}: {
  url?: string;
  alt: string;
  size?: number;
}) {
  return (
    <MuiAvatar
      variant="square"
      src={url}
      alt={alt}
      slotProps={{ img: { loading: 'lazy' } }}
      sx={{
        width: size,
        height: size,
        border: 'solid 2px',
        borderColor: 'divider',
        bgcolor: 'surface',
      }}
    >
      <PersonIcon
        sx={{ width: size * 0.6, height: size * 0.6, color: 'surfaceLighter' }}
      />
    </MuiAvatar>
  );
}
