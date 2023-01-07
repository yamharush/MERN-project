import request from "supertest";
import app from "../server";
import mongoose from "mongoose";
import Post from "../models/post_model";
import User from "../models/user_model";
import Message from "../models/message_model";
import Chat from "../models/chat_model";

const newPostMessage = "This is the new test post message";
let newPostSender = "";
let newPostId = "";
const newPostMessageUpdated = "This is the updated message";

const userEmail = "user1@gmail.com";
const userPassword = "12345";
let accessToken = "";

beforeAll(async () => {
    await Post.remove();
    await User.remove();
    await Message.remove();
    await Chat.remove();

    const res = await request(app).post("/auth/register").send({
        email: userEmail,
        password: userPassword,
    });
    newPostSender = res.body._id;
});

async function loginUser() {
    const response = await request(app).post("/auth/login").send({
        email: userEmail,
        password: userPassword,
    });
    accessToken = response.body.accessToken;
}

beforeEach(async () => {
    await loginUser();
});

afterAll(async () => {
    await Post.remove();
    await User.remove();
    mongoose.connection.close();
});

describe("Posts Tests", () => {
    test("add new post", async () => {
        const response = await request(app)
            .post("/post")
            .set("Authorization", "JWT " + accessToken)
            .send({
                message: newPostMessage,
                sender: newPostSender,
            });
        expect(response.statusCode).toEqual(200);
        //   console.log("response body addNewPost")
        //   console.log(response.body.post)
        expect(response.body.post.message).toEqual(newPostMessage);
        expect(response.body.post.sender).toEqual(newPostSender);
        newPostId = response.body.post._id;
    });

    test("get all posts", async () => {
        const response = await request(app)
            .get("/post")
            .set("Authorization", "JWT " + accessToken);
        expect(response.statusCode).toEqual(200);
        expect(response.body.post[0].message).toEqual(newPostMessage);
        expect(response.body.post[0].sender).toEqual(newPostSender);
    });

    test("get post by id", async () => {
        const response = await request(app)
            .get("/post/" + newPostId)
            .set("Authorization", "JWT " + accessToken);
        expect(response.statusCode).toEqual(200);
        expect(response.body.post.message).toEqual(newPostMessage);
        expect(response.body.post._id).toEqual(newPostId);
    });

    test("get post by wrong id fails", async () => {
        const response = await request(app)
            .get("/post/12345")
            .set("Authorization", "JWT " + accessToken);
        expect(response.statusCode).toEqual(400);
    });

    test("get post by sender", async () => {
        const response = await request(app)
            .get("/post?sender=" + newPostSender)
            .set("Authorization", "JWT " + accessToken);
        expect(response.statusCode).toEqual(200);
        expect(response.body.post[0].message).toEqual(newPostMessage);
        expect(response.body.post[0].sender).toEqual(newPostSender);
    });

    test("update post by valid Id", async () => {
        let response = await request(app)
            .put("/post/" + newPostId)
            .set("Authorization", "JWT " + accessToken)
            .send({
                message: newPostMessageUpdated,
            });
        console.log(response.body.post)
        expect(response.statusCode).toEqual(200);
        expect(response.body.post.message).toEqual(newPostMessageUpdated);
        expect(response.body.post.sender).toEqual(newPostSender);

        response = await request(app)
            .get("/post/" + newPostId)
            .set("Authorization", "JWT " + accessToken);
        expect(response.statusCode).toEqual(200);
        expect(response.body.post.message).toEqual(newPostMessageUpdated);
        expect(response.body.post.sender).toEqual(newPostSender);
    })

    test("update post by invalid Id", async () => {
        const response = await request(app)
            .put("/post/12345")
            .set("Authorization", "JWT " + accessToken)
            .send({
                message: newPostMessageUpdated,
            });
        expect(response.statusCode).toEqual(400);

    });
});