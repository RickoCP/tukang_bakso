import React from "react";
import { Marker } from "react-leaflet";
import L from "leaflet";

// Fungsi untuk membuat label kustom menggunakan DivIcon
const createLabelIcon = (label) => {
  return L.divIcon({
    html: `
      <div class="bg-white text-black text-xs px-1 py-1 rounded shadow-md inline-block" style="
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 150px;
      ">
        ${label}
      </div>
    `,
    className: '',
    iconSize: [0, 0],
    iconAnchor: [-20, 35],
  });
};

const MapMarker = ({ position, label, icon }) => (
  <Marker position={position} icon={icon}>
    <Marker position={position} icon={createLabelIcon(label)} />
  </Marker>
);

export default MapMarker;
