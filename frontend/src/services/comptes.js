import api from './api';

export const getComptes = async () => {
  const response = await api.get('/comptes/');
  return response.data;
};


export const getCompte = async (id) => {
  const response = await api.get(`/comptes/${id}`);
  return response.data;
};

export const createCompte = async (compteData) => {
  const response = await api.post('/comptes/', compteData);
  return response.data;
};

export const updateCompte = async (id, compteData) => {
  const response = await api.put(`/comptes/${id}`, compteData);
  return response.data;
};

export const deleteCompte = async (id) => {
  const response = await api.delete(`/comptes/${id}`);
  return response.data;
};

export const calculerInterets = async (compteId) => {
  const response = await api.post(`/comptes/${compteId}/calcul-interets`);
  return response.data;
};

export const getTransactions = async (compteId) => {
  const response = await api.get(`/comptes/${compteId}/transactions`);
  console.log("Réponse complète:", response); // Ajoutez ce log
  return response.data;
};

export const deposerArgent = async (compteId, montant) => {
  return api.post(`/comptes/${compteId}/depot`, {
    montant: parseFloat(montant)
  });
};

export const retirerArgent = async (compteId, montant) => {
  return api.post(`/comptes/${compteId}/retrait`, {
    montant: parseFloat(montant)
  });
};