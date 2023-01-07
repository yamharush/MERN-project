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
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const request_1 = __importDefault(require("../common/request"));
const message_1 = __importDefault(require("../controllers/message"));
const auth_1 = __importDefault(require("../controllers/auth"));
const chat_1 = __importDefault(require("../controllers/chat"));
router.post("/", auth_1.default.authenticateMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    try {
        const chatId = yield chat_1.default.getChat(request_1.default.fromRestRequest(req));
        const response = yield message_1.default.addNewMessage(request_1.default.fromRestRequest(req), chatId);
        response.sendRestResponse(res);
    }
    catch (err) {
        res.status(400).send({
            status: "fail",
            message: err.message,
        });
    }
}));
router.get("/", auth_1.default.authenticateMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield message_1.default.getAllMessages(request_1.default.fromRestRequest(req), req.query.user);
        response.sendRestResponse(res);
    }
    catch (err) {
        res.status(400).send({
            status: "fail",
            message: err.message,
        });
    }
}));
module.exports = router;
//# sourceMappingURL=message_route.js.map