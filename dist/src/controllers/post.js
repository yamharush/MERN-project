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
const post_model_1 = __importDefault(require("../models/post_model"));
const response_1 = __importDefault(require("../common/response"));
const error_1 = __importDefault(require("../common/error"));
// import { Request, Response } from "express";
const addNewPost = (req) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    const msg = req.body.message;
    const senderMsg = req.body.sender;
    const sender = req.userId;
    const post = new post_model_1.default({
        message: msg,
        sender: senderMsg,
    });
    try {
        const newPost = yield post.save();
        return new response_1.default(newPost, sender, null);
    }
    catch (err) {
        return new response_1.default(null, sender, new error_1.default(400, err.message));
    }
});
const getAllPosts = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const sender = req.userId;
    try {
        const posts = yield post_model_1.default.find();
        return new response_1.default(posts, sender, null);
    }
    catch (err) {
        return new response_1.default(null, sender, new error_1.default(400, err.message));
    }
});
const getPostById = (req, id) => __awaiter(void 0, void 0, void 0, function* () {
    // const id = id;
    const postId = id;
    const sender = req.userId;
    try {
        const posts = yield post_model_1.default.findById(postId);
        return new response_1.default(posts, sender, null);
    }
    catch (err) {
        return new response_1.default(null, sender, new error_1.default(400, err.message));
    }
});
const getPostBySender = (req, sender) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield post_model_1.default.find({ sender: sender });
        return new response_1.default(posts, req.userId, null);
    }
    catch (err) {
        return new response_1.default(null, req.userId, new error_1.default(400, err.message));
    }
});
const putPostById = (req, id) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = id;
    const updateMsg = req.body.message;
    const sender = req.userId;
    try {
        const post = yield post_model_1.default.findByIdAndUpdate(postId, { message: updateMsg }, { new: true });
        return new response_1.default(post, sender, null);
    }
    catch (err) {
        return new response_1.default(null, sender, new error_1.default(400, err.message));
    }
});
module.exports = {
    getAllPosts,
    addNewPost,
    getPostById,
    getPostBySender,
    putPostById
};
//# sourceMappingURL=post.js.map