/* #region Imports */
const express = require('express');
const expressHandlebars = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const config = require('./config/config').get(process.env.NODE_ENV);
const GlobalHelpers = require('../helpers/GlobalHelpers');
const HBSHelpers = require('./../helpers/HBSHelpers');
const ImageHelper = require('./../helpers/ImageHelper');
const VideoHelper = require('./../helpers/VideoHelper');
const {ScreenImage} = require('./models/screen_image');
const {ScreenVideo} = require('./models/screen_video');
const {User} = require('./models/user');
const {Auth} = require('./middleware/auth');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const hbs = expressHandlebars.create({
  extname: 'hbs',
  defaultLayout: 'main',
  layoutsDir: __dirname + './../views/layouts',
  partialsDir: __dirname + './../views/partials',
  helpers: {
    guestList: guestName => {
      return HBSHelpers.guestList(guestName);
    },
    companyList: companyName => {
      return HBSHelpers.companyList(companyName);
    },
    showCompanies: companies => {
      return HBSHelpers.showCompanies(companies);
    }
  }
});

/* #endregion */

/* #region Variables */
let guests = [];
let companies = [];
/* #endregion */

/* #region Mongoose settings */
mongoose.Promise = global.Promise;
mongoose.connect(config.DATABASE, {useNewUrlParser: true});
mongoose.set('useCreateIndex', true);
/* #endregion */

/* #region App settings */
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.use('/css', express.static(__dirname + './../public/css'));
app.use('/js', express.static(__dirname + './../public/js'));
app.use('/slick', express.static(__dirname + './../public/slick'));
app.use('/images', express.static(__dirname + './../public/images'));
app.use('/icons', express.static(__dirname + './../public/icons'));
app.use('/uploads', express.static(__dirname + './../uploads'));
app.use(bodyParser.json());
app.use(cookieParser());
/* #endregion */

/* #region IO settings */
io.on('connection', socket => {
  socket.on('UpdateOnDatabase', () => {
    socket.broadcast.emit('RefreshPage');
  });
});
/* #endregion */

/* #region HTTP methods */
app.get('/', (req, res) => {
  ScreenImage.find().exec((err, docImage) => {
    ScreenVideo.find().exec((err, docVideo) => {
      if (err) 
        return res.status(400).send(err);
      res.render('home', {
        images: docImage,
        videos: docVideo,
        header: false,
        title: 'Welcome Screen Cinq',
        host: config.HOST
      });
    });
  });
});

app.get('/register', Auth, (req, res) => {
  if (req.user && req.user.isAdmin === false) {
    res.redirect('back');
  } else {
    if (req.user) { 
      return res.render('register', {
        header: true,
        title: 'Register',
        isAdmin: req.user.isAdmin
      });
    } else {
      res.render('login', {
        header: false,
        title: 'login'
      });
    }
  }  
});

app.post('/api/register', (req, res) => {
  const user = new User({
    isAdmin: req.body.isAdmin,
    name: req.body.name,
    login: req.body.login,
    email: req.body.email,
    password: req.body.password
  });

  user.save((err, doc) => {
    if (err)
      res.status(400).send(err);
    res.end('User created successfully!');
  });
});

app.get('/login', Auth, (req, res) => {
  if (req.user) { 
    res.render('welcome_screens_list', {
      header: true,
      title: 'Login',
      isAdmin: req.user.isAdmin
    });
  } else {
    res.render('login', {
      header: false,
      title: 'Login'
    });
  }
});

app.post('/api/login', (req, res) => {
  User.findOne({'login': req.body.login}, (err, user) => {
    if(!user) 
      return res.status(400).json({message: 'Wrong login.'});
    user.comparePassword(req.body.password, (err, isMatch) => {
      if(err) 
        throw err;
      if(!isMatch) 
        return res.status(400).json({message: 'Wrong password.'});

      user.generateToken((err, user) => {
        if(err) 
          return res.status(400).send(err);
        res.cookie('auth', user.token).send('OK!');
      });
    });
  });
});

