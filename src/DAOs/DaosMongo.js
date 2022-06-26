const {ContenedorMongoDB} = require('../containers/mongoContainer')
const {chats} = require('../models/mongoChatModel')

class DaosMongo extends ContenedorMongoDB{
    constructor(){
        super(chats)
    }
}

module.exports = {DaosMongo};