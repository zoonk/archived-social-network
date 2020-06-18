import { useEffect, useMemo, useRef, useState } from 'react';
import { throttle } from 'lodash';
import { Node } from 'slate';
import { Slate } from 'slate-react';
import { Grid, makeStyles, TextField, Typography } from '@material-ui/core';
import { Post } from '@zoonk/models';
import { getLinkMetadata } from '@zoonk/services';
import {
  appLanguage,
  containsVimeoUrl,
  containsYoutubeUrl,
  getEmptyEditor,
} from '@zoonk/utils';
import ImageUpload from './ImageUpload';
import Editor from './rich-text/Editor';
import ToolbarFixed from './rich-text/ToolbarFixed';
import { insertVideo } from './rich-text/videos';
import { withEditor } from './rich-text/utils';
import TopicSelector from './TopicSelector';
import useTranslation from './useTranslation';

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
  const classes = useStyles();
  const [content, setContent] = useState<Node[]>(
    data?.content || getEmptyEditor(),
  );
  const editor = useMemo(() => withEditor(), []);
  const [cover, setCover] = useState<string | null>(data?.cover || null);
  const [title, setTitle] = useState<string>(data?.title || '');
  const [topics, setTopics] = useState<string[]>(data?.topics || []);
  const [link, setLink] = useState<string>(data?.links?.[0] || '');
  const [linkValid, setLinkValid] = useState<boolean>();
  const valid = title.length > 0 && topics.length > 0;

  const throttled = useRef(
    throttle((url: string) => {
      const youtube = containsYoutubeUrl(url);
      const vimeo = containsVimeoUrl(url);
      const video = youtube || vimeo;

      if (video) {
        insertVideo(editor, video);
      }

      getLinkMetadata(url).then((meta) => {
        if (meta.description) editor.insertText(meta.description);
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
    onSubmit(
      {
        content: JSON.stringify(content),
        cover,
        links: [link],
        subtitle: '',
        title,
      },
      topics,
    );
  };

  return (
    <Slate editor={editor} value={content} onChange={setContent}>
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
          <ToolbarFixed valid={valid} saving={saving} onSave={handleSubmit} />
          <Editor placeholder={translate('description')} fixed />
        </Grid>
      </Grid>
    </Slate>
  );
};

export default ReferencesForm;
