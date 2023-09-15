const express = require('express')
const app = express()
const mongoose = require('mongoose')
const router = require('./src/routes/router')
require('dotenv').config({ path: '.env' })

app.use(express.json())
app.use('/', router)

mongoose.connect(process.env.MongoDB)
.then(() => { console.log('MongoDB is Connected') })
.catch(((error) => { console.log(error) }))

app.listen(process.env.PORT, () => {
    console.log('Application is Running on Port', process.env.PORT)
})

