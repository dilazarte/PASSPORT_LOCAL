const express = require('express')
const handlebars = require('express-handlebars');
const path =  require('path');
const port = 8080
const app = express()
const session = require('express-session');
const MongoStore = require('connect-mongo');

const {DaosMongoUsuarios} = require('./src/DAOs/DaosMongoUsuarios')
const { encryptPass } = require('./src/utils/encryptPassword');
const { validatePass } = require('./src/utils/validatePassword')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const {usuarios} = require('./src/models/mongoUsuariosModel')
require('dotenv').config()



//rutas
const adminRouter = require('./src/routes/admin');
const chatsRouter = require('./src/routes/chatRoutes')
const prodTest = require('./src/routes/productosRoutes')
const loginRouter = require('./src/routes/login');
const logoutRouter = require('./src/routes/logout');
const inicioRouter =  require('./src/routes/inicio');
const registerRouter = require('./src/routes/register');
const loginError =  require('./src/routes/loginerror')
const signUpError =  require('./src/routes/signuperror')


//para recibir info desde post
app.use(express.json());
app.use(express.urlencoded({extended: true}));


app.engine(
    'hbs',
    handlebars.engine({
        extname:'.hbs',
        defaultLayout: path.join(__dirname, './src/views/layaouts/index.hbs'),
        layoutsDir:path.join(__dirname, './src/views/layaouts'),
        partialsDir: path.join(__dirname,'./src/views/partials')
    })
);
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, './src/views'));
app.use(express.static(path.join(__dirname, '/public')));

//configurando sesiones en mongo.-
const mongoOptions = {useNewUrlParser: true, useUnifiedTopology: true}
app.use(session({
    store: MongoStore.create({
        mongoUrl:`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.k7tpv.mongodb.net/sesiones?retryWrites=true&w=majority`,
        ongoOptions: mongoOptions
    }),
    cookie: {maxAge: 120000},
    secret:"sesionSecreta123",
    resave:true,
    saveUninitialized:true,
    rolling:true
}))

//iniciando passport.-
app.use(passport.initialize());
app.use(passport.session());

passport.use('login', new LocalStrategy({usernameField: 'email'},
    (email, password, done) => {
        //await DaosMongoUsuarios.getUser({email: email}, (err, user) =>{
        usuarios.findOne({email: email}, (err, user) =>{
            if(err) {
                return done(err);
            }
            if(!user) {
                console.log('No se escontro el usuario');
                return done(null, false);
            }
            if(!validatePass(user, password)){
                console.log('Contraseña incorrecta');
                return done(null, false);
            }
            return done(null, user);
        })
    }
))

passport.use('signup', new LocalStrategy(
    {passReqToCallback: true, usernameField: 'email'}, (req, email, password, done) => {
        //await DaosMongoUsuarios.getUser({email: email}, async (err, user) =>{
        usuarios.findOne({email: email}, (err, user) =>{
            if(err) {
                return done(err);
            }
            if(user) {
                console.log('Ya existe un usuario con ese email');
                return done(null, false);
            }
            console.log(req.body)
            const newUser = {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: email,
                password: encryptPass(password)
            }
            console.log(newUser)

            //await DaosMongoUsuarios.createUser(newUser, (err, id) => {
            usuarios.create(newUser, (err, id) => {
                if(err) {
                    console.log('Error en el registro')
                    return done(err)
                }
                console.log(id)
                console.log('Registrado correctamente')
                return done(null, id)
            })
        })
    }
))

passport.serializeUser((user, done) => {
    done(null, user._id)
})
passport.deserializeUser((id, done) => {
    //await DaosMongoUsuarios.getDocById(id, done)
    usuarios.findById(id, done)
})


app.use('/', inicioRouter)
app.use('/api/productos', prodTest)
app.use('/api/chat', chatsRouter)
app.use('/login', loginRouter)
app.use('/logout', logoutRouter)
app.use('/admin', adminRouter)
app.use('/register', registerRouter)
app.use('/loginError', loginError)
app.use('/signupError', signUpError)


const { Server: HttpServer } = require('http');
const { Server: IOServer } = require('socket.io');

const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

io.on('connection', (socket) => {
    console.log(`Usuario conectado ${socket.id} - ${socket.handshake.address}`);
    
    socket.emit('msg', '')
    socket.on('newMsg', ()=>{
        io.sockets.emit('msg', '')
    })
});

const serverON = httpServer.listen(port, ()=>{
    console.log(`Server on port ${port}`)
})
serverON.on('error', error=> console.log(`Error del servidor ${error}`))

// app.listen(port, ()=>{
//     console.log(`Server on port ${port}`)
// })