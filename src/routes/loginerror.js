const express = require('express')
const {Router} = express

const loginError = Router()

loginError.get('/', (req, res)=>{
    res.render('loginError')
})

module.exports= loginError