const express = require('express')
const router = express.Router()
const userController = require('../controller/usersController')
const postController = require('../controller/postController')
const middleware = require('../middleware/authorization')

//------------------------ Users APT's-------------------------------------------------------------------//

router.post('/createuser', userController.createUser)
router.post('/login', postController.login)
router.post('/refresh',postController.RefreshToken)
router.get('/users/:userId',middleware.Authentication,middleware.Authorization, userController.getUser)
router.put('/update/:userId',middleware.Authentication,middleware.Authorization, userController.updateUser)
router.delete('/delete/:userId',middleware.Authentication,middleware.Authorization, userController.deleteUser)

//------------------------Post API's-----------------------------------------------------------------------------------//

router.post('/createpost/:userId', middleware.Authentication, middleware.Authorization, postController.createPost)
router.get('/getposts', middleware.Authentication, postController.getPosts)
router.put('/updatepost/:userId/:postId', middleware.Authentication, middleware.Authorization, postController.updatePost)
router.delete('/deletepost/:userId/:postId', middleware.Authentication, middleware.Authorization, postController.deletePost)

//----------------------Comment & Like API----------------------------------------------------------------//

router.post('/comment/:postId', middleware.Authentication, postController.comment)
router.post('/like/:userId/:postId/:commentId', middleware.Authentication, postController.like)

//-----------------Handling Invalid HTTP req-----------------------------------------//

router.all('/*', (req, res) => {
    res.status(404).send({ message: 'URL path Not Found, Enter valid URL path' })
})

//-------------------------------------------------------------------------------------------//
module.exports = router;