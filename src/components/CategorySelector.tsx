import { useContext } from 'react';
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
import { GlobalContext, theme } from '@zoonk/utils';

interface CategorySelectorProps {
  onSelect: (category: Post.Category) => void;
}

interface CategoryList {
  name: string;
  value: Post.Category;
  icon: React.ReactNode;
}

/**
 * Dropdown menu for selecting a post category.
 */
const CategorySelector = ({ onSelect }: CategorySelectorProps) => {
  const { translate } = useContext(GlobalContext);
  const categories: CategoryList[] = [
    {
      name: translate('references_links'),
      value: 'references',
      icon: <Link />,
    },
    { name: translate('posts'), value: 'posts', icon: <Description /> },
    { name: translate('courses'), value: 'courses', icon: <School /> },
    { name: translate('books'), value: 'books', icon: <MenuBook /> },
    {
      name: translate('real_life_examples'),
      value: 'examples',
      icon: <Language />,
    },
    {
      name: translate('questions'),
      value: 'questions',
      icon: <QuestionAnswer />,
    },
  ];

  return (
    <Grid container spacing={2}>
      {categories.map((item) => (
        <Grid item xs={6} sm={4} key={item.value}>
          <CardActionArea onClick={() => onSelect(item.value)}>
            <Card
              variant="outlined"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '150px',
                padding: theme.spacing(1),
                textAlign: 'center',
                backgroundColor: theme.palette.primary.main,
              }}
            >
              <div style={{ color: 'white' }}>{item.icon}</div>
              <Typography variant="h5" style={{ color: 'white' }}>
                {item.name}
              </Typography>
            </Card>
          </CardActionArea>
        </Grid>
      ))}
    </Grid>
  );
};

export default CategorySelector;
