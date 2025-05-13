// mockAlerts.ts
import type { Alert, AlertStats, PaginatedResponse } from '@/types';

// Define PaginatedAlerts locally using the generic type
type PaginatedAlerts = PaginatedResponse<Alert>;

export const mockAlerts: Alert[] = [
  {
    alertId: 1,
    sensorId: 101,
    readingId: 1001,
    alertLevel: 'CRITICAL',
    message: 'Temperature threshold exceeded (42°C)',
    timestamp: new Date().toISOString(),
    acknowledged: false,
  },
  {
    alertId: 2,
    sensorId: 102,
    readingId: 1002,
    alertLevel: 'WARNING',
    message: 'Humidity fluctuation detected (15% change)',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    acknowledged: true,
  },
  // Add more mock alerts as needed
];

export const mockAlertStats: AlertStats = {
  total: 10,
  critical: 3,
  warning: 4,
  info: 3,
  acknowledged: 5,
};

export const getMockAlerts = (
  acknowledged?: boolean,
  page: number = 0,
  size: number = 10
): PaginatedAlerts => {
  let filtered = mockAlerts;
  if (acknowledged !== undefined) {
    filtered = mockAlerts.filter(a => a.acknowledged === acknowledged);
  }

  const start = page * size;
  const end = start + size;
  const content = filtered.slice(start, end);

  return {
    content,
    totalElements: filtered.length,
    totalPages: Math.ceil(filtered.length / size),
    page,
    size,
  };
};
