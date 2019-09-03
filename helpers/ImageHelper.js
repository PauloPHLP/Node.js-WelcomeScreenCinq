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
let startDate = '';
let endDate = '';
let activated = '';

module.exports = {
  SetStorage: () => {
    return storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb (null, 'uploads/');
      },
      filename: (req, file, cb) => {
        date = GlobalHelpers.GetDate();
        imageName = Date.now() + "_" + file.originalname;
        defaultImageName = file.originalname;
        activated = req.params.isProgrammed;
        this.date = date;
        this.imageName = imageName;
        this.defaultImage = defaultImageName;
        this.startDate = startDate;
        this.endDate = endDate;
        this.activated = activated;

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
    if (req.params.isProgrammed !== "programmed") 
      GlobalHelpers.EnableDisableVideos('false');

    if (req.body.defaultImage == true) {
      return screenImage = new ScreenImage({
        imageName: 'default_image.jpg',
        companies: 'Default image',
        defaultImageName: 'default_image.jpg',
        date: moment(Date.now()).format('MM/DD/YY'),
        startDate: this.startDate,
        endDate: this.endDate,
        activated: "true"
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

  DeleteSingleImage: req => {
    ScreenImage.findById(req.params.id, (err, screenImage) => {
      if (screenImage.imageName != 'default_image.jpg') {
        fileStream.unlink('./uploads/' + screenImage.imageName, err => {});
      }
    });
  },

  DeleteSingleWSImage: (req, res) => {
    module.exports.DeleteSingleImage(req);
    
    ScreenImage.find({_id: req.params.id}).deleteOne().exec((err, screenImage) => {
      res.status(200).send(screenImage);
      GlobalHelpers.EnableDisableDefaultVideoIfNoWS();
    });
  },

  UpdateImage: req => {
    this.isDefault = Boolean(req.body.defaultImage);
    this.isEnable = req.params.isProgrammed;
    module.exports.DeleteImage(req.params.oldImageName);
    this.companiesList = module.exports.SetCompanies(req.body.company1, req.body.company2);
    this.date = GlobalHelpers.GetDate();
    req.body.startDate = GlobalHelpers.FormatDateToUpdate(req.body.startDate);
    req.body.endDate = GlobalHelpers.FormatDateToUpdate(req.body.endDate);

    if (this.isDefault === false && this.isEnable === 'true') {
      GlobalHelpers.EnableDisableVideos("false");
      return module.exports.SetNotDefaultImage(req.params.oldImageName, req.params.currentImage, this.companiesList, this.date, null, null, 'true');
    } else if (this.isDefault === false && this.isEnable === 'false') {
      return module.exports.SetNotDefaultImage(req.params.oldImageName, req.params.currentImage, this.companiesList, this.date, null, null, 'false');
    } else  if (this.isDefault === false && this.isEnable === 'programmed') {
      return module.exports.SetNotDefaultImage(req.params.oldImageName, req.params.currentImage, this.companiesList, this.date, req.body.startDate, req.body.endDate, 'programmed');
    } else if (this.isDefault === true && this.isEnable === 'true') {
      GlobalHelpers.EnableDisableVideos("false");
      return module.exports.SetImage('default_image.jpg', 'default_image.jpg', this.companiesList, this.date, null, null, 'true');
    } else if (this.isDefault === true && this.isEnable === 'false') {
      return module.exports.SetImage('default_image.jpg', 'default_image.jpg', this.companiesList, this.date, null, null, 'false');
    } else if (this.isDefault === true && this.isEnable === 'programmed') {
      return module.exports.SetImage('default_image.jpg', 'default_image.jpg', this.companiesList, this.date, req.body.startDate, req.body.endDate, 'programmed');
    } 
  },

  SetImage: (imgName, defaultImgName, comp, dataUpd, startDate, endDate, isActivated) => {
    return this.newImage = {
      imageName: imgName,
      defaultImageName: defaultImgName,
      companies: comp,
      date: dataUpd,
      startDate: startDate,
      endDate: endDate,
      activated: isActivated 
    }
  },

  SetNotDefaultImage: (imgName, defImgName, comp, dataUpd, startDate, endDate, isActivated) => {
    if (this.imageName == "" && this.defaultImage == "") {
      this.imageName = imgName;
      this.defaultImage = defImgName;
    } 

    return module.exports.SetImage(this.imageName, this.defaultImage, comp, dataUpd, startDate, endDate, isActivated);
  },

  SetCompanies: () => {
    for (let i = 0; i < arguments.length; i++) {
      this.companies = arguments[i];
    }
  }
}