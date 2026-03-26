"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function MapInner() {
  // Coordonnées de l'ULPGL Goma (approximatif basé sur l'iframe original)
  const position: [number, number] = [-1.683642, 29.219803];

  return (
    <MapContainer 
      center={position} 
      zoom={15} 
      scrollWheelZoom={false}
      className="w-full h-full min-h-[500px] lg:min-h-screen rounded-b-3xl lg:rounded-md lg:rounded-r-3xl z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />
      <Marker position={position}>
        <Popup className="font-sans">
          <div className="text-center p-2">
            <h3 className="font-bold text-slate-900 leading-tight mb-1">CREDDA - ULPGL</h3>
            <p className="text-xs text-slate-500">Goma, Nord-Kivu, RDC</p>
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
}
