const express = require('express');
const hbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const moment = require('moment');
const config = require('./config/config').get(process.env.NODE_ENV);
const {ScreenImage} = require('./models/screen_image');
const {ScreenVideo} = require('./models/screen_video');
const {User} = require('./models/user');
const {Auth} = require('./middleware/auth');

const app = express();
let title = '';
let imageName = '';
let defaultImageName = '';
let defaultVideoName = '';
let guests = [];
let videoName = '';
let date = '';

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
app.use('/uploads', express.static(__dirname + './../uploads'));
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

app.put('/api/update_user', Auth, (req, res) => {
    User.updateOne(req.params._id, req.body)
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

app.post('/api/new_welcome_screen_image', (req, res) => {
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb (null, 'uploads/')
        },
        filename: (req, file, cb) => {
            date = Date.now();
            imageName = Date.now() + "_" + file.originalname;
            defaultImageName = file.originalname;
            cb (null, `${imageName}`);
        }
    })
    
    const upload = multer({
        storage
    }).single('image');

    upload(req, res, function(err) {
        req.body.defaultImage = Boolean(req.body.defaultImage);

        if (req.body.defaultImage == true) {
            imageName = 'default_image.jpg';
            company = 'Default image';
            defaultImageName = imageName;
        }
        
        for (let i = 1; i < 9; i++) {
            guests.push(req.body['guest' + i.toString()]);
        }

        const screenImage = new ScreenImage({
            company: req.body.company,
            guestsNames: guests,
            imageName: imageName,
            defaultImageName: defaultImageName,
            date: date,
            activated: 'Enabled'
        });

        screenImage.save((err, doc) => {
            if (err)
                res.status(400).send(err);
        })

        if (err)
            return res.end('An error has occurred!');
        res.end('Image uploaded successfully!');
    })
});

app.get('/edit_welcome_screen_image/:id', Auth, (req, res) => { 
    if (!req.user) { 
        return res.render('login', {
            header: false
        });
    } else {
        ScreenImage.findById(req.params.id, (err, screenImage) => {
            if (err)
                return res.status(400).send(err);

            if ((screenImage.defaultImageName === 'default_image.jpg') && (screenImage.activated === 'Enabled')) {
                res.render('edit_welcome_screen_image', {
                    screenImage,
                    isDefaultImage: true,
                    isEnabled: true,
                    header: true
                });
            } else if ((screenImage.defaultImageName != 'default_image.jpg') && (screenImage.activated === 'Enabled')) {
                res.render('edit_welcome_screen_image', {
                    screenImage,
                    isDefaultImage: false,
                    isEnabled: true,
                    header: true
                });
            } else if ((screenImage.defaultImageName === 'default_image.jpg') && (screenImage.activated === 'Disable')) {
                res.render('edit_welcome_screen_image', {
                    screenImage,
                    isDefaultImage: true,
                    isEnabled: false,
                    header: true
                });
            } else {
                res.render('edit_welcome_screen_image', {
                    screenImage,
                    isDefaultImage: false,
                    isEnabled: false,
                    header: true
                });
            }
        })
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

app.post('/api/new_welcome_screen_video', (req, res) => {
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb (null, 'uploads/')
        },
        filename: (req, file, cb) => {
            date = Date.now();
            videoName = Date.now() + "_" + file.originalname;
            defaultVideoName = file.originalname;
            title = req.body.title;
            cb (null, `${videoName}`);
        }
    })
    
    const upload = multer({
        storage
    }).single('video');

    upload(req, res, function(err) {
        req.body.defaultVideo = Boolean(req.body.defaultVideo);

        if (req.body.defaultVideo == true) {
            videoName = 'default_video.mp4';
            defaultVideoName = videoName;
            title = 'Default video';
        }

        const screenVideo = new ScreenVideo({
            title: title,
            videoName: videoName,
            defaultVideoName: defaultVideoName,
            date: date
        });

        screenVideo.save((err, doc) => {
            if (err)
                res.status(400).send(err);
        })

        if (err)
            return res.end('An error has occurred!');
        res.end('Video uploaded successfully!');
    })
});

app.get('/edit_welcome_screen_video/:id', Auth, (req, res) => {
    if (!req.user) { 
        return res.render('login', {
            header: false
        });
    } else {
        ScreenVideo.findById(req.params.id, (err, screenVideo) => {
            if (err)
                return res.status(400).send(err);

            if ((screenVideo.defaultVideoName === 'default_video.mp4') && (screenVideo.activated === 'Enabled')) {
                res.render('edit_welcome_screen_video', {
                    screenVideo,
                    isDefaultVideo: true,
                    isEnabled: true,
                    header: true
                });
            } else if ((screenVideo.defaultVideoName != 'default_video.mp4') && (screenVideo.activated === 'Enabled')) {
                res.render('edit_welcome_screen_video', {
                    screenVideo,
                    isDefaultVideo: false,
                    isEnabled: true,
                    header: true
                });
            } else if ((screenVideo.defaultVideoName === 'default_video.mp4') && (screenVideo.activated === 'Disable')) {
                res.render('edit_welcome_screen_video', {
                    screenVideo,
                    isDefaultVideo: true,
                    isEnabled: false,
                    header: true
                });
            } else {
                res.render('edit_welcome_screen_video', {
                    screenVideo,
                    isDefaultVideo: false,
                    isEnabled: false,
                    header: true
                });
            }
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
            ScreenVideo.find().exec((err, docVideo) => {
                ScreenImage.find().exec((err, docImage) => {
                    if (err) 
                        return res.status(400).send(err);
                    res.render('welcome_screens_list', {
                        header: true,
                        videos: docVideo,
                        images: docImage,
                        user: req.user 
                    });
                })
            })
        });
    }    
});

app.listen(config.PORT, () => {
    console.log(`Welcome Screen Cinq running on port ${config.PORT}`);
});