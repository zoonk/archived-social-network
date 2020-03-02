import { useContext } from 'react';
import { useRouter } from 'next/router';
import { Paper, Tab, Tabs } from '@material-ui/core';
import { GlobalContext } from '@zoonk/utils';

type Menu = 'topics' | 'posts' | 'courses' | 'leaderboard';

interface CategoryTabsProps {
  active: Menu;
}

const CategoryTabs = ({ active }: CategoryTabsProps) => {
  const { translate } = useContext(GlobalContext);
  const { push } = useRouter();
  const menu: Menu[] = ['topics', 'posts', 'courses', 'leaderboard'];

  return (
    <Paper square variant="outlined">
      <Tabs
        value={active}
        indicatorColor="primary"
        textColor="primary"
        variant="scrollable"
        scrollButtons="auto"
        aria-label="categories"
      >
        {menu.map((item) => (
          <Tab
            key={item}
            onClick={() => push(`/${item}`)}
            value={item}
            label={translate(item)}
          />
        ))}
      </Tabs>
    </Paper>
  );
};

export default CategoryTabs;
