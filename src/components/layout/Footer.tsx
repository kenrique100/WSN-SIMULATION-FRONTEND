import { Box, Typography, TextField, Button, useTheme, Grid } from '@mui/material';

export default function Footer() {
  const theme = useTheme();
  const showContactInfo = true;

  return (
    <Box
      component="footer"
      sx={{
        py: 4,
        px: 2,
        backgroundColor: theme.palette.background.paper,
        borderTop: `1px solid ${theme.palette.divider}`,
        mt: 'auto',
      }}
    >
      <Grid container spacing={4} justifyContent="center" maxWidth="lg" mx="auto">
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Subscribe to our Newsletter
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Stay updated with the latest news, alerts, and system updates.
          </Typography>
          <Box
            component="form"
            display="flex"
            flexDirection={{ xs: 'column', sm: 'row' }}
            gap={2}
          >
            <TextField
              type="email"
              label="Email Address"
              variant="outlined"
              size="small"
              fullWidth
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: theme.palette.background.paper,
                },
              }}
            />
            <Button type="submit" variant="contained" color="primary">
              Subscribe
            </Button>
          </Box>
        </Grid>

        {showContactInfo && (
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Contact Info
            </Typography>
            <Typography variant="body2">Email: ngondeasale734@gmail.com</Typography>
            <Typography variant="body2">Phone: +237 6 51 50 86 90</Typography>
            <Typography variant="body2">Address: 340 Ndokoti, Douala, Cameroon</Typography>
          </Grid>
        )}
      </Grid>

      <Box mt={4} textAlign="center">
        <Typography variant="body2" color="text.secondary" fontSize="0.75rem">
          © {new Date().getFullYear()} WSN Monitoring System • v1.0.0 • Designed by Ewane Joan
        </Typography>
      </Box>
    </Box>
  );
}