app.get('/logout', Auth, (req, res) => {
  req.user.deleteToken(req.token, (err, user) => {
    if(err) 
      return res.status(400).send(err);
    res.redirect('/');
  });
});

app.get('/my_account', Auth, (req, res) => {
  if (!req.user) { 
    return res.render('login', {
      header: false,
      title: 'Login'
    });
  } else {
    User.find({'_id': req.user._id}).exec((err, user) => {
      res.render('my_account', {
        header: true,
        user: req.user,
        title: req.user.name,
        isAdmin: req.user.isAdmin
      });
    });
  }    
});

app.put('/api/update_user/:id', Auth, (req, res) => {
  bcrypt.genSalt(10, (err, salt) => {
    if(err) 
      return next(err);
    bcrypt.hash(req.body.password, salt, (err, hash) => {
      if(err) 
        return next(err);

      req.body.password = hash;

      User.updateOne({'_id': req.params.id}, {$set: {
        name: req.body.name,
        login: req.body.login,
        email: req.body.email,
        password: req.body.password
      }}, (err, user) => {
        res.status(200).send(user);
      });
    });
  });
});

app.delete('/api/delete_user/:id', (req, res) => {
  User.remove({"_id": req.params.id}, (err, user) => {
    res.status(200).send(user);
  });
});

app.get('/welcome_screen_preview', Auth, (req, res) => {
  if (!req.user) { 
    return res.render('login', {
      header: false,
      title: 'Login'
    });
  } else {
    ScreenImage.find().exec((err, docImage) => {
      ScreenVideo.find().exec((err, docVideo) => {
        if (err) 
          return res.status(400).send(err);
        res.render('welcome_screen_preview', {
          images: docImage,
          videos: docVideo,
          header: true,
          isAdmin: req.user.isAdmin,
          title: 'Welcome Screens preview',
          host: config.HOST
        });
      });
    });
  }    
});

app.get('/welcome_screens_list', Auth, (req, res) => {
  if (!req.user) { 
    return res.render('login', {
      header: false,
      title: 'Login'
    });
  } else {
    User.find({'_id': req.user._id}).exec((err, user) => {
      ScreenVideo.find().exec((err, docVideo) => {
        ScreenImage.find().exec((err, docImage) => {
          if (err) 
            return res.status(400).send(err);
          res.render('welcome_screens_list', {
            header: true,
            isAdmin: req.user.isAdmin,
            videos: docVideo,
            images: docImage,
            user: req.user,
            title: 'Welcome Screen list'
          });
        });
      });
    });
  }    
});

app.get('/new_welcome_screen_image', Auth, (req, res) => {
  if (!req.user) { 
    return res.render('login', {
      header: false,
      title: 'New Welcome Screen'
    });
  } else {
    res.render('new_welcome_screen_image', {
      header: true,
      isAdmin: req.user.isAdmin,
      title: 'New Welcome Screen'
    });
  }    
});

app.post('/api/new_welcome_screen_image', (req, res) => {
  const upload = ImageHelper.StoreImage();
  
  upload(req, res, function(err) {
    const screenImage = ImageHelper.UploadImage(req);

    for (let i = 1; i < 9; i++) {
      guests.push(req.body['guest' + i.toString()]);
    }

    for (let i = 1; i < 3; i++) {
      companies.push(req.body['company' + i.toString()]);
    }

    screenImage.companies = companies;
    screenImage.guestsNames = guests;
    companies = [];
    guests = [];

    screenImage.save((err, doc) => {
      if (err)
        res.status(400).send(err);
    });

    if (err)
      return res.end('An error has occurred!');
    res.end('Image uploaded successfully!');
  });
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
      const renderSettings = GlobalHelpers.RenderSettings(screenImage.defaultImageName, screenImage.activated);

      res.render('edit_welcome_screen_image', {
        screenImage,
        isDefaultImage: renderSettings.isDefault,
        isEnabled: renderSettings.isEnabled,
        header: true,
        isAdmin: req.user.isAdmin,
        title: 'Edit Welcome Screen'
      });
    });
  }    
});

