const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId

const postsSchema = mongoose.Schema({
    createdBy: {
        type: ObjectId, ref: 'user'
    },
    message: {
        type: String
    },
    comments: [{
        sentBy: {
            type: ObjectId, ref: 'user'
        },
        sentAt: {
            type: Date
        },
        comment: {
            type: String
        },
        liked: [{
            type: ObjectId, ref: 'user'
        },
        {
            userId: ObjectId
        }]
    }]
},
{ timestamps: true })

module.exports = mongoose.model('posts', postsSchema)