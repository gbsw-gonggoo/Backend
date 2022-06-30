const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const passport = require('passport')
const morgan = require('morgan')
const session = require('express-session')
const nunjucks = require('nunjucks')
const dotenv = require('dotenv')
const cors = require('cors')

dotenv.config()
const productRouter = require('./routes/product')
const authRouter = require('./routes/auth')
const indexRouter = require('./routes')
const userRouter = require('./routes/users')

const { sequelize } = require('./models')
const passportConfig = require('./passport')

const app = express()
passportConfig()
app.set('port', process.env.PORT)
app.set('view engine', 'html')

app.use(cors({
    origin: ['http://localhost:3002', "http://127.0.0.1:3002", 'http://172.16.1.42:3002'],
    methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD'],
    credentials: true
}))

nunjucks.configure('views', {
    express: app,
    watch: true,
})
sequelize.sync({force: false})
    .then(() => {
        console.log('데이터베이스 연결 성공')
    })
    .catch((err) => {
        console.error(err)
    })

app.use(morgan('dev'))
app.use('/api/product/img', express.static(path.join(__dirname, 'uploads')))
app.use('/api/user/background', express.static(path.join(__dirname, 'background')))
app.use('/api/user/profile', express.static(path.join(__dirname, 'profile')))
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cookieParser(process.env.COOKIE_SECRET))

app.use(session({
    resave: false,
    saveUninitialized:false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: 'auto',
        maxAge: 60 * 60 * 1000,
    },
}))
app.use(passport.initialize())
app.use(passport.session())

app.use('/api/product', productRouter)
app.use('/api/auth', authRouter)
app.use('/api', indexRouter)
app.use('/api/user', userRouter)

app.use((req, res, next) => {
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`)
    error.status = 404
    next(error)
})

app.use((err, req, res) => {
    res.json({success: false, message: ""}).status(500)
})

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중')
})

