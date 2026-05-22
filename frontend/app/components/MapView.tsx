'use client';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix leaflet marker icons
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function MapView({ positions }: { positions: any[] }) {
  const center = positions.length > 0
    ? [positions[0].lat, positions[0].lng]
    : [36.8189, 10.1658];

  return (
    <div className="rounded-xl overflow-hidden h-96">
      <MapContainer center={center as [number, number]} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {positions.map((pos: any) => (
          <Marker key={pos.id} position={[pos.lat, pos.lng]} icon={icon}>
            <Popup>
              Lat: {pos.lat}, Lng: {pos.lng}<br />
              {new Date(pos.timestamp).toLocaleString()}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}