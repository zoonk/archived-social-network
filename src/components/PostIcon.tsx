import {
  Description,
  Language,
  Link,
  MenuBook,
  QuestionAnswer,
  School,
} from '@material-ui/icons';
import { Post } from '@zoonk/models';

interface PostIconProps {
  category: Post.Category;
  iconProps?: any;
}

const PostIcon = ({ category, iconProps }: PostIconProps) => {
  switch (category) {
    case 'references':
      return <Link {...iconProps} />;
    case 'courses':
      return <School {...iconProps} />;
    case 'books':
      return <MenuBook {...iconProps} />;
    case 'posts':
      return <Description {...iconProps} />;
    case 'examples':
      return <Language {...iconProps} />;
    case 'questions':
      return <QuestionAnswer {...iconProps} />;
    default:
      return <Description {...iconProps} />;
  }
};

export default PostIcon;
