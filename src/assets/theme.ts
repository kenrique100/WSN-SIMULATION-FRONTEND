import { createTheme, ThemeOptions } from '@mui/material/styles';

export type ThemeMode = 'light' | 'dark';

const sharedOptions: ThemeOptions = {
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        h1: { fontSize: '2.5rem', fontWeight: 500 },
        h2: { fontSize: '2rem', fontWeight: 500 },
        h3: { fontSize: '1.75rem', fontWeight: 500 },
        h4: { fontSize: '1.5rem', fontWeight: 500 },
    },
    shape: {
        borderRadius: 8,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontWeight: 500,
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    borderRight: 'none',
                    boxShadow: '1px 0 10px rgba(0, 0, 0, 0.1)',
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                },
            },
        },
    },
};

export const lightTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#3f51b5',
            contrastText: '#fff',
        },
        secondary: {
            main: '#f50057',
            contrastText: '#fff',
        },
        background: {
            default: '#f5f7fa',
            paper: '#ffffff',
        },
        text: {
            primary: '#1a1a1a',
            secondary: '#4a4a4a',
        },
    },
    ...sharedOptions,
});

export const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#90caf9',
            contrastText: '#121212',
        },
        secondary: {
            main: '#f48fb1',
            contrastText: '#121212',
        },
        background: {
            default: '#121212',
            paper: '#1e1e1e',
        },
        text: {
            primary: '#ffffff',
            secondary: '#b0b0b0',
        },
    },
    ...sharedOptions,
});