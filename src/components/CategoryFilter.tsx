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
  const classes = useStyles();

  return (
    <div className={classes.toggleContainer}>
      <ToggleButtonGroup
        size="small"
        value={filterBy}
        onChange={onSelect}
        aria-label="text formatting"
      >
        <ToggleButton value="all" aria-label="all">
          <AllInclusive />
        </ToggleButton>
        <ToggleButton value="references" aria-label="link">
          <Link />
        </ToggleButton>
        <ToggleButton value="courses" aria-label="italic">
          <School />
        </ToggleButton>
        <ToggleButton value="books" aria-label="underlined">
          <MenuBook />
        </ToggleButton>
        <ToggleButton value="posts" aria-label="color">
          <Description />
        </ToggleButton>
        <ToggleButton value="examples" aria-label="color">
          <Language />
        </ToggleButton>
        <ToggleButton value="questions" aria-label="color">
          <QuestionAnswer />
        </ToggleButton>
      </ToggleButtonGroup>
    </div>
  );
};

export default CategoryFilter;
