import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const useSocket = (user, host = "http://localhost:5000") => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!user) return;

    const socket = io(host);

    socket.on("connect", () => {
      // Set user for socket connection
      socket.emit("client connect", user);
    });

    setSocket(socket);

    // Deps
  }, [host, user]);

  return socket;
};

export default useSocket;
