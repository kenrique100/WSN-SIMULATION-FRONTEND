import React from 'react';
import { Grid, Paper, Typography, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import GaugeChart from 'react-gauge-chart';
import { Warning, Error } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
    sensorCard: {
        padding: theme.spacing(2),
        textAlign: 'center',
        position: 'relative',
    },
    warningIcon: {
        position: 'absolute',
        top: theme.spacing(1),
        right: theme.spacing(1),
        color: theme.palette.warning.main,
    },
    dangerIcon: {
        position: 'absolute',
        top: theme.spacing(1),
        right: theme.spacing(1),
        color: theme.palette.danger.main,
    },
}));

function SensorGrid({ sensors }) {
    const classes = useStyles();

    if (!sensors || sensors.length === 0) {
        return <CircularProgress />;
    }

    return (
        <Grid container spacing={2}>
            {sensors.map((node) => (
                <React.Fragment key={node.node_id}>
                    {node.sensors.map((sensor) => {
                        const latestReading = sensor.latest_reading;
                        const value = latestReading ? latestReading.value : 0;
                        const threshold = sensor.thresholds || {};
                        const isWarning = threshold.warning_level && value >= threshold.warning_level;
                        const isDanger = threshold.danger_level && value >= threshold.danger_level;

                        return (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={sensor.sensor_id}>
                                <Paper className={classes.sensorCard}>
                                    {isDanger && <Error className={classes.dangerIcon} />}
                                    {isWarning && !isDanger && <Warning className={classes.warningIcon} />}
                                    <Typography variant="h6">{sensor.type.name} - {node.name}</Typography>
                                    <Typography variant="subtitle1">{node.location}</Typography>
                                    <GaugeChart
                                        id={`gauge-${sensor.sensor_id}`}
                                        nrOfLevels={3}
                                        colors={['#4CAF50', '#FFC107', '#F44336']}
                                        arcWidth={0.3}
                                        percent={calculatePercent(value, sensor.type.unit, threshold)}
                                        textColor="#FFFFFF"
                                        formatTextValue={() => `${value.toFixed(2)} ${sensor.type.unit}`}
                                    />
                                    <Typography variant="caption">
                                        Last update: {latestReading ? new Date(latestReading.timestamp).toLocaleTimeString() : 'N/A'}
                                    </Typography>
                                </Paper>
                            </Grid>
                        );
                    })}
                </React.Fragment>
            ))}
        </Grid>
    );
}

function calculatePercent(value, unit, threshold) {
    // Simple normalization for gauge display
    if (unit === 'ppm') {
        if (unit === 'CH₄') {
            return Math.min(value / 200, 1);  // Max 200ppm for display
        } else if (unit === 'CO₂') {
            return Math.min(value / 10000, 1);  // Max 10,000ppm for display
        } else if (unit === 'H₂S') {
            return Math.min(value / 100, 1);  // Max 100ppm for display
        }
    }
    return Math.min(value / 100, 1);  // Default to 0-100 range
}

export default SensorGrid;