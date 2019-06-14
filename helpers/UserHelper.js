const {User} = require('./../server/models/user');

module.exports = {
  CreateUser: req => {
    
    return user = new User({
      isAdmin: req.body.isAdmin,
      name: req.body.name,
      login: req.body.login,
      email: req.body.email,
      password: req.body.password
    });
  }
}