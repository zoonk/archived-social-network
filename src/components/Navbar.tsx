import { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import Router from 'next/router';
import {
  AppBar,
  Badge,
  Drawer,
  IconButton,
  LinearProgress,
  Toolbar,
} from '@material-ui/core';
import { Edit, Menu, Notifications } from '@material-ui/icons';
import { liveUserXP } from '@zoonk/services';
import { GlobalContext, UserContext } from '@zoonk/utils';
import MenuDrawer from './MenuDrawer';
import SearchBox from './SearchBox';

const Navbar = () => {
  const { translate, user } = useContext(GlobalContext);
  const [displayMenu, setMenu] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [xp, setXP] = useState<number>(1);

  // Hide the menu drawer when navigating to a different page.
  useEffect(() => {
    Router.events.on('routeChangeStart', () => setMenu(false));
  }, []);

  // Add a loading effect when navigating to a different page.
  useEffect(() => {
    Router.events.on('routeChangeStart', () => setLoading(true));
    Router.events.on('routeChangeComplete', () => setLoading(false));
    Router.events.on('routeChangeError', () => setLoading(false));
  }, []);

  // Get user's XP
  useEffect(() => {
    if (!user) return;
    const unsubscribe = liveUserXP(user.uid, setXP);
    return () => unsubscribe();
  }, [user]);

  return (
    <AppBar position="sticky">
      {loading && <LinearProgress variant="query" />}

      <Toolbar variant="dense">
        <Link href="/">
          <a>
            <img
              src="/icon_white.svg"
              alt="Zoonk icon"
              style={{ height: '25px' }}
            />
          </a>
        </Link>

        <SearchBox />

        <Link href="/posts/add" passHref>
          <IconButton
            aria-label={translate('post_add')}
            color="inherit"
            edge="end"
          >
            <Edit />
          </IconButton>
        </Link>

        {user && (
          <Link href="/notifications" passHref>
            <IconButton
              aria-label={translate('notifications')}
              color="inherit"
              edge="end"
            >
              <Badge
                variant="dot"
                overlap="circle"
                color="secondary"
                invisible={!user.notifications}
              >
                <Notifications />
              </Badge>
            </IconButton>
          </Link>
        )}

        <IconButton
          edge="end"
          color="inherit"
          aria-label={translate('menu')}
          onClick={() => setMenu(true)}
        >
          <Menu />
        </IconButton>
      </Toolbar>

      <Drawer open={displayMenu} anchor="right" onClose={() => setMenu(false)}>
        <UserContext.Provider value={{ xp }}>
          <MenuDrawer />
        </UserContext.Provider>
      </Drawer>
    </AppBar>
  );
};

export default Navbar;
