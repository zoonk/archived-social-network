import { Post } from '@zoonk/models';
import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
} from '@material-ui/core';
import { isInternal, markdownToText, theme } from '@zoonk/utils';

interface LinkCardProps {
  site: Post.Link;
}

const LinkCard = ({ site }: LinkCardProps) => {
  const { description, image, title, url } = site;

  return (
    <Card variant="outlined">
      <CardActionArea
        component="a"
        href={url}
        target={isInternal(url) ? '_self' : '_blank'}
        rel={isInternal(url) ? undefined : 'noopener noreferrer'}
      >
        <CardContent style={{ display: 'flex', padding: theme.spacing(1) }}>
          {image && (
            <div
              style={{
                background: `url(${image}) no-repeat center center`,
                backgroundSize: 'cover',
                width: '100px',
                minWidth: '100px',
                marginRight: theme.spacing(1),
              }}
            />
          )}
          <div style={{ minWidth: 0 }}>
            <Typography gutterBottom variant="h6" noWrap>
              {title}
            </Typography>
            <Typography variant="body2">
              {markdownToText(description || '').slice(0, 200)}
            </Typography>
          </div>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default LinkCard;
