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
const post_1 = __importDefault(require("../controllers/post"));
const request_1 = __importDefault(require("../common/request"));
module.exports = (io, socket) => {
    const addNewPost = (body) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("addNewPost handler with socketId: %s", socket.id);
        try {
            const response = yield post_1.default.addNewPost(new request_1.default(body, socket.data.user));
            socket.emit("post:post", response.body);
        }
        catch (err) {
            socket.emit("post:post", { status: "fail" });
        }
    });
    const getAllPosts = (body) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("post:get_all handler with socketId: %s", socket.id);
        try {
            const response = yield post_1.default.getAllPosts(new request_1.default(body, socket.data.user));
            socket.emit("post:get", response);
        }
        catch (err) {
            socket.emit("post:get", { status: "fail" });
        }
    });
    const getPostById = (body) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("post:get_by_id handler");
        const response = yield post_1.default.getPostById(new request_1.default(body, socket.data.user), body.id);
        socket.emit("post:get:id", response);
    });
    const getPostBySender = (body) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("post:get_by_sender handler");
        const response = yield post_1.default.getPostBySender(new request_1.default(body, socket.data.user), body.sender);
        socket.emit("post:get:sender", response);
    });
    const updatePost = (body) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("post:put handler");
        const response = yield post_1.default.putPostById(new request_1.default(body, socket.data.user), body.id);
        socket.emit("post:put", response);
    });
    console.log("register echo handlers");
    socket.on("post:get", getAllPosts);
    socket.on("post:get:id", getPostById);
    socket.on("post:get:sender", getPostBySender);
    socket.on("post:post", addNewPost);
    socket.on("post:put", updatePost);
};
//# sourceMappingURL=postHandler.js.map