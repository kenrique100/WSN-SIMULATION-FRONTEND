import { Alert, AlertTitle, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface ErrorAlertProps {
    message: string;
    retryable?: boolean;
    onRetry?: () => void;
}

export default function ErrorAlert({ message, retryable = false, onRetry }: ErrorAlertProps) {
    const navigate = useNavigate();

    return (
        <Alert
            severity="error"
            sx={{ my: 2 }}
            action={
                <>
                    {retryable && (
                        <Button
                            color="inherit"
                            size="small"
                            onClick={onRetry}
                        >
                            Retry
                        </Button>
                    )}
                    <Button
                        color="inherit"
                        size="small"
                        onClick={() => navigate('/')}
                    >
                        Go Home
                    </Button>
                </>
            }
        >
            <AlertTitle>Error</AlertTitle>
            {message}
        </Alert>
    );
}