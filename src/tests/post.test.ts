
import request from 'supertest'
import app from '../server'
import mongoose from 'mongoose'
import Post from '../models/post_model'

const newPostMessage = 'This is the new test post message'
const newPostSender = '999000'
const updatedPostMessage = 'This is the update message'
const nonExistSender = 'Yam Harush'
let newPostId = ''
let newSender = ''


beforeAll(async () => {
    await Post.remove()
})

afterAll(async () => {
    await Post.remove()
    mongoose.connection.close()
})

describe("Posts Tests", () => {

    test("add new post", async () => {
        const response = await request(app).post('/post').send({
            "message": newPostMessage,
            "sender": newPostSender
        })
        expect(response.statusCode).toEqual(200)
        expect(response.body.message).toEqual(newPostMessage)
        expect(response.body.sender).toEqual(newPostSender)
        newPostId = response.body._id
        newSender = response.body.sender
    })

    test("get all posts", async () => {
        const response = await request(app).get('/post')
        expect(response.statusCode).toEqual(200)
        expect(response.body[0].message).toEqual(newPostMessage)
        expect(response.body[0].sender).toEqual(newPostSender)
    })

    test("get post by id", async () => {
        const response = await request(app).get('/post/' + newPostId)
        expect(response.statusCode).toEqual(200)
        expect(response.body.message).toEqual(newPostMessage)
        expect(response.body.sender).toEqual(newPostSender)
    })
    //the negative test of get test by id
    test("get post by non exist id", async () => {
        const response = await request(app).get('/post/11102')
        expect(response.statusCode).toEqual(400)
    })


    test("get post by sender", async () => {
        const response = await request(app).get('/post?sender=' + newSender)
        expect(response.statusCode).toEqual(200)
        expect(response.body[0].message).toEqual(newPostMessage)
        expect(response.body[0].sender).toEqual(newSender)
    })

    //the negative test of get post by sender
    test("get post by non exist sender", async () => {
        const response = await request(app).get('/post?sender=' + nonExistSender)
        expect(response.statusCode).toEqual(200)
        expect(response.body.length).toEqual(0)
    })

    test("Update post", async () => {
        let response = await request(app).put('/post/' + newPostId).send({
            "message": updatedPostMessage,
            "sender": newPostSender
        })
        expect(response.statusCode).toEqual(200)
        expect(response.body.message).toEqual(updatedPostMessage)
        expect(response.body.sender).toEqual(newPostSender)

        response = await request(app).get('/post/' + newPostId)
        expect(response.statusCode).toEqual(200)
        expect(response.body.message).toEqual(updatedPostMessage)
        expect(response.body.sender).toEqual(newPostSender)

        //negative test for update post
        response = await request(app).put('/post/1102').send({
            "message": updatedPostMessage,
            "sender": newPostSender
        })
        expect(response.statusCode).toEqual(400)

        response = await request(app).put('/post/' + newPostId).send({
            "message": updatedPostMessage,
        })
        expect(response.statusCode).toEqual(200)
        expect(response.body.message).toEqual(updatedPostMessage)
        expect(response.body.sender).toEqual(newPostSender)
    })
})


