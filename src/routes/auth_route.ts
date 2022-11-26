import express from 'express'
const router = express.Router()
import auth from '../controllers/auth'

router.post('/login', auth.login)

router.post('/register', auth.register)

router.post('/logout', auth.logout)

export = router