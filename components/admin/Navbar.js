"use client";

import { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Button, Drawer, List, ListItem, ListItemText, Divider, Menu, MenuItem, useMediaQuery, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession, signOut } from 'next-auth/react';

function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(true);  // State to handle loading
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') {
      // Session is still loading, keep loading state true
      return;
    }
    
    if (status === 'authenticated') {
      // Redirect if the user is authenticated but not an admin
      const role = session?.user?.role;
      if (role !== 'admin') {
        router.push('/'); // Redirect to home if the role is not admin
        return;
      }
    } else if (status === 'unauthenticated') {
      router.push('/'); // Redirect to home if not authenticated
      return;
    }

    // If all checks pass, set loading to false and show the content
    setLoading(false);
  }, [status, session, router]);

  if (loading) {
    // You can return a loader or null while redirecting
    return null;
  }

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });  // prevent automatic redirection
    router.push('/');  // manually navigate to home page
    handleProfileMenuClose();
  };

  const navItems = ['Home', 'Reports', 'Settings', 'Contact'];

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            <Image
              className="logoShadow"
              src="/assets/logo/rblogo.png"
              alt="Logo"
              width={200}
              height={25}
              priority
            />
          </Typography>

          {isMobile ? (
            <>
              <IconButton edge="start" color="inherit" onClick={toggleDrawer(true)} aria-label="menu">
                <MenuIcon />
              </IconButton>

              <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={toggleDrawer(false)}
              >
                <List>
                  {navItems.map((item) => (
                    <ListItem button key={item} onClick={toggleDrawer(false)}>
                      <ListItemText primary={item} />
                    </ListItem>
                  ))}
                </List>
                <Divider />
                <List>
                  <ListItem button onClick={handleProfileMenuOpen}>
                    <ListItemText primary={session?.user?.name || 'Profile'} />
                  </ListItem>
                </List>
              </Drawer>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {navItems.map((item) => (
                <Button key={item} color="inherit">
                  {item}
                </Button>
              ))}
              <Button color="inherit" onClick={handleProfileMenuOpen}>
                {session?.user?.name || 'Profile'}
              </Button>
            </div>
          )}

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
          >
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    </>
  );
}

export default Navbar;
