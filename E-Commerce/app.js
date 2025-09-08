const express = require('express')
const app = express()
const PORT = 3000
const path = require('path')
const hbs = require('hbs');
const session = require('express-session')
const MongoStore = require('connect-mongo')

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({ mongoUrl: process.env.DB_PATH,
    ttl: 14 * 24 * 60 * 60
   }),
    cookie: {
      secure: process.env.NODE_ENV === "production", // only HTTPS in prod
      httpOnly: true,
      sameSite: "lax"
    }
}))

const passport = require('./authentication/passport')
app.use(passport.initialize());
app.use(passport.session());

//Middlewares
app.use(express.urlencoded({extended: true}))
hbs.registerPartials(path.join(__dirname + '/views/partials'));
app.set('view engine', 'hbs');
app.use(express.json())
app.use(express.static(path.join(__dirname,'public')))





// Render Front Page
const homeRouter = require('./router/home')
app.use('/', homeRouter)

const adminRouter = require('./router/products')
app.use('/admin', adminRouter)

const shopController = require('./router/shop')
app.use('/shop', shopController);

// mongodb://127.0.0.1:27017/ecommerce
require('mongoose').connect(process.env.DB_PATH).then(() => {
    app.listen(PORT, () => {
        console.log(`localhost:${PORT}`);        
    })
})
.catch(err => {
    console.log(err);        
})