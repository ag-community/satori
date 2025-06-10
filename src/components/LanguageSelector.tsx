import CheckIcon from "@mui/icons-material/Check";
import {
  Box,
  Button,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  useTheme,
} from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";

export interface Language {
  code: string;
  name: string;
}

const languages: Language[] = [
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
];

// Simple flag url helper (uses flagcdn.com)
function getFlagUrl(code: string) {
  // en -> us for flag
  const flagCode = code === "en" ? "us" : code;
  return `https://flagcdn.com/24x18/${flagCode}.png`;
}

export const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const currentLanguage =
    languages.find((lang) => i18n.language.startsWith(lang.code)) ||
    languages[0];

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    handleClose();
  };

  return (
    <Box>
      <Button
        aria-label="language-selector-button"
        id="language-selector-button"
        aria-controls={open ? "language-selector-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
        sx={{
          color: "white",
          textTransform: "none",
          minWidth: { xs: "40px", md: "auto" },
          px: { xs: 1, md: 2 },
          background: theme.palette.primary.main,
          borderRadius: 2,
          "&:hover": {
            background: theme.palette.secondary.main + "22",
          },
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <Box
            component="img"
            height={20}
            width={24}
            alt={currentLanguage.name}
            src={getFlagUrl(currentLanguage.code)}
            sx={{ borderRadius: "2px" }}
          />
        </Stack>
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "language-selector-button",
          sx: {
            bgcolor: theme.palette.primary.main,
            paddingTop: 0,
          },
        }}
        slotProps={{ paper: { sx: { width: 180, borderRadius: 3 } } }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
      >
        {languages.map((language) => (
          <MenuItem
            key={language.code}
            onClick={() => changeLanguage(language.code)}
            selected={i18n.language.startsWith(language.code)}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              p: 1.5,
            }}
          >
            <Box
              component="img"
              height={20}
              width={24}
              alt={language.name}
              src={getFlagUrl(language.code)}
              sx={{ borderRadius: "2px" }}
            />
            <ListItemText primary={language.name} />
            {i18n.language.startsWith(language.code) && (
              <ListItemIcon sx={{ minWidth: "auto", color: "success.main" }}>
                <CheckIcon fontSize="small" />
              </ListItemIcon>
            )}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};