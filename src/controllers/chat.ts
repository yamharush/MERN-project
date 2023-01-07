import chat from "../models/chat_model";
//import request from "../common/Request";
import response from "../common/Response";
import error from "../common/Error";

const getChat = async (req) => {
    console.log("getChat");
    const receiverId = req.body.receiverId;
    const senderId = req.userId;
    try {
        let isExist = await chat.findOne({
            members: [senderId, receiverId],
        });
        if (!isExist)
            isExist = await chat.findOne({
                members: [receiverId, senderId],
            });
        if (!isExist) {
            const newChat = await new chat({
                members: [senderId, receiverId],
            });
            const savedChat = await newChat.save();
            return new response(savedChat, senderId, null);
        } else {
            console.log("chat exists in the db");
            return new response(isExist, senderId, null);
        }
    } catch (err) {
        return new response(null, senderId, new error(400, err.message));
    }
};

export = {
    getChat,
};