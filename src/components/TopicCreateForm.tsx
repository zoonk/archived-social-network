import { useState } from 'react';
import { Button, Grid, IconButton, Typography } from '@material-ui/core';
import { Help } from '@material-ui/icons';
import { WikipediaSearchItem } from '@zoonk/models';
import { appLanguage, theme } from '@zoonk/utils';
import TopicSearch from './TopicSearch';
import TopicSearchHelp from './TopicSearchHelp';
import useTranslation from './useTranslation';

interface TopicCreateFormProps {
  onSubmit: (item: WikipediaSearchItem) => void;
}

const TopicCreateForm = ({ onSubmit }: TopicCreateFormProps) => {
  const translate = useTranslation();
  const [help, setHelp] = useState<boolean>(false);
  const [selected, setSelected] = useState<WikipediaSearchItem>();

  const handleSelect = (item: WikipediaSearchItem | null) => {
    if (item) {
      setSelected(item);
    }
  };

  return (
    <form
      style={{
        width: '100%',
        marginTop: theme.spacing(3),
      }}
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        if (selected) onSubmit(selected);
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="body2" gutterBottom>
            {translate('topic_create_desc')}{' '}
            <IconButton onClick={() => setHelp(true)} size="small" edge="start">
              <Help fontSize="small" style={{ verticalAlign: 'middle' }} />
            </IconButton>
          </Typography>
          <TopicSearch language={appLanguage} onSelect={handleSelect} />
          <TopicSearchHelp open={help} onClose={() => setHelp(false)} />
        </Grid>
      </Grid>

      <Button
        disabled={!selected}
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        style={{ margin: theme.spacing(3, 0, 2) }}
      >
        {translate('topic_create')}
      </Button>
    </form>
  );
};

export default TopicCreateForm;
