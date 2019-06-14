const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('./../config/config').get(process.env.NODE_ENV);
const SALT_I = 10;

const userSchema = mongoose.Schema({
  isAdmin: {
    type: Boolean,
    default: false
  },
  name: {
    type: String,
    require: true,
  },
  login: {
    type: String,
    require: true,
    unique: 1
  },
  email: {
    type: String,
    require: true,
    trim: true,
    unique: 1
  },
  password: {
    type: String,
    require: true
  },
  token: {
    type: String,
    require: true
  }
}, {timestamps: true});

userSchema.pre('save', function(next) {
  let user = this;

  if(user.isModified('password')) {
    bcrypt.genSalt(SALT_I, (err, salt) => {
      if(err) 
        return next(err);
      bcrypt.hash(user.password, salt, (err, hash) => {
        if(err) 
          return next(err);
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

userSchema.statics.findByToken = function(token, cb) {
  var user = this;

  jwt.verify(token, config.SECRET, (err, decode) => {
    user.findOne({'_id': decode, 'token': token}, (err, user) => {
      if(err) 
        return cb(err);
      cb(null, user);
    });
  });
}

userSchema.methods.generateToken = function(cb) {
  var user = this;
  var token = jwt.sign(user._id.toHexString(), config.SECRET);

  user.token = token;
  user.save((err, user) => {
    if(err) 
      return cb(err);
    cb(null, user);
  });
}

userSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if(err) 
      return cb(err);
    cb(null, isMatch);
  });
}

userSchema.methods.deleteToken = function(token, cb) {
  var user = this;

  user.update({$unset: {token: 1}}, (err, user) => {
    if (err) 
      return cb(err);
    cb (null, user);
  });
}

const User = mongoose.model('User', userSchema); 

module.exports = {User};