const express = require('express')
const router = express.Router()
const Message = require('../controllers/message.js')

router.get('/', Message.getAllMessages)

router.post('/', Message.addNewMessage)

export = router