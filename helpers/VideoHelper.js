const moment = require('moment');
const multer = require('multer');
const fileStream = require('fs');
const GlobalHelpers = require('./GlobalHelpers');
const {ScreenVideo} = require('./../server/models/screen_video');

let date = '';
let videoName = '';
let defaultVideoName = '';
let title = '';
let isEnable = false;
let isDefault = false;
let newVideo = '';

module.exports = {
  SetStorage: () => {
    return storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb (null, 'uploads/');
      },
      filename: (req, file, cb) => {
        date = moment(Date.now()).format('MM/DD/YY');
        videoName = Date.now() + "_" + file.originalname;
        defaultVideoName = file.originalname;
        title = req.body.title;
        this.date = date;
        this.videoName = videoName;
        this.defaultVideoName = defaultVideoName;
        this.title = title;
        cb (null, `${videoName}`);
      }
    });
  },

  StoreVideo: () => {
    const storage = module.exports.SetStorage();

    return upload = multer({
      storage
    }).single('video');
  },

  UploadVideo: req => {
    req.body.defaultVideo = Boolean(req.body.defaultVideo);
    
    if (req.body.defaultVideo == true) {
      return screenVideo = new ScreenVideo({
        title: 'Default video',
        videoName: 'default_video.mp4',
        defaultVideoName: 'default_video.mp4',
        date: moment(Date.now()).format('MM/DD/YY')
      });
    } else {
      return screenVideo = new ScreenVideo({
        title: this.title,
        videoName: this.videoName,
        defaultVideoName: this.defaultVideoName,
        date: this.date
      });
    }
  },

  DeleteVideo: (oldVidName) => {
    if ((oldVidName !== 'default_video.mp4') && (this.videoName !== oldVidName) || (this.isDefault === true && oldVidName !== 'default_video.mp4')) {
      fileStream.unlink('./uploads/' + oldVidName, function (err) {});
    }
  },

  DeleteSingleWSVideo: (req, res) => {
    ScreenVideo.findById(req.params.id, (err, screenVideo) => {
      if (screenVideo.videoName != 'default_video.mp4') {
        fileStream.unlink('./uploads/' + screenVideo.videoName, err => {});
      }
    });
  
    ScreenVideo.find({_id: req.params.id}).deleteOne().exec((err, screenVideo) => {
      res.status(200).send(screenVideo);
    });
  },

  UpdateVideo: req => {
    this.isDefault = Boolean(req.body.defaultVideo);
    this.isEnable = Boolean(req.body.isEnable);
    module.exports.DeleteVideo(req.params.oldVideoName);
    this.date = GlobalHelpers.GetDate();

    if (this.isDefault === true && this.isEnable === true) {
      return module.exports.SetVideo('default_video.mp4', 'default_video.mp4', 'Default video', this.date, true);
    } else if (this.isDefault === true && this.isEnable === false) {
      return module.exports.SetVideo('default_video.mp4', 'default_video.mp4', 'Default video', this.date, false);
    } else if (this.isDefault === false && this.isEnable === true) {
      return module.exports.SetNotDefaultVideo(req.body.oldVideoName, req.body.currentVideo, req.body.title, this.date, true);
    } else {
      return module.exports.SetNotDefaultVideo(req.body.oldVideoName, req.body.currentVideo, req.body.title, this.date, false);
    }
  },

  SetVideo: (vidName, defaultVidName, tit, dataUpd, isActivated) => {
    return this.newVideo = {
      videoName: vidName,
      defaultVideoName: defaultVidName,
      title: tit,
      date: dataUpd,
      activated: isActivated 
    }
  },

  SetNotDefaultVideo: (vidName, defaultVidName, tit, dataUpd, isActivated) => {
    if (this.videoName == "" && this.defaultVideoName == "") {
      this.videoName = vidName;
      this.defaultVideoName = defaultVidName;
    } 

    return module.exports.SetVideo(this.videoName, this.defaultVideoName, tit, dataUpd, isActivated);
  }
}