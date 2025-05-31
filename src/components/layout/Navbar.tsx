import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  Box,
  useMediaQuery,
  Divider,
  styled,
  ListItemIcon,
  ListItemText,
  List,
  ListItem,
  Popover,
  Button,
  Paper
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import SidebarToggleButton from '@/components/layout/SidebarToggleButton';
import { useAuthStore } from '@/store/authStore';
import { useNotificationStore } from '@/store/notificationStore';
import { formatDistanceToNow } from 'date-fns';

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 5,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}));

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuthStore();
  const { notifications, unreadCount, markAsRead, fetchNotifications } = useNotificationStore();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notifAnchorEl, setNotifAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Fetch notifications on mount and periodically
  useEffect(() => {
    if (isAuthenticated) {
      const fetch = async () => {
        try {
          await fetchNotifications();
        } catch (error) {
          console.error('Error fetching notifications:', error);
        }
      };

      fetch();
      const interval = setInterval(fetch, 30000); // Poll every 30 seconds
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, fetchNotifications]);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotifMenu = (event: React.MouseEvent<HTMLElement>) => {
    setNotifAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotifClose = () => {
    setNotifAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      handleClose();
    }
  };

  const handleNotificationClick = async (id: string) => {
    try {
      await markAsRead(id);
      // You could add navigation logic here based on notification type
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: theme.zIndex.drawer + 1,
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        boxShadow: '0 1px 4px 0 rgba(0,0,0,0.05)',
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 3 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {isMobile && isAuthenticated && <SidebarToggleButton />}
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              ml: 2,
              fontWeight: 700,
              letterSpacing: 1.2,
              color: theme.palette.primary.main,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Box
              component="span"
              sx={{
                display: 'inline-block',
                width: 8,
                height: 8,
                bgcolor: theme.palette.primary.main,
                borderRadius: '50%',
                mr: 1,
              }}
            />
            WSN Monitoring
          </Typography>
        </Box>

        {isAuthenticated && user && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              color="inherit"
              sx={{ p: 0.5 }}
              onClick={handleNotifMenu}
              aria-label="notifications"
            >
              <StyledBadge badgeContent={unreadCount} color="error">
                <NotificationsIcon />
              </StyledBadge>
            </IconButton>

            <Popover
              open={Boolean(notifAnchorEl)}
              anchorEl={notifAnchorEl}
              onClose={handleNotifClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              slotProps={{
                paper: {
                  sx: {
                    width: 360,
                    maxHeight: 480,
                    p: 0,
                    mt: 1.5,
                    ml: 0.75,
                  },
                },
              }}
            >
              <Paper>
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6">Notifications</Typography>
                  {unreadCount > 0 && (
                    <Button
                      size="small"
                      onClick={() => markAsRead('all')}
                      disabled={unreadCount === 0}
                    >
                      Mark all as read
                    </Button>
                  )}
                </Box>
                <Divider />
                <List sx={{ p: 0 }}>
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <ListItem
                        key={notification.id}
                        onClick={() => handleNotificationClick(notification.id)}
                        sx={{
                          bgcolor: notification.read ? 'inherit' : 'action.hover',
                          borderLeft: notification.read ? 'none' : `3px solid ${theme.palette.primary.main}`,
                          px: 2,
                          py: 1.5,
                          cursor: 'pointer',
                        }}
                      >
                        <ListItemText
                          primary={notification.title}
                          secondary={
                            <>
                              {notification.message}
                              <Typography
                                component="span"
                                variant="caption"
                                display="block"
                                color="text.secondary"
                                mt={0.5}
                              >
                                {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                              </Typography>
                            </>
                          }
                          primaryTypographyProps={{
                            fontWeight: notification.read ? 'normal' : 'bold',
                          }}
                        />
                      </ListItem>
                    ))
                  ) : (
                    <ListItem>
                      <ListItemText primary="No notifications" />
                    </ListItem>
                  )}
                </List>
              </Paper>
            </Popover>

            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
              sx={{ p: 0, ml: 1 }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography
                  variant="body1"
                  sx={{
                    display: { xs: 'none', sm: 'block' },
                    fontWeight: 500,
                  }}
                >
                  {user.username}
                </Typography>
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    fontSize: '1rem',
                  }}
                >
                  {user.username.charAt(0).toUpperCase()}
                </Avatar>
              </Box>
            </IconButton>

            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              slotProps={{
                paper: {
                  elevation: 2,
                  sx: {
                    minWidth: 200,
                    overflow: 'visible',
                    mt: 1.5,
                    '& .MuiAvatar-root': {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
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
                      zIndex: 0,
                    },
                  },
                },
              }}
            >
              <MenuItem
                onClick={() => {
                  navigate('/settings');
                  handleClose();
                }}
                sx={{ py: 1 }}
              >
                <ListItemIcon>
                  <Avatar sx={{ width: 24, height: 24 }} />
                </ListItemIcon>
                Profile
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout} sx={{ py: 1 }}>
                Logout
              </MenuItem>
            </Menu>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}