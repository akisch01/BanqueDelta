import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../../services/auth';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Paper, 
  useTheme,
  Grow,
  Fade,
  InputAdornment,
  IconButton,
  Divider
} from '@mui/material';
import { 
  Person, 
  Lock, 
  Badge, 
  AssignmentInd, 
  Visibility, 
  VisibilityOff,
  ArrowBack
} from '@mui/icons-material';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    nom: '',
    prenom: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await register(formData);
      navigate('/login');
    } catch (err) {
      setError("Erreur lors de l'inscription");
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `
          radial-gradient(circle at 10% 20%, ${theme.palette.primary.light} 0%, transparent 30%),
          radial-gradient(circle at 90% 80%, ${theme.palette.secondary.light} 0%, transparent 30%),
          ${theme.palette.background.default}
        `,
        p: 2
      }}
    >
      <Grow in={true} timeout={700}>
        <Paper
          elevation={0}
          sx={{
            width: '100%',
            maxWidth: 500,
            p: 5,
            borderRadius: 4,
            backdropFilter: 'blur(12px)',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            position: 'relative',
            overflow: 'hidden',
            '&:before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 6,
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
            }
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 80,
                height: 80,
                borderRadius: '50%',
                bgcolor: 'primary.main',
                color: 'white',
                mb: 3,
                boxShadow: `0 8px 32px ${theme.palette.primary.main}40`,
                transition: 'all 0.5s ease',
                '&:hover': {
                  transform: 'rotate(15deg) scale(1.1)'
                }
              }}
            >
              <AssignmentInd sx={{ fontSize: 40 }} />
            </Box>
            <Typography 
              variant="h3" 
              component="h1"
              sx={{ 
                fontWeight: 800,
                color: theme.palette.text.primary,
                letterSpacing: -0.5,
                mb: 1
              }}
            >
              Créer un compte
            </Typography>
            <Typography 
              variant="body1"
              sx={{ 
                color: theme.palette.text.secondary,
                fontSize: '1.1rem'
              }}
            >
              Rejoignez notre communauté en quelques secondes
            </Typography>
          </Box>

          {error && (
            <Fade in={true}>
              <Typography 
                color="error" 
                sx={{ 
                  mb: 3,
                  textAlign: 'center',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1.5
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" 
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {error}
              </Typography>
            </Fade>
          )}

          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                label="Prénom"
                name="prenom"
                fullWidth
                value={formData.prenom}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person sx={{ color: theme.palette.text.secondary }} />
                    </InputAdornment>
                  ),
                  sx: { '& input': { py: 1.8 } }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    backgroundColor: 'rgba(0, 0, 0, 0.02)',
                    '& fieldset': {
                      borderColor: 'rgba(0, 0, 0, 0.08)'
                    },
                    '&:hover fieldset': {
                      borderColor: theme.palette.primary.light
                    }
                  }
                }}
              />
              <TextField
                label="Nom"
                name="nom"
                fullWidth
                value={formData.nom}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Badge sx={{ color: theme.palette.text.secondary }} />
                    </InputAdornment>
                  ),
                  sx: { '& input': { py: 1.8 } }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    backgroundColor: 'rgba(0, 0, 0, 0.02)',
                    '& fieldset': {
                      borderColor: 'rgba(0, 0, 0, 0.08)'
                    },
                    '&:hover fieldset': {
                      borderColor: theme.palette.primary.light
                    }
                  }
                }}
              />
            </Box>

            <TextField
              label="Nom d'utilisateur"
              name="username"
              fullWidth
              margin="normal"
              value={formData.username}
              onChange={handleChange}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person sx={{ color: theme.palette.text.secondary }} />
                  </InputAdornment>
                ),
                sx: { '& input': { py: 1.8 } }
              }}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  backgroundColor: 'rgba(0, 0, 0, 0.02)',
                  '& fieldset': {
                    borderColor: 'rgba(0, 0, 0, 0.08)'
                  },
                  '&:hover fieldset': {
                    borderColor: theme.palette.primary.light
                  }
                }
              }}
            />

            <TextField
              label="Mot de passe"
              name="password"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              margin="normal"
              value={formData.password}
              onChange={handleChange}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: theme.palette.text.secondary }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{ color: theme.palette.text.secondary }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
                sx: { '& input': { py: 1.8 } }
              }}
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  backgroundColor: 'rgba(0, 0, 0, 0.02)',
                  '& fieldset': {
                    borderColor: 'rgba(0, 0, 0, 0.08)'
                  },
                  '&:hover fieldset': {
                    borderColor: theme.palette.primary.light
                  }
                }
              }}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              disabled={isLoading}
              sx={{
                py: 2,
                borderRadius: 3,
                fontSize: 16,
                fontWeight: 700,
                textTransform: 'none',
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 7px 14px rgba(0, 0, 0, 0.15)'
                },
                '&:active': {
                  transform: 'translateY(0)'
                }
              }}
            >
              {isLoading ? 'Création en cours...' : 'Créer mon compte'}
            </Button>
          </form>

          <Divider sx={{ my: 4, borderColor: 'rgba(0, 0, 0, 0.08)' }} />

          <Box sx={{ textAlign: 'center' }}>
            <Button
              startIcon={<ArrowBack />}
              onClick={() => navigate('/login')}
              sx={{
                color: theme.palette.text.secondary,
                fontWeight: 500,
                '&:hover': {
                  color: theme.palette.primary.main,
                  backgroundColor: 'transparent'
                }
              }}
            >
              Retour à la connexion
            </Button>
          </Box>
        </Paper>
      </Grow>
    </Box>
  );
};

export default Register;