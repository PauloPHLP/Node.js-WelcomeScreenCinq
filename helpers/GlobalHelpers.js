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

  NewVideoDisableEverything: (currentVideoId, isActivated) => {
    module.exports.EnableDisableImages(false);
    module.exports.DisableAllVideosButCurrent(currentVideoId, isActivated);
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

  DisableEnableAllVideosButCurrent: (currentVideoId, isActivated) => {
    ScreenVideo.find().then(docVideo => {
      docVideo.forEach(video => {
          if (video._id != currentVideoId) {
            ScreenVideo.updateOne({_id: video._id}, {$set: {activated: isActivated}}, (err, screenVideo) => {});
          }
      });
    });
  },

  DisableActiveMidia: () => {
    ScreenVideo.find({'activated': true}).then(video => {
      ScreenImage.find({'activated': true}).then(image => {
        if (image == '' && video == '') {
          ScreenVideo.updateOne({'title': 'Default video'}, {$set: {activated: true}}, (err, screenVideo) => {});
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