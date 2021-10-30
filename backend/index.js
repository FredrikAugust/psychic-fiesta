const express = require("express");
const app = express();
const http = require("http");

const server = http.createServer(app);

const { v4 } = require("uuid");

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  },
});

io.on("connection", (socket) => {
  socket
    .on("message", (data) => {
      switch (data.type) {
        case "create":
          const id = v4();
          io.emit("message", { type: "created", value: { id, ...data } });
          break;

        case "sync":
          io.emit("sync");
          break;

        case "sync_response":
          console.debug(data.value);
          io.emit("sync_response", { value: data.value });
          break;

        default:
          console.warn(`Unknown type: ${data.type}`);
          break;
      }
    })
    .on("disconnect", () => {
      console.log("disconnected");
    });
});

server.listen(4000, () => {
  console.log("listening on *:4000");
});
