import Post from "../models/post_model";
import Request from "../common/request";
import Response from "../common/response";
import Error from "../common/error";
// import { Request, Response } from "express";

const addNewPost = async (req) => {
  console.log(req.body);
  const msg = req.body.message;
  const senderMsg = req.body.sender;
  const sender = req.userId;
  const post = new Post({
    message: msg,
    sender: senderMsg,
  });
  try {
    const newPost = await post.save();
    return new Response(newPost, sender, null);
  } catch (err) {
    return new Response(null, sender, new Error(400, err.message));
  }
};

const getAllPosts = async (req) => {
  const sender = req.userId;
  try {
    const posts = await Post.find();
    return new Response(posts, sender, null);
  } catch (err) {
    return new Response(null, sender, new Error(400, err.message));
  }
};

const getPostById = async (req, id) => {
  // const id = id;
  const postId = id;
  const sender = req.userId;
  try {
    const posts = await Post.findById(postId);
    return new Response(posts, sender, null);
  } catch (err) {
    return new Response(null, sender, new Error(400, err.message));
  }
};

const getPostBySender = async (req, sender) => {
  try {
    const posts = await Post.find({ sender: sender });
    return new Response(posts, req.userId, null);
  } catch (err) {
    return new Response(null, req.userId, new Error(400, err.message));
  }
};

const putPostById = async (req, id) => {
  const postId = id;
  const updateMsg = req.body.message
  const sender = req.userId;
  try {
    const post = await Post.findByIdAndUpdate(postId, { message: updateMsg }, { new: true });
    return new Response(post, sender, null);
  } catch (err) {
    return new Response(null, sender, new Error(400, err.message));
  }
};

export = {
  getAllPosts,
  addNewPost,
  getPostById,
  getPostBySender,
  putPostById
};