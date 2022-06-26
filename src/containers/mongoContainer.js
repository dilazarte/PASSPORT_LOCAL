const mongoose = require('mongoose')
require('dotenv').config();

const URL = process.env.MONGO_URI;


class ContenedorMongoDB {
    constructor(model){
        mongoose.connect(URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }, ()=> console.log('Connected to db'));
        this.model = model
    }

    async getDoc(data){
        try {
            const item = await this.model.findOne(data)
            if(item.length > 0){
                return item
            } else{
                return '[]'
            }
        } catch (error) {
            return error
        }
    }
    
    async getDocById(id){
        try {
            const item = await this.model.find({'_id': id }).select('-__v')
            if(item.length > 0){
                return item
            } else{
                return '[]'
            }
        } catch (error) {
            return error
        }
    }

    async getAllDoc(){
        try {
            const items = await this.model.find({}).select('-__v')
            if(items.length > 0){
                return items;
            } else{
                return `Error: no se encontraron documentos`
            }
        } catch (error) {
            return error
        }
    }

    async addDoc(obj){
        try {
            obj.timeStamp = Date.now()
            const newItem = await this.model.create(obj);
            return newItem._id;
        } catch (error) {
            return error
        }
    }

    async updateDoc(id, data){
        try {
            const updateItem = await this.model.updateOne({_id: id}, {$set: data});
            return updateItem;
        } catch (error) {
            return error
        }
    }

    async deleteDoc(id){
        try {
            const deleteItem = await this.model.deleteOne({_id: id})
            return deleteItem;
        } catch (error) {
            return error
        }
    }
}

module.exports = {ContenedorMongoDB}