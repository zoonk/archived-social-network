import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Router from 'next/router';
import {
  AppBar,
  Badge,
  IconButton,
  LinearProgress,
  Toolbar,
} from '@material-ui/core';
import { Edit, Menu, Notifications } from '@material-ui/icons';
import SearchBox from './SearchBox';
import useAuth from './useAuth';
import useTranslation from './useTranslation';

const NavbarDrawer = dynamic(() => import('./NavbarDrawer'), { ssr: false });

const Navbar = () => {
  const translate = useTranslation();
  const { user } = useAuth();
  const [displayMenu, setMenu] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // Handle visual effects when the navigation starts.
  useEffect(() => {
    const handleRouterChange = () => {
      setMenu(false);
      setLoading(true);
    };
    Router.events.on('routeChangeStart', handleRouterChange);
    return () => Router.events.off('routeChangeStart', handleRouterChange);
  }, []);

  // Handle visual effects when the navigation ends or has an error.
  useEffect(() => {
    const handleRouterChange = () => setLoading(false);
    Router.events.on('routeChangeComplete', handleRouterChange);
    Router.events.on('routeChangeError', handleRouterChange);
    return () => {
      Router.events.off('routeChangeComplete', handleRouterChange);
      Router.events.off('routeChangeError', handleRouterChange);
    };
  }, []);

  return (
    <AppBar position="sticky">
      {loading && <LinearProgress variant="query" />}

      <Toolbar variant="dense">
        <Link href={user ? '/following' : '/'}>
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
              invisible={!user?.notifications}
            >
              <Notifications />
            </Badge>
          </IconButton>
        </Link>

        <IconButton
          edge="end"
          color="inherit"
          aria-label={translate('menu')}
          onClick={() => setMenu(true)}
        >
          <Menu />
        </IconButton>
      </Toolbar>

      <NavbarDrawer open={displayMenu} onClose={() => setMenu(false)} />
    </AppBar>
  );
};

export default Navbar;
