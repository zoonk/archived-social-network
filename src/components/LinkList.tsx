import { Grid, Typography } from '@material-ui/core';
import { Post } from '@zoonk/models';
import { theme } from '@zoonk/utils';
import LinkCard from './LinkCard';
import useTranslation from './useTranslation';

interface LinkListProps {
  sites: Post.Link[];
}

const LinkList = ({ sites }: LinkListProps) => {
  const translate = useTranslation();

  if (sites.length === 0) return null;

  return (
    <Grid container spacing={1} style={{ marginTop: theme.spacing(2) }}>
      <Typography variant="h6" gutterBottom>
        {translate('references')}
      </Typography>
      {sites.map((site) => (
        <Grid item key={site.url} xs={12}>
          <LinkCard site={site} />
        </Grid>
      ))}
    </Grid>
  );
};

export default LinkList;
