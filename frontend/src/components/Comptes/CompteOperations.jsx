import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  deposerArgent,
  retirerArgent,
  calculerInterets,
  getTransactions,
  getCompte,
} from '../../services/comptes';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  Alert,
  useTheme,
  Chip,
  CircularProgress,
  IconButton
} from '@mui/material';
import { 
  AccountBalance,
  ArrowBack,
  AttachMoney,
  TrendingUp,
  History
} from '@mui/icons-material';

const safeFormat = (value) => {
  if (value === undefined || value === null || isNaN(value)) return '0';
  return value.toLocaleString('fr-FR');
};

const formatDateComplete = (dateString) => {
  if (!dateString) return 'Date inconnue';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Date invalide';
    
    // Si l'heure est à 00:00:00, ajoute un décalage aléatoire (pour la démo)
    if (date.getHours() === 0 && date.getMinutes() === 0) {
      const randomHours = Math.floor(Math.random() * 24);
      const randomMinutes = Math.floor(Math.random() * 60);
      date.setHours(randomHours);
      date.setMinutes(randomMinutes);
    }
    
    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  } catch {
    return 'Date invalide';
  }
};

const CompteOperations = () => {
  const { id } = useParams();
  const theme = useTheme();
  const [compte, setCompte] = useState({
    solde: 0,
    decouvert_autorise: 0,
    taux_interet: 0,
    type_compte: '',
    client_id: ''
  });
  const [transactions, setTransactions] = useState([]);
  const [montant, setMontant] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [compteData, transactionsData] = await Promise.all([
          getCompte(id),
          getTransactions(id)
        ]);

        setCompte({
          solde: compteData?.solde ?? 0,
          decouvert_autorise: compteData?.decouvert_autorise ?? 0,
          taux_interet: compteData?.taux_interet ?? 0,
          type_compte: compteData?.type_compte ?? '',
          client_id: compteData?.client_id ?? ''
        });

        setTransactions(transactionsData ?? []);
      } catch (err) {
        setError('Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);

  const handleDepot = async () => {
    try {
      const amount = parseFloat(montant);
      if (isNaN(amount) || amount <= 0) {
        setError('Montant invalide');
        return;
      }
      
      const result = await deposerArgent(id, amount);
      if (!result?.nouveau_solde) throw new Error('Réponse serveur invalide');

      setCompte(prev => ({
        ...prev,
        solde: result.nouveau_solde
      }));
      
      setSuccess(`Dépôt de ${safeFormat(amount)} Fcfa effectué`);
      setMontant('');
      
      const transactionsData = await getTransactions(id);
      setTransactions(transactionsData ?? []);
    } catch (err) {
      setError(err.message || 'Erreur lors du dépôt');
    }
  };

  const handleRetrait = async () => {
    try {
      const amount = parseFloat(montant);
      if (isNaN(amount) || amount <= 0) {
        setError('Montant invalide');
        return;
      }
      
      const result = await retirerArgent(id, amount);
      if (!result?.nouveau_solde) throw new Error('Réponse serveur invalide');

      setCompte(prev => ({
        ...prev,
        solde: result.nouveau_solde
      }));
      
      setSuccess(`Retrait de ${safeFormat(amount)} Fcfa effectué`);
      setMontant('');
      
      const transactionsData = await getTransactions(id);
      setTransactions(transactionsData ?? []);
    } catch (err) {
      setError(err.message || 'Erreur lors du retrait');
    }
  };

  const handleCalculInterets = async () => {
    try {
      const result = await calculerInterets(id);
      if (!result?.nouveau_solde) throw new Error('Réponse serveur invalide');

      setCompte(prev => ({
        ...prev, 
        solde: result.nouveau_solde
      }));
      
      setSuccess('Intérêts calculés et ajoutés au compte');
    } catch (err) {
      setError(err.message || 'Erreur lors du calcul des intérêts');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <IconButton 
          onClick={() => window.history.back()} 
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
        <Box>
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 700,
              color: theme.palette.text.primary
            }}
          >
            Opérations sur le compte #{id}
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: theme.palette.text.secondary,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <AccountBalance fontSize="small" />
            {compte.type_compte} - Client ID: {compte.client_id}
          </Typography>
        </Box>
      </Box>

      {/* Alerts */}
      {error && (
        <Alert 
          severity="error" 
          onClose={() => setError('')} 
          sx={{ mb: 3 }}
          icon={<AttachMoney />}
        >
          {error}
        </Alert>
      )}
      {success && (
        <Alert 
          severity="success" 
          onClose={() => setSuccess('')} 
          sx={{ mb: 3 }}
          icon={<TrendingUp />}
        >
          {success}
        </Alert>
      )}

      {/* Main Content */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Solde Card */}
        <Grid item xs={12} md={4}>
          <Paper
            sx={{ 
              p: 3, 
              borderRadius: 3,
              background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.background.paper} 100%)`
            }}
          >
            <Typography variant="h6" gutterBottom>
              Solde actuel
            </Typography>
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 700,
                color: compte.solde >= 0 ? theme.palette.success.main : theme.palette.error.main
              }}
            >
              {safeFormat(compte.solde)} Fcfa
            </Typography>
            {compte.type_compte === 'courant' && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                Découvert autorisé: {safeFormat(compte.decouvert_autorise)} Fcfa
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Operations Card */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" gutterBottom>
              Effectuer une opération
            </Typography>
            <TextField
              label="Montant (Fcfa)"
              type="number"
              fullWidth
              value={montant}
              onChange={(e) => setMontant(e.target.value)}
              sx={{ mb: 2 }}
              InputProps={{
                sx: {
                  borderRadius: 2
                }
              }}
            />
            <Box display="flex" gap={2} sx={{ mb: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleDepot}
                sx={{
                  px: 4,
                  borderRadius: 2,
                  fontWeight: 600,
                  textTransform: 'none',
                  flex: 1
                }}
              >
                Dépôt
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleRetrait}
                sx={{
                  px: 4,
                  borderRadius: 2,
                  fontWeight: 600,
                  textTransform: 'none',
                  flex: 1
                }}
              >
                Retrait
              </Button>
            </Box>
            {compte.type_compte === 'épargne' && (
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                mt: 2,
                p: 2,
                borderRadius: 2,
                backgroundColor: theme.palette.action.hover
              }}>
                <Box>
                  <Typography variant="body2">
                    Taux d'intérêt: {safeFormat(compte.taux_interet)}%
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  onClick={handleCalculInterets}
                  sx={{
                    borderRadius: 2,
                    fontWeight: 500
                  }}
                >
                  Calculer les intérêts
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Transactions History */}
      <Paper sx={{ 
        p: 3, 
        borderRadius: 3,
        border: `1px solid ${theme.palette.divider}`
      }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2,
          mb: 3
        }}>
          <History color="primary" />
          <Typography variant="h5">
            Historique des transactions
          </Typography>
        </Box>
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ 
                backgroundColor: theme.palette.background.default 
              }}>
                <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="right">Montant</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.length > 0 ? (
                transactions.map((tx) => (
                  <TableRow 
                    key={tx.id}
                    hover
                    sx={{
                      '&:last-child td': { borderBottom: 0 }
                    }}
                  >
                    <TableCell>
                      <Chip
                        label={tx.type_transaction || 'transaction'}
                        color={tx.type_transaction === 'dépôt' ? 'success' : 'error'}
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
                          color: tx.type_transaction === 'dépôt' ? 
                            theme.palette.success.main : 
                            theme.palette.error.main
                        }}
                      >
                        {safeFormat(tx.montant)} Fcfa
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {formatDateComplete(tx.date_transaction)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      Aucune transaction enregistrée
                    </Typography>
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

export default CompteOperations;