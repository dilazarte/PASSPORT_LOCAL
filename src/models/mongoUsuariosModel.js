const mongoose = require("mongoose");

const usuariosCollections = 'usuarios';

const usuariosSchema = new mongoose.Schema({
    firstName: {type: String, required: true, max: 100},
    lastName: {type: String, required: true, max: 100},
    email: {type: String, required: true, max: 100},
    password: {type: String, required: true, max: 100}
})

const usuarios = mongoose.model(usuariosCollections, usuariosSchema);

module.exports = {usuarios}