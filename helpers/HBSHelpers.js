const GlobalHelpers = require('./GlobalHelpers');
const TemplateHelpers = require('./TemplateHelpers');

module.exports = {
  ShowCompanies: companies => {
    if ((companies[0] !== '' && companies[1] === '') || (companies[0] !== ' ' && companies[1] === ' ')) {
      return `<td class="releway-font ellipsis">${companies[0]}</td>`;
    } else if ((companies[0] === '' && companies[1] !== '') || (companies[0] === ' ' && companies[1] !== ' ')) {
      return `<td class="releway-font ellipsis">${companies[1]}</td>`;
    } else if ((companies[0] !== '' && companies[1] !== '') && (companies[0] !== ' ' && companies[1] !== ' ')) {
      return `<td class="releway-font ellipsis">${companies[0]} - ${companies[1]}</td>`;
    } else {
      return `<td class="releway-font ellipsis"></td>`;
    }
  },

  CheckAvailability: ws => {
    if (ws.activated === 'true') {
      return `<td class="releway-font"><i class="material-icons on-icon">
      fiber_manual_record
      </i> Enabled</td>`;
    } else if (ws.activated === 'false') {
      return `<td class="releway-font"><i class="material-icons off-icon">
      fiber_manual_record
      </i> Disabled</td>`;
    } else if (ws.activated === 'programmed') {
      return `<td class="releway-font"><i class="material-icons programmed-icon">
      fiber_manual_record
      </i> Scheduled to ${GlobalHelpers.FormatDate(ws.startDate)}</td>`;
    }
  },

  CheckType: type => {
    if (type === 'Image')
      return `<td class="releway-font ellipsis">Visitor Page</td>`;
    else 
      return `<td class="releway-font ellipsis">Video</td>`;
  },

  CheckIsProgrammed: ws => {
    if (ws.activated === 'programmed') {
      return TemplateHelpers.ProgrammedWelcomeScreen(ws);
    } else if (ws.activated === 'true' && ws.startDate === null) {
      return TemplateHelpers.ActivetedWelcomeScreen(ws);
    } else if (ws.activated === 'true' && ws.startDate !== null) {
      return TemplateHelpers.ProgrammedWelcomeScreen(ws);
    } else if (ws.activated === 'false') {
      return TemplateHelpers.DisabledWelcomeScreen(ws);
    }
  },

  ShowVideos: (videos, isAdmin) => {
    return TemplateHelpers.ShowVideos(videos, isAdmin);
  },

  CheckImagectivation: image => {
    if (image.activated === 'true') 
      return TemplateHelpers.ImageList(image);
    else 
      return;
  },

  CheckVideoActivation: video => {
    if (video.activated === 'true') 
      return TemplateHelpers.VideoList(video);
    else 
      return;
  }
}