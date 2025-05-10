import { Drawer, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import {
    Dashboard as DashboardIcon,
    Sensors as NodesIcon,
    Warning as AlertsIcon,
    ShowChart as ReadingsIcon,
    Settings as SettingsIcon
} from '@mui/icons-material';
import { NavLink } from 'react-router-dom';
import { styled } from '@mui/material/styles';

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
    return (
        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
            }}
        >
            <Toolbar /> {/* For proper spacing below app bar */}
            <Box sx={{ overflow: 'auto' }}>
                <List>
                    <StyledNavLink to="/">
                        <ListItem button>
                            <ListItemIcon>
                                <DashboardIcon />
                            </ListItemIcon>
                            <ListItemText primary="Dashboard" />
                        </ListItem>
                    </StyledNavLink>
                    <StyledNavLink to="/nodes">
                        <ListItem button>
                            <ListItemIcon>
                                <NodesIcon />
                            </ListItemIcon>
                            <ListItemText primary="Nodes" />
                        </ListItem>
                    </StyledNavLink>
                    <StyledNavLink to="/alerts">
                        <ListItem button>
                            <ListItemIcon>
                                <AlertsIcon />
                            </ListItemIcon>
                            <ListItemText primary="Alerts" />
                        </ListItem>
                    </StyledNavLink>
                    <StyledNavLink to="/readings">
                        <ListItem button>
                            <ListItemIcon>
                                <ReadingsIcon />
                            </ListItemIcon>
                            <ListItemText primary="Readings" />
                        </ListItem>
                    </StyledNavLink>
                </List>
                <Divider />
                <List>
                    <StyledNavLink to="/settings">
                        <ListItem button>
                            <ListItemIcon>
                                <SettingsIcon />
                            </ListItemIcon>
                            <ListItemText primary="Settings" />
                        </ListItem>
                    </StyledNavLink>
                </List>
            </Box>
        </Drawer>
    );
}