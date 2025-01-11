import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Business as BusinessIcon,
  Inventory as ResourceIcon,
  AttachMoney as FinanceIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useRouter, usePathname } from 'next/navigation';

const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Customers', icon: <PeopleIcon />, path: '/customers' },
  { text: 'Business', icon: <BusinessIcon />, path: '/business' },
  { text: 'Resources', icon: <ResourceIcon />, path: '/resources' },
  { text: 'Finance', icon: <FinanceIcon />, path: '/finance' },
  { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
    >
      <Box sx={{ height: 64 }} /> {/* Navbar height offset */}
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                selected={pathname?.startsWith(item.path)}
                onClick={() => router.push(item.path)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
} 