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
const chat_model_1 = __importDefault(require("../models/chat_model"));
//import request from "../common/Request";
const Response_1 = __importDefault(require("../common/Response"));
const Error_1 = __importDefault(require("../common/Error"));
const getChat = (req) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("getChat");
    const receiverId = req.body.receiverId;
    const senderId = req.userId;
    try {
        let isExist = yield chat_model_1.default.findOne({
            members: [senderId, receiverId],
        });
        if (!isExist)
            isExist = yield chat_model_1.default.findOne({
                members: [receiverId, senderId],
            });
        if (!isExist) {
            const newChat = yield new chat_model_1.default({
                members: [senderId, receiverId],
            });
            const savedChat = yield newChat.save();
            return new Response_1.default(savedChat, senderId, null);
        }
        else {
            console.log("chat exists in the db");
            return new Response_1.default(isExist, senderId, null);
        }
    }
    catch (err) {
        return new Response_1.default(null, senderId, new Error_1.default(400, err.message));
    }
});
module.exports = {
    getChat,
};
//# sourceMappingURL=chat.js.map