// src/components/common/Loading.tsx
import { CircularProgress, Box } from '@mui/material';

interface LoadingProps {
  fullScreen?: boolean;
}

export default function Loading({ fullScreen = false }: LoadingProps) {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight={fullScreen ? '100vh' : '100%'}
    >
      <CircularProgress />
    </Box>
  );
}