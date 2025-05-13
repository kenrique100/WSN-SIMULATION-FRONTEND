// types.ts
import { SelectChangeEvent } from '@mui/material';

export interface User {
    userId: number;
    username: string;
    email: string;
    role: string;
    createdAt: string;
    name?: string;
}

export interface AuthResponse {
    accessToken: string;
    tokenType: string;
    user: User;
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface RegisterRequest extends LoginRequest {
    email: string;
    name: string;
    confirmPassword: string;
}

export interface SensorNode {
    nodeId: number;
    name: string;
    location: string;
    latitude?: number;
    longitude?: number;
    status: NodeStatus;
    lastHeartbeat?: string;
}

export interface NodeSensor {
    sensorId: number;
    nodeId: number;
    typeId: number;
    minValue?: number;
    maxValue?: number;
    calibrationDate?: string;
}

export interface Reading {
    readingId: number;
    sensorId: number;
    value: number;
    timestamp: string;
}

export interface Alert {
    alertId: number;
    sensorId: number;
    readingId: number;
    alertLevel: AlertLevel;
    message?: string;
    timestamp: string;
    acknowledged: boolean;
    acknowledgedBy?: number;
    acknowledgedAt?: string;
}
export interface AlertStats {
    total: number;
    critical: number;
    warning: number;
    info: number;
    acknowledged: number;
}

export interface NetworkTopology {
    linkId: number;
    sourceNodeId: number;
    targetNodeId: number;
    sourceNodeName?: string;
    targetNodeName?: string;
    signalStrength: number;
    lastUpdated: string;
}

export interface Threshold {
    id: string;
    sensorType: string;
    minValue?: number;
    maxValue?: number;
    notificationEnabled: boolean;
}

export interface ReadingFilter {
    sensorId?: number;
    nodeId?: number;
    startTime?: string;
    endTime?: string;
    limit?: number;
    hours?: number;
}

export interface LoginData {
    username: string;
    password: string;
}

export interface RegisterData {
    username: string;
    email: string;
    password: string;
}

export interface AlertThreshold {
    id: number;
    sensorType: string;
    sensorTypeId?: number;
    minValue?: number;
    maxValue?: number;
    warningLevel?: number;
    dangerLevel?: number;
    notificationEnabled: boolean;
    updatedBy?: number;
    updatedAt?: string;
}
export interface AlertThresholdUpdate {
    minValue?: number;
    maxValue?: number;
    warningLevel?: number;
    dangerLevel?: number;
    notificationEnabled?: boolean;
    updatedBy?: number;
}
export interface ThresholdFormValues {
    sensorType: string;
    minValue?: number;
    maxValue?: number;
    notificationEnabled: boolean;
    level: string;
}

export interface ApiError {
    message: string;
    statusCode: number;
    timestamp?: string;
    path?: string;
}

export interface FormButtonsProps {
    onCancel: () => void;
    isEdit?: boolean;
}

export interface LabeledSelectOption {
    value: string;
    label: string;
}

export interface LabeledSelectProps {
    label: string;
    value: string;
    name: string;
    options: readonly { value: string; label: string }[];
    onChange: (e: SelectChangeEvent) => void;
    helperText?: string;
}

export interface NodeStats {
    total: number;
    active: number;
    inactive: number;
    maintenance?: number;
}
export interface AlertStats {
    total: number;
    critical: number;
    warning: number;
    info: number;
    acknowledged: number;
}

export interface PaginatedResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    page: number;
    size: number;
}

export const NODE_STATUSES = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'maintenance', label: 'Maintenance' },
] as const;

export type NodeStatus = typeof NODE_STATUSES[number]['value'];
export type AlertLevel = 'INFO' | 'WARNING' | 'CRITICAL';