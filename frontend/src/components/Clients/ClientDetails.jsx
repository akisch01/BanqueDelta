import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getClients, deleteClient } from '../../services/clients';
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
  useTheme,
  Tooltip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  InputAdornment,
  Avatar
} from '@mui/material';
import { 
  Add, 
  Delete, 
  Edit, 
  Search,
  Person,
  Home,
  Cake
} from '@mui/icons-material';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const ClientList = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const data = await getClients();
        setClients(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des clients', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  const handleDeleteClick = (client) => {
    setClientToDelete(client);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteClient(clientToDelete.id);
      setClients(clients.filter((client) => client.id !== clientToDelete.id));
    } catch (error) {
      console.error('Erreur lors de la suppression du client', error);
    } finally {
      setOpenDeleteDialog(false);
      setClientToDelete(null);
    }
  };

  const filteredClients = clients.filter(client =>
    `${client.nom} ${client.prenom}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.adresse.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header Section */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 4,
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 700,
            color: theme.palette.text.primary
          }}
        >
          Gestion des Clients
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Rechercher un client..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search color="action" />
                </InputAdornment>
              ),
              sx: {
                borderRadius: 2,
                backgroundColor: theme.palette.background.paper
              }
            }}
            sx={{
              minWidth: 250
            }}
          />
          
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            component={Link}
            to="/clients/new"
            sx={{
              px: 3,
              borderRadius: 2,
              fontWeight: 600,
              textTransform: 'none',
              boxShadow: 'none',
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              '&:hover': {
                boxShadow: `0 4px 12px ${theme.palette.primary.main}40`
              }
            }}
          >
            Nouveau Client
          </Button>
        </Box>
      </Box>

      {/* Clients Table */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 4,
          border: `1px solid ${theme.palette.divider}`,
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.05)'
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ 
                backgroundColor: theme.palette.background.default 
              }}>
                <TableCell sx={{ fontWeight: 600 }}>Nom Complet</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Date Naissance</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Adresse</TableCell>
                <TableCell sx={{ fontWeight: 600, textAlign: 'right' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredClients.length > 0 ? (
                filteredClients.map((client) => (
                  <TableRow 
                    key={client.id}
                    hover
                    sx={{
                      '&:last-child td': { borderBottom: 0 },
                      transition: 'background-color 0.3s ease'
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ 
                          bgcolor: theme.palette.primary.main,
                          color: theme.palette.primary.contrastText,
                          width: 36, 
                          height: 36 
                        }}>
                          {client.prenom.charAt(0)}{client.nom.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography fontWeight={500}>
                            {client.prenom} {client.nom}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            ID: {client.id}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Cake fontSize="small" color="action" />
                        <Typography>
                          {format(new Date(client.date_naissance), 'dd MMM yyyy', { locale: fr })}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Home fontSize="small" color="action" />
                        <Typography>
                          {client.adresse}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        <Tooltip title="Modifier">
                          <IconButton
                            component={Link}
                            to={`/clients/${client.id}/edit`}
                            sx={{
                              color: theme.palette.primary.main,
                              '&:hover': {
                                backgroundColor: theme.palette.primary.light
                              }
                            }}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Supprimer">
                          <IconButton
                            sx={{
                              color: theme.palette.error.main,
                              '&:hover': {
                                backgroundColor: theme.palette.error.light
                              }
                            }}
                            onClick={() => handleDeleteClick(client)}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center',
                      gap: 1
                    }}>
                      <Person sx={{ 
                        fontSize: 60,
                        color: theme.palette.text.disabled
                      }} />
                      <Typography variant="h6" color="text.secondary">
                        Aucun client trouvé
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {searchTerm ? 'Essayez une autre recherche' : 'Ajoutez votre premier client'}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            maxWidth: 500
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>
          Confirmer la suppression
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer le client {clientToDelete?.prenom} {clientToDelete?.nom} ?
            Cette action est irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={() => setOpenDeleteDialog(false)}
            sx={{
              px: 3,
              borderRadius: 2,
              textTransform: 'none',
              color: theme.palette.text.secondary
            }}
          >
            Annuler
          </Button>
          <Button 
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            sx={{
              px: 3,
              borderRadius: 2,
              fontWeight: 600,
              textTransform: 'none',
              boxShadow: 'none'
            }}
          >
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ClientList;