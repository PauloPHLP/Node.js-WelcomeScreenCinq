const express = require('express');
const hbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
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
    res.render('home', {
        header: false
    });
});

app.get('/register', Auth, (req, res) => {
    if (req.user) { 
        return res.render('welcome_screen_preview', {
            header: true
        });
    } else {
        res.render('register', {
            header: false
        });
    }
});

app.post('/api/register', (req, res) => {
    const user = new User(req.body);
    
    user.save((err, doc) => {
        if(err) 
            return res.status(400).send(err);
        user.generateToken((err, user) => {
            if(err) 
                return res.status(400).send(err);
            res.cookie('auth', user.token).send('OK!');
        })
    })
});

app.get('/login', Auth, (req, res) => {
    if (req.user) { 
        return res.render('welcome_screen_preview', {
            header: true
        });
    } else {
        res.render('login', {
            header: false
        });
    }
});

app.post('/api/login', (req, res) => {
    User.findOne({'login': req.body.login}, (err, user) => {
        if(!user) 
            return res.status(400).json({message: 'Wrong login.'});
   
        user.comparePassword(req.body.password, function(err, isMatch) {
            if(err) 
                throw err;
            if(!isMatch) 
                return res.status(400).json({message: 'Wrong password.'});

            user.generateToken((err, user) => {
                if(err) 
                    return res.status(400).send(err);
                res.cookie('auth', user.token).send('OK!');
            })
        })
    })
});

app.get('/logout', Auth, (req, res) => {
    req.user.deleteToken(req.token, (err, user) => {
        if(err) 
            return res.status(400).send(err);
        res.redirect('/')
    })
});

app.put('/api/update_user', Auth, (req, res) => {
    const user = req.body;

    User.updateOne(req.params._id, user)
    .then((user) => {
        res.status(201).send(user);
    })
    .catch(err => res.status(500).send(err));
})

app.delete('/api/delete_user', (req, res) => {
    const user = req.body;

    User.deleteOne(req.params._id)
    .then((user) => {
        res.status(200).send(user);
    })
    .catch(err => res.status(500).send(err));
})

app.get('/my_account', Auth, (req, res) => {
    if (!req.user) { 
        return res.render('login', {
            header: false
        });
    } else {
        User.find({'_id': req.user._id}).exec((err, user) => {
            res.render('my_account', {
                header: true,
                user: req.user 
            });
        })
    }    
});

app.get('/welcome_screen_preview', Auth, (req, res) => {
    if (!req.user) { 
        return res.render('login', {
            header: false
        });
    } else {
        res.render('welcome_screen_preview', {
            header: true
        });
    }    
});

app.get('/welcome_screens_list', Auth, (req, res) => {
    if (!req.user) { 
        return res.render('login', {
            header: false
        });
    } else {
        User.find({'_id': req.user._id}).exec((err, user) => {
            res.render('welcome_screens_list', {
                header: true,
                user: req.user 
            });
        });
    }    
});

app.get('/new_welcome_screen_image', Auth, (req, res) => {
    if (!req.user) { 
        return res.render('login', {
            header: false
        });
    } else {
        res.render('new_welcome_screen_image', {
            header: true
        });
    }    
});

app.get('/new_welcome_screen_video', Auth, (req, res) => {
    if (!req.user) { 
        return res.render('login', {
            header: false
        });
    } else {
        res.render('new_welcome_screen_video', {
            header: true
        });
    }    
});

app.listen(config.PORT, () => {
    console.log(`Welcome Screen Cinq running on port ${config.PORT}`);
});