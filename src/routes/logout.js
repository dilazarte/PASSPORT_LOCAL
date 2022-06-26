const express = require('express')
const {Router} = express

const logoutRouter = Router()

logoutRouter.get('/', (req, res)=>{
    let name = req.user
    req.logout(err =>{
        if(err){ console.log('error al cerrar sesion') }
    })
    res.render('logout', {name: name.firstName, lastName: name.lastName})
})


module.exports= logoutRouter