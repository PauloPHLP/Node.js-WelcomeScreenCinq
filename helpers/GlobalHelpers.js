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
        ScreenImage.updateOne({_id: image._id}, {$set: {activated: isActivated}}, (err, screenImage) => {});
      });
    });
  },

  EnableDisableVideos: isActivated => {
    ScreenVideo.find().then(docVideo => {
      docVideo.forEach(video => {
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
      if (count > 0) {
        module.exports.EnableDisableVideos(false);
      }
    });
  },

  EnableDefaultVideoIfNoMedia: () => {
    ScreenImage.countDocuments({activated: 'true'}, function(err, imgCount) {
      ScreenVideo.countDocuments({activated: 'true'}, function(err, vidCount) {
        if (imgCount === 0 || vidCount ===  0) {
          // module.exports.EnableDisableDefaultVideo(true);
          // console.log('got something');
        }
      });
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
    if (((defaultName === 'default_video.mp4') || (defaultName === 'default_image.jpg')) && (activated === true)) {
      this.isDefault = true;
      this.isEnabled = true;
    } else if (((defaultName !== 'default_video.mp4') && (defaultName !== 'default_image.jpg')) && (activated === true)) {
      this.isDefault = false;
      this.isEnabled = true;
    } else if (((defaultName === 'default_video.mp4') || (defaultName === 'default_image.jpg')) && (activated === false)) {
      this.isDefault = true;
      this.isEnabled = false;
    } else {
      this.isDefault = false;
      this.isEnabled = false;
    }

    return {
      isDefault: this.isDefault,
      isEnabled: this.isEnabled
    };
  },

  GetDate: () => {
    return date = moment(Date.now()).format('MM/DD/YY');
  }
}