const moment = require('moment');
const multer = require('multer');
const fileStream = require('fs');
const GlobalHelpers = require('./GlobalHelpers');
const {ScreenImage} = require('./../server/models/screen_image');

let date = '';
let imageName = '';
let defaultImageName = '';
let defaultImage = '';
let companies = [];
let companiesList = [];
let guests = [];
let isEnable = false;
let isDefault = false;
let newImage = '';

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
        defaultImageName: this.defaultImage
      });
    }
  },

  DeleteImage: (currentImage, oldImageName) => {
    if (currentImage != '' || currentImage == oldImageName) {
      if (oldImageName != 'default_image.jpg') {
        fileStream.unlink('./uploads/' + oldImageName, function (err) {});
      }
    }
  },

  UpdateImage: req => {
    this.isDefault = Boolean(req.body.defaultImage);
    this.isEnable = Boolean(req.body.isEnable);
    this.companiesList = module.exports.SetCompanies(req.body.company1, req.body.company2);
    this.date = GlobalHelpers.GetDate();

    module.exports.DeleteImage(req.params.currentImage, req.params.oldImageName);

    if (this.isDefault == true && this.isEnable == true) {
      module.exports.SetImage('default_image.jpg', 'default_image.jpg', this.companiesList, this.date, true);
      GlobalHelpers.EnableDisableVideos(false);

      return this.newImage;
    } else if (this.isDefault == false && this.isEnable == true) {
      module.exports.SetNotDefaultImage(req.params.oldImageName, req.params.currentImage, this.companiesList, this.date, true);
      GlobalHelpers.EnableDisableVideos(false);

      return this.newImage;
    } else if (this.isDefault == true && this.isEnable == false) {
      module.exports.SetImage('default_image.jpg', 'default_image.jpg', this.companiesList, this.date, false);
      GlobalHelpers.EnableDisableVideos(false);

      return this.newImage;
    } else {
      module.exports.SetNotDefaultImage(req.params.oldImageName, req.params.currentImage, this.companiesList, this.date, false);
      GlobalHelpers.EnableDisableVideos(false);

      return this.newImage;
    }
  },

  SetImage: (imgName, defaultImgName, comp, dataUpd, isActivated) => {
    this.newImage = {
      imageName: imgName,
      defaultImageName: defaultImgName,
      companies: comp,
      date: dataUpd,
      activated: isActivated 
    }
  },

  SetNotDefaultImage: (imgName, defImgName, comp, dataUpd, isActivated) => {
    if (this.imageName == "" && this.defaultImage == "") {
      this.imageName = imgName;
      this.defaultImage = defImgName;
    } 

    module.exports.SetImage(this.imageName, this.defaultImage, comp, dataUpd, isActivated);
  },

  SetCompanies: () => {
    for (let i = 0; i < arguments.length; i++) {
      this.companies = arguments[i];
    }
  }
}