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
const message_model_1 = __importDefault(require("../models/message_model"));
const chat_model_1 = __importDefault(require("../models/chat_model"));
const error_1 = __importDefault(require("../common/error"));
const response_1 = __importDefault(require("../common/response"));
const mongoose_1 = __importDefault(require("mongoose"));
var id = new mongoose_1.default.Types.ObjectId();
const addNewMessage = (req, chatId) => __awaiter(void 0, void 0, void 0, function* () {
    const sender = req.userId;
    console.log("chatId:", chatId.body.id);
    try {
        const message = yield new message_model_1.default({
            chatId: chatId.body.id,
            senderId: sender,
            text: req.body.text,
        });
        const savedMessage = yield message.save();
        console.log("saved a new message in the db");
        return new response_1.default(savedMessage, sender, null);
    }
    catch (err) {
        return new response_1.default(null, sender, new error_1.default(400, err.message));
    }
});
const getAllMessages = (req, user) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(user);
    const sender = req.userId;
    console.log(sender);
    try {
        let isExist = yield chat_model_1.default.findOne({
            members: [user, sender],
        });
        if (!isExist) {
            isExist = yield chat_model_1.default.findOne({
                members: [sender, user],
            });
        }
        console.log(isExist);
        const messages = yield message_model_1.default.find({
            chatId: isExist.id,
        });
        console.log("chatId:", isExist.id);
        return new response_1.default(messages, sender, null);
    }
    catch (err) {
        return new response_1.default(null, sender, new error_1.default(400, err.message));
    }
});
module.exports = {
    addNewMessage,
    getAllMessages
};
//# sourceMappingURL=message.js.map