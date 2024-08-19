//npm run dev

import http from "http";

import { Server } from "socket.io";
import { instrument } from "@socket.io/admin-ui";
import express from "express";
import { Socket } from "dgram";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const httpServer = http.createServer(app);
const wsServer = new Server(httpServer);

const handleListen = () => console.log(`http://http://localhost:3000 로 접속하세요`)

httpServer.listen(3000,handleListen);