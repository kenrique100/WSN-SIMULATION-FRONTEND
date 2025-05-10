import React, { useState, useEffect } from 'react';
import { Container, Grid, Paper, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import SensorGrid from '../components/SensorGrid';
import AlertPanel from '../components/AlertPanel';
import NetworkMap from '../components/NetworkMap';
import api from '../services/api';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
    paper: {
        padding: theme.spacing(2),
        height: '100%',
    },
    title: {
        marginBottom: theme.spacing(2),
    },
}));

function OperatorView() {
    const classes = useStyles();
    const [sensorData, setSensorData] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [network, setNetwork] = useState({ nodes: [], links: [] });

    useEffect(() => {
        // Fetch initial data
        const fetchData = async () => {
            try {
                const [sensorsRes, alertsRes, networkRes] = await Promise.all([
                    api.get('/nodes?limit=10'),
                    api.get('/alerts?acknowledged=false'),
                    api.get('/topology'),
                ]);

                setSensorData(sensorsRes.data);
                setAlerts(alertsRes.data);
                setNetwork({
                    nodes: sensorsRes.data,
                    links: networkRes.data,
                });
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();

        // Set up WebSocket for real-time updates
        const ws = new WebSocket('ws://localhost:8000/ws');

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'reading') {
                setSensorData(prev => updateSensorData(prev, data.payload));
            } else if (data.type === 'alert') {
                setAlerts(prev => [data.payload, ...prev]);
            } else if (data.type === 'topology') {
                setNetwork(prev => ({
                    ...prev,
                    links: data.payload,
                }));
            }
        };

        return () => ws.close();
    }, []);

    const updateSensorData = (currentData, newReading) => {
        return currentData.map(node => {
            if (node.node_id === newReading.node_id) {
                const updatedSensors = node.sensors.map(sensor => {
                    if (sensor.sensor_id === newReading.sensor_id) {
                        return {
                            ...sensor,
                            latest_reading: newReading,
                        };
                    }
                    return sensor;
                });
                return { ...node, sensors: updatedSensors };
            }
            return node;
        });
    };

    const handleAcknowledgeAlert = async (alertId) => {
        try {
            await api.post(`/alerts/${alertId}/acknowledge`, { user_id: 1 }); // TODO: Use real user ID
            setAlerts(prev => prev.filter(alert => alert.alert_id !== alertId));
        } catch (error) {
            console.error('Error acknowledging alert:', error);
        }
    };

    return (
        <Container maxWidth="lg" className={classes.root}>
            <Typography variant="h4" className={classes.title}>
                Plant Operator Dashboard
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Paper className={classes.paper}>
                        <NetworkMap nodes={network.nodes} links={network.links} />
                    </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Paper className={classes.paper}>
                        <AlertPanel alerts={alerts} onAcknowledge={handleAcknowledgeAlert} />
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Paper className={classes.paper}>
                        <SensorGrid sensors={sensorData} />
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
}

export default OperatorView;