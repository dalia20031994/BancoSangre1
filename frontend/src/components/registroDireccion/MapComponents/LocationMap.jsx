/*tiene lo de que se vea bonito cuando cambia de lugar, el boton para ubicacion actual y el indicador de ubicacion */
import React from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import LocationMarker from "./LocationMarker";
import FlyToLocation from "./FlyToLocation";
import { LocateFixed } from "lucide-react";

const LocationMap = ({ latitud, longitud, nombreMunicipio, onMarkerDragEnd, onDetectLocation }) => {
  return (
    <div className="mt-4">
      <label className="block text-sm font-bold text-teal-700">Elegir dirección</label>
      <label className="block text-sm font-bold text-white"> . </label>

      <MapContainer 
        center={[latitud || 17.075, longitud || -96.721]} 
        zoom={15} 
        scrollWheelZoom={false} 
        style={{ height: "300px" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <LocationMarker 
          latitud={latitud} 
          longitud={longitud} 
          nombreMunicipio={nombreMunicipio}
          onDragEnd={onMarkerDragEnd}
        />
        <FlyToLocation lat={latitud} lng={longitud} />
      </MapContainer>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={onDetectLocation}
          className="flex items-center gap-2 border border-green-700 text-green-800 hover:bg-green-50 px-4 py-2 rounded-md transition-colors"
        >
          <LocateFixed size={18} />
          Detectar mi ubicación
        </button>
      </div>
    </div>
  );
};

export default LocationMap;