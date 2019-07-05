const moment = require('moment');
const multer = require('multer');
const fileStream = require('fs');
const GlobalHelpers = require('./GlobalHelpers');
const {ScreenVideo} = require('./../server/models/screen_video');

let date = '';
let videoName = '';
let defaultVideoName = '';
let title = '';
let startDate = '';
let endDate = '';
let isEnable = false;
let isDefault = false;
let newVideo = '';
let activated = '';

module.exports = {
  SetStorage: () => {
    return storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb (null, 'uploads/');
      },
      filename: (req, file, cb) => {
        if (req.params.isProgrammed === "programmed") {
          startDate = req.params.startDate;
          endDate = req.params.endDate;
        } else {
          startDate = null;
          endDate = null;
        }
        date = GlobalHelpers.GetDate();
        videoName = Date.now() + "_" + file.originalname;
        defaultVideoName = file.originalname;
        title = req.body.title;
        activated = req.params.isProgrammed;
        this.date = date;
        this.videoName = videoName;
        this.defaultVideoName = defaultVideoName;
        this.title = title;
        this.startDate = startDate;
        this.endDate = endDate;
        this.activated = activated;
        
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
        date: moment(Date.now()).format('MM/DD/YY'),
        startDate: this.startDate,
        endDate: this.endDate,
        activated: "true"
      });
    } else {
      return screenVideo = new ScreenVideo({
        title: this.title,
        videoName: this.videoName,
        defaultVideoName: this.defaultVideoName,
        date: this.date,
        startDate: this.startDate,
        endDate: this.endDate,
        activated: this.activated
      });
    }
  },

  DeleteVideo: (oldVidName) => {
    if ((oldVidName !== 'default_video.mp4') && (this.videoName !== oldVidName) || (this.isDefault === true && oldVidName !== 'default_video.mp4')) {
      fileStream.unlink('./uploads/' + oldVidName, function (err) {});
    }
  },

  DeleteSingleVideo: (req) => {
    ScreenVideo.findById(req.params.id, (err, screenVideo) => {
      if (screenVideo.videoName != 'default_video.mp4') {
        fileStream.unlink('./uploads/' + screenVideo.videoName, err => {});
      }
    });
  },

  DeleteSingleWSVideo: (req, res) => {
    module.exports.DeleteSingleVideo(req);
  
    ScreenVideo.find({_id: req.params.id}).deleteOne().exec((err, screenVideo) => {
      res.status(200).send(screenVideo);
      GlobalHelpers.EnableDefaultVideoIfNoVideos();
    });
  },
  
  UpdateVideo: req => {
    this.isDefault = Boolean(req.body.defaultVideo);
    this.isEnable = req.params.isProgrammed;
    this.date = GlobalHelpers.GetDate();
    module.exports.DeleteVideo(req.params.oldVideoName);
    req.body.startDate = GlobalHelpers.FormatDateToUpdate(req.body.startDate);
    req.body.endDate = GlobalHelpers.FormatDateToUpdate(req.body.endDate);

    if (this.isDefault === false && this.isEnable === 'true') {
      GlobalHelpers.DisableEverythingButCurrentVideo(req.params.id);
      return module.exports.SetNotDefaultVideo(req.body.oldVideoName, req.body.currentVideo, req.body.title, this.date, null, null, 'true');
    } else if (this.isDefault === false && this.isEnable === 'false') {
      GlobalHelpers.EnableDefaultVideoIfNoVideos();
      return module.exports.SetNotDefaultVideo(req.body.oldVideoName, req.body.currentVideo, req.body.title, this.date, null, null, 'false');
    } else  if (this.isDefault === false && this.isEnable === 'programmed') {
      return module.exports.SetNotDefaultVideo(req.body.oldVideoName, req.body.currentVideo, req.body.title, this.date, req.body.startDate, req.body.endDate, 'programmed');
    } else if (this.isDefault === true && this.isEnable === 'true') {
      GlobalHelpers.DisableEverythingButCurrentVideo(req.params.id);
      return module.exports.SetVideo('default_video.mp4', 'default_video.mp4', 'Default video', this.date, null, null, 'true');
    } else if (this.isDefault === true && this.isEnable === 'false') {
      return module.exports.SetVideo('default_video.mp4', 'default_video.mp4', 'Default video', this.date, null, null, 'true');
    } else if (this.isDefault === true && this.isEnable === 'programmed') {
      return module.exports.SetVideo('default_video.mp4', 'default_video.mp4', 'Default video', this.date, req.body.startDate, req.body.endDate, 'programmed');
    } 
  },

  SetVideo: (vidName, defaultVidName, tit, dataUpd, startDate, endDate, isActivated) => {
    return this.newVideo = {
      videoName: vidName,
      defaultVideoName: defaultVidName,
      title: tit,
      date: dataUpd,
      startDate: startDate,
      endDate: endDate,
      activated: isActivated 
    }
  },

  SetNotDefaultVideo: (vidName, defaultVidName, tit, dataUpd, startDate, endDate, isActivated) => {
    if (this.videoName == "" && this.defaultVideoName == "") {
      this.videoName = vidName;
      this.defaultVideoName = defaultVidName;
    } 
    return module.exports.SetVideo(this.videoName, this.defaultVideoName, tit, dataUpd, startDate, endDate, isActivated);
  }
}