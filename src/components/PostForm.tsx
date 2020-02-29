import { useCallback, useContext, useEffect, useState } from 'react';
import { Button, Grid, makeStyles, TextField } from '@material-ui/core';
import { Post } from '@zoonk/models';
import { appLanguage, GlobalContext } from '@zoonk/utils';
import FormattingTips from './FormattingTips';
import FormBase from './FormBase';
import ImageUpload from './ImageUpload';
import LinkFormField from './LinkFormField';
import PostPreview from './PostPreview';
import TopicSelector from './TopicSelector';

const useStyles = makeStyles((theme) => ({
  column: {
    '& > *': {
      marginBottom: theme.spacing(2),
    },
  },
  header: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: theme.spacing(2),
  },
  previewBtn: { textAlign: 'right', marginLeft: theme.spacing(1) },
}));

interface PostFormProps {
  data?: Post.Get;
  saving: boolean;
  topicIds?: string[];
  onDelete?: () => void;
  onSubmit: (data: Post.EditableFields, topics: string[]) => void;
}

/**
 * Form for editing a post.
 */
const PostForm = ({
  data,
  saving,
  topicIds,
  onDelete,
  onSubmit,
}: PostFormProps) => {
  const { translate } = useContext(GlobalContext);
  const classes = useStyles();
  const [preview, setPreview] = useState<boolean>(false);
  const [content, setContent] = useState<string>(data?.content || '');
  const [title, setTitle] = useState<string>(data?.title || '');
  const [topics, setTopics] = useState<string[]>(data?.topics || []);
  const [links, setLinks] = useState<string[]>(
    data && data.links && data.links.length > 0 ? data.links : [''],
  );
  const valid = content.length > 0 && title.length > 0 && topics.length > 0;

  // Add the current topicId when adding a new item.
  useEffect(() => {
    if (topicIds && !data) {
      setTopics(topicIds);
    }
  }, [data, topicIds]);

  // Append an image to the current content.
  const insertImage = useCallback(
    (url: string) => {
      const img = `![post](${url} "")`;
      const newContent = `${content}\n${img}`;
      setContent(newContent);
    },
    [content],
  );

  if (preview) {
    return (
      <PostPreview
        data={{
          content,
          links,
          title,
          topics,
        }}
        onReturn={() => setPreview(false)}
      />
    );
  }

  return (
    <FormBase
      valid={valid}
      saving={saving}
      onDelete={onDelete}
      onSubmit={() => {
        onSubmit({ content, links, title }, topics);
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <div className={classes.header}>
            <FormattingTips />
            <Button
              variant="contained"
              color="primary"
              onClick={() => setPreview(true)}
              className={classes.previewBtn}
            >
              {translate('preview')}
            </Button>
          </div>
        </Grid>
      </Grid>

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
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            multiline
            rows={10}
            variant="outlined"
            fullWidth
            id="post-description"
            label={translate('content')}
            name="post-description"
          />

          <ImageUpload
            category="posts"
            hideImg
            img={null}
            label={translate('add_image')}
            onSave={insertImage}
          />
        </Grid>

        <Grid item xs={12} sm={6} className={classes.column}>
          <TopicSelector
            active={topicIds ? topicIds[0] : undefined}
            items={topics}
            language={data ? data.language : appLanguage}
            onChange={setTopics}
          />

          <LinkFormField
            links={links}
            onChange={(index, value) => {
              let newLinks: Array<string | null> = [...links];
              newLinks[index] = value;
              newLinks = newLinks.filter((item) => item !== null);
              setLinks(newLinks as string[]);
            }}
          />
        </Grid>
      </Grid>
    </FormBase>
  );
};

export default PostForm;
