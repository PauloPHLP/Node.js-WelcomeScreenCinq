const {ScreenVideo} = require('./../server/models/screen_video');
const {ScreenImage} = require('./../server/models/screen_image');

let isDefault = false;
let isEnabled = false;

module.exports = {
  DisableImagesAndVideos: () => {
    module.exports.DisableImages();
    module.exports.DisableVideos();
  },

  DisableImages: () => {
    ScreenImage.find().then(docImage => {
      docImage.forEach(image => {
        ScreenImage.updateOne({_id: image._id}, {$set: {activated: false}}, (err, screenImage) => {
        });
      });
    });
  },

  DisableVideos: () => {
    ScreenVideo.find().then(docVideo => {
      docVideo.forEach(video => {
        ScreenVideo.updateOne({_id: video._id}, {$set: {activated: false}}, (err, screenVideo) => {
        });
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
  }
}