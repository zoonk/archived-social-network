import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { throttle } from 'lodash';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { Grid, makeStyles, TextField, Typography } from '@material-ui/core';
import { Post } from '@zoonk/models';
import { searchPost } from '@zoonk/services';
import { appLanguage, GlobalContext } from '@zoonk/utils';
import FormattingTips from './FormattingTips';
import FormBase from './FormBase';
import ImageUpload from './ImageUpload';
import LinkFormField from './LinkFormField';
import PostPreview from './PostPreview';
import TopicSelector from './TopicSelector';

const PostSelector = dynamic(() => import('./PostSelector'));

const useStyles = makeStyles((theme) => ({
  column: {
    '& > *': {
      marginBottom: theme.spacing(2),
    },
  },
  header: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
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
  const { query } = useRouter();
  const category = String(query.category) as Post.Category;
  const classes = useStyles();
  const [content, setContent] = useState<string>(data?.content || '');
  const [title, setTitle] = useState<string>(data?.title || '');
  const [topics, setTopics] = useState<string[]>(data?.topics || []);
  const [links, setLinks] = useState<string[]>(
    data && data.links && data.links.length > 0 ? data.links : [''],
  );
  const [search, setSearch] = useState<ReadonlyArray<Post.Index>>([]);
  const valid = content.length > 0 && title.length > 0 && topics.length > 0;
  const lessonCategories = ['examples', 'lessons'];
  const isLesson = lessonCategories.includes(category);

  const throttled = useRef(
    throttle((searchTerm: string) => {
      searchPost(searchTerm, category).then(setSearch);
    }, 1000),
  );

  // Search existing posts when creating a new one.
  useEffect(() => {
    if (!data && isLesson && title.length > 3) {
      throttled.current(title);
    }
  }, [data, isLesson, title]);

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

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6} className={classes.column}>
        <FormBase
          valid={valid}
          saving={saving}
          onDelete={onDelete}
          onSubmit={() => {
            onSubmit({ content, links, title }, topics);
          }}
        >
          <Grid item xs={12} className={classes.column}>
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

            {isLesson && <PostSelector posts={search} />}

            <TextField
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              multiline
              rows={20}
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
        </FormBase>
      </Grid>

      <Grid item xs={12} sm={6} className={classes.column}>
        <div className={classes.header}>
          <Typography variant="h5">{translate('preview')}</Typography>
          <FormattingTips />
        </div>
        <PostPreview
          data={{
            content,
            links,
            title,
            topics,
          }}
        />
      </Grid>
    </Grid>
  );
};

export default PostForm;
