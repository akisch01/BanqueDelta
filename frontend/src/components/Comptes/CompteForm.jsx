import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createCompte, updateCompte, getCompte } from '../../services/comptes';
import {
  TextField,
  Button,
  Typography,
  Paper,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  useTheme,
  Chip,
  IconButton,
  Divider
} from '@mui/material';
import { 
  ArrowBack,
  AccountBalance,
  Save,
  Cancel
} from '@mui/icons-material';

const CompteForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const [formData, setFormData] = useState({
    client_id: '',
    type_compte: 'courant',
    solde: 0,
    taux_interet: 0,
    decouvert_autorise: 0,
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      const fetchCompte = async () => {
        try {
          const compte = await getCompte(id);
          setFormData({
            client_id: compte.client_id,
            type_compte: compte.type_compte,
            solde: compte.solde,
            taux_interet: compte.taux_interet || 0,
            decouvert_autorise: compte.decouvert_autorise || 0,
          });
        } catch (err) {
          setError('Erreur lors du chargement du compte');
        }
      };
      fetchCompte();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await updateCompte(id, formData);
      } else {
        await createCompte(formData);
      }
      navigate('/comptes');
    } catch (err) {
      setError(err.message || 'Une erreur est survenue');
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <IconButton 
          onClick={() => navigate('/comptes')} 
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
          {id ? 'Modifier Compte' : 'Nouveau Compte'}
        </Typography>
      </Box>

      {/* Error Display */}
      {error && (
        <Chip 
          label={error} 
          color="error" 
          sx={{ mb: 3 }} 
          icon={<AccountBalance />}
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
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label="ID Client"
              name="client_id"
              type="number"
              fullWidth
              value={formData.client_id}
              onChange={handleChange}
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
            />

            <FormControl fullWidth required>
              <InputLabel>Type de compte</InputLabel>
              <Select
                name="type_compte"
                value={formData.type_compte}
                onChange={handleChange}
                label="Type de compte"
                sx={{
                  borderRadius: 2
                }}
              >
                <MenuItem value="courant">Courant</MenuItem>
                <MenuItem value="épargne">Épargne</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Solde initial (Fcfa)"
              name="solde"
              type="number"
              fullWidth
              value={formData.solde}
              onChange={handleChange}
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
            />

            {formData.type_compte === 'épargne' && (
              <TextField
                label="Taux d'intérêt (%)"
                name="taux_interet"
                type="number"
                fullWidth
                value={formData.taux_interet}
                onChange={handleChange}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
              />
            )}

            {formData.type_compte === 'courant' && (
              <TextField
                label="Découvert autorisé (Fcfa)"
                name="decouvert_autorise"
                type="number"
                fullWidth
                value={formData.decouvert_autorise}
                onChange={handleChange}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
              />
            )}

            <Divider sx={{ my: 2 }} />

            {/* Form Actions */}
            <Box sx={{ 
              display: 'flex', 
              gap: 2, 
              justifyContent: 'flex-end'
            }}>
              <Button
                variant="outlined"
                startIcon={<Cancel />}
                onClick={() => navigate('/comptes')}
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
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default CompteForm;