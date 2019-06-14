const {User} = require('./../models/user');

let Auth = (req, res, next) => {
  const token = req.cookies.auth;

  User.findByToken(token, (err, user) => {
    if (err)
      throw err;
    req.user = user;
      
    next();
  });
}

module.exports = {Auth}