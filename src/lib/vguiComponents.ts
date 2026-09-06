import type { Components, Theme } from '@mui/material/styles';

import { CONTROL_HEIGHT } from './theme';
import type {} from './theme-augmentation';
import { bevel, pressedBevel } from './vgui';

export function vguiComponents(): Components<Theme> {
  return {
    MuiCssBaseline: {
      styleOverrides: (theme) => {
        const grey = theme
          .getColorSchemeSelector('greysteam')
          .replace(/\s*&\s*$/, '');
        return {
          [grey]: {
            body: {
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/images/hl2_background01.png')`,
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
            },
          },
        };
      },
    },

    MuiAutocomplete: {
      styleOverrides: {
        inputRoot: {
          '&.MuiOutlinedInput-root': {
            paddingTop: 0,
            paddingBottom: 0,
          },
          '& .MuiAutocomplete-input': {
            paddingTop: 0,
            paddingBottom: 0,
            height: 'auto',
          },
        },
        popupIndicator: {
          backgroundColor: 'transparent',
          '&:hover': {
            backgroundColor: 'transparent',
          },
        },
      },
    },

    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },

    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: ({ theme }) => ({
          textTransform: 'none',
          fontWeight: 'lighter',
          borderRadius: 0,
          minWidth: 75,
          height: CONTROL_HEIGHT,
          padding: '0 12px',
          justifyContent: 'flex-start',
          color: theme.vars.palette.text.primary,
          backgroundColor: theme.vars.palette.surface,
          ...bevel(theme, 'raised'),
          '&:active': {
            ...pressedBevel(theme),
            color: theme.vars.palette.primary.main,
            backgroundColor: theme.vars.palette.inset,
          },
          '&:hover': {
            backgroundColor: theme.vars.palette.surfaceLighter,
          },
          '&:disabled': {
            opacity: 0.5,
          },
        }),
      },
    },

    MuiIconButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 0,
          border: '1px solid transparent',
          color: theme.vars.palette.text.primary,
          '&:active': {
            backgroundColor: theme.vars.palette.inset,
          },
        }),
      },
    },

    MuiToggleButtonGroup: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 0,
          ...bevel(theme, 'raised'),
          backgroundColor: theme.vars.palette.surface,
        }),
      },
    },

    MuiToggleButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 0,
          border: 'none',
          textTransform: 'none',
          fontWeight: 'lighter',
          color: theme.vars.palette.text.primary,
          minHeight: CONTROL_HEIGHT,
          '&:hover': {
            backgroundColor: theme.vars.palette.surfaceLighter,
          },
          '&.Mui-selected': {
            color: theme.vars.palette.primary.main,
            backgroundColor: theme.vars.palette.inset,
            boxShadow: `inset 0 0 0 1px ${theme.vars.palette.divider}`,
            '&:hover': {
              backgroundColor: theme.vars.palette.inset,
            },
          },
        }),
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 0,
          backgroundColor: theme.vars.palette.inset,
          ...bevel(theme, 'sunken'),
          color: theme.vars.palette.text.primary,
          fontSize: '0.9rem',
          minHeight: CONTROL_HEIGHT,
          display: 'flex',
          alignItems: 'center',
          '& fieldset': {
            border: 'none',
          },
          '&.Mui-focused': {
            borderColor: theme.vars.palette.primary.main,
          },
        }),
        input: {
          padding: '0 8px',
        },
      },
    },

    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: 'inherit',
        },
      },
    },

    MuiMenuItem: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 0,
          fontSize: '0.9rem',
          color: theme.vars.palette.text.primary,
          '&:hover': {
            backgroundColor: theme.vars.palette.surfaceLighter,
          },
          '&.Mui-selected': {
            color: theme.vars.palette.primary.main,
            backgroundColor: theme.vars.palette.inset,
          },
        }),
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: theme.vars.palette.surface,
          color: theme.vars.palette.text.primary,
        }),
      },
    },

    MuiMenu: {
      styleOverrides: {
        paper: ({ theme }) => ({
          backgroundColor: theme.vars.palette.surface,
          ...bevel(theme, 'raised'),
          borderRadius: 0,
        }),
      },
    },

    MuiPaginationItem: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 0,
          backgroundColor: theme.vars.palette.surface,
          color: theme.vars.palette.text.primary,
          ...bevel(theme, 'raised'),
          '&:hover': {
            backgroundColor: theme.vars.palette.surfaceLighter,
          },
          '&.Mui-selected': {
            ...pressedBevel(theme),
            backgroundColor: theme.vars.palette.inset,
            color: theme.vars.palette.primary.main,
            '&:hover': {
              backgroundColor: theme.vars.palette.inset,
            },
          },
        }),
      },
    },

    MuiAvatar: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 0,
          backgroundColor: theme.vars.palette.surface,
        }),
      },
    },

    MuiTableCell: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderColor: theme.vars.palette.divider,
          padding: '4px 10px',
        }),
        head: ({ theme }) => ({
          color: theme.vars.palette.primary.main,
          textTransform: 'uppercase',
          fontSize: 12,
          letterSpacing: 1,
          fontWeight: 600,
          whiteSpace: 'nowrap',
          borderColor: theme.vars.palette.divider,
        }),
      },
    },

    MuiList: {
      styleOverrides: {
        root: {
          padding: 4,
        },
      },
    },
  };
}
