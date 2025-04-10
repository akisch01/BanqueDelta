import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../Context/Context';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Box,
  useTheme,
  styled,
  Avatar,
  IconButton,
  Badge
} from '@mui/material';
import {
  Home as HomeIcon,
  People as ClientsIcon,
  AccountBalance as AccountsIcon,
  Settings as SettingsIcon,
  ChevronLeft,
  Dashboard as DashboardIcon,
  Notifications as NotificationsIcon,
  HelpOutline as HelpIcon
} from '@mui/icons-material';

const drawerWidth = 280;

const SidebarItem = styled(ListItem)(({ theme, selected }) => ({
  borderRadius: theme.shape.borderRadius,
  margin: theme.spacing(0, 1.5),
  padding: theme.spacing(1, 2),
  transition: 'all 0.3s ease',
  '& .MuiListItemIcon-root': {
    minWidth: '40px',
    color: selected ? theme.palette.primary.main : theme.palette.text.secondary
  },
  '& .MuiListItemText-primary': {
    fontWeight: selected ? 600 : 500,
    color: selected ? theme.palette.primary.main : theme.palette.text.primary
  },
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    '& .MuiListItemIcon-root': {
      color: theme.palette.primary.main
    },
    '& .MuiListItemText-primary': {
      color: theme.palette.primary.main
    }
  }
}));

const Sidebar = ({ mobileOpen, handleDrawerToggle }) => {
  const location = useLocation();
  const theme = useTheme();
  const { user } = useContext(AuthContext);

  const menuItems = [
    {
      text: 'Tableau de bord',
      icon: <HomeIcon />,
      path: '/'
    },
    {
      text: 'Clients',
      icon: <ClientsIcon />,
      path: '/clients'
    },
    {
      text: 'Comptes',
      icon: <AccountsIcon />,
      path: '/comptes'
    }
  ];

  const secondaryItems = [
    {
      text: 'Paramètres',
      icon: <SettingsIcon />,
      path: '/settings'
    },
    {
      text: 'Aide & Support',
      icon: <HelpIcon />,
      path: '/help'
    }
  ];

  return (
    <Box
      component="nav"
      sx={{
        width: { md: drawerWidth },
        flexShrink: { md: 0 }
      }}
    >
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            background: theme.palette.background.paper,
            borderRight: 'none'
          }
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
          <IconButton onClick={handleDrawerToggle}>
            <ChevronLeft />
          </IconButton>
        </Box>
        <SidebarContent 
          location={location} 
          theme={theme} 
          menuItems={menuItems} 
          secondaryItems={secondaryItems} 
          user={user} 
        />
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            background: theme.palette.background.paper,
            borderRight: 'none',
            boxShadow: theme.shadows[1]
          }
        }}
        open
      >
        <SidebarContent 
          location={location} 
          theme={theme} 
          menuItems={menuItems} 
          secondaryItems={secondaryItems} 
          user={user} 
        />
      </Drawer>
    </Box>
  );
};

const SidebarContent = ({ location, theme, menuItems, secondaryItems, user }) => (
  <>
    <Box sx={{ p: 3, mb: 1 }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 2,
        mb: 3
      }}>
        <DashboardIcon sx={{ 
          fontSize: 40,
          color: theme.palette.primary.main 
        }} />
        <Typography
          variant="h6"
          noWrap
          sx={{
            fontWeight: 800,
            letterSpacing: -0.5,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          Banque Delta
        </Typography>
      </Box>
      
      {user && (
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2,
          p: 1.5,
          borderRadius: 2,
          bgcolor: theme.palette.action.selected,
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          '&:hover': {
            bgcolor: theme.palette.action.hover
          }
        }}>
          <Avatar 
            sx={{ 
              width: 40, 
              height: 40,
              border: `2px solid ${theme.palette.primary.main}`,
              bgcolor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText
            }} 
          >
            {user.username.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {user.username}
            </Typography>
            <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
              {user.role || 'Utilisateur'}
            </Typography>
          </Box>
          <Box sx={{ ml: 'auto' }}>
            <Badge badgeContent={3} color="error">
              <NotificationsIcon fontSize="small" />
            </Badge>
          </Box>
        </Box>
      )}
    </Box>

    <Divider sx={{ my: 1 }} />

    <List>
      {menuItems.map((item) => (
        <SidebarItem
          button
          key={item.text}
          component={Link}
          to={item.path}
          selected={location.pathname === item.path}
        >
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText primary={item.text} />
        </SidebarItem>
      ))}
    </List>

    <Divider sx={{ my: 1 }} />

    <List>
      {secondaryItems.map((item) => (
        <SidebarItem
          button
          key={item.text}
          component={Link}
          to={item.path}
          selected={location.pathname === item.path}
        >
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText primary={item.text} />
        </SidebarItem>
      ))}
    </List>

    <Box sx={{ mt: 'auto', p: 2 }}>
      <Typography variant="caption" sx={{ color: theme.palette.text.disabled }}>
        Version 1.0.0
      </Typography>
    </Box>
  </>
);

export default Sidebar;