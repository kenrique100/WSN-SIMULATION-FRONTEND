import {
    Drawer,
    List,
    ListItemIcon,
    ListItemText,
    Divider,
    Toolbar,
    Box,
    ListItemButton
} from '@mui/material';
import {
    Dashboard as DashboardIcon,
    Sensors as NodesIcon,
    Warning as AlertsIcon,
    ShowChart as ReadingsIcon,
    Settings as SettingsIcon
} from '@mui/icons-material';
import { NavLink } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { useAppStore } from '@/store';

const drawerWidth = 240;

const StyledNavLink = styled(NavLink)(({ theme }) => ({
    color: theme.palette.text.primary,
    textDecoration: 'none',
    '&.active': {
        backgroundColor: theme.palette.action.selected,
    },
    '&.active .MuiListItemIcon-root': {
        color: theme.palette.primary.main,
    },
}));

export default function Sidebar() {
    const sidebarOpen = useAppStore((state) => state.sidebarOpen);

    return (
      <Drawer
        variant="persistent"
        open={sidebarOpen}
        sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
                width: drawerWidth,
                boxSizing: 'border-box',
                transition: 'width 0.3s ease',
            },
        }}
      >
          <Toolbar /> {/* Spacer to align with AppBar */}
          <Box sx={{ overflow: 'auto' }}>
              <List>
                  <StyledNavLink to="/">
                      <ListItemButton>
                          <ListItemIcon>
                              <DashboardIcon />
                          </ListItemIcon>
                          <ListItemText primary="Dashboard" />
                      </ListItemButton>
                  </StyledNavLink>
                  <StyledNavLink to="/nodes">
                      <ListItemButton>
                          <ListItemIcon>
                              <NodesIcon />
                          </ListItemIcon>
                          <ListItemText primary="Nodes" />
                      </ListItemButton>
                  </StyledNavLink>
                  <StyledNavLink to="/alerts">
                      <ListItemButton>
                          <ListItemIcon>
                              <AlertsIcon />
                          </ListItemIcon>
                          <ListItemText primary="Alerts" />
                      </ListItemButton>
                  </StyledNavLink>
                  <StyledNavLink to="/readings">
                      <ListItemButton>
                          <ListItemIcon>
                              <ReadingsIcon />
                          </ListItemIcon>
                          <ListItemText primary="Readings" />
                      </ListItemButton>
                  </StyledNavLink>
              </List>
              <Divider />
              <List>
                  <StyledNavLink to="/settings">
                      <ListItemButton>
                          <ListItemIcon>
                              <SettingsIcon />
                          </ListItemIcon>
                          <ListItemText primary="Settings" />
                      </ListItemButton>
                  </StyledNavLink>
              </List>
          </Box>
      </Drawer>
    );
}