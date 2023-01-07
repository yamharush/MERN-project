"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const message_1 = __importDefault(require("../controllers/message"));
const chat_1 = __importDefault(require("../controllers/chat"));
const Request_1 = __importDefault(require("../common/Request"));
module.exports = (io, socket) => {
    // object :
    //{'receiverId': destination user id,
    //   'text' : message to send}
    const sendMessage = (body) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("chat:send_message");
        try {
            const conversationId = yield chat_1.default.getChat(new Request_1.default(body, socket.data.user));
            const response = yield message_1.default.addNewMessage(new Request_1.default(body, socket.data.user), conversationId);
            io.to(body.receiverId).emit("chat:message", response);
        }
        catch (err) {
            socket.emit("chat:message", { status: "fail" });
        }
    });
    // get user conversations
    const getAllMsgById = (body) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("chat:get:id");
        try {
            const response = yield message_1.default.getAllMessages(new Request_1.default(body, socket.data.user), body.user);
            socket.emit("chat:get:id", response);
        }
        catch (err) {
            socket.emit("chat:get:id", { status: "fail" });
        }
    });
    console.log("register chat handlers");
    socket.on("chat:send_message", sendMessage);
    socket.on("chat:get:id", getAllMsgById);
};
//# sourceMappingURL=chatHandler.js.map