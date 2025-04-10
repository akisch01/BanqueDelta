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
  useTheme,
  Avatar,
  TextField,
  InputAdornment,
  CircularProgress,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import { 
  Add, 
  Delete, 
  Edit,
  Search,
  AccountBalance,
  AccountCircle
} from '@mui/icons-material';

const CompteList = () => {
  const [comptes, setComptes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedCompteId, setSelectedCompteId] = useState(null);
  const theme = useTheme();

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

  const handleDeleteClick = (id) => {
    setSelectedCompteId(id);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteCompte(selectedCompteId);
      setComptes(comptes.filter((compte) => compte.id !== selectedCompteId));
      setOpenDeleteDialog(false);
    } catch (error) {
      console.error('Erreur lors de la suppression du compte', error);
      setOpenDeleteDialog(false);
    }
  };

  const handleDeleteCancel = () => {
    setOpenDeleteDialog(false);
    setSelectedCompteId(null);
  };

  const filteredComptes = comptes.filter(compte =>
    compte.id.toString().includes(searchTerm) ||
    compte.client_id.toString().includes(searchTerm) ||
    compte.type_compte.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      {/* Boîte de dialogue de confirmation */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Confirmer la suppression
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Êtes-vous sûr de vouloir supprimer ce compte ? Cette action est irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Annuler
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>

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
          variant="h3" 
          sx={{ 
            fontWeight: 700,
            color: theme.palette.text.primary
          }}
        >
          Gestion des Comptes
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Rechercher un compte..."
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
            to="/comptes/new"
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
            Nouveau Compte
          </Button>
        </Box>
      </Box>

      {/* Comptes Table */}
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
                <TableCell sx={{ fontWeight: 600 }}>Client</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="right">Solde</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Détails</TableCell>
                <TableCell sx={{ fontWeight: 600, textAlign: 'right' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredComptes.length > 0 ? (
                filteredComptes.map((compte) => (
                  <TableRow 
                    key={compte.id}
                    hover
                    sx={{
                      '&:last-child td': { borderBottom: 0 },
                      transition: 'background-color 0.3s ease'
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ 
                          bgcolor: theme.palette.secondary.main,
                          color: theme.palette.secondary.contrastText,
                          width: 36, 
                          height: 36 
                        }}>
                          <AccountCircle />
                        </Avatar>
                        <Typography>
                          ID: {compte.client_id}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={compte.type_compte}
                        color={compte.type_compte === 'courant' ? 'primary' : 'secondary'}
                        sx={{
                          fontWeight: 500,
                          textTransform: 'capitalize'
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Typography 
                        sx={{ 
                          fontWeight: 600,
                          color: compte.solde >= 0 ? theme.palette.success.main : theme.palette.error.main
                        }}
                      >
                        {compte.solde.toLocaleString('fr-FR')} Fcfa
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {compte.type_compte === 'épargne' ? (
                        <Typography variant="body2">
                          Taux: {compte.taux_interet}%
                        </Typography>
                      ) : (
                        <Typography variant="body2">
                          Découvert: {compte.decouvert_autorise.toLocaleString('fr-FR')} Fcfa
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        <Tooltip title="Modifier">
                          <IconButton
                            component={Link}
                            to={`/comptes/${compte.id}`}
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
                            onClick={() => handleDeleteClick(compte.id)}
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
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center',
                      gap: 1
                    }}>
                      <AccountBalance sx={{ 
                        fontSize: 60,
                        color: theme.palette.text.disabled
                      }} />
                      <Typography variant="h6" color="text.secondary">
                        Aucun compte trouvé
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {searchTerm ? 'Essayez une autre recherche' : 'Ajoutez votre premier compte'}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default CompteList;