
import request from 'supertest'
import app, { notify } from '../server'
import mongoose from 'mongoose'
import Post from '../models/post_model'
import User from '../models/user_model'

let accessToken = ''
const userEmail = "user1@gmail.com"
const userPassword = "123456"

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
            "password": userPassword
        })
        expect(response.statusCode).toEqual(200)
    })

    test("Login test", async () => {
        let response = await request(app).post('/auth/login').send({
            "email": userEmail,
            "password": userPassword
        })
        expect(response.statusCode).toEqual(200)
        accessToken = response.body.accessToken
        console.log(accessToken)
        expect(accessToken).not.toBeNull()

        response = await request(app).get('/post').set('Authorization', 'JWT ' + accessToken)
        console.log("access token " + accessToken)
        expect(response.statusCode).toEqual(200)

        response = await request(app).get('/post').set('Authorization', `JWT 1 ${accessToken}`)
        expect(response.statusCode).not.toEqual(200)
    })

    test("Login test wrong password", async () => {
        const response = await request(app).post('/auth/login').send({
            "email": userEmail,
            "password": userPassword + '4'
        })
        expect(response.statusCode).not.toEqual(200)
        const token = response.body.accessToken
        expect(token).toBeUndefined()
    })

    test("Logout test", async () => {
        const response = await request(app).post('/auth/logout').send({
            "email": userEmail,
            "password": userPassword
        })
        expect(response.statusCode).toEqual(200)
    })
})


