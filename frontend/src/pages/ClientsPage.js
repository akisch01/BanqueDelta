import { useState, useEffect } from 'react';
import { Container, Typography } from '@mui/material';
import ClientForm from '../components/Clients/ClientForm';
import ClientList from '../components/ClientList';
import { getClients, createClient } from '../services/api';

const ClientsPage = () => {
  const [clients, setClients] = useState([]);
  const [newClient, setNewClient] = useState({ nom: '', prenom: '' });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    const response = await getClients();
    setClients(response.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createClient(newClient);
    fetchClients();
    setNewClient({ nom: '', prenom: '' });
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ my: 4 }}>Gestion des Clients</Typography>
      <ClientForm 
        client={{
          nom: newClient.nom,
          setNom: (value) => setNewClient({...newClient, nom: value}),
          prenom: newClient.prenom,
          setPrenom: (value) => setNewClient({...newClient, prenom: value})
        }} 
        onSubmit={handleSubmit}
      />
      <ClientList clients={clients} />
    </Container>
  );
};

export default ClientsPage;