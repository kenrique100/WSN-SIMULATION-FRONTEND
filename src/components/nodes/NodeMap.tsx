import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { SensorNode } from '@/types';

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

// Helper component to fit bounds
function FitBounds({ nodes }: { nodes: SensorNode[] }) {
    const map = useMap();

    useEffect(() => {
        const bounds = nodes
          .filter(node => node.latitude && node.longitude)
          .map(node => [node.latitude!, node.longitude!] as [number, number]);

        if (bounds.length > 0) {
            map.fitBounds(bounds);
        }
    }, [nodes, map]);

    return null;
}

export default function NodeMap({ nodes }: NodeMapProps) {
    const center: [number, number] = [37.7749, -122.4194]; // Default center (e.g., San Francisco)

    return (
      <div style={{ height: '400px', width: '100%' }}>
          <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <FitBounds nodes={nodes} />
              {nodes
                .filter(node => node.latitude && node.longitude)
                .map(node => (
                  <Marker key={node.nodeId} position={[node.latitude!, node.longitude!]} icon={icon}>
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
          </MapContainer>
      </div>
    );
}
