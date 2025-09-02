import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import SearchIcon from "@mui/icons-material/Search";
import { CardSection } from "../components/CardSection";
import { ActionCard } from "../components/ActionCard";
import AGLogoBlue from "../components/images/logos/ag_logo_blue.png";

export const HomePage = () => {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        maxWidth: 700,
        mx: "auto",
        py: 4,
        px: 2,
      }}
    >
      <CardSection
        backgroundLogo={AGLogoBlue}
        logoPosition="right"
        sx={{ 
          display: "flex", 
          alignItems: "center", 
          minHeight: 120,
        }}
      >
        <Typography variant="h5" fontWeight={700} mb={1}>
          {t("home.title")}
        </Typography>
        <Typography color="text.secondary">
          {t("home.subtitle")}
        </Typography>
      </CardSection>

      <CardSection>
        <Box display="flex" flexDirection={{ xs: "column", sm: "row" }}>
          <ActionCard
            icon={<LeaderboardIcon color="secondary" />}
            title={t("home.view_rankings")}
            description={t("home.view_rankings_desc")}
          />
          <ActionCard
            icon={<SearchIcon color="secondary" />}
            title={t("home.browse_matches")}
            description={t("home.browse_matches_desc")}
          />
          <ActionCard
            icon={<MenuBookIcon color="secondary" />}
            title={t("home.read_docs")}
            description={t("home.read_docs_desc")}
          />
        </Box>
      </CardSection>

      <CardSection 
        backgroundLogo={AGLogoBlue}
        logoPosition="left"
        sx={{ 
          display: "flex", 
          alignItems: "center", 
          minHeight: 120,
        }}
      >
        <Box>
          <Typography variant="h6" fontWeight={700}>
            {t("home.stats_title")}
          </Typography>
          <Typography color="text.secondary">
            {t("home.stats_desc")}
          </Typography>
        </Box>
      </CardSection>

      <CardSection 
        backgroundLogo={AGLogoBlue}
        logoPosition="right"
        sx={{ 
          display: "flex", 
          alignItems: "center", 
          minHeight: 120,
        }}
      >
        <Box>
          <Typography variant="h6" fontWeight={700}>
            {t("home.open_source_title")}
          </Typography>
          <Typography color="text.secondary">
            {t("home.open_source_desc")}
          </Typography>
        </Box>
      </CardSection>
    </Box>
  );
};