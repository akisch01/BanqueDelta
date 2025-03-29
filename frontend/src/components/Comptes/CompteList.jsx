import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getComptes, deleteCompte } from '../../services/comptes';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Box,
  IconButton,
  Chip,
} from '@mui/material';
import { Add, Delete, Edit } from '@mui/icons-material';

const CompteList = () => {
  const [comptes, setComptes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComptes = async () => {
      try {
        const data = await getComptes();
        setComptes(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des comptes', error);
      } finally {
        setLoading(false);
      }
    };

    fetchComptes();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteCompte(id);
      setComptes(comptes.filter((compte) => compte.id !== id));
    } catch (error) {
      console.error('Erreur lors de la suppression du compte', error);
    }
  };

  if (loading) return <Typography>Chargement...</Typography>;

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Typography variant="h4">Liste des comptes</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          component={Link}
          to="/comptes/new"
        >
          Ajouter un compte
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Client ID</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Solde</TableCell>
              <TableCell>Détails</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {comptes.map((compte) => (
              <TableRow key={compte.id}>
                <TableCell>{compte.id}</TableCell>
                <TableCell>{compte.client_id}</TableCell>
                <TableCell>
                  <Chip
                    label={compte.type_compte}
                    color={compte.type_compte === 'courant' ? 'primary' : 'secondary'}
                  />
                </TableCell>
                <TableCell>{compte.solde} Fcfa</TableCell>
                <TableCell>
                  {compte.type_compte === 'épargne' && (
                    <Typography variant="body2">
                      Taux: {compte.taux_interet}%
                    </Typography>
                  )}
                  {compte.type_compte === 'courant' && (
                    <Typography variant="body2">
                      Découvert: {compte.decouvert_autorise} Fcfa
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <IconButton
                    component={Link}
                    to={`/comptes/${compte.id}`}
                    color="primary"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(compte.id)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default CompteList;