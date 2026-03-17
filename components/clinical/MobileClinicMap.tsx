"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Custom black-gold icon for Awwwards-style
const customIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Component to handle map centering and premium transitions
function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

interface Location {
  id: string;
  title: string;
  lat: number;
  lng: number;
  date: string;
}

export default function MobileClinicMap({ locations }: { locations: Location[] }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return <div className="h-[500px] bg-primary/5 animate-pulse" />;

  // Center on Goma/Kivu region by default
  const defaultCenter: [number, number] = [-1.6585, 29.2230];

  return (
    <div className="h-[500px] w-full border border-light-gray shadow-3xl bg-primary/5 overflow-hidden">
      <MapContainer 
        center={defaultCenter} 
        zoom={8} 
        scrollWheelZoom={false}
        className="h-full w-full grayscale contrast-125 brightness-90 saturate-0 hover:grayscale-0 transition-all duration-1000"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        {locations.map((loc) => (
          <Marker 
            key={loc.id} 
            position={[loc.lat, loc.lng]} 
            icon={customIcon}
          >
            <Popup className="premium-popup">
              <div className="p-2 space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-accent">{new Date(loc.date).toLocaleDateString()}</p>
                <h4 className="font-serif font-black text-primary leading-tight">{loc.title}</h4>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      <style jsx global>{`
        .leaflet-container {
          background: #050a15 !important;
        }
        .premium-popup .leaflet-popup-content-wrapper {
          border-radius: 0 !important;
          background: #050a15 !important;
          color: white !important;
          border: 1px solid rgba(255,255,255,0.1);
          box-shadow: 20px 20px 40px rgba(0,0,0,0.5);
        }
        .premium-popup .leaflet-popup-tip {
          background: #050a15 !important;
        }
      `}</style>
    </div>
  );
}
