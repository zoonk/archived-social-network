import { useContext, useEffect, useRef, useState } from 'react';
import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';
import { MaterialSelect, Post } from '@zoonk/models';
import { GlobalContext } from '@zoonk/utils';

interface CategorySelectorProps {
  active: Post.Category | 'none';
  style?: React.CSSProperties;
  onSelect: (category: Post.Category) => void;
}

/**
 * Dropdown menu for selecting a post category.
 */
const CategorySelector = ({
  active,
  style,
  onSelect,
}: CategorySelectorProps) => {
  const { translate } = useContext(GlobalContext);
  const [labelWidth, setLabelWidth] = useState(0);
  const inputLabel = useRef<HTMLLabelElement>(null);
  const categories = [
    { name: translate('references_links'), value: 'references' },
    { name: translate('posts'), value: 'posts' },
    { name: translate('courses'), value: 'courses' },
    { name: translate('books'), value: 'books' },
    { name: translate('real_life_examples'), value: 'examples' },
    { name: translate('questions'), value: 'questions' },
  ];

  const handleChange = (event: React.ChangeEvent<MaterialSelect>) => {
    onSelect(event.target.value as Post.Category);
  };

  useEffect(() => {
    setLabelWidth(inputLabel.current!.offsetWidth);
  }, []);

  return (
    <FormControl variant="outlined" style={{ width: '100%', ...style }}>
      <InputLabel ref={inputLabel} id="category-label">
        {translate('post_category')}
      </InputLabel>
      <Select
        labelId="category-label"
        id="category-select"
        value={active}
        onChange={handleChange}
        labelWidth={labelWidth}
      >
        <MenuItem disabled value="none">
          {translate('post_category')}
        </MenuItem>
        {categories.map((item) => (
          <MenuItem value={item.value} key={item.value}>
            {item.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default CategorySelector;
