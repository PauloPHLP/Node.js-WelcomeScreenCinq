const moment = require('moment');
const {ScreenVideo} = require('./../server/models/screen_video');
const {ScreenImage} = require('./../server/models/screen_image');

let isDefault = false;
let isEnabled = false;

module.exports = {
  EnableDisableImagesAndVideos: isEnabled => {
    module.exports.EnableDisableImages(isEnabled);
    module.exports.EnableDisableVideos(isEnabled);
  },

  EnableDisableImages: isActivated => {
    ScreenImage.find().then(docImage => {
      docImage.forEach(image => {
        if (image.activated === "true")
          ScreenImage.updateOne({_id: image._id}, {$set: {activated: isActivated}}, (err, screenImage) => {}); 
      });
    });
  },

  EnableDisableVideos: isActivated => {
    ScreenVideo.find().then(docVideo => {
      docVideo.forEach(video => {
        if (video.activated === "true")
          ScreenVideo.updateOne({_id: video._id}, {$set: {activated: isActivated}}, (err, screenVideo) => {});
      });
    });
  },

  EnableDisableDefaultVideo: isActivated => {
    ScreenVideo.updateOne({isDefaultVideo: 'true'}, {$set: {activated: isActivated}}, (err, screenVideo) => {});
  },

  EnableDefaultVideoIfNoImages: () => {
    ScreenImage.countDocuments({activated: 'true'}, function(err, count) {
      if (count === 0) {
        module.exports.EnableDisableDefaultVideo(true);
      }
      if (count > 0) {
        module.exports.EnableDisableVideos(false);
      }
    });
  },

  EnableDefaultVideoIfNoVideos: () => {
    ScreenVideo.countDocuments({activated: 'true'}, function(err, count) {
      if (count === 0) {
        module.exports.EnableDisableDefaultVideo(true);
      }
    });
  },

  DisableEverythingButCurrentVideo: id => {
    module.exports.EnableDisableImages(false);
    ScreenVideo.find().then(docVideo => {
      docVideo.forEach(video => {
        if (video._id != id) {
          ScreenVideo.updateOne({_id: video._id}, {$set: {activated: false}}, (err, screenVideo) => {});
        }
      });
    });
  },

  RenderSettings: (defaultName, activated) => {
    if (((defaultName === 'default_video.mp4') || (defaultName === 'default_image.jpg')) && (activated === "true")) {
      this.isDefault = true;
      this.isEnabled = "true";
    } else if (((defaultName === 'default_video.mp4') || (defaultName === 'default_image.jpg')) && (activated === "false")) {
      this.isDefault = true;
      this.isEnabled = "false";
    } else if (((defaultName === 'default_video.mp4') || (defaultName === 'default_image.jpg')) && (activated === "programmed")) {
      this.isDefault = true;
      this.isEnabled = "programmed";
    } else if (((defaultName !== 'default_video.mp4') && (defaultName !== 'default_image.jpg')) && (activated === "true")) {
      this.isDefault = false;
      this.isEnabled = "true";
    } else if (((defaultName !== 'default_video.mp4') && (defaultName !== 'default_image.jpg')) && (activated === "false")) {
      this.isDefault = false;
      this.isEnabled = "false";
    } else {
      this.isDefault = false;
      this.isEnabled = "programmed";
    }

    return {
      isDefault: this.isDefault,
      isEnabled: this.isEnabled
    };
  },

  GetDate: () => {
    return moment(Date.now()).format('MM/DD/YY');
  },

  FormatDate: date => {
    return moment(moment(date, 'DD/MM/YYYY HH:mm')).format('DD/MM/YYYY - HH:mm');
  }
}