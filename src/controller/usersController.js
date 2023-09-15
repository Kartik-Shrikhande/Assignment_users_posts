const userModel = require('../model/userModel')
const { isValidObjectId } = require('mongoose')

const { validname, validEmail, validMobileNum, validPassword, } = require('../validation/validations')
const { hash } = require('bcrypt')

//---------------------------------------Create User--------------------------------------------------//
const createUser = async (req, res) => {
    try {
        const { name, email, mobile, password } = req.body
        //making sure user enter some data
        if (Object.keys(req.body).length == 0) return res.status(400).send({ status: false, message: 'Enter Required Data' })
        //applied validations on name,email,mobile and password
        if (!name) return res.status(400).send({ status: false, message: 'Enter Name' })
        if (!validname(name)) return res.status(400).send({ status: false, message: 'Enter Valid Name,it should have to be Alphabates only' })

        if (!email) return res.status(400).send({ status: false, message: 'Enter email' })
        if (!validEmail(email)) return res.status(400).send({ status: false, message: 'Enter Valid Email, eg:-rahul@gmail.com' })
        //checking if email already present in database
        const existEmail = await userModel.findOne({ email: email })
        if (existEmail) return res.status(400).send({ status: false, message: 'Enterd mail already exist, please enter unique Email' })

        if (!mobile) return res.status(400).send({ status: false, message: 'Enter Mobile Number' })
        if (!validMobileNum(mobile)) return res.status(400).send({ status: false, message: 'Enter Valid 10 digit Mobile Number' })

        if (!password) return res.status(400).send({ status: false, message: 'Enter password' })
        if (!validPassword(password)) return res.status(400).send({ status: false, message: 'Enter Valid password, eg:-Rahul#123' })
        //hashing the password by using hash function
        req.body.password = await hash(password, 8)

        const newUser = await userModel.create(req.body)
        return res.status(201).send({ status: true, message: 'User Successfully Created', data: newUser })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

//---------------------------------------get User--------------------------------------------------//

const getUser = async (req, res) => {
    try {
        //create get user by id
        const { userId } = req.params
        if (!isValidObjectId(userId)) return res.status(400).send({ status: false, message: 'Enter valid userId' })
        //getting user by its userId
        const users = await userModel.findOne({ _id: userId })
        if (!users) return res.status(404).send({ status: false, message: 'user Not found' })
        return res.status(200).send({ status: true, message: 'success', data: users })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

//---------------------------------------update User--------------------------------------------------//

const updateUser = async (req, res) => {
    try {
        const { userId } = req.params
        //checking for valid  object id
        if (!isValidObjectId(userId)) return res.status(400).send({ status: false, message: 'Enter Valid Id' })
        //here checking wheather UserId is Available or not
        let existid = await userModel.findById({ _id: userId })
        if (!existid) return res.status(404).send({ status: false, message: 'UserId is Not Found' })
        //making sure data should be present to do some update
        const data = req.body
        if (Object.keys(data).length === 0) return res.status(400).send({ status: false, message: 'Enter Required Data to update' })
        const { name, email, mobile, password } = data
        if (!validname(name)) return res.status(400).send({ status: false, message: 'Enter valid user name' })
        if (!validEmail(email)) return res.status(400).send({ status: false, message: 'Enter Valid Email, eg:-rahul@gmail.com' })
        if (!validMobileNum(mobile)) return res.status(400).send({ status: false, message: 'Enter Valid 10 digit Mobile Number' })
        if (!validPassword(password)) return res.status(400).send({ status: false, message: 'Enter Valid password, eg:-Rahul123' })
         req.body.password = await hash(password, 8)
        let update = await userModel.findOneAndUpdate({ _id: userId }, { $set: data }, { new: true })
        return res.status(200).send({ status: true, message: 'User Profile updated', data: update })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

//---------------------------------------delete User--------------------------------------------------//

const deleteUser = async (req, res) => {

    try {
        const { userId } = req.params
        if (!isValidObjectId(userId)) return res.status(400).send({ status: false, message: 'Enter Valid Id' })
        const userExist = await userModel.findById(userId)
        if (!userExist) return res.status(404).send({ status: false, message: 'UserId is already deleted Or userId not Found' })
        const deletedUser = await userModel.findByIdAndDelete({ _id: userId })
        return res.status(200).send({ status: true, message: 'User Deleted Successfully' })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}
//--------------------------------------------------------------------------------------------//

module.exports = { createUser, getUser, updateUser, deleteUser }