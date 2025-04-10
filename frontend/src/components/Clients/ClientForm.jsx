import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createClient, updateClient, getClient } from '../../services/clients';
import {
  TextField,
  Button,
  Typography,
  Paper,
  Box,
  useTheme,
  Avatar,
  Chip,
  Stack,
  IconButton
} from '@mui/material';
import { 
  DatePicker 
} from '@mui/x-date-pickers';
import { 
  LocalizationProvider 
} from '@mui/x-date-pickers/LocalizationProvider';
import { 
  AdapterDateFns 
} from '@mui/x-date-pickers/AdapterDateFns';
import { 
  Person,
  ArrowBack,
  Save,
  Cancel
} from '@mui/icons-material';
import { fr } from 'date-fns/locale';

const ClientForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    date_naissance: null,
    adresse: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      const fetchClient = async () => {
        try {
          const client = await getClient(id);
          setFormData({
            nom: client.nom,
            prenom: client.prenom,
            date_naissance: new Date(client.date_naissance),
            adresse: client.adresse,
          });
        } catch (err) {
          setError('Erreur lors du chargement du client');
        }
      };
      fetchClient();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (date) => {
    setFormData({ ...formData, date_naissance: date });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await updateClient(id, formData);
      } else {
        await createClient(formData);
      }
      navigate('/clients');
    } catch (err) {
      setError(err.message || 'Une erreur est survenue');
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <IconButton 
          onClick={() => navigate('/clients')} 
          sx={{ 
            mr: 2,
            color: theme.palette.primary.main,
            '&:hover': {
              backgroundColor: theme.palette.primary.light
            }
          }}
        >
          <ArrowBack />
        </IconButton>
        <Typography 
          variant="h3" 
          sx={{ 
            fontWeight: 700,
            color: theme.palette.text.primary
          }}
        >
          {id ? 'Modifier Client' : 'Nouveau Client'}
        </Typography>
      </Box>

      {/* Error Display */}
      {error && (
        <Chip 
          label={error} 
          color="error" 
          sx={{ mb: 3 }} 
          icon={<Person />}
        />
      )}

      {/* Form Card */}
      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: 4,
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.05)',
          maxWidth: 700,
          mx: 'auto'
        }}
      >
        {/* Client Avatar Preview */}
        {id && (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 3,
            mb: 4
          }}>
            <Avatar
              sx={{
                width: 60,
                height: 60,
                fontSize: 24,
                bgcolor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText
              }}
            >
              {formData.prenom.charAt(0)}{formData.nom.charAt(0)}
            </Avatar>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              {formData.prenom} {formData.nom}
            </Typography>
          </Box>
        )}

        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <Box sx={{ display: 'flex', gap: 3 }}>
              <TextField
                label="Prénom"
                name="prenom"
                fullWidth
                value={formData.prenom}
                onChange={handleChange}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
              />
              <TextField
                label="Nom"
                name="nom"
                fullWidth
                value={formData.nom}
                onChange={handleChange}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
              />
            </Box>

            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
              <DatePicker
                label="Date de naissance"
                value={formData.date_naissance}
                onChange={handleDateChange}
                inputFormat="dd/MM/yyyy"
                renderInput={(params) => (
                  <TextField 
                    {...params} 
                    fullWidth 
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2
                      }
                    }}
                  />
                )}
              />
            </LocalizationProvider>

            <TextField
              label="Adresse"
              name="adresse"
              fullWidth
              multiline
              rows={3}
              value={formData.adresse}
              onChange={handleChange}
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
            />

            {/* Form Actions */}
            <Box sx={{ 
              display: 'flex', 
              gap: 2, 
              mt: 2,
              pt: 3,
              justifyContent: 'flex-end',
              borderTop: `1px solid ${theme.palette.divider}`
            }}>
              <Button
                variant="outlined"
                startIcon={<Cancel />}
                onClick={() => navigate('/clients')}
                sx={{
                  px: 4,
                  borderRadius: 2,
                  fontWeight: 600,
                  textTransform: 'none'
                }}
              >
                Annuler
              </Button>
              <Button 
                type="submit" 
                variant="contained" 
                startIcon={<Save />}
                sx={{
                  px: 4,
                  borderRadius: 2,
                  fontWeight: 600,
                  textTransform: 'none',
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                  '&:hover': {
                    boxShadow: `0 4px 12px ${theme.palette.primary.main}40`
                  }
                }}
              >
                {id ? 'Mettre à jour' : 'Créer'}
              </Button>
            </Box>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
};

export default ClientForm;