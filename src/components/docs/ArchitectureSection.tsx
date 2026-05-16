import { MermaidDiagram } from '@lightenna/react-mermaid-diagram';
import { Box, Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';

export const ArchitectureSection = () => {
  const theme = useTheme();
  const { t } = useTranslation();

  const diagram = `
flowchart TD
  Input["Input: blue_team[], red_team[], outcome"]
  Input --> Guard["${t('docs.architecture.diagram.step1')}<br/>assert!(teams not empty)"]
  Guard --> Convert["${t('docs.architecture.diagram.step2')}<br/>PlayerMatchData → WengLinRating"]
  Convert --> Bayesian["${t('docs.architecture.diagram.step3')}<br/>weng_lin_two_teams()"]
  Bayesian --> Post["${t('docs.architecture.diagram.step4')}"]
  Post --> Output["Output: Vec&lt;RatingResult&gt;"]
`;

  const steps = [
    {
      title: t('docs.architecture.step1_title'),
      desc: t('docs.architecture.step1_desc'),
    },
    {
      title: t('docs.architecture.step2_title'),
      desc: t('docs.architecture.step2_desc'),
    },
    {
      title: t('docs.architecture.step3_title'),
      desc: t('docs.architecture.step3_desc'),
    },
    {
      title: t('docs.architecture.step4_title'),
      desc: t('docs.architecture.step4_desc'),
    },
  ];

  return (
    <Box>
      <Typography variant="h6" fontWeight={700} mb={2}>
        {t('docs.architecture.title')}
      </Typography>

      <Typography color="text.secondary" mb={3}>
        {t('docs.architecture.desc')}
      </Typography>

      <Box
        sx={{
          background: '#111',
          borderRadius: 2,
          p: 2,
          mb: 3,
          overflow: 'auto',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <MermaidDiagram theme="dark">{diagram}</MermaidDiagram>
      </Box>

      {steps.map((step, i) => (
        <Box
          key={i}
          sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'flex-start' }}
        >
          <Box
            sx={{
              minWidth: 36,
              height: 36,
              borderRadius: '50%',
              background: theme.palette.secondary.main,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.85rem',
              mt: 0.3,
            }}
          >
            {i + 1}
          </Box>
          <Box>
            <Typography fontWeight={700} mb={0.5}>
              {step.title}
            </Typography>
            {'desc' in step && (
              <Typography color="text.secondary">{step.desc}</Typography>
            )}
            {'subs' in step && (
              <Box
                component="ul"
                sx={{ color: 'text.secondary', pl: 2, mt: 0.5 }}
              >
                {step.subs?.map((sub, j) => (
                  <Box component="li" key={j}>
                    <Typography color="text.secondary">{sub}</Typography>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </Box>
      ))}
    </Box>
  );
};
