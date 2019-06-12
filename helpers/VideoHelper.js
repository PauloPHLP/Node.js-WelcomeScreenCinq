const moment = require('moment');
const multer = require('multer');
const fileStream = require('fs');
const GlobalHelpers = require('./GlobalHelpers');
const {ScreenVideo} = require('./../server/models/screen_video');

let date = '';
let videoName = '';
let defaultVideoName = '';
let title = '';
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

  DeleteVideo: (currentVideo, oldVideoName) => {
    if (currentVideo != '' || currentVideo == oldVideoName) {
      if (oldVideoName != 'default_video.mp4') {
        fileStream.unlink('./uploads/' + oldVideoName, function (err) {});
      }
    }
  },

  UpdateVideo: req => {
    this.isDefault = Boolean(req.body.defaultImage);
    this.isEnable = Boolean(req.body.isEnable);
    this.date = GlobalHelpers.GetDate();

    module.exports.DeleteVideo(req.params.currentImage, req.params.oldImageName);

    if (this.isDefault == true && this.isEnable == true) {
      module.exports.SetVideo('default_video.mp4', 'default_video.mp4', 'Default video', this.date, true);
      GlobalHelpers.EnableDisableImagesAndVideos(false);
      
      return this.newVideo;
    } else if (this.isDefault == false && this.isEnable == true) {
      module.exports.SetNotDefaultVideo(req.params.oldVideoName, req.params.currentVideo, this.title, this.date, true);
      GlobalHelpers.EnableDisableVideos(false);

      return this.newImage;
    } else if (this.isDefault == true && this.isEnable == false) {
      module.exports.SetVideo('default_video.mp4', 'default_video.mp4', 'Default video', this.date, false);
      GlobalHelpers.EnableDisableImagesAndVideos(false);
      
      return this.newVideo;
    } else {
      module.exports.SetNotDefaultVideo(req.params.oldVideoName, req.params.currentVideo, this.title, this.date, false);
      GlobalHelpers.EnableDisableVideos(false);

      return this.newImage;
    }
  },

  SetVideo: (vidName, defaultVidName, tit, dataUpd, isActivated) => {
    this.newVideo = {
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
      this.defaultVidName = defaultVidName;
    } 

    module.exports.SetVideo(this.videoName, this.defaultVidName, tit, dataUpd, isActivated);
  },
}