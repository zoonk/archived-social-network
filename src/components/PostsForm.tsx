import { useCallback, useContext, useEffect, useState } from 'react';
import { Grid, makeStyles, TextField, Typography } from '@material-ui/core';
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
  tips: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  expand: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  preview: { marginTop: theme.spacing(2) },
}));

interface PostsFormProps {
  data?: Post.Get;
  saving: boolean;
  topicIds?: string[];
  onDelete?: () => void;
  onSubmit: (
    data: Omit<Post.EditableFields, 'pinned'>,
    topics: string[],
  ) => void;
}

const PostsForm = ({
  data,
  saving,
  topicIds,
  onDelete,
  onSubmit,
}: PostsFormProps) => {
  const { translate } = useContext(GlobalContext);
  const classes = useStyles();
  const [expand, setExpand] = useState<boolean>(false);
  const [content, setContent] = useState<string>(data?.content || '');
  const [cover, setCover] = useState<string | null>(data?.cover || null);
  const [subtitle, setSubtitle] = useState<string>(data?.subtitle || '');
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
      const img = `[[ img src="${url}" align="center" alt="post" title="" ]]`;
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
            onSubmit({ content, cover, links, subtitle, title }, topics);
          }}
        >
          <Grid item xs={12} className={classes.column}>
            <Grid container spacing={1}>
              <Grid item xs={10} sm={11}>
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

              <Grid item xs={2} sm={1}>
                <FormattingTips />
              </Grid>
            </Grid>

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

            <TextField
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              multiline
              rows={expand ? undefined : 20}
              variant="outlined"
              fullWidth
              id="post-description"
              label={translate('content')}
              name="post-description"
            />

            <ImageUpload
              category="posts"
              id="add-post-img"
              hideImg
              img={null}
              label={translate('add_image')}
              onSave={insertImage}
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

      <Grid item xs={12} sm={6} className={classes.preview}>
        <PostPreview content={content} onToggleExpand={setExpand} />
      </Grid>
    </Grid>
  );
};

export default PostsForm;
