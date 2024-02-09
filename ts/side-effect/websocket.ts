import { io } from "socket.io-client";
import { connectionOptions } from "../requests";
import { handleMessage } from "./handlers";

let socket = null;

function connect() {
  socket = io(connectionOptions);
  socket.on("connect", () => {
    console.log("Connected to the server");
    ping();
  });
  socket.on("disconnect", () => {
    console.log("Disconnected from the server");
  });
  socket.on("message", handleMessage);
}

function ping() {
  if (!socket || !socket.connected) return;
  socket.emit("ping");
  setTimeout(ping, 500);
}

function sendMessage(text: string) {
  if (!socket || !socket.connected) return;
  socket.emit("message", { text: `${text}` });
}

export { connect, sendMessage };
