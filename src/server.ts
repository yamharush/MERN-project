import express from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import http from "http";
const server = http.createServer(app);

import bodyParser from "body-parser";
app.use(bodyParser.urlencoded({ extended: true, limit: "1mb" }));
app.use(bodyParser.json());

mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection;
db.on("error", (error) => {
    console.error(error);
});
db.once("open", () => {
    console.log("connected to mongo DB");
});

app.use("/public", express.static("public"));

import postRouter from "./routes/post_route";
app.use("/post", postRouter);

import authRouth from "./routes/auth_route";
app.use("/auth", authRouth);

import messageRouth from "./routes/message_route";
app.use("/message", messageRouth);

import swaggerUI from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";

if (process.env.NODE_ENV == "development") {
    const options = {
        definition: {
            openapi: "3.0.0",
            info: {
                title: "Web Dev 2022 REST API",
                version: "1.0.0",
                description: "REST server including authentication using JWT",
            },
            servers: [{ url: "http://localhost:3000" }],
        },
        apis: ["./src/routes/*.ts"],
    };
    const specs = swaggerJsDoc(options);
    app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
}

export = server;