import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Context/Context';
import { login } from '../../services/auth';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Paper, 
  Link, 
  useTheme,
  Grow,
  Fade,
  InputAdornment,
  IconButton,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import { Lock, Email, Visibility, VisibilityOff } from '@mui/icons-material';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login: authLogin } = useContext(AuthContext);
  const navigate = useNavigate();
  const theme = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const { access_token } = await login(username, password);
      const user = { username };
      authLogin(access_token, user);
      navigate('/');
    } catch (err) {
      setError('Identifiants incorrects');
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
          radial-gradient(circle at 75% 50%, ${theme.palette.primary.light} 0%, transparent 50%),
          radial-gradient(circle at 25% 80%, ${theme.palette.secondary.light} 0%, transparent 50%),
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
            maxWidth: 450,
            p: 6,
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
          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 90,
                height: 90,
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
              <Lock sx={{ fontSize: 44 }} />
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
              Connexion
            </Typography>
            <Typography 
              variant="body1"
              sx={{ 
                color: theme.palette.text.secondary,
                fontSize: '1.1rem'
              }}
            >
              Entrez vos identifiants pour accéder à votre compte
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
            <TextField
              label="Email ou nom d'utilisateur"
              variant="outlined"
              fullWidth
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email sx={{ 
                      color: theme.palette.text.secondary,
                      mr: 1 
                    }} />
                  </InputAdornment>
                ),
                sx: {
                  '& input': {
                    py: 1.8
                  }
                }
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
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: theme.palette.primary.main
                  }
                }
              }}
            />

            <TextField
              label="Mot de passe"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ 
                      color: theme.palette.text.secondary,
                      mr: 1 
                    }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{ color: theme.palette.text.secondary }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
                sx: {
                  '& input': {
                    py: 1.8
                  }
                }
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
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: theme.palette.primary.main
                  }
                }
              }}
            />

            <FormControlLabel
              control={
                <Checkbox 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  color="primary"
                />
              }
              label="Se souvenir de moi"
              sx={{ 
                mb: 3,
                '& .MuiTypography-root': {
                  color: theme.palette.text.secondary
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
              {isLoading ? 'Connexion en cours...' : 'Se connecter'}
            </Button>
          </form>

          <Box sx={{ 
            textAlign: 'center',
            mt: 4
          }}>
            <Typography 
              variant="body2"
              sx={{ 
                color: theme.palette.text.secondary
              }}
            >
              Vous n'avez pas de compte ?{' '}
              <Link 
                href="/register" 
                underline="none"
                sx={{ 
                  fontWeight: 600,
                  color: theme.palette.primary.main,
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
              >
                Créer un compte
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Grow>
    </Box>
  );
};

export default Login;