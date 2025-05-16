/*es para hacer un vuelo hacia la direccion que se registra automaticamente para que se vea bonito cuando camboa de una direccion a otra */
import React, { useEffect } from "react";
import { useMap } from "react-leaflet";

const FlyToLocation = ({ lat, lng }) => {
  const map = useMap();

  useEffect(() => {
    if (lat && lng) {
      map.flyTo([lat, lng], 15, { duration: 1.5 });
    }
  }, [lat, lng]);

  return null;
};

export default FlyToLocation;