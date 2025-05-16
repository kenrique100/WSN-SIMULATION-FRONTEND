import { SelectChangeEvent } from '@mui/material';

/*export interface User {
    userId: number;
    username: string;
    email: string;
    name: string;
    role: string;
    avatarUrl?: string;
    createdAt: string;
    enabled: boolean;
}*/

export interface UserResponse {
    userId: number;
    username: string;
    email: string;
    role: Role;
    createdAt: string;
    enabled?: boolean;
}

export enum Role {
    ADMIN = 'ADMIN',
    OPERATOR = 'OPERATOR',
    VIEWER = 'VIEWER'
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    user: UserResponse;
}


export interface UserCreateRequest {
    username: string;
    email: string;
    password: string;
    role: Role;
}

export interface LoginRequest {
    username: string;
    password: string;
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
    nodeId?: number;
    value: number;
    timestamp: string;
}

export interface ReadingStats {
    average: number;
    min: number;
    max: number;
    count: number;
    firstReading: string;
    lastReading: string;
    trend: 'up' | 'down' | 'stable';
}

export interface Alert {
    alertId: number;
    sensorId: number;
    readingId?: number;
    alertLevel: AlertLevel;
    message?: string;
    timestamp: string;
    acknowledged: boolean;
    acknowledgedBy?: number;
    acknowledgedAt?: string;
    sensor?: {
        sensorId: number;
        type?: {
            name: string;
            unit: string;
        };
    };
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

export interface CreateTopologyRequest {
    sourceNodeId: number;
    targetNodeId: number;
    signalStrength: number;
}

export interface ThresholdResponse {
    thresholdId: number;
    sensorTypeId: number;
    warningLevel: number;
    dangerLevel: number;
    updatedBy: number;
    updatedAt: string;
}

export interface ThresholdUpdateRequest {
    warningLevel?: number;
    dangerLevel?: number;
    updatedBy: number;
}

export interface ReadingFilter {
    sensorId?: number;
    nodeId?: number;
    startTime?: string;
    endTime?: string;
    limit?: number;
    hours?: number;
    page?: number;
    size?: number;
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
    last?: boolean;
}

export interface ApiError {
    message?: string;
    error?: string;
    statusCode?: number;
    [key: string]: unknown;
}

export interface TokenRefreshResponse {
    accessToken: string;
    refreshToken: string;
}


export const NODE_STATUSES = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'maintenance', label: 'Maintenance' },
] as const;

export type NodeStatus = typeof NODE_STATUSES[number]['value'];
export type AlertLevel = 'INFO' | 'WARNING' | 'CRITICAL';