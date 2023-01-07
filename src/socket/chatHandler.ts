import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import User from "../models/user_model";
import Message from "../controllers/message";
import Chat from "../controllers/chat";
import Request from "../common/Request";

export = (
    io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>,
    socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>
) => {
    // object :
    //{'receiverId': destination user id,
    //   'text' : message to send}

    const sendMessage = async (body) => {
        console.log("chat:send_message");
        try {
            const conversationId = await Chat.getChat(
                new Request(body, socket.data.user)
            );
            const response = await Message.addNewMessage(
                new Request(body, socket.data.user),
                conversationId
            );
            io.to(body.receiverId).emit("chat:message", response);
        } catch (err) {
            socket.emit("chat:message", { status: "fail" });
        }
    };

    // get user conversations
    const getAllMsgById = async (body) => {
        console.log("chat:get:id");
        try {
            const response = await Message.getAllMessages(
                new Request(body, socket.data.user),
                body.user
            );
            socket.emit("chat:get:id", response);
        } catch (err) {
            socket.emit("chat:get:id", { status: "fail" });
        }
    };

    console.log("register chat handlers");
    socket.on("chat:send_message", sendMessage);
    socket.on("chat:get:id", getAllMsgById);
};