import { MermaidDiagram } from '@lightenna/react-mermaid-diagram';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import type { Theme } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { Card } from '@/components/ui/Card';
import { SortableSections } from '@/components/ui/SortableSections';
import { usePageTitle } from '@/lib/usePageTitle';
import { bevel, insetPanel } from '@/lib/vgui';

const SECTION_ORDER = [
  'algorithm',
  'architecture',
  'post_bayesian',
  'changelog',
] as const;
type SectionId = (typeof SECTION_ORDER)[number];

export function DocsPage() {
  const { t } = useTranslation();
  usePageTitle(t('title.docs'));

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

  const postBayesian = [
    {
      katex:
        '\\text{base\\_delta} = \\mu_{\\text{wenglin}} - \\mu_{\\text{previous}}',
      hint: 'step4a_hint',
    },
    {
      katex: '\\text{perf\\_bonus} = \\text{performance\\_bonus(player, team)}',
      hint: 'step4b_hint',
    },
    {
      katex:
        '\\text{final\\_delta} = \\text{base\\_delta} + \\text{perf\\_bonus}',
      hint: 'step4c_hint',
    },
    {
      katex:
        '\\text{If winner and final\\_delta} < \\text{floor:}\\ \\text{final\\_delta} = \\text{winner\\_min\\_delta} \\times \\text{engagement\\_scale}',
      hint: 'step4d_hint',
    },
    {
      katex:
        '\\text{new\\_rating} = \\max(\\mu + \\text{final\\_delta}, \\text{rating\\_floor})',
      hint: 'step4e_hint',
    },
    {
      katex:
        '\\sigma_{\\text{new}} = \\sqrt{\\sigma_{\\text{wenglin}}^2 + \\tau^2}',
      hint: 'step4f_hint',
    },
  ];

  const mathBoxSx = (theme: Theme) => ({
    p: 1.5,
    my: 2,
    overflowX: 'auto',
    ...insetPanel(theme),
  });

  const smallLabelSx = {
    fontSize: 12,
    color: 'text.secondary',
    m: 0,
  } as const;

  const sections: Record<SectionId, { title: string; body: ReactNode }> = {
    algorithm: {
      title: t('docs.algorithm.title'),
      body: (
        <>
          <Typography sx={{ m: 0, mb: 1.5, color: 'text.secondary' }}>
            {t('docs.algorithm.intro')}
          </Typography>

          <Typography
            component="h4"
            variant="h6"
            sx={{ m: 0, mb: 1, fontWeight: 700 }}
          >
            {t('docs.algorithm.core_model')}
          </Typography>
          <TableContainer sx={{ overflowX: 'auto', mb: 2 }}>
            <Table size="small" sx={{ minWidth: 560 }}>
              <TableHead>
                <TableRow>
                  <TableCell>
                    {t('docs.algorithm.core_table.parameter')}
                  </TableCell>
                  <TableCell>{t('docs.algorithm.core_table.symbol')}</TableCell>
                  <TableCell>
                    {t('docs.algorithm.core_table.meaning')}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>{t('docs.algorithm.core_table.rating')}</TableCell>
                  <TableCell>μ (mu)</TableCell>
                  <TableCell sx={{ color: 'text.secondary' }}>
                    {t('docs.algorithm.params_mu')}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    {t('docs.algorithm.core_table.uncertainty')}
                  </TableCell>
                  <TableCell>σ (sigma)</TableCell>
                  <TableCell sx={{ color: 'text.secondary' }}>
                    {t('docs.algorithm.params_sigma')}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          <Typography
            component="h4"
            variant="h6"
            sx={{ m: 0, mb: 1, fontWeight: 700 }}
          >
            {t('docs.algorithm.equations')}
          </Typography>
          <Paper variant="outlined" sx={(theme) => mathBoxSx(theme)}>
            <Box sx={{ textAlign: 'center' }}>
              <BlockMath math="c = \sqrt{2\beta^2 + \sigma^2_{A_{total}} + \sigma^2_{B_{total}}}" />
              <BlockMath math="P(A\text{ wins}) = \frac{1}{1 + \exp\left(-\frac{\mu_{A_{total}} - \mu_{B_{total}}}{c}\right)}" />
            </Box>
          </Paper>

          <Typography variant="body2" sx={smallLabelSx}>
            {t('docs.algorithm.winning_team_label')}
          </Typography>
          <Paper variant="outlined" sx={(theme) => mathBoxSx(theme)}>
            <Box sx={{ textAlign: 'center' }}>
              <BlockMath math="\mu_{i_{new}} = \mu_i + \frac{\sigma_i^2}{c} \times \Omega" />
              <BlockMath math="\sigma_{i_{new}}^2 = \sigma_i^2 \times \left(1 - \frac{\sigma_i^2}{c^2} \times \Delta\right)" />
            </Box>
          </Paper>

          <Typography variant="body2" sx={smallLabelSx}>
            {t('docs.algorithm.losing_team_label')}
          </Typography>
          <Paper variant="outlined" sx={(theme) => mathBoxSx(theme)}>
            <Box sx={{ textAlign: 'center' }}>
              <BlockMath math="\mu_{j_{new}} = \mu_j - \frac{\sigma_j^2}{c} \times \Omega" />
              <BlockMath math="\sigma_{j_{new}}^2 = \sigma_j^2 \times \left(1 - \frac{\sigma_j^2}{c^2} \times \Delta\right)" />
            </Box>
          </Paper>

          <Paper variant="outlined" sx={(theme) => mathBoxSx(theme)}>
            <Box sx={{ textAlign: 'center' }}>
              <BlockMath math="\Omega = \frac{1}{1 + \exp\left(\frac{\mu_{B_{total}} - \mu_{A_{total}}}{c}\right)}" />
              <BlockMath math="\Delta = \Omega \times (1 - \Omega)" />
            </Box>
          </Paper>
          <Typography variant="body2" sx={smallLabelSx}>
            {t('docs.algorithm.surprise_factor_label')}
          </Typography>
          <Typography variant="body2" sx={{ ...smallLabelSx, mb: 2 }}>
            {t('docs.algorithm.information_gain_label')}
          </Typography>

          <Typography
            component="h4"
            variant="h6"
            sx={{ m: 0, mb: 1, fontWeight: 700 }}
          >
            {t('docs.algorithm.key_properties_title')}
          </Typography>
          <Box
            component="ul"
            sx={{ m: 0, mb: 1.5, color: 'text.secondary', pl: 2.5 }}
          >
            {[0, 1, 2, 3].map((i) => (
              <Box component="li" key={i} sx={{ mb: 0.5 }}>
                <Typography
                  component="p"
                  sx={{ m: 0, color: 'text.secondary' }}
                >
                  {t(`docs.algorithm.key_properties.${i}`)}
                </Typography>
              </Box>
            ))}
          </Box>

          <Typography
            component="h4"
            variant="h6"
            sx={{ m: 0, mb: 1, fontWeight: 700 }}
          >
            {t('docs.algorithm.beta_title')}
          </Typography>
          <Typography sx={{ m: 0, color: 'text.secondary' }}>
            {t('docs.algorithm.beta_desc')}
          </Typography>
        </>
      ),
    },
    architecture: {
      title: t('docs.architecture.title'),
      body: (
        <>
          <Typography sx={{ m: 0, mb: 1.5, color: 'text.secondary' }}>
            {t('docs.architecture.desc')}
          </Typography>

          <Box
            sx={(theme) => ({
              ...mathBoxSx(theme),
              display: 'flex',
              justifyContent: 'center',
            })}
          >
            <MermaidDiagram theme="dark">{diagram}</MermaidDiagram>
          </Box>

          {steps.map((step, i) => (
            <Box
              key={i}
              sx={{ mb: 1.5, display: 'flex', gap: 1.5, flexWrap: 'wrap' }}
            >
              <Box
                sx={(theme) => ({
                  width: 30,
                  height: 30,
                  minWidth: 30,
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: theme.vars.palette.surface,
                  ...bevel(theme, 'raised'),
                  color: theme.vars.palette.primary.main,
                  fontWeight: 700,
                  fontFamily: theme.typography.fontFamily,
                })}
              >
                {i + 1}
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography component="p" sx={{ m: 0, fontWeight: 700 }}>
                  {step.title}
                </Typography>
                <Typography
                  component="p"
                  sx={{ m: 0, color: 'text.secondary' }}
                >
                  {step.desc}
                </Typography>
              </Box>
            </Box>
          ))}
        </>
      ),
    },
    post_bayesian: {
      title: t('docs.post_bayesian.title'),
      body: (
        <>
          <Typography sx={{ m: 0, mb: 1.5, color: 'text.secondary' }}>
            {t('docs.post_bayesian.desc')}
          </Typography>

          {postBayesian.map((sub) => (
            <Box key={sub.hint} sx={{ mb: 2 }}>
              <Paper variant="outlined" sx={(theme) => mathBoxSx(theme)}>
                <Box sx={{ textAlign: 'center' }}>
                  <BlockMath math={sub.katex} />
                </Box>
              </Paper>
              <Typography variant="body2" sx={{ ...smallLabelSx, mt: 0.5 }}>
                {t(`docs.architecture.${sub.hint}`)}
              </Typography>
            </Box>
          ))}
        </>
      ),
    },
    changelog: {
      title: t('docs.changelog.title'),
      body: (
        <>
          {(['v1', 'v2', 'v3'] as const).map((v) => {
            const latest = v === 'v3';
            return (
              <Box
                key={v}
                sx={(theme) => ({
                  borderLeft: `4px solid ${
                    latest
                      ? theme.vars.palette.primary.main
                      : theme.vars.palette.line
                  }`,
                })}
              >
                <Card variant="inset">
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 1,
                      mb: 0.5,
                    }}
                  >
                    <Typography component="b" sx={{ fontWeight: 700 }}>
                      {t(`docs.changelog.${v}.title`)}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontSize: 12, color: 'text.secondary' }}
                    >
                      {t(`docs.changelog.${v}.date`)}
                    </Typography>
                  </Box>
                  <Typography component="p" sx={{ m: 0 }}>
                    {t(`docs.changelog.${v}.desc`)}
                  </Typography>
                </Card>
              </Box>
            );
          })}
        </>
      ),
    },
  };

  return <SortableSections sections={sections} initialOrder={SECTION_ORDER} />;
}
