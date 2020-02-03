import { useCallback, useContext, useEffect, useState } from 'react';
import { Button, Grid, TextField } from '@material-ui/core';
import { Post } from '@zoonk/models';
import { appLanguage, GlobalContext, theme } from '@zoonk/utils';
import FormBase from './FormBase';
import ImageUpload from './ImageUpload';
import LinkFormField from './LinkFormField';
import PostPreview from './PostPreview';
import TopicSelector from './TopicSelector';

interface PostFormProps {
  data?: Post.Get;
  format: Post.Format;
  saving: boolean;
  topicIds?: string[];
  onDelete?: () => void;
  onSubmit: (
    data: Omit<Post.EditableFields, 'chapters' | 'order'>,
    topics: string[],
  ) => void;
}

/**
 * Form for editing a post.
 */
const PostForm = ({
  data,
  format,
  saving,
  topicIds,
  onDelete,
  onSubmit,
}: PostFormProps) => {
  const { translate } = useContext(GlobalContext);
  const [preview, setPreview] = useState<boolean>(false);
  const [content, setContent] = useState<string>(data?.content || '');
  const [title, setTitle] = useState<string>(data?.title || '');
  const [topics, setTopics] = useState<string[]>(data?.topics || []);
  const [links, setLinks] = useState<string[]>(data?.links || ['']);
  const hasUrl = format === 'link' || format === 'video';
  const valid =
    content.length > 0 &&
    title.length > 0 &&
    topics.length > 0 &&
    (!hasUrl || links.length > 0);

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
        onSubmit({ content, format, links, title }, topics);
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginBottom: theme.spacing(2),
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={() => setPreview(true)}
          style={{ textAlign: 'right' }}
        >
          {translate('preview')}
        </Button>
      </div>

      <Grid container spacing={2}>
        <Grid item xs={12}>
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
        </Grid>

        {(format === 'link' || format === 'video') && (
          <Grid item xs={12}>
            <LinkFormField
              format={format}
              links={links}
              onChange={(index, value) => {
                let newLinks: Array<string | null> = [...links];
                newLinks[index] = value;
                newLinks = newLinks.filter((item) => item !== null);
                setLinks(newLinks as string[]);
              }}
            />
          </Grid>
        )}

        <Grid item xs={12}>
          <TextField
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            multiline
            rows={hasUrl ? 3 : 10}
            variant="outlined"
            fullWidth
            id="post-description"
            label={hasUrl ? translate('description') : translate('content')}
            name="post-description"
          />

          {!hasUrl && (
            <ImageUpload
              category="posts"
              hideImg
              img={null}
              label={translate('add_image')}
              onSave={insertImage}
            />
          )}
        </Grid>

        <Grid item xs={12}>
          <TopicSelector
            active={topicIds ? topicIds[0] : undefined}
            items={topics}
            language={data ? data.language : appLanguage}
            onChange={setTopics}
          />
        </Grid>
      </Grid>
    </FormBase>
  );
};

export default PostForm;
