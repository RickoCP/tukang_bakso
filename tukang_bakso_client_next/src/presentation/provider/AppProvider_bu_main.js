import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback
} from "react";
import io from "socket.io-client";
import { useRouter } from "next/router";
const ENDPOINT = "http://localhost:5000";
const Context = createContext();

function AppProvider({ children }) {
  const socketRef = useRef();
  const watchLocation = useRef();

  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState({});
  const [currentRole, setCurrentRole] = useState("");
  const [userName, setUserName] = useState("");
  const [bottomSheetText, setBottomSheetText] = useState(
    "Dengan menutup halaman ini, kamu akan keluar dari pantauan Tukang Bakso"
  );
  const [hasAccessLocation, setHasAccessLocation] = useState(false);

  const router = useRouter();

  const connectSocket = () => {
    socketRef.current = io(ENDPOINT);
  };

  const disconnectSocket = () => {
    if (socketRef.current) {
      socketRef.current.emit("disconnect_socket");
      // socketRef.current.disconnect();
    }
  };

  const appClosed= () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
  };

  useEffect(() => {
    connectSocket();

    if (socketRef.current) {
      socketRef.current.on("new-user", (data) => {
        console.log("new-user: ", data);
        console.log("currentRole: ", currentRole);
        console.log("data.role: ", data.role);
        if (currentRole !== data.role) {
          setUsers((users) => [...users, data]);
        }
        // setUsers((users) => [...users, data]);
      });

      socketRef.current.on("users", (data) => {
        console.log("users: ", data);
        console.log("currentRole: ", currentRole);
        const dataFilter = data.filter((u) => u.role !== currentRole);
        setUsers(dataFilter);
        // setUsers(data);
      });

      socketRef.current.on("current-user", (data) => {
        console.log("current-user: ", data);
        setCurrentUser(data);
      });

      socketRef.current.on("position-change", (data) => {
        console.log("position-change: ", data);
        let users = users?.map((user) => {
          if (user.socketId === data.soketId) {
            return data;
          }
          return user;
        });
      });
    }

    if (hasAccessLocation) {
      watchLocation.current = navigator.geolocation.watchPosition(
        positionChange,
        locationResolveError
      );
    }

    return () => {
      navigator.geolocation.clearWatch(watchLocation.current);
      appClosed();
    };
  }, []);

  function positionChange(data) {
    const latitude = data.coords.latitude;
    const longitude = data.coords.longitude;
    if (currentUser !== "customer") {
      socketRef.current.emit("position-change", {
        socketId: currentUser.socketId,
        coords: {
          latitude,
          longitude,
        },
        role: currentRole,
        name: userName,
      });
    }
  }

  function initUserLocation() {
    if (!navigator.geolocation) {
      console.log("Your system does not support Geolocation");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      locationResolveSuccessfully,
      locationResolveError
    );
  }

  function locationResolveSuccessfully(data) {
    setHasAccessLocation(true);
    const latitude = data.coords.latitude;
    const longitude = data.coords.longitude;
    socketRef.current.emit("join", {
      coord: { latitude, longitude },
      role: currentRole,
      name: userName,
    });
    console.log("Location fetched successfully");
    console.log("currentRole: ", currentRole);
    console.log("userName: ", userName);
    console.log("latitude/longitude: ", latitude + longitude);
    router.push("/map");
  }

  const locationResolveError = useCallback((error) => {
    const errorMessages = {
      1: "Permission Denied - Please allow location access.",
      2: "Position Unavailable - Cannot retrieve your location.",
      3: "Timeout - Location request took too long.",
    };

    console.warn(errorMessages[error.code] || "Unknown error occurred.");
  }, []);

  function closeApp() {
    // navigator.geolocation.clearWatch(watchLocation.current);
    disconnectSocket();
    router.push("/");
  }

  return (
    <Context.Provider
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
    </Context.Provider>
  );
}

export const useApp = () => useContext(Context);

export default AppProvider;
