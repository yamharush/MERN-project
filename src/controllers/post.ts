import Post from '../models/post_model'
import { Request, Response } from 'express'
const getAllPosts = async (req: Request, res: Response) => {
    try {
        let posts = {}
        if (req.query.sender == null) {
            posts = await Post.find()
        } else {
            posts = await Post.find({ 'sender': req.query.sender })
        }
        res.status(200).send(posts)
    } catch (err) {
        res.status(400).send({ 'error': "fail to get posts from db" })
    }
}

const getPostById = async (req: Request, res: Response) => {
    console.log(req.params.id)

    try {
        const posts = await Post.findById(req.params.id)
        res.status(200).send(posts)
    } catch (err) {
        res.status(400).send({ 'error': "fail to get posts from db" })
    }
}

const addNewPost = async (req: Request, res: Response) => {
    console.log(req.body)
    const post = new Post({
        message: req.body.message,
        sender: req.body.sender
    })

    try {
        const newPost = await post.save()
        console.log("save post in db")
        res.status(200).send(newPost)
    } catch (err) {
        console.log("faile to save post in db")
        res.status(400).send({ 'error': 'fail adding new post to db' })
    }
}

const updatePostById = async (req: Request, res: Response) => {
    console.log("update post by id")
    console.log(req.body)
    if ((req.params.id == null) || (req.params.id == undefined)) {
        res.status(400).send({
            status: "fail",
            message: "err.message"
        })
    }
    try {
        const updatePost = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true })
        console.log("update post in the data base")
        res.status(200).send(updatePost)
    } catch (error) {
        res.status(400).send({ error: "fail to update post in the data base" })
    }
}

export = { getAllPosts, addNewPost, getPostById, updatePostById }