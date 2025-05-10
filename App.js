import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Login from './pages/Login';
import OperatorView from './pages/OperatorView';
import SafetyOfficerView from './pages/SafetyOfficerView';
import AdminView from './pages/AdminView';
import PrivateRoute from './components/PrivateRoute';
import AuthProvider from './services/AuthProvider';

const theme = createMuiTheme({
    palette: {
        type: 'dark',
        primary: {
            main: '#4caf50',
        },
        secondary: {
            main: '#ff5722',
        },
        warning: {
            main: '#ff9800',
        },
        danger: {
            main: '#f44336',
        },
        background: {
            default: '#121212',
            paper: '#1e1e1e',
        },
    },
});

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AuthProvider>
                <Router>
                    <Switch>
                        <Route path="/login" component={Login} />
                        <PrivateRoute path="/operator" component={OperatorView} role="plant_operator" />
                        <PrivateRoute path="/safety" component={SafetyOfficerView} role="safety_officer" />
                        <PrivateRoute path="/admin" component={AdminView} role="admin" />
                        <Route path="/" exact component={Login} />
                    </Switch>
                </Router>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;