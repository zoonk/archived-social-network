import { useContext, useEffect, useState } from 'react';
import { Button, Card, CardContent, Typography } from '@material-ui/core';
import { Post } from '@zoonk/models';
import { getLinkMetadata } from '@zoonk/services';
import { containsYoutubeUrl, GlobalContext, theme } from '@zoonk/utils';
import EditorView from './EditorView';
import LinkList from './LinkList';
import PostTitle from './PostTitle';
import TopicChips from './TopicChips';
import YoutubePlayer from './YoutubePlayer';

interface PostPreviewProps {
  data: Partial<Post.Get>;
  onToggleExpand?: (value: boolean) => void;
}

/**
 * Display a post preview.
 */
const PostPreview = ({ data, onToggleExpand }: PostPreviewProps) => {
  const { translate } = useContext(GlobalContext);
  const [expand, setExpand] = useState<boolean>(false);
  const [sites, setSites] = useState<Post.Link[]>([]);
  const { content, links, title, topics } = data;
  const youtube = links?.find((link) => containsYoutubeUrl(link));
  const youtubeId = containsYoutubeUrl(youtube);
  const rawLinks = JSON.stringify(links);

  useEffect(() => {
    if (onToggleExpand) onToggleExpand(expand);
  }, [expand, onToggleExpand]);

  useEffect(() => {
    // React doesn't compare arrays. We've converted it to string and parsed it back to array here.
    const linksArr = JSON.parse(rawLinks);

    if (linksArr && linksArr.length > 0) {
      const promises: Post.Link[] = linksArr
        .filter(Boolean)
        .map((link: string) => getLinkMetadata(link));
      Promise.all(promises).then(setSites);
    }
  }, [rawLinks]);

  return (
    <div
      style={{
        background: theme.palette.grey[100],
        padding: theme.spacing(2),
        borderRadius: '20px',
        marginTop: theme.spacing(1),
      }}
    >
      <Typography variant="h5" gutterBottom align="center">
        {translate('preview')}
      </Typography>
      <Card
        variant="outlined"
        style={{
          height: expand ? 'auto' : '500px',
          overflow: expand ? 'hidden' : 'auto',
        }}
      >
        <CardContent>
          <PostTitle>{title}</PostTitle>
          <TopicChips items={topics || []} />
          <EditorView content={content || ''} />
          {links && youtubeId && <YoutubePlayer id={youtubeId} />}
          <LinkList sites={sites} />
        </CardContent>
      </Card>

      {onToggleExpand && (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button color="primary" onClick={() => setExpand(!expand)}>
            {expand ? translate('collapse') : translate('expand')}
          </Button>
        </div>
      )}
    </div>
  );
};

export default PostPreview;
