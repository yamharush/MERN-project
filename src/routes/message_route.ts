import express from "express";
const router = express.Router();
import request from "../common/request";
import message from "../controllers/message";
import auth from "../controllers/auth";
import chat from "../controllers/chat";

router.post("/", auth.authenticateMiddleware, async (req, res) => {
    console.log(req.body);
    try {
        const chatId = await chat.getChat(
            request.fromRestRequest(req)
        );
        const response = await message.addNewMessage(
            request.fromRestRequest(req),
            chatId
        );
        response.sendRestResponse(res);
    } catch (err) {
        res.status(400).send({
            status: "fail",
            message: err.message,
        });
    }
});

router.get("/", auth.authenticateMiddleware, async (req, res) => {
    try {
        const response = await message.getAllMessages(
            request.fromRestRequest(req),
            req.query.user
        );
        response.sendRestResponse(res);
    } catch (err) {
        res.status(400).send({
            status: "fail",
            message: err.message,
        });
    }
});

export = router;