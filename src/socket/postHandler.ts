import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import Post from "../controllers/post";
import Request from "../common/request";

export = (
    io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>,
    socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>
) => {
    const addNewPost = async (body) => {
        console.log("addNewPost handler with socketId: %s", socket.id);
        try {
            const response = await Post.addNewPost(
                new Request(body, socket.data.user)
            );
            socket.emit("post:post", response.body);
        } catch (err) {
            socket.emit("post:post", { status: "fail" });
        }
    };

    const getAllPosts = async (body) => {
        console.log("post:get_all handler with socketId: %s", socket.id);
        try {
            const response = await Post.getAllPosts(
                new Request(body, socket.data.user)
            );
            socket.emit("post:get", response);
        } catch (err) {
            socket.emit("post:get", { status: "fail" });
        }
    };

    const getPostById = async (body) => {
        console.log("post:get_by_id handler");
        const response = await Post.getPostById(
            new Request(body, socket.data.user),
            body.id
        );
        socket.emit("post:get:id", response);
    };

    const getPostBySender = async (body) => {
        console.log("post:get_by_sender handler");
        const response = await Post.getPostBySender(
            new Request(body, socket.data.user),
            body.sender
        );
        socket.emit("post:get:sender", response);
    };

    const updatePost = async (body) => {
        console.log("post:put handler");
        const response = await Post.putPostById(new Request(body, socket.data.user), body.id)
        socket.emit("post:put", response);
    };

    console.log("register echo handlers");
    socket.on("post:get", getAllPosts);
    socket.on("post:get:id", getPostById);
    socket.on("post:get:sender", getPostBySender);
    socket.on("post:post", addNewPost);
    socket.on("post:put", updatePost);
};