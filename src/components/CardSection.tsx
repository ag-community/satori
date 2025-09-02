import React from "react";
import { Box, BoxProps, useTheme } from "@mui/material";

interface CardSectionProps extends BoxProps {
  backgroundLogo?: string;
  backgroundLogoOpacity?: number;
  logoPosition?: "left" | "right";
}

export function CardSection({
  children,
  backgroundLogo,
  backgroundLogoOpacity = 0.8,
  logoPosition = "right",
  sx,
  ...rest
}: CardSectionProps) {
  const theme = useTheme();
  return (
    <Box
      sx={{
        background: theme.palette.primary.main,
        borderRadius: 3,
        p: { xs: 2, sm: 3 },
        mb: 3,
        position: "relative",
        overflow: "hidden",
        ...sx,
      }}
      {...rest}
    >
      {backgroundLogo && (
        <Box
          sx={{
            position: "absolute",
            [logoPosition === "left" ? "left" : "right"]: -30,
            top: logoPosition === "right" ? -30 : "auto",
            bottom: logoPosition === "left" ? -30 : "auto",
            width: 180,
            height: 180,
            zIndex: 0,
            overflow: "hidden",
          }}
        >
          <Box
            component="img"
            src={backgroundLogo}
            alt=""
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              opacity: backgroundLogoOpacity,
              filter: "brightness(0.7) saturate(1.5)",
              transform: "scale(1)",
            }}
          />
        </Box>
      )}

      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: backgroundLogo ? (logoPosition === "left" ? "80%" : "80%") : "100%",
          marginLeft: backgroundLogo ? (logoPosition === "right" ? 0 : "auto") : 0,
          marginRight: backgroundLogo ? (logoPosition === "left" ? 0 : "auto") : 0,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}