const moment = require('moment');
const multer = require('multer');
const {ScreenVideo} = require('./../server/models/screen_video');

let date = '';
let videoName = '';
let defaultVideoName = '';
let title = '';

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
  }
}