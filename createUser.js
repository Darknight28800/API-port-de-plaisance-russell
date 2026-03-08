const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const User = require('./models/User')

mongoose.connect('mongodb://127.0.0.1:27017/port-russell')

async function createUser(){

const password = await bcrypt.hash("123456",10)

const user = new User({
username:"admin",
email:"admin@mail.com",
password:password
})

await user.save()

console.log("Utilisateur créé")

mongoose.disconnect()

}

createUser()