import Message from "../models/message_model";
import chat from "../models/chat_model";
import error from "../common/error";
import response from "../common/response";
import mongoose from "mongoose";
var id = new mongoose.Types.ObjectId()

const addNewMessage = async (req, chatId) => {
    const sender = req.userId;
    console.log("chatId:", chatId.body.id);
    try {
        const message = await new Message({
            chatId: chatId.body.id,
            senderId: sender,
            text: req.body.text,
        });
        const savedMessage = await message.save();
        console.log("saved a new message in the db");
        return new response(savedMessage, sender, null);
    } catch (err) {
        return new response(null, sender, new error(400, err.message));
    }
};

const getAllMessages = async (req, user) => {
    console.log(user);
    const sender = req.userId;
    console.log(sender);
    try {
        let isExist = await chat.findOne({
            members: [user, sender],
        });
        if (!isExist) {
            isExist = await chat.findOne({
                members: [sender, user],
            });
        }
        console.log(isExist);
        const messages = await Message.find({
            chatId: isExist.id,
        });
        console.log("chatId:", isExist.id);
        return new response(messages, sender, null);
    } catch (err) {
        return new response(null, sender, new error(400, err.message));
    }
};

export = {
    addNewMessage,
    getAllMessages
};