const moment = require('moment');
const multer = require('multer');
const {ScreenImage} = require('./../server/models/screen_image');

let date = '';
let imageName = '';
let defaultImageName = '';
let companies = [];
let guests = [];

module.exports = {
  SetStorage: () => {
    return storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb (null, 'uploads/');
      },
      filename: (req, file, cb) => {
        date = moment(Date.now()).format('MM/DD/YY');
        imageName = Date.now() + "_" + file.originalname;
        defaultImageName = file.originalname;

        this.date = date;
        this.imageName = imageName;
        this.defaultImage = defaultImageName;
        cb (null, `${imageName}`);
      }
    });
  },

  StoreImage: () => {
    const storage = module.exports.SetStorage();

    return upload = multer({
      storage
    }).single('image');
  },

  UploadImage: req => {
    req.body.defaultImage = Boolean(req.body.defaultImage);
    
    if (req.body.defaultImage == true) {
      return screenImage = new ScreenImage({
        imageName: 'default_image.jpg',
        companies: 'Default image',
        defaultImageName: 'default_image.jpg',
        date: moment(Date.now()).format('MM/DD/YY')
      });
    } else {
      return screenImage = new ScreenImage({
        date: this.date,
        imageName: this.imageName,
        defaultImage: this.defaultImage
      });
    }
  }
}