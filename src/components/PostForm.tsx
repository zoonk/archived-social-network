import { useContext, useEffect, useState } from 'react';
import { Grid, TextField } from '@material-ui/core';
import { Post } from '@zoonk/models';
import { appLanguage, GlobalContext } from '@zoonk/utils';
import FormBase from './FormBase';
import LinkFormField from './LinkFormField';
import TopicSelector from './TopicSelector';

interface PostFormProps {
  data?: Post.Get;
  format: Post.Format;
  saving: boolean;
  topicId?: string;
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
  topicId,
  onDelete,
  onSubmit,
}: PostFormProps) => {
  const { translate } = useContext(GlobalContext);
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
    if (topicId && !data) {
      setTopics([topicId]);
    }
  }, [data, topicId]);

  return (
    <FormBase
      valid={valid}
      saving={saving}
      onDelete={onDelete}
      onSubmit={() => {
        onSubmit({ content, format, links, title }, topics);
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12}>
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
        </Grid>

        <Grid item xs={12}>
          <TopicSelector
            active={topicId}
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
