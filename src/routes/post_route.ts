import express from "express";
const router = express.Router();
import Post from "../controllers/post";
import Auth from "../controllers/auth";
import Request from "../common/request";

/**
 * @swagger
 * tags:
 *   name: Post
 *   description: The Posts API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       required:
 *         - message
 *         - sender
 *       properties:
 *         message:
 *           type: string
 *           description: The post text
 *         sender:
 *           type: string
 *           description: The sending user id
 *       example:
 *         message: 'this is my new post'
 *         sender: '12342345234556'
 */

/**
 * @swagger
 * /post:
 *   get:
 *     summary: get list of post from server
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: sender
 *         schema:
 *           type: string
 *           description: filter the posts according to the given sender id
 *     responses:
 *       200:
 *         description: the list of posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                  $ref: '#/components/schemas/Post'
 *
 */
router.get("/", Auth.authenticateMiddleware, async (req, res) => {
    if (req.query.sender == null) {
        try {
            const response = await Post.getAllPosts(Request.fromRestRequest(req));
            response.sendRestResponse(res);
        } catch (err) {
            res.status(400).send({
                status: "fail",
                message: err.message,
            });
        }
    } else {
        try {
            const response = await Post.getPostBySender(
                Request.fromRestRequest(req),
                req.query.sender
            );
            response.sendRestResponse(res);
        } catch (err) {
            res.status(400).send({
                status: "fail",
                message: err.message,
            });
        }
    }
});
/**
 * @swagger
 * /post/{id}:
 *   get:
 *     summary: get post by id
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         requiered: true
 *         schema:
 *           type: string
 *           description: the requested post id
 *     responses:
 *       200:
 *         description: the requested post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *
 */
router.get("/:id", Auth.authenticateMiddleware, async (req, res) => {
    try {
        const response = await Post.getPostById(
            Request.fromRestRequest(req),
            req.params.id
        );
        response.sendRestResponse(res);
    } catch (err) {
        res.status(400).send({
            status: "fail",
            message: err.message,
        });
    }
});

/**
 * @swagger
 * /post:
 *   post:
 *     summary: add a new post
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       200:
 *         description: the requested post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *
 */
// router.post("/", auth.authenticateMiddleware, post.addNewPost);
router.post("/", Auth.authenticateMiddleware, async (req, res) => {
    try {
        const response = await Post.addNewPost(Request.fromRestRequest(req));
        response.sendRestResponse(res);
    } catch (err) {
        res.status(400).send({
            status: "fail",
            message: err.message,
        });
    }
});

/**
 * @swagger
 * /post/{id}:
 *   put:
 *     summary: update existing post by id
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         requiered: true
 *         schema:
 *           type: string
 *           description: the updated post id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       200:
 *         description: the requested post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *
 */
router.put("/:id", Auth.authenticateMiddleware, async (req, res) => {
    try {
        const response = await Post.putPostById(
            Request.fromRestRequest(req), req.params.id
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