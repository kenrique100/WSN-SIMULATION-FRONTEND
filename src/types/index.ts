export interface User {
    userId: number;
    username: string;
    email: string;
    role: string;
    createdAt: string;
}

export interface AuthResponse {
    accessToken: string;
    tokenType: string;
    user: UserResponse;
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface UserCreateRequest extends LoginRequest {
    email: string;
    role: string;
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
    nodeId: string;
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