app.put('/api/update_welcome_screen_image/:id/:oldImageName/:currentImage', (req, res) => {
  const upload = ImageHelper.StoreImage();

  upload(req, res, err => {
    const screenImage = ImageHelper.UpdateImage(req);
    
    for (let i = 1; i < 9; i++) {
      guests.push(req.body['guest' + i.toString()]);
    }

    for (let i = 1; i < 3; i++) {
      companies.push(req.body['company' + i.toString()]);
    }

    ScreenImage.updateOne({_id: req.params.id}, {$set: {
      imageName: screenImage.imageName,
      defaultImageName: screenImage.defaultImageName,
      guestsNames: guests,
      companies: companies,
      date: screenImage.date,
      activated: screenImage.activated
    }}, (err, screenImage) => {});

    GlobalHelpers.EnableDefaultVideoIfNoImages();

    if (err)
      return res.end('An error has occurred!');
    res.end('Welcome Screen update successfully!');
  });

  companies = [];
  guests = [];
});

app.delete('/api/delete_welcome_screen_image/:id', (req, res) => {
  ImageHelper.DeleteSingleWSImage(req, res);
});

app.get('/new_welcome_screen_video', Auth, (req, res) => {
  if (!req.user) { 
    return res.render('login', {
      header: false,
      title: 'Login'
    });
  } else {
    // const day = '12-05-30 21:30';
    // console.log(moment(day, 'MM/DD/YYYY HH:mm').format('YYYY-MM-DD HH:mm'));
    res.render('new_welcome_screen_video', {
      header: true,
      isAdmin: req.user.isAdmin,
      title: 'New Welcome Screen'
    });
  }    
});

app.post('/api/new_welcome_screen_video', (req, res) => {
  GlobalHelpers.EnableDisableImagesAndVideos(false);
  const upload = VideoHelper.StoreVideo();
  
  upload(req, res, function(err) {
    const screenVideo = VideoHelper.UploadVideo(req);

    screenVideo.save((err, doc) => {
      if (err)
        res.status(400).send(err);
    });

    if (err)
      return res.end('An error has occurred!');
    res.end('Video uploaded successfully!');
  });
});

app.get('/edit_welcome_screen_video/:id', Auth, (req, res) => {
  if (!req.user) { 
    return res.render('login', {
      header: false,
      title: 'Login'
    });
  } else {
    ScreenVideo.findById(req.params.id, (err, screenVideo) => {
      if (err)
        return res.status(400).send(err);
      const renderSettings = GlobalHelpers.RenderSettings(screenVideo.defaultVideoName, screenVideo.activated);

      res.render('edit_welcome_screen_video', {
        screenVideo,
        isDefaultVideo: renderSettings.isDefault,
        isEnabled: renderSettings.isEnabled,
        header: true,
        isAdmin: req.user.isAdmin,
        title: 'Edit Welcome Screen'
      });
    });
  }    
});

app.put('/api/update_welcome_screen_video/:id/:oldVideoName/:currentVideo', (req, res) => {
  const upload = VideoHelper.StoreVideo();

  upload(req, res, function(err) {
    const screenVideo = VideoHelper.UpdateVideo(req);

    ScreenVideo.updateOne({_id: req.params.id}, {$set: {
      videoName: screenVideo.videoName,
      defaultVideoName: screenVideo.defaultVideoName,
      title: screenVideo.title,
      date: screenVideo.date,
      activated: screenVideo.activated
    }}, (err, screenVideo) => {});

    GlobalHelpers.EnableDefaultVideoIfNoVideos();
    
    if (err)
      return res.end('An error has occurred!');
    res.end('Welcome Screen update successfully!');
  });
});

app.delete('/api/delete_welcome_screen_video/:id', (req, res) => { 
  VideoHelper.DeleteSingleWSVideo(req, res);
});
/* #endregion */

/* #region PORT listener */
http.listen(config.PORT, '0.0.0.0', () => {
  console.log(`Welcome Screen Cinq running on port ${config.PORT}`);
});
/* #endregion */