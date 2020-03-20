import { useContext } from 'react';
import { makeStyles } from '@material-ui/core';
import {
  AllInclusive,
  Description,
  Language,
  Link,
  MenuBook,
  QuestionAnswer,
  School,
} from '@material-ui/icons';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import { Post } from '@zoonk/models';
import { GlobalContext } from '@zoonk/utils';

const useStyles = makeStyles((theme) => ({
  toggleContainer: {
    margin: theme.spacing(2, 0),
  },
}));

type Filter = Post.Category | 'all';

interface CategoryFilterProps {
  filterBy: Filter[];
  onSelect: (e: any, changes: Filter[]) => void;
}

const CategoryFilter = ({ filterBy, onSelect }: CategoryFilterProps) => {
  const { translate } = useContext(GlobalContext);
  const classes = useStyles();

  return (
    <div className={classes.toggleContainer}>
      <ToggleButtonGroup
        size="small"
        value={filterBy}
        onChange={onSelect}
        aria-label={translate('post_filter')}
      >
        <ToggleButton
          value="all"
          title={translate('all')}
          aria-label={translate('all')}
        >
          <AllInclusive />
        </ToggleButton>
        <ToggleButton
          value="references"
          title={translate('references')}
          aria-label={translate('references')}
        >
          <Link />
        </ToggleButton>
        <ToggleButton
          value="courses"
          title={translate('courses')}
          aria-label={translate('courses')}
        >
          <School />
        </ToggleButton>
        <ToggleButton
          value="books"
          title={translate('books')}
          aria-label={translate('books')}
        >
          <MenuBook />
        </ToggleButton>
        <ToggleButton
          value="posts"
          title={translate('posts')}
          aria-label={translate('posts')}
        >
          <Description />
        </ToggleButton>
        <ToggleButton
          value="examples"
          title={translate('real_life_examples')}
          aria-label={translate('real_life_examples')}
        >
          <Language />
        </ToggleButton>
        <ToggleButton
          value="questions"
          title={translate('questions')}
          aria-label={translate('questions')}
        >
          <QuestionAnswer />
        </ToggleButton>
      </ToggleButtonGroup>
    </div>
  );
};

export default CategoryFilter;
