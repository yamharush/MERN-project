"use strict";
module.exports = (io, socket) => {
    const sendMessage = (payload) => {
        console.log('chat:send_message');
        const to = payload.to;
        const message = payload.message;
        const from = socket.data.user;
        io.to(to).emit("chat:message", { 'to': to, 'from': from, 'message': message });
    };
    console.log('register echo handlers');
    socket.on("chat:send_message", sendMessage);
};
//# sourceMappingURL=chatHandler.js.map