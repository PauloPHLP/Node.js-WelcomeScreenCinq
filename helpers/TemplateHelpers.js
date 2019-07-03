const GlobalHelpers = require('./GlobalHelpers');
const HBSHelpers = require('./HBSHelpers');

module.exports = {
  ProgrammedWelcomeScreen: ws => {
    return `
      <div class="col-xs-6 col-sm-6 col-md-6">
        <div class="form-group flt_center">
          <input type="checkbox" name="startScheduleWs" id="startScheduleWs" checked>
          <label for="startScheduleWs">This welcome screen is schedule to:</label>
          <input type='text' name="startDate" id="startDate" class="datepicker-here form-control input-sm" data-position="top center" data-language='en' data-timepicker="true" placeholder="Start time" value="${GlobalHelpers.FormatDate(ws.startDate)}"/>
        </div>
      </div>
      <div class="col-xs-6 col-sm-6 col-md-6">
        <div class="form-group flt_center">
          <input type="checkbox" class="vsb_hidden">
          <label for="finishScheduleWs">Until:</label>
          <input type='text' name="endDate" id="endDate" class="datepicker-here form-control input-sm" data-position="top center" data-language='en' data-timepicker="true" placeholder="Finish time" value="${GlobalHelpers.FormatDate(ws.endDate)}"/>
        </div>
      </div>
    `;
  },

  ActivetedWelcomeScreen: ws => {
    return `
      <div class="col-xs-6 col-sm-6 col-md-6">
        <div class="form-group flt_center">
          <input type="checkbox" name="startScheduleWs" id="startScheduleWs">
          <label for="startScheduleWs">This welcome screen is schedule to:</label>
          <input type='text' name="startDate" id="startDate" class="datepicker-here form-control input-sm" data-position="top center" data-language='en' data-timepicker="true" placeholder="Start time" disabled/>
        </div>
      </div>
      <div class="col-xs-6 col-sm-6 col-md-6">
        <div class="form-group flt_center">
          <input type="checkbox" class="vsb_hidden">
          <label for="finishScheduleWs">Until:</label>
          <input type='text' name="endDate" id="endDate" class="datepicker-here form-control input-sm" data-position="top center" data-language='en' data-timepicker="true" placeholder="Finish time" disabled/>
        </div>
      </div>
    `;
  },

  ProgrammedWelcomeScreen: ws => {
    return `
      <div class="col-xs-6 col-sm-6 col-md-6">
        <div class="form-group flt_center">
          <input type="checkbox" name="startScheduleWs" id="startScheduleWs" checked>
          <label for="startScheduleWs">This welcome screen is schedule to:</label>
          <input type='text' name="startDate" id="startDate" class="datepicker-here form-control input-sm" data-position="top center" data-language='en' data-timepicker="true" placeholder="Start time" value="${GlobalHelpers.FormatDate(ws.startDate)}"/>
        </div>
      </div>
      <div class="col-xs-6 col-sm-6 col-md-6">
        <div class="form-group flt_center">
          <input type="checkbox" class="vsb_hidden">
          <label for="finishScheduleWs">Until:</label>
          <input type='text' name="endDate" id="endDate" class="datepicker-here form-control input-sm" data-position="top center" data-language='en' data-timepicker="true" placeholder="Finish time" value="${GlobalHelpers.FormatDate(ws.endDate)}"/>
        </div>
      </div>
    `;
  },

  DisabledWelcomeScreen: ws => {
    return `
      <div class="col-xs-6 col-sm-6 col-md-6">
        <div class="form-group flt_center">
          <input type="checkbox" name="startScheduleWs" id="startScheduleWs">
          <label for="startScheduleWs">This welcome screen is schedule to:</label>
          <input type='text' name="startDate" id="startDate" class="datepicker-here form-control input-sm" data-position="top center" data-language='en' data-timepicker="true" placeholder="Start time" disabled/>
        </div>
      </div>
      <div class="col-xs-6 col-sm-6 col-md-6">
        <div class="form-group flt_center">
          <input type="checkbox" class="vsb_hidden">
          <label for="finishScheduleWs">Until:</label>
          <input type='text' name="endDate" id="endDate" class="datepicker-here form-control input-sm" data-position="top center" data-language='en' data-timepicker="true" placeholder="Finish time" disabled/>
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
            <td>${video.title}</td>
            <td>${video.date}</td>
            ${GlobalHelpers.CheckAvailability(video)}
            <td>${video.wsType}</td>
            <td>
              <a href="/edit_welcome_screen_video/${video.id}" class="edit" title="Edit" data-toggle="tooltip"><i class="material-icons">&#xE254;</i></a>
              <a class="deleteVideo" title="Delete" data-toggle="tooltip" onclick="DeleteVideo('${video.id}');"><i class="material-icons">&#xE872;</i></a>
            </td>
          </tr>
        `
      } else if (!isAdmin) {
        if (!video.isDefaultVideo) {
          toReturn += `
            <tr>
              <td>${video.title}</td>
              <td>${video.date}</td>
              ${GlobalHelpers.CheckAvailability(video)}
              <td>${video.wsType}</td>
              <td>
                <a href="/edit_welcome_screen_video/${video.id}" class="edit" title="Edit" data-toggle="tooltip"><i class="material-icons">&#xE254;</i></a>
                <a class="deleteVideo" title="Delete" data-toggle="tooltip" onclick="DeleteVideo('${video.id}');"><i class="material-icons">&#xE872;</i></a>
              </td>
            </tr>
          ` 
        }
      }
    });

    return toReturn;
  }
}