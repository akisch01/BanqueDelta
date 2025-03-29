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
} from '@mui/material';

const CompteForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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
    <Paper sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        {id ? 'Modifier Compte' : 'Nouveau Compte'}
      </Typography>
      {error && (
        <Typography color="error" gutterBottom>
          {error}
        </Typography>
      )}
      <form onSubmit={handleSubmit}>
        <TextField
          label="ID Client"
          name="client_id"
          type="number"
          fullWidth
          margin="normal"
          value={formData.client_id}
          onChange={handleChange}
          required
        />

        <FormControl fullWidth margin="normal" required>
          <InputLabel>Type de compte</InputLabel>
          <Select
            name="type_compte"
            value={formData.type_compte}
            onChange={handleChange}
            label="Type de compte"
          >
            <MenuItem value="courant">Courant</MenuItem>
            <MenuItem value="épargne">Épargne</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Solde initial"
          name="solde"
          type="number"
          fullWidth
          margin="normal"
          value={formData.solde}
          onChange={handleChange}
          required
        />

        {formData.type_compte === 'épargne' && (
          <TextField
            label="Taux d'intérêt (%)"
            name="taux_interet"
            type="number"
            fullWidth
            margin="normal"
            value={formData.taux_interet}
            onChange={handleChange}
            required
          />
        )}

        {formData.type_compte === 'courant' && (
          <TextField
            label="Découvert autorisé"
            name="decouvert_autorise"
            type="number"
            fullWidth
            margin="normal"
            value={formData.decouvert_autorise}
            onChange={handleChange}
            required
          />
        )}

        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/comptes')}
          >
            Annuler
          </Button>
          <Button type="submit" variant="contained" color="primary">
            {id ? 'Mettre à jour' : 'Créer'}
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default CompteForm;