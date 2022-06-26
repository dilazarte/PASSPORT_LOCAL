const {ContenedorMongoDB} = require('../containers/mongoContainer')
const {usuarios} = require('../models/mongoUsuariosModel')

class DaosMongoUsuarios extends ContenedorMongoDB{
    constructor(){
        super(usuarios)
    }
    async getUser(data){
        //const user = await this.model.findOne(data)
        const user = await this.getDoc(data)
        return user;
    }
    async createUser(data){
        //const newUser = await this.model.create(data)
        const newUser = await this.addDoc(data)
        return newUser;
    }
}

module.exports = {DaosMongoUsuarios};