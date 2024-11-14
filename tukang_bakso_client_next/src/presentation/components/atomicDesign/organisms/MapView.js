import React from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import MapMarker from "../molecules/MapMarker";
import { useApp } from "../../../../presentation/provider/AppProvider";
import L from "leaflet";

// Membuat icon kustom
const customIconCustomer = new L.Icon({
  iconUrl: "/images/customer_icon.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const customIconTukangBakso = new L.Icon({
  iconUrl: "/images/tukang_bakso_icon.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const MapView = () => {
  const { users, currentUser } = useApp();
  const centerUser = users.find((e) => e.socketId === currentUser?.socketId);
  const center = centerUser
    ? [centerUser.coords?.latitude, centerUser.coords?.longitude]
    : [0, 0];

  const userToShow = users.filter((e) => e.role !== currentUser?.role);

  return (
    <MapContainer center={center} zoom={12} style={{ height: "100vh" }}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {userToShow?.map((user) => (
        <MapMarker
          key={user.socketId || user.id}
          position={[user.coords?.latitude, user.coords?.longitude]}
          label={user.name}
          icon={user.role === "customer" ? customIconCustomer : customIconTukangBakso}
        />
      ))}
    </MapContainer>
  );
};

export default MapView;
