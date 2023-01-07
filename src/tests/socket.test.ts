import server from "../app";
import mongoose from "mongoose";
import Client, { Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";

import request from "supertest";
import Post from "../models/post_model";
import User from "../models/user_model";
import Message from "../models/message_model";
import Chat from "../models/chat_model";

const userEmail = "user1@gmail.com";
const userPassword = "12345";

const userEmail2 = "user2@gmail.com";
const userPassword2 = "12345";

const myMessage = "hi ...";
const sender1 = "12345";

type Client = {
    socket: Socket<DefaultEventsMap, DefaultEventsMap>;
    accessToken: string;
    id: string;
};

let client1: Client;
let client2: Client;
let postId: string;

function clientSocketConnect(clientSocket): Promise<string> {
    return new Promise((resolve) => {
        clientSocket.on("connect", () => {
            resolve("1");
        });
    });
}

const connectUser = async (userEmail, userPassword) => {
    const response1 = await request(server).post("/auth/register").send({
        email: userEmail,
        password: userPassword,
    });
    const userId = response1.body._id;
    const response = await request(server).post("/auth/login").send({
        email: userEmail,
        password: userPassword,
    });
    const token = response.body.accessToken;

    const socket = Client("http://localhost:" + process.env.PORT, {
        auth: {
            token: "barrer " + token,
        },
    });
    await clientSocketConnect(socket);
    const client = { socket: socket, accessToken: token, id: userId };
    return client;
};

describe("my awesome project", () => {
    jest.setTimeout(15000);

    beforeAll(async () => {
        await Post.remove();
        await User.remove();
        await Message.remove();
        await Chat.remove();
        client1 = await connectUser(userEmail, userPassword);
        client2 = await connectUser(userEmail2, userPassword2);
        console.log("finish beforeAll");
    });

    afterAll(() => {
        client1.socket.close();
        client2.socket.close();
        server.close();
        mongoose.connection.close();
    });

    test("should work", (done) => {
        client1.socket.once("echo:echo_res", (arg) => {
            console.log("echo:echo");
            expect(arg.msg).toBe("hello");
            done();
        });
        client1.socket.emit("echo:echo", { msg: "hello" });
    });

    test("Post add new post", (done) => {
        client1.socket.once("post:post", (args) => {
            expect(args.message).toBe(myMessage);
            expect(args.sender).toBe(sender1);
            postId = args._id;
            done();
        });
        console.log("test post add new post");
        client1.socket.emit("post:post", {
            message: myMessage,
            sender: sender1,
        });
    });

    test("Post get all test", (done) => {
        client1.socket.once("post:get", (arg) => {
            console.log("on any " + arg);
            console.log(arg.body);
            expect(arg.err).toBe(null);
            done();
        });
        console.log("test post get all");
        client1.socket.emit("post:get", {});
    });

    test("Post get by Id test", (done) => {
        client1.socket.once("post:get:id", (arg) => {
            console.log("post id " + postId);
            expect(arg.err).toBe(null);
            expect(arg.body._id).toBe(postId);
            done();
        });
        console.log("test post get by Id");
        client1.socket.emit("post:get:id", { id: postId });
    });

    test("Post get by sender test", (done) => {
        client1.socket.once("post:get:sender", (arg) => {
            expect(arg.err).toBe(null);
            console.log(arg.body);
            done();
        });
        console.log("test post get by sender");
        client1.socket.emit("post:get:sender", { sender: sender1 });
    });

    test("Update a post", (done) => {
        const myNewMessage = "hi it's new ...";
        client1.socket.once("post:put", (args) => {
            expect(args.err).toBe(null);
            console.log(args.body);
            expect(args.body.message).toBe(myNewMessage);
            expect(args.body._id).toBe(postId);
            done();
        });
        console.log("test post update a post");
        client1.socket.emit("post:put", {
            message: myNewMessage,
            id: postId,
        });
    });

    test("Test chat messages - client1 send a msg to client2", (done) => {
        const text = "hi client2... first msg";
        client2.socket.once("chat:message", (args) => {
            expect(args.err).toBe(null);
            console.log(args.body);
            expect(args.body.text).toBe(text);
            expect(args.body.senderId).toBe(client1.id);
            done();
        });
        client1.socket.emit("chat:send_message", {
            receiverId: client2.id,
            text,
        });
    });
    test("Test chat messages - client2 send a msg to client1", (done) => {
        const text = "hi client1... first msg";
        client1.socket.once("chat:message", (args) => {
            expect(args.err).toBe(null);
            console.log(args.body);
            expect(args.body.text).toBe(text);
            expect(args.body.senderId).toBe(client2.id);
            done();
        });
        client2.socket.emit("chat:send_message", {
            receiverId: client1.id,
            text,
        });
    });
    test("Test chat messages - client2 send another msg to client1", (done) => {
        const text = "hi client1... second msg";
        client1.socket.once("chat:message", (args) => {
            expect(args.err).toBe(null);
            console.log(args.body);
            expect(args.body.text).toBe(text);
            expect(args.body.senderId).toBe(client2.id);
            done();
        });
        client2.socket.emit("chat:send_message", {
            receiverId: client1.id,
            text,
        });
    });

    test("Chat get all message by Id test", (done) => {
        client1.socket.once("chat:get:id", (arg) => {
            expect(arg.err).toBe(null);
            console.log(arg);
            expect(arg.body[0].senderId).toBe(client1.id);
            done();
        });
        console.log("test chat msg - get by Id");
        client1.socket.emit("chat:get:id", {
            user: client2.id,
        });
    });
});
