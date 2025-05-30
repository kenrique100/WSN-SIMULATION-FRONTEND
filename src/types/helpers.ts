import type { NodeStatus } from '@/types';

export function formatReadingValue(value: number, unit: string): string {
    return `${value.toFixed(2)} ${unit}`;
}

export function getStatusColor(status: NodeStatus): string {
    switch (status) {
        case 'active':
            return '#4caf50';
        case 'inactive':
            return '#f44336';
        case 'maintenance':
            return '#ff9800';
        default:
            return '#9e9e9e';
    }
}

export function formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}