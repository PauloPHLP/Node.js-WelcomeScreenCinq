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
    GlobalHelpers.EnableDisableVideos(false);

    const storage = module.exports.SetStorage();

    return upload = multer({
      storage
    }).single('image');
  },

  UploadImage: req => {
    req.body.defaultImage = Boolean(req.body.defaultImage);
    GlobalHelpers.DisableActiveMidia();
    
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

  DeleteImage: (oldImgName) => {
    if ((oldImgName !== 'default_image.jpg') && (this.imageName !== oldImgName) || (this.isDefault === true && oldImgName !== 'default_image.jpg')) {
      fileStream.unlink('./uploads/' + oldImgName, function (err) {});
    }
  },

  DeleteSingleWSImage: (req, res) => {
    ScreenImage.findById(req.params.id, (err, screenImage) => {
      if (screenImage.imageName != 'default_image.jpg') {
        fileStream.unlink('./uploads/' + screenImage.imageName, err => {});
      }
    });
  
    ScreenImage.find({_id: req.params.id}).deleteOne().exec((err, screenImage) => {
      res.status(200).send(screenImage);
    });
  },

  UpdateImage: req => {
    this.isDefault = Boolean(req.body.defaultImage);
    this.isEnable = Boolean(req.body.isEnable);
    module.exports.DeleteImage(req.params.oldImageName);
    this.companiesList = module.exports.SetCompanies(req.body.company1, req.body.company2);
    this.date = GlobalHelpers.GetDate();

    if (this.isDefault == true && this.isEnable == true) {
      return module.exports.SetImage('default_image.jpg', 'default_image.jpg', this.companiesList, this.date, true, false);
    } else if (this.isDefault == true && this.isEnable == false) {
      return module.exports.SetImage('default_image.jpg', 'default_image.jpg', this.companiesList, this.date, false, false);
    } else if (this.isDefault == false && this.isEnable == true) {
      return module.exports.SetNotDefaultImage(req.params.oldImageName, req.params.currentImage, this.companiesList, this.date, true, false);
    } else {
      return module.exports.SetNotDefaultImage(req.params.oldImageName, req.params.currentImage, this.companiesList, this.date, false, false);
    }
  },

  SetImage: (imgName, defaultImgName, comp, dataUpd, isActivated, enableVideo) => {
    GlobalHelpers.EnableDisableVideos(enableVideo);
    
    return this.newImage = {
      imageName: imgName,
      defaultImageName: defaultImgName,
      companies: comp,
      date: dataUpd,
      activated: isActivated 
    }
  },

  SetNotDefaultImage: (imgName, defImgName, comp, dataUpd, isActivated, enableVideo) => {
    if (this.imageName == "" && this.defaultImage == "") {
      this.imageName = imgName;
      this.defaultImage = defImgName;
    } 

    GlobalHelpers.EnableDisableVideos(enableVideo);

    return module.exports.SetImage(this.imageName, this.defaultImage, comp, dataUpd, isActivated);
  },

  SetCompanies: () => {
    for (let i = 0; i < arguments.length; i++) {
      this.companies = arguments[i];
    }
  }
}