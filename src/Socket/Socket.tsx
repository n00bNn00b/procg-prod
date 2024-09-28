// import { io, Socket } from "socket.io-client";
// import { useEffect, useState } from "react";

// const url = import.meta.env.VITE_API_URL;

// let socket: Socket | null = null;

// const useSocket = () => {
//   const [user, setUser] = useState<string | null>(localStorage.getItem("user_name"));

//   // Function to initialize socket connection
//   const initializeSocket = (username: string | null) => {
//     // if (socket) {
//     //   socket.disconnect(); // Disconnect the previous connection
//     // }

//     socket = io(`${url}`, {
//       query: {
//         key: username
//       }
//     });

//     socket.on("connect", () => {
//       console.log("Connected with username:", username);
//     });
//   };

//   // Update socket when user_name is set or changed
//   useEffect(() => {
//     initializeSocket(user);

//     const handleStorageChange = (event: StorageEvent) => {
//       if (event.key === "user_name") {
//         const updatedUser = event.newValue;
//         setUser(updatedUser);
//         initializeSocket(updatedUser); // Re-initialize socket with new user
//       }
//     };

//     // Listen for changes to localStorage
//     window.addEventListener("storage", handleStorageChange);

//     return () => {
//       // Cleanup when the component unmounts
//       window.removeEventListener("storage", handleStorageChange);
//       if (socket) {
//         socket.disconnect();
//       }
//     };
//   }, [user]);

//   return socket;
// };

// export default useSocket;

  