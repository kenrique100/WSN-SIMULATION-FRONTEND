export const SENSOR_TYPES = [
    { id: 1, name: 'Temperature', unit: '°C' },
    { id: 2, name: 'Humidity', unit: '%' },
    { id: 3, name: 'Pressure', unit: 'hPa' },
    { id: 4, name: 'Light', unit: 'lux' },
    { id: 5, name: 'Motion', unit: 'bool' },
] as const;

export const NODE_STATUSES = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'maintenance', label: 'Maintenance' },
] as const;


export const ALERT_TYPES = [
    { value: 'threshold', label: 'Threshold' },
    { value: 'status', label: 'Status' },
    { value: 'battery', label: 'Battery' },
] as const;

export type SensorType = typeof SENSOR_TYPES[number];
export type NodeStatus = typeof NODE_STATUSES[number]['value'];
export type AlertType = typeof ALERT_TYPES[number]['value'];