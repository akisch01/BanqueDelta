import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './Context/Context';
import Navbar from './components/Layout/Navbar';
import Sidebar from './components/Layout/Sidebar';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ClientList from './components/Clients/ClientList';
import ClientForm from './components/Clients/ClientForm';
import ClientDetails from './components/Clients/ClientDetails';
import CompteList from './components/Comptes/CompteList';
import CompteForm from './components/Comptes/CompteForm';
import CompteOperations from './components/Comptes/CompteOperations';
import PrivateRoute from './components/Auth/PrivateRoute';
import Home from './components/Home';
import { CssBaseline, ThemeProvider, Box, useTheme } from '@mui/material';
import theme from './styles/theme';

const drawerWidth = 240;

const App = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Box sx={{ display: 'flex' }}>
          <Navbar handleDrawerToggle={handleDrawerToggle} />
          <Sidebar />
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: 3,
              width: { sm: `calc(100% - ${drawerWidth}px)` },
              marginTop: '64px',
            }}
          >
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              <Route path="/" element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              } />
              
              <Route path="/clients" element={
                <PrivateRoute>
                  <ClientList />
                </PrivateRoute>
              } />
              
              <Route path="/clients/new" element={
                <PrivateRoute>
                  <ClientForm />
                </PrivateRoute>
              } />
              
              <Route path="/clients/:id/edit" element={
                <PrivateRoute>
                  <ClientForm />
                </PrivateRoute>
              } />
              
              <Route path="/clients/:id" element={
                <PrivateRoute>
                  <ClientDetails />
                </PrivateRoute>
              } />
              
              <Route path="/comptes" element={
                <PrivateRoute>
                  <CompteList />
                </PrivateRoute>
              } />
              
              <Route path="/comptes/new" element={
                <PrivateRoute>
                  <CompteForm />
                </PrivateRoute>
              } />
              
              <Route path="/comptes/:id/edit" element={
                <PrivateRoute>
                  <CompteForm />
                </PrivateRoute>
              } />
              
              <Route path="/comptes/:id" element={
                <PrivateRoute>
                  <CompteOperations />
                </PrivateRoute>
              } />
            </Routes>
          </Box>
        </Box>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;