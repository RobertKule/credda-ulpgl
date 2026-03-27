"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in Leaflet + Next.js
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface Session {
  id: string;
  title: string;
  location: string;
  date: Date | string;
  lat: number | null;
  lng: number | null;
  isMobile: boolean;
}

const ChangeView = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  map.setView(center, 12);
  return null;
};

export default function MapComponent({ sessions }: { sessions: Session[] }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return <div className="h-[500px] w-full bg-slate-100 animate-pulse" />;

  const defaultCenter: [number, number] = [-1.6706, 29.2195]; // Goma center

  return (
    <div className="h-[500px] w-full relative z-10 border border-slate-200">
      <MapContainer 
        center={defaultCenter} 
        zoom={12} 
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {sessions.map((session) => (
          session.lat && session.lng && (
            <Marker key={session.id} position={[session.lat, session.lng]}>
              <Popup className="font-serif">
                <div className="space-y-2 p-2">
                  <p className="text-[10px] font-black uppercase text-emerald-700 tracking-widest">
                    {session.isMobile ? "Clinique Mobile" : "Centre Fixe"}
                  </p>
                  <h4 className="font-bold text-slate-900 leading-tight">{session.title}</h4>
                  <p className="text-xs text-slate-500">{session.location}</p>
                  <p className="text-[10px] text-slate-400 italic">
                    {new Date(session.date).toLocaleDateString()}
                  </p>
                </div>
              </Popup>
            </Marker>
          )
        ))}
      </MapContainer>
    </div>
  );
}
