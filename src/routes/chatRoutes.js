const express = require('express');
const {Router} = express
const {schema,normalize} = require('normalizr');
const {DaosMongo} = require('../DAOs/DaosMongo')
const daosChat = new DaosMongo()
const util = require('util')

const chatsRouter = Router();


//defino mi schema con normalizr
const authorSchema = new schema.Entity('author')
const mensajeSchema = new schema.Entity('mensaje') //, {author: authorSchema}
const mensajesSchema = new schema.Entity('mensajes', {
    mensajes: [
        {
            author: authorSchema,
            text: [mensajeSchema]
        }
    ]
})


chatsRouter.get('/', async (req, res) => { //verificar aca el formato del array
    const data = await daosChat.getAllDoc()
    
    const mensajes = {id: 'mensajes', mensajes: data.map((el) => ({
        author: el.author,
        text: el.text,
        id: el._id
    }))}
    
    const normalizedChat = normalize(mensajes, mensajesSchema)
    res.json(normalizedChat)

    //console.log(util.inspect(normalizedChat, true, 8, true))
    console.log('ORIGINAL: ' + JSON.stringify(data).length)
    console.log('NORMALIZADO: ' + JSON.stringify(normalizedChat).length)
})

chatsRouter.post('/', async (req, res) => {
    let newMsg = req.body;
    await daosChat.addDoc(newMsg)
    res.json({
        add: newMsg.id
    })
})

module.exports = chatsRouter