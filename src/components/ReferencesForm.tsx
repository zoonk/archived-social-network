import { useContext, useEffect, useRef, useState } from 'react';
import { throttle } from 'lodash';
import { Grid, makeStyles, TextField, Typography } from '@material-ui/core';
import { Post } from '@zoonk/models';
import { getLinkMetadata } from '@zoonk/services';
import { appLanguage, GlobalContext } from '@zoonk/utils';
import FormattingTips from './FormattingTips';
import FormBase from './FormBase';
import ImageUpload from './ImageUpload';
import PostPreview from './PostPreview';
import TopicSelector from './TopicSelector';

const useStyles = makeStyles((theme) => ({
  column: {
    '& > *': {
      marginBottom: theme.spacing(2),
    },
  },
  preview: { marginTop: theme.spacing(2) },
}));

interface ReferencesFormProps {
  data?: Post.Get;
  saving: boolean;
  topicIds?: string[];
  onDelete?: () => void;
  onSubmit: (
    data: Omit<Post.EditableFields, 'pinned'>,
    topics: string[],
  ) => void;
}

const ReferencesForm = ({
  data,
  saving,
  topicIds,
  onDelete,
  onSubmit,
}: ReferencesFormProps) => {
  const { translate } = useContext(GlobalContext);
  const classes = useStyles();
  const [content, setContent] = useState<string>(data?.content || '');
  const [cover, setCover] = useState<string | null>(data?.cover || null);
  const [title, setTitle] = useState<string>(data?.title || '');
  const [topics, setTopics] = useState<string[]>(data?.topics || []);
  const [link, setLink] = useState<string>(data?.links?.[0] || '');
  const [linkValid, setLinkValid] = useState<boolean>();
  const valid = content.length > 0 && title.length > 0 && topics.length > 0;

  const throttled = useRef(
    throttle((url: string) => {
      getLinkMetadata(url).then((meta) => {
        setTitle(meta.title);
        setContent(meta.description || '');
        setCover(meta.image);
      });
    }, 1000),
  );

  // Add the current topicId when adding a new item.
  useEffect(() => {
    if (topicIds && !data) {
      setTopics(topicIds);
    }
  }, [data, topicIds]);

  useEffect(() => {
    try {
      const url = new URL(link);
      setLinkValid(true);

      // Don't update metadata when editing a reference.
      if (!data) {
        throttled.current(url.href);
      }
    } catch (e) {
      if (link) setLinkValid(false);
    }
  }, [data, link]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6} className={classes.column}>
        <FormBase
          valid={valid}
          saving={saving}
          onDelete={onDelete}
          onSubmit={() => {
            onSubmit(
              { content, cover, links: [link], subtitle: '', title },
              topics,
            );
          }}
        >
          <Grid item xs={12} className={classes.column}>
            <TextField
              value={link}
              onChange={(e) => setLink(e.target.value)}
              variant="outlined"
              fullWidth
              id="ref-link"
              label={translate('link')}
              error={linkValid === false}
              helperText={
                linkValid === false ? translate('link_invalid') : undefined
              }
              name="link"
              required
              type="url"
            />

            <TextField
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              variant="outlined"
              fullWidth
              id="ref-title"
              label={translate('title')}
              name="title"
              required
              type="text"
            />

            <Grid container spacing={1}>
              <Grid item xs={10} sm={11}>
                <TextField
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  multiline
                  rows={4}
                  variant="outlined"
                  fullWidth
                  id="ref-description"
                  label={translate('description')}
                  name="ref-description"
                />
              </Grid>

              <Grid item xs={2} sm={1}>
                <FormattingTips />
              </Grid>
            </Grid>

            <TopicSelector
              active={topicIds ? topicIds[0] : undefined}
              items={topics}
              language={data ? data.language : appLanguage}
              onChange={setTopics}
            />

            <div>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                {translate('cover')}
              </Typography>
              <ImageUpload
                id="ref-cover-img"
                img={cover}
                category="posts"
                onSave={setCover}
              />
            </div>
          </Grid>
        </FormBase>
      </Grid>

      <Grid item xs={12} sm={6} className={classes.preview}>
        <PostPreview content={content} />
      </Grid>
    </Grid>
  );
};

export default ReferencesForm;
