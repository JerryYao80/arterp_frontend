import { ReactNode, useState } from 'react';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  People,
  Business,
  Inventory,
  AttachMoney,
  ChevronLeft,
  ChevronRight,
  ExitToApp,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { styled } from '@mui/material/styles';
import { useDispatch } from 'react-redux';
import { logout } from '@/app/store/authSlice';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const theme = useTheme();
  const router = useRouter();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(true);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleLogout = () => {
    dispatch(logout());
    router.push('/auth/login');
  };

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
    { text: 'Customers', icon: <People />, path: '/customers' },
    { text: 'Business', icon: <Business />, path: '/business' },
    { text: 'Resources', icon: <Inventory />, path: '/resources' },
    { text: 'Finance', icon: <AttachMoney />, path: '/finance' },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: `calc(100% - ${open ? drawerWidth : 0}px)`,
          ml: `${open ? drawerWidth : 0}px`,
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
            edge="start"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            ART ERP System
          </Typography>
          <IconButton color="inherit" onClick={handleLogout}>
            <ExitToApp />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', padding: 1 }}>
          <IconButton onClick={handleDrawerToggle}>
            {theme.direction === 'ltr' ? <ChevronLeft /> : <ChevronRight />}
          </IconButton>
        </Box>
        <List>
          {menuItems.map((item) => (
            <ListItemButton
              key={item.text}
              onClick={() => router.push(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>
      <Main open={open}>
        <Box component="div" sx={{ height: theme.spacing(8) }} />
        {children}
      </Main>
    </Box>
  );
} 