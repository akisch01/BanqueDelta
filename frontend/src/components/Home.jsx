import React from 'react';
import { 
  Typography, 
  Box, 
  Paper, 
  Grid, 
  useTheme,
  Grow,
  styled,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider
} from '@mui/material';
import { 
  AccountBalance, 
  People, 
  AttachMoney,
  TrendingUp,
  ArrowUpward,
  ArrowDownward,
  Payment
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';

const StatCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(3),
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[8],
    '& .icon-container': {
      background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
      color: theme.palette.common.white
    }
  }
}));

const IconContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 60,
  height: 60,
  borderRadius: '50%',
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[2],
  transition: 'all 0.3s ease'
}));

// Données pour le graphique
const chartData = [
  { name: 'Jan', value: 4000 },
  { name: 'Fév', value: 3000 },
  { name: 'Mar', value: 5000 },
  { name: 'Avr', value: 2780 },
  { name: 'Mai', value: 1890 },
  { name: 'Jun', value: 2390 },
  { name: 'Jul', value: 3490 }
];

// Données pour les activités récentes
const recentActivities = [
  { id: 1, type: 'depot', amount: 1500, account: 'Compte Épargne', date: '10 min ago' },
  { id: 2, type: 'retrait', amount: 800, account: 'Compte Courant', date: '1h ago' },
  { id: 3, type: 'virement', amount: 1200, account: 'Compte Entreprise', date: '3h ago' },
  { id: 4, type: 'depot', amount: 2500, account: 'Compte Courant', date: '5h ago' }
];

const Home = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const stats = [
    {
      icon: <People fontSize="large" />,
      title: "Clients",
      subtitle: "Gestion des clients",
      color: theme.palette.primary.main,
      value: "1,248",
      trend: "+12% ce mois",
      onClick: () => navigate('/clients')
    },
    {
      icon: <AccountBalance fontSize="large" />,
      title: "Comptes",
      subtitle: "Gestion des comptes",
      color: theme.palette.secondary.main,
      value: "2,845",
      trend: "+8% ce mois",
      onClick: () => navigate('/comptes')
    },
    {
      icon: <AttachMoney fontSize="large" />,
      title: "Transactions",
      subtitle: "Opérations bancaires",
      color: theme.palette.success.main,
      value: "5,427",
      trend: "+24% ce mois",
      onClick: () => navigate('/comptes')
    }
  ];

  const quickActions = [
    { 
      title: "Nouveau client", 
      icon: <People color="primary" />,
      onClick: () => navigate('/clients/new')
    },
    { 
      title: "Créer un compte", 
      icon: <AccountBalance color="secondary" />,
      onClick: () => navigate('/comptes/new')
    },
    { 
      title: "Effectuer un virement", 
      icon: <AttachMoney color="success" />,
      onClick: () => navigate('/comptes')
    }
  ];

  return (
    <Box sx={{ p: 4 }}>
      {/* Header Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" sx={{ fontWeight: 700, color: theme.palette.text.primary, mb: 1 }}>
          Tableau de bord
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 400, color: theme.palette.text.secondary }}>
          Bienvenue sur l'application de la Banque Delta
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={4} sx={{ mb: 8 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Grow in={true} timeout={index * 200 + 300}>
              <StatCard elevation={4} onClick={stat.onClick}>
                <IconContainer className="icon-container" sx={{ color: stat.color }}>
                  {stat.icon}
                </IconContainer>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.text.secondary, mb: 0.5 }}>
                    {stat.title}
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.text.primary, mb: 1 }}>
                    {stat.value}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TrendingUp fontSize="small" color="success" />
                    <Typography variant="body2" sx={{ color: theme.palette.success.main, fontWeight: 500 }}>
                      {stat.trend}
                    </Typography>
                  </Box>
                </Box>
              </StatCard>
            </Grow>
          </Grid>
        ))}
      </Grid>

      {/* Graphique et Activités récentes */}
      <Grid container spacing={4} sx={{ mb: 6 }}>
        {/* Graphique */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 4, borderRadius: 4, height: '100%' }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
              Statistiques des transactions
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                  <XAxis dataKey="name" stroke={theme.palette.text.secondary} />
                  <YAxis stroke={theme.palette.text.secondary} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke={theme.palette.primary.main} 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Activités récentes */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 4, height: '100%' }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
              Activités récentes
            </Typography>
            <List>
              {recentActivities.map((activity) => (
                <React.Fragment key={activity.id}>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      {activity.type === 'depot' ? (
                        <ArrowDownward color="success" />
                      ) : activity.type === 'retrait' ? (
                        <ArrowUpward color="error" />
                      ) : (
                        <Payment color="info" />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={`${activity.type === 'depot' ? 'Dépôt' : activity.type === 'retrait' ? 'Retrait' : 'Virement'} - ${activity.account}`}
                      secondary={`${activity.amount} fcfa • ${activity.date}`}
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Typography variant="h5" sx={{ fontWeight: 600, color: theme.palette.text.primary, mb: 3 }}>
        Accès rapide
      </Typography>
      <Grid container spacing={3}>
        {quickActions.map((action, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Paper
              onClick={action.onClick}
              sx={{
                p: 3,
                borderRadius: 3,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'translateY(-3px)',
                  boxShadow: theme.shadows[6],
                  backgroundColor: theme.palette.action.hover
                }
              }}
            >
              <IconContainer>
                {action.icon}
              </IconContainer>
              <Typography variant="h6" sx={{ fontWeight: 500 }}>
                {action.title}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Home;