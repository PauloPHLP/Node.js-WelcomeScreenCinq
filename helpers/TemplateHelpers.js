const GlobalHelpers = require('./GlobalHelpers');

module.exports = {
  ProgrammedWelcomeScreen: video => {
    return `
      <div class="col-xs-6 col-sm-6 col-md-6">
        <div class="form-group flt_center">
          <input type="checkbox" name="startScheduleWs" id="startScheduleWs" checked>
          <label for="startScheduleWs">This welcome screen is schedule to:</label>
          <input type='text' name="startDate" id="startDate" class="datepicker-here form-control input-sm" data-position="top center" data-language='en' data-timepicker="true" placeholder="Start time" value="${GlobalHelpers.FormatDate(video.startDate)}"/>
        </div>
      </div>
      <div class="col-xs-6 col-sm-6 col-md-6">
        <div class="form-group flt_center">
          <input type="checkbox" class="vsb_hidden">
          <label for="finishScheduleWs">Until:</label>
          <input type='text' name="endDate" id="endDate" class="datepicker-here form-control input-sm" data-position="top center" data-language='en' data-timepicker="true" placeholder="Finish time" value="${GlobalHelpers.FormatDate(video.endDate)}"/>
        </div>
      </div>
    `;
  },

  ActivetedWelcomeScreen: video => {
    return `
    
    `;
  }
}