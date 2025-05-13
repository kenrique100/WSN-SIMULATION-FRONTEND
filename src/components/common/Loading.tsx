import { CircularProgress, Box } from '@mui/material';

interface LoadingProps {
    fullScreen?: boolean;
}

export default function Loading({ fullScreen = false }: LoadingProps) {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                ...(fullScreen && {
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'background.paper',
                    zIndex: 9999
                })
            }}
        >
            <CircularProgress />
        </Box>
    );
}