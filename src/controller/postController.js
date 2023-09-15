const postModel = require('../model/postsModel')
const userModel = require('../model/userModel')
require('dotenv').config({ port: ".env" })
const { isValidObjectId } = require('mongoose')
const { compareSync } = require('bcrypt')
const { validEmail, validPassword, } = require('../validation/validations')
const { sign, verify } = require("jsonwebtoken")
const { redis } = require("./redis")

//-----------------------------------------------login User-----------------------------------------------------//

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (Object.keys(req.body).length == 0) return res.status(400).send({ status: false, message: 'Enter email and password' });
        if (!validEmail(email)) return res.status(400).send({ status: false, message: 'Enter Valid Email' });
        if (!validPassword(password)) return res.status(400).send({ status: false, message: 'Enter Valid Password' });
        const login = await userModel.findOne({ email: email });
        if (!login) return res.status(404).send({ status: false, message: 'Entered Email Does not Exist, Enter a valid email' });
        const passwordMatch = compareSync(password, login.password);
        if (!passwordMatch) return res.status(400).send({ status: false, message: 'Wrong Password' });
        let jwtToken = sign({ userId: login._id }, process.env.SECRET_KEY, { expiresIn: '15min' })
        await redis.set(`${login._id}`, jwtToken)
        res.header('authorization', jwtToken);
        return res.status(200).send({ status: true, message: 'User login Successfully' });

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

//----------------------------------------------Refresh Token-----------------------------------------------------//

const RefreshToken = async (req, res) => {
    try {
        const { refreshToken, userId } = req.body
        const redisToken = await redis.get(userId)
        if (redisToken !== refreshToken) return res.status(401).send({ status: false, message: 'Invalid refresh token' });
        const newToken = sign({ userId: userId }, process.env.SECRET_KEY, { expiresIn: '24h' })
        await redis.set(`${userId}`, newToken)
        res.header('authorization', newToken);
        return res.status(200).send({ status: true, message: 'Token refresh Successfully' });

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

//----------------------------------------------create post-----------------------------------------------------//

const createPost = async (req, res) => {
    try {
        const { userId } = req.params
        if (!isValidObjectId(userId)) return res.status(400).send({ status: false, message: 'Enter valid userId' })
        let data = req.body
        const { createdBy, message } = data
        //heres,Ensuring there must be required data filled in json body
        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: 'Enter Required Data' })
        if (!createdBy) return res.status(400).send({ status: false, message: 'Enter Valid ObjectId in createdBy' })
        if (createdBy != userId) return res.status(400).send({ status: false, message: 'userId and createdById should have to be same' })
        if (!message) return res.status(400).send({ status: false, message: 'Enter Valid message' })

        let create = await postModel.create(data)
        return res.status(201).send({ status: true, message: 'Post Successfully Created', data: create })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

//----------------------------------------------get posts-----------------------------------------------------//

const getPosts = async (req, res) => {
    try {
        const posts = await postModel.find().populate('createdBy')
        if (posts.length == 0) return res.status(404).send({ status: false, message: 'No Post found' })
        return res.status(200).send({ status: true, message: 'All Posts', Total_Posts: posts.length, data: posts })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

//----------------------------------------------Update post-----------------------------------------------------//

const updatePost = async (req, res) => {
    try {
        const { userId, postId } = req.params
        if (!isValidObjectId(userId)) return res.status(400).send({ status: false, message: 'Enter valid userId' })
        if (!isValidObjectId(postId)) return res.status(400).send({ status: false, message: 'Enter valid postId' })

        let existid = await userModel.findById({ _id: userId })
        if (!existid) return res.status(404).send({ status: false, message: 'userId is Not Found' })

        let existpostid = await postModel.findById({ _id: postId })
        if (!existpostid) return res.status(404).send({ status: false, message: 'postId is Not Found' })

        let data = req.body
        const { createdBy, message } = data

        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: 'Enter Required Data' })
        if (!createdBy) return res.status(400).send({ status: false, message: 'Enter Valid ObjectId in createdBy' })
        if (createdBy != userId) return res.status(400).send({ status: false, message: 'userId and createdById should have to be same' })
        if (!message) return res.status(400).send({ status: false, message: 'Enter Valid message' })

        let updatePost = await postModel.findOneAndUpdate({ _id: postId }, { $set: data }, { new: true })
        return res.status(200).send({ status: true, message: 'Post Successfully Updated', data: updatePost })

    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

//----------------------------------------------delete post-----------------------------------------------------//

const deletePost = async (req, res) => {
    try {
        const { userId, postId } = req.params
        if (!isValidObjectId(userId)) return res.status(400).send({ status: false, message: 'Enter valid userId' })
        if (!isValidObjectId(postId)) return res.status(400).send({ status: false, message: 'Enter valid postId' })

        let existpostid = await postModel.findById({ _id: postId })
        // //checking wheather taskId is already deleted or its unavailable Id
        if (!existpostid) return res.status(404).send({ status: false, message: 'Post is already deleted Or Post not Found' })
        if (existpostid.createdBy != userId) return res.status(401).send({ status: false, message: 'your unauthorized to delete this post' })
        //deleting Task by its Id
        const deletepost = await postModel.findByIdAndDelete({ _id: postId })
        return res.status(200).send({ status: true, message: 'Post is deleted' })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

//----------------------------------------------create comment -----------------------------------------------------//

const comment = async (req, res) => {
    try {
        const postId = req.params.postId;
        const { sentBy, comment } = req.body;

        // Find the post by ID
        const post = await postModel.findById(postId);
        if (!post) { return res.status(404).send({ status: false, message: 'Post not found' }) }

        if (Object.keys(req.body).length == 0) return res.status(400).send({ status: false, message: 'Enter Required data' })
        if (!sentBy) { return res.status(400).send({ status: false, message: 'Enter ObjectId' }) }
        if (!comment) { return res.status(400).send({ status: false, message: 'Enter comment' }) }
        // Create a new comment
        const newComment = {
            sentBy,
            sentAt: Date.now(),
            comment,
        }
        // Push the new comment into the post's comments array
        // Save the updated post
        const pushcomment = await postModel.findOneAndUpdate({ _id: postId }, { $push: { comments: newComment } }, { new: true });
        res.status(201).send({ status: true, message: "comment successfully created", data: pushcomment })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

//----------------------------------------------create like-----------------------------------------------------//

const like = async (req, res) => {
    try {
        const { userId, postId, commentId } = req.params
        if (!userId) { return res.status(400).send({ status: false, message: 'Enter yours userId to like the comment' }) }
        const post = await postModel.findById(postId);

        if (!post) { return res.status(404).json({ message: 'Post not found' }) }
        const comments = post.comments
        if (comments.length == 0) return res.status(404).json({ message: 'comment not found' });

        for (let i = 0; i < comments.length; i++) {
            if (comments[i]._id == commentId) {
                comments[i].liked.push(userId)
            }
        }
        const result = await postModel.findByIdAndUpdate({ _id: postId }, { comments: comments }, { new: true });
        return res.status(200).send({ status: true, message: "successfully Liked comment", data: result })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

//-----------------------------------------------------------------------------------------------------//

module.exports = { login, createPost, getPosts, updatePost, deletePost, comment, like, RefreshToken }


