const express = require('express')
const {Router} = express

const inicioRouter = Router()

inicioRouter.get('/', (req, res)=>{
    res.render('main')
})

module.exports = inicioRouter