import { useState, useRef } from "react";
import { useRouter } from "next/router";
import { SocketService } from "../infrastructure/SocketService";

export function useAppProvider() {
  const socketRef = useRef();
  const watchLocation = useRef();
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState({});
  const [currentRole, setCurrentRole] = useState("");
  const [userName, setUserName] = useState("");
  const [hasAccessLocation, setHasAccessLocation] = useState(false);

  const router = useRouter();

  const connectSocket = () => {
    socketRef.current = SocketService.connect();
  };

  const disconnectSocket = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
  };

  const positionChange = (data) => {
    const latitude = data.coords.latitude;
    const longitude = data.coords.longitude;
    socketRef.current.emit("position-change", {
      socketId: currentUser.socketId,
      coords: { latitude, longitude },
      role: currentRole,
      name: userName,
    });
  };

  const initUserLocation = () => {
    if (!navigator.geolocation) {
      console.log("Your system does not support Geolocation");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      locationResolveSuccessfully,
      locationResolveError
    );
  };

  const locationResolveSuccessfully = (data) => {
    setHasAccessLocation(true);
    const latitude = data.coords.latitude;
    const longitude = data.coords.longitude;
    socketRef.current.emit("join", {
      coord: { latitude, longitude },
      role: currentRole,
      name: userName,
    });
    router.push("/map");
  };

  const locationResolveError = (error) => {
    let errorType = "";
    if (error.code === 1) {
      errorType = "Permission Denied";
    } else if (error.code === 2) {
      errorType = "Position Unavailable";
    } else if (error.code === 3) {
      errorType = "Timeout";
    }
    console.log(error.message);
  };

  const closeApp = () => {
    disconnectSocket();
    router.push("/");
  };

  return {
    connectSocket,
    disconnectSocket,
    initUserLocation,
    setCurrentRole,
    setUserName,
    closeApp,
    users,
    setUsers,
    currentUser,
    setCurrentUser,
    currentRole,
    userName,
    hasAccessLocation,
    watchLocation,
  };
}
