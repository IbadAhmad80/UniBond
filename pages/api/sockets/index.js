import { Server } from "socket.io";

const gatherUserMessages = (newMessage, prevMessagesMap) => {
    let prevMessages = prevMessagesMap?.get(newMessage.to);
    if (prevMessages) prevMessagesMap.set(newMessage.to, [...prevMessages, { ...newMessage, isRead: false }]);
    else prevMessagesMap?.set(newMessage.to, [{ ...newMessage, isRead: false }]);
    return prevMessagesMap.get(newMessage.to);
};

const removeUserMesages = (unreadMessages, prevMessagesMap, id) => {
    prevMessagesMap.set(id, unreadMessages);
    return prevMessagesMap.get(id);
};

const SocketHandler = (_, res) => {
    if (res.socket.server.io) {
    } else {
        const io = new Server(res.socket.server, {
            cors: {
                credentials: true,
            },
        });
        res.socket.server.io = io;
        global.onlineUsers = new Map();
        global.userMessages = new Map();

        // Some user has opened the app
        io.on("connection", (socket) => {
            global.chatSocket = socket;
            socket.broadcast.emit("online-user", Object.fromEntries(global.onlineUsers));

            // Some user has been logged in
            socket.on("add-user", (userId) => {
                if (userId) {
                    global.onlineUsers.set(userId, socket.id);
                    socket.broadcast.emit("send-notifications", { id: userId, msgs: global.userMessages.get(userId) });
                    socket.broadcast.emit("online-user", Object.fromEntries(global.onlineUsers));
                }
            });

            // Some message has been sent
            socket.on("send-msg", (data) => {
                const sendUserSocket = global.onlineUsers.get(data.to);
                if (sendUserSocket) {
                    socket.broadcast.emit("send-notifications", { id: data.to, msgs: gatherUserMessages(data, global.userMessages) });
                    socket.to(sendUserSocket).emit("msg-recieve", data.id, data.message, data.to, data.from, data.createdAt);
                }
            });

            // Some user has read the notifications / messages
            socket.on("remove-notifications", ({ userId, msgs }) => {
                socket.broadcast.emit("send-notifications", { id: userId, msgs: removeUserMesages(msgs, global.userMessages, userId) });
            });

            // Some user has been logged out
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
