import { Box } from '@mui/material';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { CardSection } from '../components/CardSection';
import { AlgorithmSection } from '../components/docs/AlgorithmSection';
import { ArchitectureSection } from '../components/docs/ArchitectureSection';
import { ChangelogSection } from '../components/docs/ChangelogSection';
import { PostBayesianSection } from '../components/docs/PostBayesianSection';

const SECTIONS: { id: string; comp: React.JSXElementConstructor<object> }[] = [
  { id: 'algorithm', comp: AlgorithmSection },
  { id: 'architecture', comp: ArchitectureSection },
  { id: 'post_bayesian', comp: PostBayesianSection },
  { id: 'changelog', comp: ChangelogSection },
];

export const DocsPage = () => {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = t('title.docs');
  }, [t]);

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', py: 4, px: 2 }}>
      {SECTIONS.map(({ id, comp: Comp }) => (
        <CardSection key={id}>
          <Comp />
        </CardSection>
      ))}
    </Box>
  );
};
