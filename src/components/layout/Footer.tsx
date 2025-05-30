import { Box, Typography, useTheme } from '@mui/material';

export default function Footer() {
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        py: 2,
        textAlign: 'center',
        backgroundColor: theme.palette.background.paper,
        borderTop: `1px solid ${theme.palette.divider}`,
        mt: 'auto',
      }}
    >
      <Typography variant="body2" color="text.secondary">
        © {new Date().getFullYear()} WSN Monitoring System
      </Typography>
    </Box>
  );
}
