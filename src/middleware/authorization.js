const { verify } = require('jsonwebtoken')
const { isValidObjectId } = require('mongoose')
const userModel = require('../model/userModel')

//------------------------------------Authentication---------------------------------------------------------------------//

const Authentication = async (req, res, next) => {
  try {
    let token = req.headers.authorization
    if (!token) return res.status(400).send({ status: false, message: 'token is not present' })
    //Removing 'Bearer' word from token
    token = token.split(' ')[1]
    //Verifying the token using the SECRET_KEY 
    verify(token, process.env.SECRET_KEY, (err, decodedToken) => {
      if (err) return res.status(401).send({ status: false, message: err.message })
      else {
        let userId = decodedToken.userId
        //setting userId in the request object 
        req['userId'] = userId
        next()
      }
      })
      }
     catch (error) {
     return res.status(500).send({ status: false, message: error.message })
    } 
   }

//-------------------------------------Authorization---------------------------------------------------------------------------------//


const Authorization = async function (req, res, next) {
  try {
    const userId = req.params.userId
    //making sure userId is should be a valid Id
    if (!(isValidObjectId(userId))) return res.status(400).send({ status: false, message: "please provide valid userId" })
    let getUser = await userModel.findOne({ _id: userId })
    if (!getUser) return res.status(404).send({ status: false, message: "user is not present" })
    if (getUser._id != req.userId) return res.status(403).send({ status: false, mesage: "Unauthorized access,Your unauthorize user to perform this task" })
    return next()
    }
    catch (err) {
    return res.status(500).send({ status: false, message: err.message })
    }
  }

//----------------------------------------------------------------------------------------------------------------------//

module.exports = { Authentication, Authorization }


