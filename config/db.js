const mongoose = require('mongoose')

const connectDB = async () => {

    try {

        await mongoose.connect('mongodb://127.0.0.1:27017/port-russell')

        console.log('MongoDB connecté')

    } catch (error) {

        console.error(error)

        process.exit(1)

    }

}

module.exports = connectDB