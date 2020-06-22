import { makeStyles } from '@material-ui/core';
import LanguageFilter from './LanguageFilter';
import MenuPages from './MenuPages';
import SocialLinks from './SocialLinks';

const useStyles = makeStyles((theme) => ({
  filter: { width: 'auto', margin: theme.spacing(2, 0) },
}));

const HomeSidebar = () => {
  const classes = useStyles();

  return (
    <aside>
      <MenuPages />
      <SocialLinks />
      <div className={classes.filter}>
        <LanguageFilter />
      </div>
    </aside>
  );
};

export default HomeSidebar;
