const mongoose = require('mongoose')


const supportSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
      },
      topic: { type: String, required: true },
      message: { type: String, required: true },


})

const Support = mongoose.model('Support', supportSchema)

module.exports = Support