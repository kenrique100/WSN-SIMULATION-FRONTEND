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
    status: string;
    lastHeartbeat?: string;
}

export interface Reading {
    readingId: number;
    sensorId: number;
    value: number;
    timestamp: string;
}

export interface Alert {
    alertId: number;
    nodeId: number;
    sensorId: number;
    type: 'threshold' | 'status' | 'battery';
    severity: 'info' | 'warning' | 'critical';
    readingId: number;
    alertLevel: string;
    message?: string;
    timestamp: string;
    acknowledged: boolean;
    acknowledgedBy?: number;
    acknowledgedAt?: string;
}

export interface NetworkTopology {
    linkId: number;
    sourceNodeId: number;
    targetNodeId: number;
    signalStrength: number;
    lastUpdated: string;
}

export interface Node {
    id: string;
    name: string;
    location: string;
    status: 'online' | 'offline' | 'warning';
    lastPing: string;
    batteryLevel: number;
    sensors: Sensor[];
}

export interface Sensor {
    id: string;
    type: string;
    unit: string;
    lastReading?: Reading;
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

export interface NodeFormData {
    name: string;
    location: string;
    latitude?: number;
    longitude?: number;
    status: string;
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
    minValue?: number;
    maxValue?: number;
    notificationEnabled: boolean;
}

export interface AlertThresholdUpdate {
    minValue?: number;
    maxValue?: number;
    notificationEnabled: boolean;
}

// === Added from reusable components ===

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
