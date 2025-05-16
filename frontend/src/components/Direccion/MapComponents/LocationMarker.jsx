/* valida las coordenadas, permite que el indicador se mueva muestra el nombre del municipio en un cuadrito */

import React from "react";
import { Marker, Tooltip } from "react-leaflet";
import L from "leaflet";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: "/gota.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  shadowUrl: markerShadow,
  shadowSize: [41, 41],
  shadowAnchor: [13, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const LocationMarker = ({ latitud, longitud, nombreMunicipio, onDragEnd }) => {
  if (!latitud || !longitud) return null;

  return (
    <Marker
      position={[latitud, longitud]}
      draggable={true}
      eventHandlers={{ dragend: onDragEnd }}
    >
      {nombreMunicipio && <Tooltip permanent>{nombreMunicipio}</Tooltip>}
    </Marker>
  );
};

export default LocationMarker;