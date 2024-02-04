import { Socket } from 'dgram';
import express from 'express';

const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000"],
  },
});
const PORT = 5001;
let typingUserList: string[] = [];
let deleteUserIndex = 0;

type MessageType = {
  userName: string;
  text: string;
};

// クライアントと通信
io.on("connection", (socket: Socket) => {
  console.log("クライアントと接続しました");

  // クライアントからタイピング開始ユーザーを受信
  socket.on("sendTypingStartUser", (typingUser: string) => {
    typingUserList.push(typingUser);
    io.emit("receivedTypingUser", typingUserList);
  });

  // クライアントからタイピング終了ユーザーを受信
  socket.on("sendTypingEndUser", (typingUser: string) => {
    typingUserList = typingUserList.filter(
      (userName) => userName !== typingUser
    );
    io.emit("receivedTypingUser", typingUserList);
  });

  // クライアントからメッセージ受信
  socket.on("sendMessage", (message: MessageType) => {
    io.emit("receivedMessage", message); // クライアントへメッセージを返信
  });
});

server.listen(PORT, () => console.log(`${PORT}でサーバーと接続しました。`));
