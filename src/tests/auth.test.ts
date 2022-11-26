
import request from 'supertest'
import app from '../server'
import mongoose from 'mongoose'
import Post from '../models/post_model'
import User from '../models/user_model'

// const newPostMessage = 'This is the new test post message'
// const newPostSender = '999000'
// const updatedPostMessage = 'This is the update message'
// const nonExistSender = 'Yam Harush'
// let newPostId = ''
// let newSender = ''

const userEmail = "user1@gmail.com"
const userPassword = "12345"

beforeAll(async () => {
    await Post.remove()
    await User.remove()
})

afterAll(async () => {
    await Post.remove()
    await User.remove()
    mongoose.connection.close()
})

describe("Auth tests", () => {

    test("Register test", async () => {
        const response = await request(app).post('/auth/register').send({
            "email": userEmail,
            "sender": userPassword
        })
        expect(response.statusCode).toEqual(200)
    })

    test("Login test", async () => {
        const response = await request(app).post('/auth/login').send({
            "email": userEmail,
            "sender": userPassword
        })
        expect(response.statusCode).toEqual(200)
        const token = response.body.accessToken
        expect(token).not.toBeNull()
    })

    test("Logout test", async () => {
        const response = await request(app).post('/auth/logout').send({
            "email": userEmail,
            "sender": userPassword
        })
        expect(response.statusCode).toEqual(200)
    })
})


