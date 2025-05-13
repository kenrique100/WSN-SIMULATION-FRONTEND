import { IconButton, Tooltip } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useAppStore } from '@/store';

export default function SidebarToggleButton() {
  const toggleSidebar = useAppStore((state) => state.toggleSidebar);

  return (
    <Tooltip title="Toggle menu">
      <IconButton
        onClick={toggleSidebar}
        size="large"
        edge="start"
        color="inherit"
        aria-label="menu"
        sx={{ mr: 1 }}
      >
        <MenuIcon />
      </IconButton>
    </Tooltip>
  );
}