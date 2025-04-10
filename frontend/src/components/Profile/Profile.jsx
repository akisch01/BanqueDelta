import React, { useState, useContext } from 'react';
import { Box, Typography, Avatar, Button, TextField, Divider, Chip } from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';
import { AuthContext } from '../../Context/Context'; // Chemin corrigé

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logique de sauvegarde ici
    setEditMode(false);
  };

  return (
    <Box sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Mon Profil
        </Typography>
        <Button 
          startIcon={editMode ? <SaveIcon /> : <EditIcon />}
          onClick={editMode ? handleSubmit : () => setEditMode(true)}
          variant="outlined"
        >
          {editMode ? 'Enregistrer' : 'Modifier'}
        </Button>
      </Box>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
        <Avatar sx={{ 
          width: 100, 
          height: 100, 
          mb: 2,
          fontSize: 40,
          bgcolor: 'primary.main'
        }}>
          {user?.username?.charAt(0).toUpperCase() || 'U'}
        </Avatar>
        <Typography variant="h6">{user?.username || 'Utilisateur'}</Typography>
        <Chip label={user?.role || 'Utilisateur'} color="primary" size="small" sx={{ mt: 1 }} />
      </Box>
      
      <Divider sx={{ my: 2 }} />
      
      <Box 
        component="form" 
        onSubmit={handleSubmit}
        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
      >
        <TextField
          name="email"
          label="Email"
          value={formData.email}
          onChange={handleChange}
          InputProps={{
            startAdornment: <EmailIcon color="action" sx={{ mr: 1 }} />,
          }}
          disabled={!editMode}
          fullWidth
          required
          type="email"
        />
        
        <TextField
          name="phone"
          label="Téléphone"
          value={formData.phone}
          onChange={handleChange}
          InputProps={{
            startAdornment: <PhoneIcon color="action" sx={{ mr: 1 }} />,
          }}
          disabled={!editMode}
          fullWidth
        />
        
        <TextField
          name="address"
          label="Adresse"
          value={formData.address}
          onChange={handleChange}
          InputProps={{
            startAdornment: <LocationIcon color="action" sx={{ mr: 1 }} />,
          }}
          disabled={!editMode}
          multiline
          rows={2}
          fullWidth
        />
      </Box>
    </Box>
  );
};

export default Profile;