const express = require('express')
const {Router} = express

const signUpError = Router()

signUpError.get('/', (req, res)=>{
    res.render('signupError')
})

module.exports= signUpError