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
  Divider,
  Grid,
  Alert,
} from '@mui/material';

const CompteOperations = () => {
  const { id } = useParams();
  const [compte, setCompte] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [montant, setMontant] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

    useEffect(() => {
      const fetchData = async () => {
        try {
          const compteData = await getCompte(id);
          setCompte(compteData);
          
          console.log("ID Compte pour requête:", id); // Debug
          const transactionsData = await getTransactions(id);
          console.log("Données reçues:", transactionsData); // Debug
          
          setTransactions(transactionsData);
        } catch (err) {
          console.error("Erreur complète:", err); // Debug
          setError('Erreur lors du chargement des données');
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
      setCompte({ ...compte, solde: result.nouveau_solde });
      setSuccess(`Dépôt de ${amount} Fcfa effectué`);
      setMontant('');
      // Rafraîchir les transactions
      const transactionsData = await getTransactions(id);
      setTransactions(transactionsData);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRetrait = async () => {
    try {
      const amount = parseFloat(montant);
      if (isNaN(amount)) {
        setError('Montant invalide');
        return;
      }
      const result = await retirerArgent(id, amount);
      setCompte({ ...compte, solde: result.nouveau_solde });
      setSuccess(`Retrait de ${amount} Fcfa effectué`);
      setMontant('');
      // Force refresh avec timeout
      setTimeout(async () => {
        const transactionsData = await getTransactions(id);
        setTransactions(transactionsData);
      }, 500); // Petit délai pour laisser le backend traiter
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCalculInterets = async () => {
    try {
      const result = await calculerInterets(id);
      setCompte({ ...compte, solde: result.nouveau_solde });
      setSuccess('Intérêts calculés et ajoutés au compte');
    } catch (err) {
      setError(err.message);
    }
  };

  if (!compte) return <Typography>Chargement...</Typography>;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Compte #{id} - {compte.type_compte}
      </Typography>
      <Typography variant="h6" gutterBottom>
        Solde: {compte.solde} Fcfa
      </Typography>

      {error && (
        <Alert severity="error" onClose={() => setError('')} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" onClose={() => setSuccess('')} sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Opérations
            </Typography>
            <TextField
              label="Montant"
              type="number"
              fullWidth
              value={montant}
              onChange={(e) => setMontant(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Box display="flex" gap={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleDepot}
              >
                Dépôt
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleRetrait}
              >
                Retrait
              </Button>
            </Box>
            {compte.type_compte === 'épargne' && (
              <Box mt={2}>
                <Typography variant="body2" gutterBottom>
                  Taux d'intérêt: {compte.taux_interet}%
                </Typography>
                <Button
                  variant="outlined"
                  onClick={handleCalculInterets}
                >
                  Calculer les intérêts
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Détails du compte
            </Typography>
            <Typography>
              <strong>Client ID:</strong> {compte.client_id}
            </Typography>
            <Typography>
              <strong>Type:</strong> {compte.type_compte}
            </Typography>
            {compte.type_compte === 'courant' && (
              <Typography>
                <strong>Découvert autorisé:</strong> {compte.decouvert_autorise} Fcfa
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />


        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Historique des transactions
        </Typography>
        <Paper elevation={3} sx={{ p: 2, mb: 4 }}>
        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Type</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }} align="right">Montant</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.length > 0 ? (
                transactions.map((tx) => (
                  <TableRow key={tx.id} hover>
                    <TableCell>{tx.id}</TableCell>
                    <TableCell sx={{ 
                      color: tx.type_transaction === 'dépôt' ? 'green' : 'red',
                      fontWeight: 'bold'
                    }}>
                      {tx.type_transaction}
                    </TableCell>
                    <TableCell align="right">
                      {tx.montant.toLocaleString('fr-FR')} Fcfa
                    </TableCell>
                    <TableCell>
                      {new Date(tx.date_transaction).toLocaleString('fr-FR')}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
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