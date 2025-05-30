// src/components/nodes/NodeMap.tsx
import { Box, Typography } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { SensorNode } from '@/types';
import { useEffect } from 'react';

// Fix for default marker icons in Leaflet
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function FitBounds({ nodes }: { nodes: SensorNode[] }) {
  const map = useMap();

  useEffect(() => {
    if (!Array.isArray(nodes)) return;

    const markers = nodes
      .filter(node => node.latitude && node.longitude)
      .map(node => [node.latitude!, node.longitude!] as [number, number]);

    if (markers.length > 0) {
      map.fitBounds(markers);
    } else if (nodes.length > 0) {
      map.setView([51.505, -0.09], 2);
    }
  }, [nodes, map]);

  return null;
}

interface NodeMapProps {
  nodes: SensorNode[];
}

export default function NodeMap({ nodes = [] }: NodeMapProps) {
  if (!Array.isArray(nodes) || nodes.length === 0) {
    return (
      <Box sx={{
        height: 400,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid #ddd'
      }}>
        <Typography>No nodes available to display on map</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <MapContainer
        center={[51.505, -0.09]}
        zoom={2}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <FitBounds nodes={nodes} />
        {Array.isArray(nodes) && nodes
          .filter(node => node.latitude && node.longitude)
          .map(node => (
            <Marker
              key={node.nodeId}
              position={[node.latitude!, node.longitude!]}
              icon={defaultIcon}
            >
              <Popup>
                <Box>
                  <Typography variant="subtitle1">{node.name}</Typography>
                  <Typography>Location: {node.location}</Typography>
                  <Typography>Status: {node.status}</Typography>
                  {node.lastHeartbeat && (
                    <Typography>
                      Last heartbeat: {new Date(node.lastHeartbeat).toLocaleString()}
                    </Typography>
                  )}
                </Box>
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </Box>
  );
}