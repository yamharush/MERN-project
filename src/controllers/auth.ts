import User from '../models/user_model'
import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

function sendError(res: Response, error: string) {
    res.status(400).send({
        'err': error
    })
}


const register = async (req: Request, res: Response) => {
    const email = req.body.email
    const password = req.body.password

    if (email == null || password == null) {
        return sendError(res, 'please provide valid email and password')
    }
    //check if already registred
    try {
        const user = await User.findOne({ 'email': email })
        if (user != null) {
            sendError(res, 'user already registred, try a diffrent name')
        }
    } catch (err) {
        console.log("error: " + err)
        sendError(res, 'fail checking user')
    }
    try {
        const salt = await bcrypt.genSalt(10)
        const encryptedPwd = await bcrypt.hash(password, salt)
        let newUser = new User({
            'email': email,
            'password': encryptedPwd
        })
        newUser = await newUser.save()
        res.status(200).send(newUser)
    } catch (err) {
        sendError(res, 'fail...')
    }
}

const login = async (req: Request, res: Response) => {
    const email = req.body.email
    const password = req.body.password
    if (email == null || password == null) return sendError(res, 'please provide valid email and password')
    try {
        const user = await User.findOne({ 'email': email })
        if (user == null) return sendError(res, 'incorrect user or password')
        const match = await bcrypt.compare(password, user.password)
        if (!match) return sendError(res, 'incorrect user or password')
        const accessToken = await jwt.sign(
            { 'id': user._id },
            process.env.ACCESS_TOKEN_SECRET,
            { 'expiresIn': process.env.JWT_TOKEN_EXPIRATION }
        )

        return res.status(200).send({ 'accesstoken': accessToken })
    } catch (err) {
        console.log("error: " + err)
        sendError(res, 'fail checking user')
    }
}

const logout = async (req: Request, res: Response) => {
    res.status(400).send({ 'error': "not implemented" })
}

export = { login, register, logout }