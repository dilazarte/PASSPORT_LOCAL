const express = require('express')
const passport = require('passport');
const {Router} = express

const loginRouter = Router()


loginRouter.get('/', (req, res)=>{
    if(req.isAuthenticated()){
        res.redirect('admin')
    }else{
        res.render('login')
    }
})

loginRouter.post('/', passport.authenticate('login', {failureRedirect: '/loginError'}), (req, res)=>{
    if (req.isAuthenticated()) {
        res.redirect('/admin')
    } else {
        res.redirect('/login')
    }
})

module.exports= loginRouter