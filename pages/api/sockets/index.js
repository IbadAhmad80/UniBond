import { Server } from "Socket.IO";

const gatherUserMessages = (newMessage, prevMessagesMap) => {
    let prevMessages = prevMessagesMap.get(newMessage.to);
    if (prevMessages) {
        prevMessages.set(newMessage.to, [...prevMessages, newMessage]);
        return prevMessagesMap;
    } else {
        prevMessages.set(newMessage.to, [newMessage]);
        return prevMessagesMap;
    }
};

const SocketHandler = (req, res) => {
    if (res.socket.server.io) {
    } else {
        const io = new Server(res.socket.server, {
            cors: {
                credentials: true,
            },
        });
        res.socket.server.io = io;
        global.onlineUsers = new Map();

        io.on("connection", (socket) => {
            global.chatSocket = socket;
            socket.broadcast.emit("online-user", Object.fromEntries(global.onlineUsers));

            socket.on("add-user", (userId) => {
                if (userId) {
                    global.onlineUsers.set(userId, socket.id);
                    socket.broadcast.emit("online-user", Object.fromEntries(global.onlineUsers));
                }
            });

            socket.on("send-msg", (data) => {
                const sendUserSocket = global.onlineUsers.get(data.to);
                if (sendUserSocket) {
                    // call some function to count all the pending messages and then call the socket
                    socket.to(sendUserSocket).emit("msg-recieve", data.id, data.message, data.to, data.from, data.createdAt);
                }
                // call same fucntion again to count all the pending messages
                // gatherUserMessages(data)
            });

            socket.on("delete-user", (userId) => {
                if (userId) {
                    global.onlineUsers.delete(userId);
                    socket.broadcast.emit("online-user", Object.fromEntries(global.onlineUsers));
                }
            });
        });
    }
    res.end();
};

export default SocketHandler;
