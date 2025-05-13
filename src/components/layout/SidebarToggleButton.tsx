import { useAppStore } from '@/store/index';
import { IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

function SidebarToggleButton() {
  const toggleSidebar = useAppStore((state) => state.toggleSidebar);

  return (
    <IconButton onClick={toggleSidebar}>
      <MenuIcon />
    </IconButton>
  );
}