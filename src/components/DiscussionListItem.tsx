import { useContext } from 'react';
import NextLink from 'next/link';
import {
  Avatar,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Link,
  Typography,
} from '@material-ui/core';
import { Comment } from '@zoonk/models';
import { GlobalContext } from '@zoonk/utils';

interface DiscussionListItemProps {
  comment: Comment.Get;
}

const DiscussionListItem = ({ comment }: DiscussionListItemProps) => {
  const { translate } = useContext(GlobalContext);
  const { content, createdAt, createdBy, postId } = comment;

  return (
    <Card variant="outlined">
      <CardHeader
        avatar={
          <NextLink
            href="/profile/[id]"
            as={`/profile/${createdBy.username}`}
            passHref
          >
            <a>
              <Avatar
                src={createdBy.photo || undefined}
                alt={createdBy.name}
                title={createdBy.name}
              />
            </a>
          </NextLink>
        }
        title={
          <NextLink
            href="/profile/[id]"
            as={`/profile/${createdBy.username}`}
            passHref
          >
            <Link color="textPrimary">
              <Typography variant="h6">{createdBy.name}</Typography>
            </Link>
          </NextLink>
        }
        subheader={createdAt}
      />
      <CardContent>
        <Typography variant="body2" color="textSecondary">
          {content}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <NextLink href="/posts/[id]" as={`/posts/${postId}`} passHref>
          <Button component="a" color="primary">
            {translate('see_discussion')}
          </Button>
        </NextLink>
      </CardActions>
    </Card>
  );
};

export default DiscussionListItem;
