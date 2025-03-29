import React from 'react';
import { Typography, Box, Paper, Grid } from '@mui/material';
import { AccountBalance, People, AttachMoney } from '@mui/icons-material';

const Home = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Tableau de bord
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
            <People fontSize="large" color="primary" />
            <Box>
              <Typography variant="h6">Clients</Typography>
              <Typography variant="body2">Gestion des clients</Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
            <AccountBalance fontSize="large" color="secondary" />
            <Box>
              <Typography variant="h6">Comptes</Typography>
              <Typography variant="body2">Gestion des comptes</Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
            <AttachMoney fontSize="large" color="success" />
            <Box>
              <Typography variant="h6">Transactions</Typography>
              <Typography variant="body2">Opérations bancaires</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Typography variant="h5" gutterBottom>
        Bienvenue sur l'application de la Banque Delta
      </Typography>
      <Typography paragraph>
        Utilisez le menu de navigation pour accéder aux différentes fonctionnalités.
      </Typography>
    </Box>
  );
};

export default Home;