import type { NodeStatus } from '@/types';

export function formatReadingValue(value: number, unit: string): string {
    return `${value.toFixed(2)} ${unit}`;
}

export function getStatusColor(status: NodeStatus): string {
    switch (status) {
        case 'active':
            return 'success.main';
        case 'inactive':
            return 'error.main';
        case 'maintenance':
            return 'warning.main';
        default:
            return 'text.disabled';
    }
}

export function formatDate(date: Date): string {
    return date.toLocaleString();
}