import React, { useState } from 'react'; // Cette ligne doit être ajoutée en tout premier
import { Box, Typography, List, ListItem, ListItemIcon, ListItemText, Switch, Divider } from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Language as LanguageIcon,
  Security as SecurityIcon,
  Palette as PaletteIcon
} from '@mui/icons-material';

const Settings = () => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <Box sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
        Paramètres
      </Typography>
      
      <List>
        <ListItem>
          <ListItemIcon>
            <NotificationsIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Notifications" secondary="Activer/Désactiver les notifications" />
          <Switch 
            checked={notifications} 
            onChange={() => setNotifications(!notifications)} 
          />
        </ListItem>
        
        <Divider variant="inset" component="li" />
        
        <ListItem>
          <ListItemIcon>
            <PaletteIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Mode sombre" secondary="Basculer entre light/dark mode" />
          <Switch 
            checked={darkMode} 
            onChange={() => setDarkMode(!darkMode)} 
          />
        </ListItem>
        
        <Divider variant="inset" component="li" />
        
        <ListItem button>
          <ListItemIcon>
            <LanguageIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Langue" secondary="Français" />
        </ListItem>
        
        <ListItem button>
          <ListItemIcon>
            <SecurityIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Sécurité" secondary="Modifier le mot de passe" />
        </ListItem>
      </List>
    </Box>
  );
};

export default Settings;