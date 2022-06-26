const mongoose = require("mongoose");

const chatsCollection = 'chats';

const chatsSchema = new mongoose.Schema({
    author: {
        id: {type: String, required: true, max: 255},
        nombre: {type: String, required: true, max: 255},
        apellido: {type: String, required: true, max: 255},
        edad: {type: String, required: true, max: 255},
        alias: {type: String, required: true, max: 255},
        avatar: {type: String, required: true, max: 255}, //url de foto
    },
    text: {type: String, required: true, max: 255}
})

const chats = mongoose.model(chatsCollection, chatsSchema);

module.exports = {chats}