"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const mongoose_1 = __importDefault(require("mongoose"));
const messageSchema = new mongoose_1.default.Schema({
    chatId: {
        type: String,
    },
    senderId: {
        type: String,
    },
    text: {
        type: String,
    },
}, { timestamps: true });
module.exports = mongoose_1.default.model("Message", messageSchema);
//# sourceMappingURL=message_model.js.map