
import request from 'supertest'
import app, { notify } from '../server'
import mongoose from 'mongoose'
import Post from '../models/post_model'
import User from '../models/user_model'

let accessToken = ''
let refreshToken = ''
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

    test("Not authorized attempt test", async () => {
        const response = await request(app).get('/post')
        expect(response.statusCode).not.toEqual(200)
    })

    test("Register test", async () => {
        const response = await request(app).post('/auth/register').send({
            "email": userEmail,
            "password": userPassword
        })
        expect(response.statusCode).toEqual(200)
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


    test("Login test", async () => {
        const response = await request(app).post('/auth/login').send({
            "email": userEmail,
            "password": userPassword
        })
        expect(response.statusCode).toEqual(200)
        accessToken = response.body.accessToken
        expect(accessToken).not.toBeNull()
        refreshToken = response.body.refreshToken
        expect(refreshToken).not.toBeNull()
    })
    test("test sing valid access token", async () => {
        const response = await request(app).get('/post').set('Authorization', 'JWT ' + accessToken)
        expect(response.statusCode).toEqual(200)
    })

    test("test sing wrong access token", async () => {
        const response = await request(app).get('/post').set('Authorization', `JWT 1 ${accessToken}`)
        expect(response.statusCode).not.toEqual(200)
    })

    jest.setTimeout(30000)
    test("test expiered token", async () => {
        await new Promise(r => setTimeout(r, 10000))
        const response = await request(app).get('/post').set('Authorization', `JWT ${accessToken}`)
        expect(response.statusCode).not.toEqual(200)
    })

    test("test refresh token", async () => {
        let response = await request(app).get('/auth/refresh').set('Authorization', `JWT ${refreshToken}`)
        expect(response.statusCode).toEqual(200)

        const newAccessToken = response.body.accessToken
        expect(newAccessToken).not.toBeNull()
        const newRefreshToken = response.body.refreshToken
        expect(newRefreshToken).not.toBeNull()

        response = await request(app).get('/post').set('Authorization', `JWT ${newAccessToken}`)
        expect(response.statusCode).toEqual(200)
    })

    test("Logout test", async () => {
        const response = await request(app).get('/auth/logout').set('Authorization', `JWT ${refreshToken}`)
        expect(response.statusCode).toEqual(200)
    })
})


