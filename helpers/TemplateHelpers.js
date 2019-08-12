const GlobalHelpers = require('./GlobalHelpers');
const HBSHelpers = require('./HBSHelpers');

module.exports = {
  ProgrammedWelcomeScreen: ws => {
    return `
      <div class="col-xs-6 col-sm-6 col-md-6">
        <div class="form-group flt_center">
          <input type="checkbox" name="startScheduleWs" id="startScheduleWs" checked>
          <label for="startScheduleWs" class="releway-font" data-toggle="tooltip" data-placement="top" title="Once selected you will be able to choose when this video will be enabled">This welcome screen is schedule to:</label>
          <input type='text' name="startDate" id="startDate" class="datepicker-here form-control input-sm releway-font" data-position="bottom center" data-language='en' data-timepicker="true" placeholder="Start time" data-toggle="tooltip" data-placement="top" title="Set the start date"/>
        </div>
      </div>
      <div class="col-xs-6 col-sm-6 col-md-6">
        <div class="form-group flt_center">
          <input type="checkbox" class="vsb_hidden">
          <label for="finishScheduleWs" class="releway-font">Until:</label>
          <input type='text' name="endDate" id="endDate" class="datepicker-here form-control input-sm releway-font" data-position="bottom center" data-language='en' data-timepicker="true" placeholder="Finish time" data-toggle="tooltip" data-placement="top" title="Set the end date"/>
        </div>
      </div>
    `;
  },

  ActivetedWelcomeScreen: ws => {
    return `
      <div class="col-xs-6 col-sm-6 col-md-6">
        <div class="form-group flt_center">
          <input type="checkbox" name="startScheduleWs" id="startScheduleWs">
          <label for="startScheduleWs" class="releway-font" data-toggle="tooltip" data-placement="top" title="Once selected you will be able to choose when this video will be enabled">This welcome screen is schedule to:</label>
          <input type='text' name="startDate" id="startDate" class="datepicker-here form-control input-sm releway-font" data-position="bottom center" data-language='en' data-timepicker="true" placeholder="Start time" disabled data-toggle="tooltip" data-placement="top" title="Set the start date"/>
        </div>
      </div>
      <div class="col-xs-6 col-sm-6 col-md-6">
        <div class="form-group flt_center">
          <input type="checkbox" class="vsb_hidden">
          <label for="finishScheduleWs" class="releway-font">Until:</label>
          <input type='text' name="endDate" id="endDate" class="datepicker-here form-control input-sm releway-font" data-position="bottom center" data-language='en' data-timepicker="true" placeholder="Finish time" disabled data-toggle="tooltip" data-placement="top" title="Set the end date"/>
        </div>
      </div>
    `;
  },

  DisabledWelcomeScreen: ws => {
    return `
      <div class="col-xs-6 col-sm-6 col-md-6">
        <div class="form-group flt_center">
          <input type="checkbox" name="startScheduleWs" id="startScheduleWs">
          <label for="startScheduleWs" class="releway-font" data-toggle="tooltip" data-placement="top" title="Once selected you will be able to choose when this video will be enabled">This welcome screen is schedule to:</label>
          <input type='text' name="startDate" id="startDate" class="datepicker-here form-control input-sm releway-font" data-position="bottom center" data-language='en' data-timepicker="true" placeholder="Start time" disabled data-toggle="tooltip" data-placement="top" title="Set the start date"/>
        </div>
      </div>
      <div class="col-xs-6 col-sm-6 col-md-6">
        <div class="form-group flt_center">
          <input type="checkbox" class="vsb_hidden">
          <label for="finishScheduleWs" class="releway-font">Until:</label>
          <input type='text' name="endDate" id="endDate" class="datepicker-here form-control input-sm releway-font" data-position="bottom center" data-language='en' data-timepicker="true" placeholder="Finish time" disabled data-toggle="tooltip" data-placement="top" title="Set the end date"/>
        </div>
      </div>
    `;
  },

  ShowVideos: (videos, isAdmin) => {
    let toReturn = '';
    videos.forEach(video => {
      if (isAdmin) {
        toReturn += `
          <tr>
            <td class="releway-font ellipsis">${video.title}</td>
            <td class="releway-font ellipsis">${video.date}</td>
            ${GlobalHelpers.CheckAvailability(video)}
            <td>
              <a href="/edit_welcome_screen_video/${video.id}" class="edit" title="Edit this video" data-toggle="tooltip"><i class="material-icons">&#xE254;</i></a>
              <a class="deleteVideo" title="Delete this video" data-toggle="tooltip" onclick="DeleteVideo('${video.id}');"><i class="material-icons delete-icon">&#xE872;</i></a>
            </td>
          </tr>
        `
      } else if (!isAdmin) {
        if (!video.isDefaultVideo) {
          toReturn += `
            <tr>
              <td class="releway-font ellipsis">${video.title}</td>
              <td class="releway-font ellipsis">${video.date}</td>
              ${GlobalHelpers.CheckAvailability(video)}
              <td>
                <a href="/edit_welcome_screen_video/${video.id}" class="edit" title="Edit this video" data-toggle="tooltip"><i class="material-icons">&#xE254;</i></a>
                <a class="deleteVideo" title="Delete this video" data-toggle="tooltip" onclick="DeleteVideo('${video.id}');"><i class="material-icons delete-icon">&#xE872;</i></a>
              </td>
            </tr>
          ` 
        }
      }
    });

    return toReturn;
  },

  ImageList: image => {
    return `
      <section>
        <img class="current_image" id="current_image" src="/uploads/${image.imageName}"/>
        <div class="loader-wrapper">
          <span class="loader">
            <span class="loader-inner"></span>
          </span>
        </div>
        <ul class="row guests_list">
          ${GlobalHelpers.CompanyList(image.companies[0])}
          ${GlobalHelpers.CompanyList(image.companies[1])}
          ${GlobalHelpers.GuestList(image.guestsNames)}
        </ul>
      </section>
    `;
  },

  VideoListPreview: video => {
    return `
      <section>
        <div class="loader-wrapper">
          <span class="loader">
            <span class="loader-inner"></span>
          </span>
        </div>
        <video class="current_video_blur" autoplay loop muted preload>
          <source src="/uploads/${video.videoName}" type="video/mp4"></source>
        </video>
        <video class="current_video" id="current_video" autoplay loop muted preload>
          <source src="/uploads/${video.videoName}" type="video/mp4"></source>
        </video>
      </section>
    `;
  },

  VideoList: video => {
    return `
      <section>
        <video class="current_video_blur" autoplay loop muted preload>
          <source src="/uploads/${video.videoName}" type="video/mp4"></source>
        </video>
        <video class="current_video" id="current_video" autoplay loop muted preload>
          <source src="/uploads/${video.videoName}" type="video/mp4"></source>
        </video>
        <div class="loader-wrapper">
          <span class="loader">
            <span class="loader-inner"></span>
          </span>
        </div>
      </section>
    `;
  }
}