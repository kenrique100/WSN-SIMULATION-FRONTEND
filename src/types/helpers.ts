export function formatDate(date: Date): string {
    return date.toLocaleString();
}

export function formatReadingValue(value: number, unit: string): string {
    return `${value.toFixed(2)} ${unit}`;
}

export function getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
        case 'online':
            return 'green';
        case 'offline':
            return 'red';
        case 'warning':
            return 'orange';
        default:
            return 'gray';
    }
}