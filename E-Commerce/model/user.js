const mongoose = require('mongoose')
const {Schema} = mongoose

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: String,
    cart: [{
        id: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "products"
        },
        quantity: Number
    }],
    orders: [{
        products: {},
        quantity: Number,
        price: Number
    }],
    role:{
        type: String,
        default: "user"
    },
    googleId: String,
    googleImg: String,
    googleAccessToken: String
})

module.exports = mongoose.model('users', userSchema);