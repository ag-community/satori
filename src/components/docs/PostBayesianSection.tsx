import 'katex/dist/katex.min.css';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { BlockMath } from 'react-katex';

const SUBS = [
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

export const PostBayesianSection = () => {
  const { t } = useTranslation();

  return (
    <Box>
      <Typography variant="h6" fontWeight={700} mb={2}>
        {t('docs.post_bayesian.title')}
      </Typography>

      <Typography color="text.secondary" mb={3}>
        {t('docs.post_bayesian.desc')}
      </Typography>

      {SUBS.map((sub) => (
        <Box key={sub.hint} sx={{ mb: 3 }}>
          <Box sx={{ background: '#111', borderRadius: 2, p: 2 }}>
            <Box sx={{ '& .katex': { fontSize: '1em' } }}>
              <BlockMath math={sub.katex} />
            </Box>
          </Box>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 0.5, pl: 1 }}
          >
            {t(`docs.architecture.${sub.hint}`)}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};
