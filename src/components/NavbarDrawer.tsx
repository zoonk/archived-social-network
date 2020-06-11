import { useEffect, useState } from 'react';
import { Drawer } from '@material-ui/core';
import { liveUserXP } from '@zoonk/services';
import { UserContext } from '@zoonk/utils';
import MenuDrawer from './MenuDrawer';
import useAuth from './useAuth';

interface NavbarDrawerProps {
  open: boolean;
  onClose: () => void;
}

const NavbarDrawer = ({ open, onClose }: NavbarDrawerProps) => {
  const { user } = useAuth();
  const [xp, setXP] = useState<number>(1);

  // Get user's XP
  useEffect(() => {
    if (!user) return;
    const unsubscribe = liveUserXP(user.uid, setXP);
    return () => unsubscribe();
  }, [user]);

  return (
    <Drawer open={open} anchor="right" onClose={onClose}>
      <UserContext.Provider value={{ xp }}>
        <MenuDrawer />
      </UserContext.Provider>
    </Drawer>
  );
};

export default NavbarDrawer;
