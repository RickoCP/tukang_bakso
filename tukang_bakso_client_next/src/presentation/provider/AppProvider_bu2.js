import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import io from "socket.io-client";
import { useRouter } from "next/router";

const ENDPOINT = "http://localhost:5000";
const AppContext = createContext();

function AppProvider({ children }) {
  const socketRef = useRef(null);
  const watchLocation = useRef(null);
  const router = useRouter();

  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentRole, setCurrentRole] = useState("");
  const [userName, setUserName] = useState("");
  const [bottomSheetText, setBottomSheetText] = useState(
    "Dengan menutup halaman ini, kamu akan keluar dari pantauan Tukang Bakso"
  );
  const [hasAccessLocation, setHasAccessLocation] = useState(false);

  /** ✅ Connect to Socket.io Server */
  const connectSocket = useCallback(() => {
    if (!socketRef.current) {
      socketRef.current = io(ENDPOINT);

      // Register event listeners
      socketRef.current.on("new-user", handleNewUser);
      socketRef.current.on("users", handleUsersUpdate);
      socketRef.current.on("current-user", setCurrentUser);
      socketRef.current.on("position-change", handlePositionChange);
    }
  }, []);

  /** ✅ Disconnect from Socket.io */
  const disconnectSocket = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.emit("disconnect_socket");
      socketRef.current.disconnect();
      socketRef.current = null;
    }
  }, []);

  /** ✅ Cleanup when the component unmounts */
  useEffect(() => {
    connectSocket();
    return () => {
      navigator.geolocation.clearWatch(watchLocation.current);
      disconnectSocket();
    };
  }, [connectSocket, disconnectSocket]);

  /** ✅ Handle New User Event */
  const handleNewUser = useCallback(
    (data) => {
      console.log("New user joined:", data);
      if (currentRole !== data.role) {
        setUsers((prevUsers) => [...prevUsers, data]);
      }
    },
    [currentRole]
  );

  /** ✅ Handle Users List Update */
  const handleUsersUpdate = useCallback(
    (data) => {
      console.log("Users updated:", data);
      setUsers(data.filter((user) => user.role !== currentRole));
    },
    [currentRole]
  );

  /** ✅ Handle Position Change Event */
  const handlePositionChange = useCallback(
    (data) => {
      console.log("Position changed:", data);
      setUsers((prevUsers) =>
        prevUsers.map((user) => (user.socketId === data.socketId ? data : user))
      );
    },
    []
  );

  /** ✅ Track User Location */
  const startLocationTracking = useCallback(() => {
    if (hasAccessLocation) {
      watchLocation.current = navigator.geolocation.watchPosition(
        handlePositionUpdate,
        handleLocationError
      );
    }
  }, [hasAccessLocation]);

  /** ✅ Handle Geolocation Success */
  const handlePositionUpdate = useCallback(
    (data) => {
      if (!socketRef.current || !currentUser) return;

      const { latitude, longitude } = data.coords;

      socketRef.current.emit("position-change", {
        socketId: currentUser.socketId,
        coords: { latitude, longitude },
        role: currentRole,
        name: userName,
      });
    },
    [currentUser, currentRole, userName]
  );

  /** ✅ Initialize User Location */
  const initUserLocation = useCallback(() => {
    if (!navigator.geolocation) {
      console.warn("Geolocation is not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(handleLocationSuccess, handleLocationError);
  }, []);

  /** ✅ Handle Geolocation Success */
  const handleLocationSuccess = useCallback(
    (data) => {
      setHasAccessLocation(true);
      const { latitude, longitude } = data.coords;

      if (socketRef.current) {
        socketRef.current.emit("join", {
          coord: { latitude, longitude },
          role: currentRole,
          name: userName,
        });
      }

      console.log("Location fetched successfully");
      router.push("/map");
    },
    [currentRole, userName, router]
  );

  /** ✅ Handle Geolocation Errors */
  const handleLocationError = useCallback((error) => {
    const errorMessages = {
      1: "Permission Denied - Please allow location access.",
      2: "Position Unavailable - Cannot retrieve your location.",
      3: "Timeout - Location request took too long.",
    };

    console.warn(errorMessages[error.code] || "An unknown location error occurred.");
  }, []);

  /** ✅ Close App and Disconnect */
  const closeApp = useCallback(() => {
    disconnectSocket();
    router.push("/");
  }, [disconnectSocket, router]);

  return (
    <AppContext.Provider
      value={{
        initUserLocation,
        setCurrentRole,
        setUserName,
        closeApp,
        users,
        currentUser,
        currentRole,
        userName,
        bottomSheetText,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
export default AppProvider;
