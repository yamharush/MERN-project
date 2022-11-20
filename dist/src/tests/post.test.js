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
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../server"));
const mongoose_1 = __importDefault(require("mongoose"));
const post_model_1 = __importDefault(require("../models/post_model"));
const newPostMessage = 'This is the new test post message';
const newPostSender = '999000';
const updatedPostMessage = 'This is the update message';
const nonExistSender = 'Yam Harush';
let newPostId = '';
let newSender = '';
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield post_model_1.default.remove();
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield post_model_1.default.remove();
    mongoose_1.default.connection.close();
}));
describe("Posts Tests", () => {
    test("add new post", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default).post('/post').send({
            "message": newPostMessage,
            "sender": newPostSender
        });
        expect(response.statusCode).toEqual(200);
        expect(response.body.message).toEqual(newPostMessage);
        expect(response.body.sender).toEqual(newPostSender);
        newPostId = response.body._id;
        newSender = response.body.sender;
    }));
    test("get all posts", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default).get('/post');
        expect(response.statusCode).toEqual(200);
        expect(response.body[0].message).toEqual(newPostMessage);
        expect(response.body[0].sender).toEqual(newPostSender);
    }));
    test("get post by id", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default).get('/post/' + newPostId);
        expect(response.statusCode).toEqual(200);
        expect(response.body.message).toEqual(newPostMessage);
        expect(response.body.sender).toEqual(newPostSender);
    }));
    //the negative test of get test by id
    test("get post by non exist id", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default).get('/post/11102');
        expect(response.statusCode).toEqual(400);
    }));
    test("get post by sender", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default).get('/post?sender=' + newSender);
        expect(response.statusCode).toEqual(200);
        expect(response.body[0].message).toEqual(newPostMessage);
        expect(response.body[0].sender).toEqual(newSender);
    }));
    //the negative test of get post by sender
    test("get post by non exist sender", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default).get('/post?sender=' + nonExistSender);
        expect(response.statusCode).toEqual(200);
        expect(response.body.length).toEqual(0);
    }));
    test("Update post", () => __awaiter(void 0, void 0, void 0, function* () {
        let response = yield (0, supertest_1.default)(server_1.default).put('/post/' + newPostId).send({
            "message": updatedPostMessage,
            "sender": newPostSender
        });
        expect(response.statusCode).toEqual(200);
        expect(response.body.message).toEqual(updatedPostMessage);
        expect(response.body.sender).toEqual(newPostSender);
        response = yield (0, supertest_1.default)(server_1.default).get('/post/' + newPostId);
        expect(response.statusCode).toEqual(200);
        expect(response.body.message).toEqual(updatedPostMessage);
        expect(response.body.sender).toEqual(newPostSender);
        //negative test for update post
        response = yield (0, supertest_1.default)(server_1.default).put('/post/1102').send({
            "message": updatedPostMessage,
            "sender": newPostSender
        });
        expect(response.statusCode).toEqual(400);
        response = yield (0, supertest_1.default)(server_1.default).put('/post/' + newPostId).send({
            "message": updatedPostMessage,
        });
        expect(response.statusCode).toEqual(200);
        expect(response.body.message).toEqual(updatedPostMessage);
        expect(response.body.sender).toEqual(newPostSender);
    }));
});
//# sourceMappingURL=post.test.js.map