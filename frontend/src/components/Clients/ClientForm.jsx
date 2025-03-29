import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createClient, updateClient, getClient } from '../../services/clients';
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
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const ClientForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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
    <Paper sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        {id ? 'Modifier Client' : 'Nouveau Client'}
      </Typography>
      {error && (
        <Typography color="error" gutterBottom>
          {error}
        </Typography>
      )}
      <form onSubmit={handleSubmit}>
        <TextField
          label="Nom"
          name="nom"
          fullWidth
          margin="normal"
          value={formData.nom}
          onChange={handleChange}
          required
        />
        <TextField
          label="Prénom"
          name="prenom"
          fullWidth
          margin="normal"
          value={formData.prenom}
          onChange={handleChange}
          required
        />
        <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          label="Date de naissance"
          value={formData.date_naissance}
          onChange={handleDateChange}
          renderInput={(params) => (
            <TextField {...params} fullWidth margin="normal" required />
          )}
        />
      </LocalizationProvider>
        <TextField
          label="Adresse"
          name="adresse"
          fullWidth
          margin="normal"
          multiline
          rows={3}
          value={formData.adresse}
          onChange={handleChange}
          required
        />
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/clients')}
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

export default ClientForm;