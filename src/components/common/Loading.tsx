import { Box, CircularProgress, Typography } from '@mui/material';

interface LoadingProps {
    message?: string;
}

export default function Loading({ message = 'Loading...' }: LoadingProps) {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                gap: 2,
                p: 4
            }}
        >
            <CircularProgress />
            <Typography variant="body1">{message}</Typography>
        </Box>
    );
}