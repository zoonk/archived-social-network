import { useState } from 'react';
import Router from 'next/router';
import { InputBase } from '@material-ui/core';
import { Search } from '@material-ui/icons';
import { fade, makeStyles, createStyles } from '@material-ui/core/styles';
import useTranslation from './useTranslation';

const useStyles = makeStyles((theme) =>
  createStyles({
    search: {
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.white, 0.15),
      '&:hover': {
        backgroundColor: fade(theme.palette.common.white, 0.25),
      },
      marginRight: theme.spacing(2),
      marginLeft: theme.spacing(2),
      flexGrow: 1,
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
      },
    },
    searchIcon: {
      width: theme.spacing(7),
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputRoot: {
      color: 'inherit',
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 7),
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: 200,
      },
    },
  }),
);

const SearchBox = () => {
  const translate = useTranslation();
  const [query, setQuery] = useState<string>('');
  const classes = useStyles();

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      Router.push(`/search?q=${query}`);
    }
  };

  return (
    <div className={classes.search}>
      <div className={classes.searchIcon}>
        <Search />
      </div>

      <InputBase
        placeholder={translate('search_ph')}
        fullWidth
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        classes={{
          root: classes.inputRoot,
          input: classes.inputInput,
        }}
        inputProps={{ 'aria-label': translate('search') }}
      />
    </div>
  );
};

export default SearchBox;
