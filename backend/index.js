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
  console.log("a user connected");

  socket.on("message", (data) => {
    console.log(data);
    io.emit("message", { ...data, id: v4().toString() });
  });
});

server.listen(4000, () => {
  console.log("listening on *:4000");
});
