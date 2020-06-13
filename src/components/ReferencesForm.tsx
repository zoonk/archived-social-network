import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { throttle } from 'lodash';
import Quill from 'quill';
import Delta from 'quill-delta';
import {
  CircularProgress,
  Grid,
  makeStyles,
  TextField,
  Typography,
} from '@material-ui/core';
import { Post } from '@zoonk/models';
import { getLinkMetadata } from '@zoonk/services';
import {
  appLanguage,
  containsVimeoUrl,
  containsYoutubeUrl,
} from '@zoonk/utils';
import ImageUpload from './ImageUpload';
import TopicSelector from './TopicSelector';
import useTranslation from './useTranslation';

const EditorFixed = dynamic(() => import('./rich-text/EditorFixed'), {
  ssr: false,
});

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
  const translate = useTranslation();
  const editorRef = useRef<Quill>();
  const classes = useStyles();
  const [content, setContent] = useState<Delta | undefined>(data?.delta);
  const [cover, setCover] = useState<string | null>(data?.cover || null);
  const [title, setTitle] = useState<string>(data?.title || '');
  const [topics, setTopics] = useState<string[]>(data?.topics || []);
  const [link, setLink] = useState<string>(data?.links?.[0] || '');
  const [linkValid, setLinkValid] = useState<boolean>();
  const valid = title.length > 0 && topics.length > 0;

  const throttled = useRef(
    throttle((url: string) => {
      const delta = new Delta([]);
      let embed: string | null = null;
      const youtube = containsYoutubeUrl(url);
      const vimeo = containsVimeoUrl(url);
      if (youtube) embed = `https://youtube.com/embed/${youtube}`;
      if (vimeo) embed = `https://player.vimeo.com/video/${vimeo}`;
      if (embed) delta.insert({ video: embed });

      getLinkMetadata(url).then((meta) => {
        delta.insert(meta?.description || '');
        setContent(delta);
        setTitle(meta.title);
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

  const handleSubmit = () => {
    const delta = editorRef.current?.getContents();
    const html = editorRef.current?.root.innerHTML;

    if (delta && html) {
      onSubmit(
        { cover, delta, html, links: [link], subtitle: '', title },
        topics,
      );
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6} className={classes.column}>
        <TextField
          value={link}
          disabled={Boolean(data)}
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
        {link && !content && <CircularProgress />}
        {content && (
          <EditorFixed
            initialData={content}
            editorRef={editorRef}
            placeholder={translate('description')}
            valid={valid}
            saving={saving}
            onSave={handleSubmit}
          />
        )}
      </Grid>
    </Grid>
  );
};

export default ReferencesForm;
