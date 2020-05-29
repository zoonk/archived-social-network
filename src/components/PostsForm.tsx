import { Fragment, useContext, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import {
  Button,
  Grid,
  makeStyles,
  Paper,
  TextField,
  Typography,
} from '@material-ui/core';
import { Post } from '@zoonk/models';
import { appLanguage, GlobalContext } from '@zoonk/utils';
import ImageUpload from './ImageUpload';
import ShowCard from './ShowCard';
import TopicSelector from './TopicSelector';

const Editor = dynamic(() => import('./rich-text/Editor'), { ssr: false });

const useStyles = makeStyles((theme) => ({
  paper: { padding: theme.spacing(2) },
  column: {
    '& > *': {
      marginBottom: theme.spacing(2),
    },
  },
  topics: {
    display: 'flex',
    flexDirection: 'column',
  },
  hide: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
}));

interface PostsFormProps {
  data?: Post.Get;
  saving: boolean;
  topicIds?: string[];
  onSubmit: (
    data: Omit<Post.EditableFields, 'pinned'>,
    topics: string[],
  ) => void;
}

const PostsForm = ({ data, saving, topicIds, onSubmit }: PostsFormProps) => {
  const { translate } = useContext(GlobalContext);
  const classes = useStyles();
  const [settings, setSettings] = useState<boolean>(!data);
  const [cover, setCover] = useState<string | null>(data?.cover || null);
  const [subtitle, setSubtitle] = useState<string>(data?.subtitle || '');
  const [title, setTitle] = useState<string>(data?.title || '');
  const [topics, setTopics] = useState<string[]>(data?.topics || []);
  const valid = title.length > 0 && topics.length > 0;

  // Add the current topicId when adding a new item.
  useEffect(() => {
    if (topicIds && !data) {
      setTopics(topicIds);
    }
  }, [data, topicIds]);

  return (
    <Fragment>
      {!settings && (
        <ShowCard
          title={title || translate('settings')}
          onShow={() => setSettings(true)}
        />
      )}

      {settings && (
        <Paper variant="outlined" className={classes.paper}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} className={classes.column}>
              <TextField
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                variant="outlined"
                fullWidth
                id="post-title"
                label={translate('title')}
                name="title"
                required
                type="text"
              />
              <TextField
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                multiline
                variant="outlined"
                fullWidth
                id="post-subtitle"
                label={translate('subtitle')}
                name="post-subtitle"
                type="textarea"
              />
              <div>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  {translate('cover')}
                </Typography>
                <ImageUpload
                  id="add-cover-img"
                  img={cover}
                  category="posts"
                  onSave={setCover}
                />
              </div>
            </Grid>
            <Grid item xs={12} sm={6} className={classes.topics}>
              <TopicSelector
                active={topicIds ? topicIds[0] : undefined}
                items={topics}
                language={data ? data.language : appLanguage}
                onChange={setTopics}
              />
              <div style={{ flex: 1 }} />
              <div className={classes.hide}>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => setSettings(false)}
                >
                  {translate('hide')}
                </Button>
              </div>
            </Grid>
          </Grid>
        </Paper>
      )}

      <Editor
        content={data?.delta}
        toolbarPosition="bottom"
        valid={valid}
        saving={saving}
        onSave={(delta, html) => {
          onSubmit(
            {
              cover,
              delta,
              html,
              links: null,
              subtitle,
              title,
            },
            topics,
          );
        }}
      />
    </Fragment>
  );
};

export default PostsForm;
