import express from 'express'
const router = express.Router()
import post from '../controllers/post'
import auth from '../controllers/auth'

router.get('/', auth.authenticateMiddleware, post.getAllPosts)

router.get('/:id', auth.authenticateMiddleware, post.getPostById)

router.post('/', auth.authenticateMiddleware, post.addNewPost)

router.put('/:id', auth.authenticateMiddleware, post.updatePostById)

export = router