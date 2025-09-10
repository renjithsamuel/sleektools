'use client';
import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Fade,
  Popper,
  Paper,
  ClickAwayListener,
  MenuList,
  Divider,
  Switch,
  FormControlLabel,
  Tooltip,
} from '@mui/material';
import { useTheme as useMuiTheme } from '@mui/material/styles';
import {
  FaGithub,
  FaHeart,
  FaShieldAlt,
  FaBars,
  FaCode,
  FaCheckCircle,
  FaExchangeAlt,
  FaRandom,
  FaTools,
  FaMoon,
  FaSun,
  FaChevronDown,
  FaUserShield,
  FaCog,
  FaTrash,
  FaHistory,
} from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { useTheme } from '../../context/ThemeContext';
import { TOOL_CATEGORIES, getToolsByCategory } from '../../constants/tools';

const iconMap = {
  FaCode,
  FaCheckCircle,
  FaExchangeAlt,
  FaRandom,
  FaTools,
};

export const ToolsNavbar = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [dropdownAnchor, setDropdownAnchor] = useState<null | HTMLElement>(null);
  const [settingsAnchor, setSettingsAnchor] = useState<null | HTMLElement>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [supportModalOpen, setSupportModalOpen] = useState(false);
  const muiTheme = useMuiTheme();
  const { isDarkMode, toggleTheme } = useTheme();
  const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down('md'));
  const router = useRouter();

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDropdownOpen = (event: React.MouseEvent<HTMLElement>, categoryId: string) => {
    setDropdownAnchor(event.currentTarget);
    setActiveDropdown(categoryId);
  };

  const handleDropdownClose = () => {
    setDropdownAnchor(null);
    setActiveDropdown(null);
  };

  const handleSettingsOpen = (event: React.MouseEvent<HTMLElement>) => {
    setSettingsAnchor(event.currentTarget);
  };

  const handleSettingsClose = () => {
    setSettingsAnchor(null);
  };

  const handleAdminAccess = () => {
    router.push('/admin');
    handleSettingsClose();
  };

  const handleClearHistory = () => {
    localStorage.clear();
    handleSettingsClose();
    // Show success message
  };

  const handleGitHub = () => {
    window.open('https://github.com/your-repo/sleektools', '_blank');
    handleSettingsClose();
  };

  const handleSupportModal = () => {
    setSupportModalOpen(true);
    handleSettingsClose();
  };

  const menuItems = [
    { label: 'All Tools', path: '/' },
    ...TOOL_CATEGORIES.map(cat => ({
      label: cat.name,
      path: `/${cat.id}`,
      category: cat,
    })),
  ];

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: 'background.paper',
          backdropFilter: 'blur(20px)',
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 4 } }}>
          {/* Logo */}
          <Button
            onClick={() => router.push('/')}
            sx={{
              p: 1,
              textTransform: 'none',
              minWidth: 'auto',
            }}
          >
            <Typography
              variant="h5"
              component="h1"
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(45deg, #4F46E5, #7C3AED)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                cursor: 'pointer',
              }}
            >
              SleekTools
            </Typography>
          </Button>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box display="flex" alignItems="center" gap={1}>
              <Button
                onClick={() => router.push('/')}
                sx={{
                  color: 'text.primary',
                  fontWeight: 500,
                  borderRadius: 2,
                  px: 2,
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                All Tools
              </Button>

              {TOOL_CATEGORIES.map(category => {
                const IconComponent = iconMap[category.icon as keyof typeof iconMap];
                return (
                  <ClickAwayListener key={category.id} onClickAway={handleDropdownClose}>
                    <Box>
                      <Button
                        onMouseEnter={(event: React.MouseEvent<HTMLElement>) =>
                          handleDropdownOpen(event, category.id)
                        }
                        onClick={() => router.push(`/${category.id}`)}
                        endIcon={<FaChevronDown size={12} />}
                        sx={{
                          color: 'text.primary',
                          fontWeight: 500,
                          borderRadius: 2,
                          px: 2,
                          '&:hover': {
                            backgroundColor: 'action.hover',
                          },
                        }}
                      >
                        <IconComponent style={{ marginRight: 8 }} />
                        {category.name}
                      </Button>

                      <Popper
                        open={activeDropdown === category.id}
                        anchorEl={dropdownAnchor}
                        placement="bottom-start"
                        transition
                        sx={{ zIndex: muiTheme.zIndex.tooltip }}
                      >
                        {({ TransitionProps, placement }: any) => (
                          <Fade {...TransitionProps} timeout={200}>
                            <Paper
                              elevation={8}
                              sx={{
                                mt: 1,
                                minWidth: 250,
                                bgcolor: 'background.paper',
                                border: 1,
                                borderColor: 'divider',
                                borderRadius: 2,
                              }}
                              onMouseLeave={handleDropdownClose}
                            >
                              <MenuList sx={{ py: 1 }}>
                                <MenuItem
                                  onClick={() => {
                                    router.push(`/${category.id}`);
                                    handleDropdownClose();
                                  }}
                                  sx={{ fontWeight: 600, color: category.color }}
                                >
                                  <ListItemIcon sx={{ color: category.color }}>
                                    <IconComponent />
                                  </ListItemIcon>
                                  All {category.name}
                                </MenuItem>
                                <Divider />
                                {getToolsByCategory(category.id)
                                  .slice(0, 5)
                                  .map(tool => (
                                    <MenuItem
                                      key={tool.id}
                                      onClick={() => {
                                        router.push(tool.route);
                                        handleDropdownClose();
                                      }}
                                      sx={{ fontSize: '0.875rem' }}
                                    >
                                      {tool.name}
                                    </MenuItem>
                                  ))}
                                {getToolsByCategory(category.id).length > 5 && (
                                  <MenuItem
                                    onClick={() => {
                                      router.push(`/${category.id}`);
                                      handleDropdownClose();
                                    }}
                                    sx={{ fontStyle: 'italic', color: 'text.secondary' }}
                                  >
                                    View all {getToolsByCategory(category.id).length} tools...
                                  </MenuItem>
                                )}
                              </MenuList>
                            </Paper>
                          </Fade>
                        )}
                      </Popper>
                    </Box>
                  </ClickAwayListener>
                );
              })}
            </Box>
          )}

          {/* Right Side Actions */}
          <Box display="flex" alignItems="center" gap={1}>
            {/* Security Badge */}
            {!isMobile && (
              <Chip
                icon={<FaShieldAlt />}
                label="Client-Side"
                size="small"
                sx={{
                  backgroundColor: 'rgba(5, 150, 105, 0.1)',
                  color: '#059669',
                  fontWeight: 600,
                  border: '1px solid rgba(5, 150, 105, 0.2)',
                  '& .MuiChip-icon': {
                    color: '#059669',
                  },
                }}
              />
            )}

            {/* Settings Dropdown */}
            <Tooltip title="Settings">
              <IconButton
                onClick={handleSettingsOpen}
                sx={{
                  color: 'text.primary',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                <FaCog />
              </IconButton>
            </Tooltip>

            <Menu
              anchorEl={settingsAnchor}
              open={Boolean(settingsAnchor)}
              onClose={handleSettingsClose}
              PaperProps={{
                elevation: 8,
                sx: {
                  mt: 1,
                  minWidth: 200,
                  bgcolor: 'background.paper',
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 2,
                },
              }}
            >
              <MenuItem onClick={toggleTheme}>
                <ListItemIcon>{isDarkMode ? <FaSun /> : <FaMoon />}</ListItemIcon>
                <ListItemText primary={`${isDarkMode ? 'Light' : 'Dark'} Mode`} />
              </MenuItem>

              <MenuItem onClick={handleAdminAccess}>
                <ListItemIcon>
                  <FaUserShield />
                </ListItemIcon>
                <ListItemText primary="Admin Dashboard" />
              </MenuItem>

              <MenuItem onClick={handleGitHub}>
                <ListItemIcon>
                  <FaGithub />
                </ListItemIcon>
                <ListItemText primary="GitHub" />
              </MenuItem>

              <MenuItem onClick={handleClearHistory}>
                <ListItemIcon>
                  <FaTrash />
                </ListItemIcon>
                <ListItemText primary="Clear History" />
              </MenuItem>

              <MenuItem onClick={handleSupportModal}>
                <ListItemIcon>
                  <FaHeart />
                </ListItemIcon>
                <ListItemText primary="Support" />
              </MenuItem>
            </Menu>

            {/* Mobile Menu */}
            {isMobile && (
              <>
                <IconButton onClick={handleMenuOpen} sx={{ color: 'text.primary' }}>
                  <FaBars />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  PaperProps={{
                    sx: {
                      bgcolor: 'background.paper',
                      border: 1,
                      borderColor: 'divider',
                      borderRadius: 2,
                      mt: 1,
                      minWidth: 200,
                    },
                  }}
                >
                  {menuItems.map(item => (
                    <MenuItem
                      key={item.path}
                      onClick={() => {
                        router.push(item.path);
                        handleMenuClose();
                      }}
                      sx={{
                        gap: 1,
                        borderRadius: 1,
                        mx: 1,
                        my: 0.5,
                        '&:hover': {
                          backgroundColor: 'action.hover',
                        },
                      }}
                    >
                      {'category' in item && item.category && (
                        <>
                          {React.createElement(iconMap[item.category.icon as keyof typeof iconMap])}
                          {item.label}
                        </>
                      )}
                      {!('category' in item) && item.label}
                    </MenuItem>
                  ))}
                  <Divider sx={{ my: 1 }} />
                  <MenuItem>
                    <FormControlLabel
                      control={<Switch checked={isDarkMode} onChange={toggleTheme} size="small" />}
                      label={isDarkMode ? 'Dark Mode' : 'Light Mode'}
                    />
                  </MenuItem>
                </Menu>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Support Modal */}
      <Dialog
        open={supportModalOpen}
        onClose={() => setSupportModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            bgcolor: 'background.paper',
          },
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            bgcolor: 'background.paper',
          }}
        >
          <FaHeart style={{ color: '#EF4444' }} />
          Support SleekTools
        </DialogTitle>
        <DialogContent sx={{ bgcolor: 'background.paper' }}>
          <Typography paragraph>
            SleekTools is a free, open-source collection of developer tools that runs entirely in
            your browser.
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <FaShieldAlt style={{ color: '#059669' }} />
              </ListItemIcon>
              <ListItemText
                primary="100% Client-Side Processing"
                secondary="Your data never leaves your device"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <FaGithub />
              </ListItemIcon>
              <ListItemText primary="Open Source" secondary="Contribute on GitHub" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <FaHeart style={{ color: '#EF4444' }} />
              </ListItemIcon>
              <ListItemText
                primary="Free Forever"
                secondary="No ads, no tracking, no subscriptions"
              />
            </ListItem>
          </List>
          <Typography variant="body2" color="text.secondary">
            If you find SleekTools useful, consider starring us on GitHub or sharing with others!
          </Typography>
        </DialogContent>
        <DialogActions sx={{ bgcolor: 'background.paper', gap: 1 }}>
          <Button onClick={() => setSupportModalOpen(false)}>Close</Button>
          <Button
            variant="contained"
            startIcon={<FaGithub />}
            href="https://github.com"
            target="_blank"
            onClick={() => setSupportModalOpen(false)}
          >
            Star on GitHub
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
