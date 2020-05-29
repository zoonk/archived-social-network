import { useContext, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { throttle } from 'lodash';
import Delta from 'quill-delta';
import { Grid, makeStyles, TextField, Typography } from '@material-ui/core';
import { Post } from '@zoonk/models';
import { getLinkMetadata } from '@zoonk/services';
import { appLanguage, GlobalContext } from '@zoonk/utils';
import ImageUpload from './ImageUpload';
import TopicSelector from './TopicSelector';

const Editor = dynamic(() => import('./rich-text/Editor'), { ssr: false });

const useStyles = makeStyles((theme) => ({
  column: {
    '& > *': {
      marginBottom: theme.spacing(2),
    },
  },
}));

interface ReferencesFormProps {
  data?: Post.Get;
  saving: boolean;
  topicIds?: string[];
  onSubmit: (
    data: Omit<Post.EditableFields, 'pinned'>,
    topics: string[],
  ) => void;
}

const ReferencesForm = ({
  data,
  saving,
  topicIds,
  onSubmit,
}: ReferencesFormProps) => {
  const { translate } = useContext(GlobalContext);
  const classes = useStyles();
  const [content, setContent] = useState<Partial<Delta> | undefined>(
    data?.delta,
  );
  const [cover, setCover] = useState<string | null>(data?.cover || null);
  const [title, setTitle] = useState<string>(data?.title || '');
  const [topics, setTopics] = useState<string[]>(data?.topics || []);
  const [link, setLink] = useState<string>(data?.links?.[0] || '');
  const [linkValid, setLinkValid] = useState<boolean>();
  const valid = title.length > 0 && topics.length > 0;

  const throttled = useRef(
    throttle((url: string) => {
      getLinkMetadata(url).then((meta) => {
        setTitle(meta.title);
        setContent({ ops: [{ insert: meta?.description || '' }] });
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

      <Grid item xs={12} sm={6}>
        <Editor
          content={content as Delta}
          placeholder={translate('description')}
          toolbarPosition="bottom"
          valid={valid}
          saving={saving}
          onSave={(delta, html) => {
            onSubmit(
              {
                cover,
                delta,
                html,
                links: [link],
                subtitle: '',
                title,
              },
              topics,
            );
          }}
        />
      </Grid>
    </Grid>
  );
};

export default ReferencesForm;
