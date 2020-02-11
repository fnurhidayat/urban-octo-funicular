const express = require('express')
const router = express.Router()
const user = require('./controllers/usersController.js')
const post = require('./controllers/postsController.js')

const authenticate = require('./middlewares/authenticate.js')
const uploader = require('./middlewares/multer.js')

// User router
router.post('/users/register', user.create)
router.post('/users/login', user.login)
router.post('/users/uploadPhoto', authenticate, uploader, user.uploadPhoto)
router.get('/users/verify', user.verify)

// Post router
router.route('/posts')
  .post(authenticate, post.create)
  .get(authenticate, post.read)
router.post('/posts/:_id/like', post.like)

module.exports = router;
