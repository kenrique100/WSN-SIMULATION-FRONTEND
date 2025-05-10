export const SENSOR_TYPES = [
    { id: 1, name: 'Temperature', unit: '°C' },
    { id: 2, name: 'Humidity', unit: '%' },
    { id: 3, name: 'Pressure', unit: 'hPa' },
    { id: 4, name: 'Light', unit: 'lux' },
    { id: 5, name: 'Motion', unit: 'bool' },
];

export const NODE_STATUSES = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'maintenance', label: 'Maintenance' },
];

export const ALERT_LEVELS = [
    { value: 'info', label: 'Info' },
    { value: 'warning', label: 'Warning' },
    { value: 'critical', label: 'Critical' },
];

export const ALERT_TYPES = [
    { value: 'threshold', label: 'Threshold' },
    { value: 'status', label: 'Status' },
    { value: 'battery', label: 'Battery' },
];