import { useEffect, useRef } from 'react';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { SensorNode } from '../../types';

const icon = L.icon({
    iconUrl: '/assets/marker-icon.png',
    iconRetinaUrl: '/assets/marker-icon-2x.png',
    shadowUrl: '/assets/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

interface NodeMapProps {
    nodes: SensorNode[];
}

export default function NodeMap({ nodes }: NodeMapProps) {
    const mapRef = useRef<Map>(null);

    useEffect(() => {
        if (nodes.length > 0 && mapRef.current) {
            const map = mapRef.current.leafletElement;
            const bounds = nodes.map(node => [node.latitude || 0, node.longitude || 0]);
            map.fitBounds(bounds);
        }
    }, [nodes]);

    return (
        <div style={{ height: '400px', width: '100%' }}>
            <Map
                ref={mapRef}
                center={[37.7749, -122.4194]}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {nodes.filter(node => node.latitude && node.longitude).map(node => (
                    <Marker
                        key={node.nodeId}
                        position={[node.latitude || 0, node.longitude || 0]}
                        icon={icon}
                    >
                        <Popup>
                            <div>
                                <h3>{node.name}</h3>
                                <p>Location: {node.location}</p>
                                <p>Status: {node.status}</p>
                                {node.lastHeartbeat && (
                                    <p>Last heartbeat: {new Date(node.lastHeartbeat).toLocaleString()}</p>
                                )}
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </Map>
        </div>
    );
}