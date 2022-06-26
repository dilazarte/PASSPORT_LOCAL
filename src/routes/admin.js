const express = require('express')
const {Router} = express
const { authCheck } = require('../middlewares/authCheck')

const adminRouter = Router()

adminRouter.get('/', authCheck,(req, res)=>{
    // res.render('admin', {name: req.session.user})
    if (req.isAuthenticated()) {
        let user = req.user;
        res.render('admin', {name: user.firstName, lastName: user.lastName})
    } else {
        res.redirect('login')
    }
})

module.exports= adminRouter