import {
    Drawer,
    List,
    ListItemIcon,
    ListItemText,
    Divider,
    Toolbar,
    Box,
    ListItemButton,
    styled,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import {
    Dashboard as DashboardIcon,
    Sensors as NodesIcon,
    Warning as AlertsIcon,
    ShowChart as ReadingsIcon,
    Settings as SettingsIcon,
    People as UsersIcon,
    Tune as ThresholdsIcon, // New icon for Thresholds
    Hub as TopologyIcon // New icon for Topology
} from '@mui/icons-material';
import { NavLink, useLocation } from 'react-router-dom';
import { useAppStore } from '@/store';

const drawerWidth = 240;

const StyledNavLink = styled(NavLink)(({ theme }) => ({
    color: theme.palette.text.secondary,
    textDecoration: 'none',
    width: '100%',
    '&.active': {
        color: theme.palette.primary.main,
        backgroundColor: theme.palette.action.selected,
    },
    '&.active .MuiListItemIcon-root': {
        color: theme.palette.primary.main,
    },
    '&:hover': {
        backgroundColor: theme.palette.action.hover,
    },
}));

const navItems = [
    { path: '/', label: 'Dashboard', icon: <DashboardIcon /> },
    { path: '/nodes', label: 'Nodes', icon: <NodesIcon /> },
    { path: '/readings', label: 'Readings', icon: <ReadingsIcon /> },
    { path: '/alerts', label: 'Alerts', icon: <AlertsIcon /> },
    { path: '/topology', label: 'Topology', icon: <TopologyIcon /> }, // Added Topology
];

const settingsItems = [
    { path: '/thresholds', label: 'Thresholds', icon: <ThresholdsIcon /> }, // Added Thresholds
    { path: '/users', label: 'User Management', icon: <UsersIcon /> },
    { path: '/settings', label: 'Settings', icon: <SettingsIcon /> },
];

export default function Sidebar() {
    const theme = useTheme();
    const location = useLocation();
    const { sidebarOpen, setSidebarOpen } = useAppStore();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    return (
      <Drawer
        variant={isMobile ? 'temporary' : 'persistent'}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
                width: drawerWidth,
                boxSizing: 'border-box',
                backgroundColor: theme.palette.background.paper,
            },
        }}
        ModalProps={{
            keepMounted: true,
        }}
      >
          <Toolbar sx={{ minHeight: '64px !important' }} />
          <Box sx={{
              height: 'calc(100vh - 64px)',
              overflowY: 'auto',
              '&::-webkit-scrollbar': {
                  width: '6px',
              },
              '&::-webkit-scrollbar-thumb': {
                  backgroundColor: theme.palette.divider,
                  borderRadius: '3px',
              },
          }}>
              <List sx={{ p: 0 }}>
                  {navItems.map((item) => (
                    <StyledNavLink
                      to={item.path}
                      key={item.path}
                    >
                        <ListItemButton
                          selected={location.pathname === item.path}
                          sx={{
                              px: 3,
                              py: 1.25,
                          }}
                        >
                            <ListItemIcon sx={{
                                minWidth: 40,
                                color: location.pathname === item.path
                                  ? theme.palette.primary.main
                                  : theme.palette.text.secondary
                            }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText
                              primary={item.label}
                              primaryTypographyProps={{
                                  fontWeight: location.pathname === item.path ? 600 : 400,
                                  fontSize: '0.875rem'
                              }}
                            />
                        </ListItemButton>
                    </StyledNavLink>
                  ))}
              </List>
              <Divider sx={{ my: 1 }} />
              <List sx={{ p: 0 }}>
                  {settingsItems.map((item) => (
                    <StyledNavLink
                      to={item.path}
                      key={item.path}
                    >
                        <ListItemButton
                          selected={location.pathname === item.path}
                          sx={{
                              px: 3,
                              py: 1.25,
                          }}
                        >
                            <ListItemIcon sx={{
                                minWidth: 40,
                                color: location.pathname === item.path
                                  ? theme.palette.primary.main
                                  : theme.palette.text.secondary
                            }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText
                              primary={item.label}
                              primaryTypographyProps={{
                                  fontWeight: location.pathname === item.path ? 600 : 400,
                                  fontSize: '0.875rem'
                              }}
                            />
                        </ListItemButton>
                    </StyledNavLink>
                  ))}
              </List>
          </Box>
      </Drawer>
    );
}