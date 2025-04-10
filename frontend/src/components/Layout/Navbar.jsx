import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Context/Context';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  useMediaQuery,
  useTheme,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  Badge
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle,
  ExitToApp,
  Settings,
  Notifications,
  Dashboard
} from '@mui/icons-material';

const Navbar = ({ handleDrawerToggle }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    logout();
    navigate('/login');
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        zIndex: theme.zIndex.drawer + 1,
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
        color: theme.palette.text.primary,
        transition: 'all 0.3s ease',
        '&:hover': {
          background: 'rgba(255, 255, 255, 0.95)',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
        }
      }}
    >
      <Toolbar sx={{ 
        px: { xs: 2, md: 4 },
        minHeight: '72px !important'
      }}>
        {isMobile && (
          <IconButton
            size="large"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ 
              mr: 2,
              color: theme.palette.primary.main
            }}
          >
            <MenuIcon />
          </IconButton>
        )}

        {/* Logo/Brand */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          flexGrow: 1,
          '&:hover': {
            '& .logo-text': {
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }
          }
        }}>
          <Dashboard sx={{ 
            mr: 1, 
            fontSize: 28,
            color: theme.palette.primary.main 
          }} />
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/"
            className="logo-text"
            sx={{
              fontWeight: 800,
              letterSpacing: -0.5,
              textDecoration: 'none',
              color: theme.palette.text.primary,
              transition: 'all 0.3s ease'
            }}
          >
            Banque Delta
          </Typography>
        </Box>

        {/* Navigation */}
        {!isMobile && user && (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: 1,
            mx: 4
          }}>
            <Button
              component={Link}
              to="/"
              sx={{
                color: theme.palette.text.secondary,
                fontWeight: 500,
                '&:hover': {
                  color: theme.palette.primary.main,
                  backgroundColor: 'transparent'
                }
              }}
            >
              Tableau de bord
            </Button>
            <Button
              component={Link}
              to="/clients"
              sx={{
                color: theme.palette.text.secondary,
                fontWeight: 500,
                '&:hover': {
                  color: theme.palette.primary.main,
                  backgroundColor: 'transparent'
                }
              }}
            >
              Clients
            </Button>
            <Button
              component={Link}
              to="/comptes"
              sx={{
                color: theme.palette.text.secondary,
                fontWeight: 500,
                '&:hover': {
                  color: theme.palette.primary.main,
                  backgroundColor: 'transparent'
                }
              }}
            >
              Transactions
            </Button>
          </Box>
        )}

        {/* User Area */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          gap: { xs: 1, md: 2 }
        }}>
          {user ? (
            <>
              <IconButton
                size="large"
                color="inherit"
                sx={{
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover
                  }
                }}
              >
                <Badge badgeContent={3} color="error">
                  <Notifications sx={{ 
                    color: theme.palette.text.secondary 
                  }} />
                </Badge>
              </IconButton>

              <IconButton
                size="large"
                onClick={handleMenu}
                color="inherit"
                sx={{
                  p: 0,
                  ml: 1,
                  '&:hover': {
                    '& .MuiAvatar-root': {
                      boxShadow: `0 0 0 2px ${theme.palette.primary.main}`
                    }
                  }
                }}
              >
                <Avatar
                  alt={user.username}
                  src="/static/images/avatar/1.jpg"
                  sx={{ 
                    width: 36, 
                    height: 36,
                    transition: 'all 0.3s ease'
                  }}
                />
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                PaperProps={{
                  elevation: 4,
                  sx: {
                    mt: 1.5,
                    minWidth: 200,
                    borderRadius: 2,
                    overflow: 'visible',
                    '&:before': {
                      content: '""',
                      display: 'block',
                      position: 'absolute',
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: 'background.paper',
                      transform: 'translateY(-50%) rotate(45deg)',
                      zIndex: 0
                    }
                  }
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem 
                  onClick={handleClose}
                  component={Link}
                  to="/profile"
                  sx={{ py: 1.5 }}
                >
                  <AccountCircle sx={{ mr: 1.5, color: 'text.secondary' }} />
                  Mon profil
                </MenuItem>
                <MenuItem 
                  onClick={handleClose}
                  component={Link}
                  to="/settings"
                  sx={{ py: 1.5 }}
                >
                  <Settings sx={{ mr: 1.5, color: 'text.secondary' }} />
                  Paramètres
                </MenuItem>
                <Divider />
                <MenuItem 
                  onClick={handleLogout}
                  sx={{ py: 1.5 }}
                >
                  <ExitToApp sx={{ mr: 1.5, color: 'text.secondary' }} />
                  Déconnexion
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button
                component={Link}
                to="/login"
                variant="text"
                sx={{
                  color: theme.palette.text.secondary,
                  fontWeight: 500,
                  '&:hover': {
                    color: theme.palette.primary.main,
                    backgroundColor: 'transparent'
                  }
                }}
              >
                Connexion
              </Button>
              <Button
                component={Link}
                to="/register"
                variant="contained"
                sx={{
                  ml: 1,
                  px: 3,
                  borderRadius: 2,
                  fontWeight: 500,
                  textTransform: 'none',
                  boxShadow: 'none',
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                  '&:hover': {
                    boxShadow: `0 4px 12px ${theme.palette.primary.main}40`
                  }
                }}
              >
                Inscription
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;