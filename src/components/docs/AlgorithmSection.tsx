import 'katex/dist/katex.min.css';
import { Box, Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { BlockMath } from 'react-katex';

export const AlgorithmSection = () => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Box>
      <Typography variant="h6" fontWeight={700} mb={2}>
        {t('docs.algorithm.title')}
      </Typography>

      <Typography color="text.secondary" mb={2}>
        {t('docs.algorithm.intro')}
      </Typography>

      <Typography variant="subtitle1" fontWeight={700} mt={3} mb={1}>
        {t('docs.algorithm.core_model')}
      </Typography>

      <Box
        sx={{
          background: theme.palette.background.default,
          borderRadius: 2,
          p: 2,
          mb: 2,
          overflow: 'auto',
        }}
      >
        <Box
          component="table"
          sx={{ width: '100%', borderCollapse: 'collapse' }}
        >
          <thead>
            <tr>
              <Box
                component="th"
                sx={{
                  textAlign: 'left',
                  p: 1,
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  color: 'white',
                  fontWeight: 700,
                }}
              >
                {t('docs.algorithm.core_table.parameter')}
              </Box>
              <Box
                component="th"
                sx={{
                  textAlign: 'left',
                  p: 1,
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  color: 'white',
                  fontWeight: 700,
                }}
              >
                {t('docs.algorithm.core_table.symbol')}
              </Box>
              <Box
                component="th"
                sx={{
                  textAlign: 'left',
                  p: 1,
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  color: 'white',
                  fontWeight: 700,
                }}
              >
                {t('docs.algorithm.core_table.meaning')}
              </Box>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Box
                component="td"
                sx={{
                  p: 1,
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  color: 'white',
                }}
              >
                {t('docs.algorithm.core_table.rating')}
              </Box>
              <Box
                component="td"
                sx={{
                  p: 1,
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  color: 'white',
                }}
              >
                μ (mu)
              </Box>
              <Box
                component="td"
                sx={{
                  p: 1,
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  color: 'text.secondary',
                }}
              >
                {t('docs.algorithm.params_mu')}
              </Box>
            </tr>
            <tr>
              <Box
                component="td"
                sx={{
                  p: 1,
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  color: 'white',
                }}
              >
                {t('docs.algorithm.core_table.uncertainty')}
              </Box>
              <Box
                component="td"
                sx={{
                  p: 1,
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  color: 'white',
                }}
              >
                σ (sigma)
              </Box>
              <Box
                component="td"
                sx={{
                  p: 1,
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  color: 'text.secondary',
                }}
              >
                {t('docs.algorithm.params_sigma')}
              </Box>
            </tr>
          </tbody>
        </Box>
      </Box>

      <Typography variant="subtitle1" fontWeight={700} mt={3} mb={1}>
        {t('docs.algorithm.equations')}
      </Typography>

      <Box
        sx={{
          background: '#111',
          borderRadius: 2,
          p: 3,
          mb: 2,
          overflow: 'auto',
        }}
      >
        <Box sx={{ '& .katex': { fontSize: '1em' } }}>
          <div style={{ textAlign: 'center', marginBottom: 12 }}>
            <BlockMath math="c = \sqrt{2\beta^2 + \sigma^2_{A_{total}} + \sigma^2_{B_{total}}}" />
          </div>
          <div style={{ textAlign: 'center' }}>
            <BlockMath math="P(A\text{ wins}) = \frac{1}{1 + \exp\left(-\frac{\mu_{A_{total}} - \mu_{B_{total}}}{c}\right)}" />
          </div>
        </Box>
      </Box>

      <Typography variant="body2" sx={{ color: 'grey.400', mb: 1 }}>
        {t('docs.algorithm.winning_team_label')}
      </Typography>

      <Box
        sx={{
          background: '#111',
          borderRadius: 2,
          p: 3,
          mb: 2,
          overflow: 'auto',
        }}
      >
        <Box sx={{ '& .katex': { fontSize: '1em' } }}>
          <div style={{ textAlign: 'center', marginBottom: 12 }}>
            <BlockMath math="\mu_{i_{new}} = \mu_i + \frac{\sigma_i^2}{c} \times \Omega" />
          </div>
          <div style={{ textAlign: 'center' }}>
            <BlockMath math="\sigma_{i_{new}}^2 = \sigma_i^2 \times \left(1 - \frac{\sigma_i^2}{c^2} \times \Delta\right)" />
          </div>
        </Box>
      </Box>

      <Typography variant="body2" sx={{ color: 'grey.400', mb: 1 }}>
        {t('docs.algorithm.losing_team_label')}
      </Typography>

      <Box
        sx={{
          background: '#111',
          borderRadius: 2,
          p: 3,
          mb: 2,
          overflow: 'auto',
        }}
      >
        <Box sx={{ '& .katex': { fontSize: '1em' } }}>
          <div style={{ textAlign: 'center', marginBottom: 12 }}>
            <BlockMath math="\mu_{j_{new}} = \mu_j - \frac{\sigma_j^2}{c} \times \Omega" />
          </div>
          <div style={{ textAlign: 'center' }}>
            <BlockMath math="\sigma_{j_{new}}^2 = \sigma_j^2 \times \left(1 - \frac{\sigma_j^2}{c^2} \times \Delta\right)" />
          </div>
        </Box>
      </Box>

      <Box
        sx={{
          background: '#111',
          borderRadius: 2,
          p: 3,
          mb: 1,
          overflow: 'auto',
        }}
      >
        <Box sx={{ '& .katex': { fontSize: '1em' } }}>
          <div style={{ textAlign: 'center', marginBottom: 12 }}>
            <BlockMath math="\Omega = \frac{1}{1 + \exp\left(\frac{\mu_{B_{total}} - \mu_{A_{total}}}{c}\right)}" />
          </div>
          <div style={{ textAlign: 'center' }}>
            <BlockMath math="\Delta = \Omega \times (1 - \Omega)" />
          </div>
        </Box>
      </Box>

      <Typography variant="body2" sx={{ color: 'grey.400', mb: 0.5 }}>
        {t('docs.algorithm.surprise_factor_label')}
      </Typography>
      <Typography variant="body2" sx={{ color: 'grey.400', mb: 2 }}>
        {t('docs.algorithm.information_gain_label')}
      </Typography>

      <Typography variant="subtitle1" fontWeight={700} mt={3} mb={1}>
        {t('docs.algorithm.key_properties_title')}
      </Typography>

      <Box component="ul" sx={{ color: 'text.secondary', pl: 2 }}>
        {[0, 1, 2, 3].map((i) => (
          <Box component="li" key={i} sx={{ mb: 0.5 }}>
            <Typography color="text.secondary">
              {t(`docs.algorithm.key_properties.${i}`)}
            </Typography>
          </Box>
        ))}
      </Box>

      <Typography variant="subtitle1" fontWeight={700} mt={3} mb={1}>
        {t('docs.algorithm.beta_title')}
      </Typography>
      <Typography color="text.secondary">
        {t('docs.algorithm.beta_desc')}
      </Typography>
    </Box>
  );
};
