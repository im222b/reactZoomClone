import http from "http";
import SocketIO from "socket.io";
import express, { application } from "express";

//npm run dev


const app = express();   //http를 다루는 서버

app.set('view engine', 'pug');
app.set("views", __dirname + "/views");
app.use("/public",express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_,res) => res.redirect("/"));

const httpServer = http.createServer(app);  //http 서버
const wsServer = SocketIO(httpServer);

wsServer.on("connection", (socket) => {
    socket["nickname"]= "익명자";
    socket.onAny((event)=> {
        console.log(`Socket Event: ${event}`);
    });
    socket.on("enter_room", (roomName,done) => {
        socket.join(roomName);
        done();
        socket.to(roomName).emit("welcome", socket.nickname);
    });
    socket.on("disconnecting", () => {
        socket.rooms.forEach(room => socket.to(room).emit("bye",socket.nickname));
    });
    socket.on("new_message", (msg,room,done) => {
        socket.to(room).emit("new_message",`${socket.nickname} : ${msg}`);
        done();
    });
    socket.on("nickname", nickname => socket["nickname"] = nickname);
});


// function onSocketClose() {
//     console.log("Browser 연결이 끊어졌습니다 ❌")
// };

// function onSocketMessage(message){
//     console.log(message.toString());
// };


// const wss = new WebSocket.Server({ server });   //ws(웹소켓 : 채팅을 위한) 서버
                                    //↳서버를 굳이 넣지 않아도 되지만 넣는다면 두개다 동시 구동가능

// const sockets = []

// wss.on("connection",(socket) => {   //socket이란 브라우저와 나(사용자) 사이의 연결
//     sockets.push(socket);
//     socket["nickname"] = "익명자";
//     console.log("Browser 연결 되었습니다✅");
//     socket.on("close", onSocketClose );
//     socket.on("message", (msg) => {
//         const message = JSON.parse(msg);
//         switch (message.type) {
//             case "new_message":
//                 sockets.forEach(aSocket => aSocket.send(`${socket.nickname} : ${message.payload}`));
//             case "nickname":
//                 socket["nickname"] = message.payload;
//         }
//     });
// });

httpServer.listen(3000);