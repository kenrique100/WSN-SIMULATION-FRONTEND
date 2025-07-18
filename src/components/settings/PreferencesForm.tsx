import {
  Box,
  Typography,
  Stack,
  Divider,
  FormControlLabel,
  Switch,
  Select,
  MenuItem,
  Button
} from '@mui/material';
import { useTheme } from '@/contexts/ThemeContext'; // adjust the import path as needed
import { useState } from 'react';

export default function PreferencesForm() {
  const { mode, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState('en');

  const handleThemeChange = (e: any) => {
    const newTheme = e.target.value;
    if (newTheme === 'light' || newTheme === 'dark') {
      if (mode !== newTheme) {
        toggleTheme();
      }
    } else if (newTheme === 'system') {
      // Implement system default detection if needed
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if ((prefersDark && mode !== 'dark') || (!prefersDark && mode !== 'light')) {
        toggleTheme();
      }
    }
  };

  return (
    <Box>
      <Typography variant="h6" fontWeight="600" gutterBottom>
        Preferences
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={4}>
        Customize your application experience
      </Typography>

      <Stack spacing={4}>
        <Box>
          <Typography fontWeight="500" mb={2}>Theme</Typography>
          <Select
            value={mode}
            onChange={handleThemeChange}
            fullWidth
            sx={{ maxWidth: 300 }}
          >
            <MenuItem value="light">Light</MenuItem>
            <MenuItem value="dark">Dark</MenuItem>
            <MenuItem value="system">System Default</MenuItem>
          </Select>
        </Box>

        <Divider />

        <Box>
          <Typography fontWeight="500" mb={2}>Notifications</Typography>
          <Stack spacing={2}>
            <FormControlLabel
              control={
                <Switch
                  checked={notifications}
                  onChange={(e) => setNotifications(e.target.checked)}
                />
              }
              label="Enable notifications"
            />
            <FormControlLabel
              control={<Switch checked />}
              label="Email notifications"
            />
            <FormControlLabel
              control={<Switch checked />}
              label="Push notifications"
            />
          </Stack>
        </Box>

        <Divider />

        <Box>
          <Typography fontWeight="500" mb={2}>Language</Typography>
          <Select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            fullWidth
            sx={{ maxWidth: 300 }}
          >
            <MenuItem value="en">English</MenuItem>
            <MenuItem value="es">Spanish</MenuItem>
            <MenuItem value="fr">French</MenuItem>
            <MenuItem value="de">German</MenuItem>
          </Select>
        </Box>

        <Divider />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="contained" sx={{ px: 4, py: 1.5 }}>
            Save Preferences
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}