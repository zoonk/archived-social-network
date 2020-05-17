import { useContext, useEffect, useState } from 'react';
import { Button, Card, CardContent, Typography } from '@material-ui/core';
import { GlobalContext, theme } from '@zoonk/utils';
import PostView from './PostView';

interface PostPreviewProps {
  content: string;
  onToggleExpand?: (value: boolean) => void;
}

/**
 * Display a post preview.
 */
const PostPreview = ({ content, onToggleExpand }: PostPreviewProps) => {
  const { translate } = useContext(GlobalContext);
  const [expand, setExpand] = useState<boolean>(false);

  useEffect(() => {
    if (onToggleExpand) onToggleExpand(expand);
  }, [expand, onToggleExpand]);

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
          <PostView content={content} />
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
