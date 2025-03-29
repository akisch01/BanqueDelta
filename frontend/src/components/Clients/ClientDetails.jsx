import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getClient, deleteClient } from '../../services/clients';
import {
  Box,
  Typography,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
} from '@mui/material';
import { Edit, Delete, ArrowBack } from '@mui/icons-material';

const ClientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const data = await getClient(id);
        setClient(data);
      } catch (err) {
        setError('Erreur lors du chargement du client');
      }
    };
    fetchClient();
  }, [id]);

  const handleDelete = async () => {
    try {
      await deleteClient(id);
      navigate('/clients');
    } catch (err) {
      setError('Erreur lors de la suppression du client');
    }
  };

  if (!client) return <Typography>Chargement...</Typography>;

  return (
    <Box>
      <Box display="flex" alignItems="center" mb={2}>
        <IconButton onClick={() => navigate('/clients')} sx={{ mr: 1 }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" component="h1">
          {client.prenom} {client.nom}
        </Typography>
      </Box>

      {error && (
        <Typography color="error" gutterBottom>
          {error}
        </Typography>
      )}

      <Paper sx={{ p: 3, mb: 3 }}>
        <List>
          <ListItem>
            <ListItemText
              primary="ID"
              secondary={client.id}
            />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText
              primary="Nom complet"
              secondary={`${client.prenom} ${client.nom}`}
            />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText
              primary="Date de naissance"
              secondary={new Date(client.date_naissance).toLocaleDateString()}
            />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText
              primary="Adresse"
              secondary={client.adresse}
            />
          </ListItem>
        </List>

        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<Edit />}
            onClick={() => navigate(`/clients/${id}/edit`)}
          >
            Modifier
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<Delete />}
            onClick={handleDelete}
          >
            Supprimer
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default ClientDetails;