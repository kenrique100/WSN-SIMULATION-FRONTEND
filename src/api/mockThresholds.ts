import type { AlertThreshold } from '@/types';

const MOCK_THRESHOLDS: AlertThreshold[] = [
  {
    id: 1,
    sensorType: 'Temperature',
    minValue: -10,
    maxValue: 50,
    notificationEnabled: true,
  },
  {
    id: 2,
    sensorType: 'Humidity',
    minValue: 0,
    maxValue: 100,
    notificationEnabled: true,
  },
  {
    id: 3,
    sensorType: 'Pressure',
    minValue: 900,
    maxValue: 1100,
    notificationEnabled: false,
  },
];

export default MOCK_THRESHOLDS;
