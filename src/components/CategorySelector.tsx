import { Card, CardActionArea, Grid, Typography } from '@material-ui/core';
import {
  Description,
  Language,
  Link,
  MenuBook,
  QuestionAnswer,
  School,
} from '@material-ui/icons';
import { Post } from '@zoonk/models';
import { theme } from '@zoonk/utils';
import CollaborativeLabel from './CollaborativeLabel';
import useTranslation from './useTranslation';

interface CategorySelectorProps {
  onSelect: (category: Post.Category) => void;
}

interface CategoryList {
  collaborative?: boolean;
  name: string;
  value: Post.Category;
  icon: React.ReactNode;
}

const CategorySelector = ({ onSelect }: CategorySelectorProps) => {
  const translate = useTranslation();
  const categories: CategoryList[] = [
    {
      name: translate('teach_ref_title'),
      value: 'references',
      icon: <Link />,
      collaborative: true,
    },
    {
      name: translate('teach_article_title'),
      value: 'posts',
      icon: <Description />,
    },
    {
      name: translate('teach_course_title'),
      value: 'courses',
      icon: <School />,
      collaborative: true,
    },
    {
      name: translate('teach_book_title'),
      value: 'books',
      icon: <MenuBook />,
      collaborative: true,
    },
    {
      name: translate('teach_example_title'),
      value: 'examples',
      icon: <Language />,
      collaborative: true,
    },
    {
      name: translate('ask_question'),
      value: 'questions',
      icon: <QuestionAnswer />,
    },
  ];

  return (
    <Grid container spacing={2}>
      {categories.map((item) => (
        <Grid item xs={6} sm={4} key={item.value}>
          <CardActionArea
            onClick={() => onSelect(item.value)}
            style={{ height: '100%' }}
          >
            <Card
              variant="outlined"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: theme.spacing(4, 2),
                textAlign: 'center',
                height: '100%',
              }}
            >
              <div>{item.icon}</div>
              <Typography variant="h5" gutterBottom>
                {item.name}
              </Typography>
              {item.collaborative && <CollaborativeLabel />}
            </Card>
          </CardActionArea>
        </Grid>
      ))}

      <Grid item xs={12} style={{ display: 'flex', alignItems: 'center' }}>
        <CollaborativeLabel />
        <Typography
          variant="body2"
          color="textSecondary"
          style={{ marginLeft: theme.spacing(1) }}
        >
          = {translate('collaborative_helper')}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default CategorySelector;
