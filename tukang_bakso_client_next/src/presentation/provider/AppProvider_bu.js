import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { useAppProvider } from "../../application/useApp";

const Context = createContext();

function AppProvider({ children }) {
  const app = useAppProvider();

  useEffect(() => {
    if (!app?.socketRef?.current) {
      app.connectSocket();
      console.log("run connectSocket");
    }

    console.log("useEffect AppProvider app: ", app);
    console.log("useEffect AppProvider app.currentRole: ", app.currentRole);
    console.log("useEffect AppProvider app.socketRef: ", app.socketRef);


    // Pastikan socketRef sudah diinisialisasi sebelum diakses
    if (app.socketRef && app.socketRef.current) {
      app.socketRef.current.on("new-user", (data) => {
        console.log("new-user: ", data);
        console.log("currentRole: ", app.currentRole);
        console.log("data.role: ", data.role);
        if (app.currentRole !== data.role) {
          app.setUsers((users) => [...users, data]);
        }
      });

      app.socketRef.current.on("users", (data) => {
        console.log("users: ", data);
        console.log("currentRole: ", app.currentRole);
        const filteredData = data.filter((u) => u.role !== app.currentRole);
        app.setUsers(filteredData);
      });

      app.socketRef.current.on("current-user", (data) => {
        console.log("current-user: ", data);
        app.setCurrentUser(data);
      });

      app.socketRef.current.on("position-change", (data) => {
        let updatedUsers = app.users.map((user) => {
          if (user.socketId === data.socketId) {
            return data;
          }
          return user;
        });
        app.setUsers(updatedUsers);
      });
    }

    if (app.hasAccessLocation) {
      app.watchLocation.current = navigator.geolocation.watchPosition(
        app.positionChange,
        app.locationResolveError
      );
    }

    return () => {
      // Pastikan watchLocation dan socketRef dihapus dengan aman
      if (app.watchLocation.current) {
        navigator.geolocation.clearWatch(app.watchLocation.current);
      }
      if (app.socketRef && app.socketRef.current) {
        app.disconnectSocket();
      }
    };
  }, [
    app.connectSocket,
    app.currentRole,
    app.disconnectSocket,
    app.hasAccessLocation,
    app.positionChange,
    app.setUsers,
    app.socketRef,
    app.users,
    app.watchLocation,
  ]);

  return <Context.Provider value={app}>{children}</Context.Provider>;
}

export const useApp = () => useContext(Context);

export default AppProvider;
