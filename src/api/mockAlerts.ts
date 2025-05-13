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
    timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    acknowledged: true,
  },
  {
    alertId: 3,
    sensorId: 103,
    readingId: 1003,
    alertLevel: 'INFO',
    message: 'Battery level dropped below 20%',
    timestamp: new Date(Date.now() - 2 * 3600000).toISOString(), // 2 hours ago
    acknowledged: false,
  },
  {
    alertId: 4,
    sensorId: 104,
    readingId: 1004,
    alertLevel: 'CRITICAL',
    message: 'Gas sensor detected high CO2 levels',
    timestamp: new Date(Date.now() - 3 * 3600000).toISOString(), // 3 hours ago
    acknowledged: true,
  },
  {
    alertId: 5,
    sensorId: 105,
    readingId: 1005,
    alertLevel: 'WARNING',
    message: 'Motion detected during off hours',
    timestamp: new Date(Date.now() - 4 * 3600000).toISOString(), // 4 hours ago
    acknowledged: false,
  },
  {
    alertId: 6,
    sensorId: 106,
    readingId: 1006,
    alertLevel: 'INFO',
    message: 'Scheduled maintenance reminder',
    timestamp: new Date(Date.now() - 5 * 3600000).toISOString(), // 5 hours ago
    acknowledged: true,
  },
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
