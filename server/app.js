const express = require('express');
const hbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const config = require('./config/config').get(process.env.NODE_ENV);
const {User} = require('./models/user');
const {Auth} = require('./middleware/auth');

const app = express();

mongoose.Promise = global.Promise;
mongoose.connect(config.DATABASE, {useNewUrlParser: true});
mongoose.set('useCreateIndex', true);

app.engine('hbs', hbs({
    extname: 'hbs',
    defaultLayout: 'main',
    layoutsDir: __dirname + './../views/layouts',
    partialsDir: __dirname + './../views/partials'
}));
app.set('view engine', 'hbs');
app.use('/css', express.static(__dirname + './../public/css'));
app.use('/js', express.static(__dirname + './../public/js'));
app.use('/images', express.static(__dirname + './../public/images'));
app.use('/icons', express.static(__dirname + './../public/icons'));
app.use(bodyParser.json());
app.use(cookieParser());

app.get('/', Auth, (req, res) => {
    res.render('home');
})

app.get('/login', Auth, (req, res) => {
    res.render('login');
})

app.get('/registration', Auth, (req, res) => {
    res.render('registration');
})

app.get('/welcome_screen_preview', Auth, (req, res) => {
    res.render('welcome_screen_preview');
})

app.get('/welcome_screens_list', Auth, (req, res) => {
    res.render('welcome_screens_list');
})

app.get('/new_welcome_screen_image', Auth, (req, res) => {
    res.render('new_welcome_screen_image');
})

app.get('/new_welcome_screen_video', Auth, (req, res) => {
    res.render('new_welcome_screen_video');
})

app.listen(config.PORT, () => {
    console.log(`Welcome Screen Cinq running on port ${config.PORT}`);
})