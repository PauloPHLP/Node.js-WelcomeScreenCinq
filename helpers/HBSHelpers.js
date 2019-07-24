const GlobalHelpers = require('./GlobalHelpers');
const TemplateHelpers = require('./TemplateHelpers');

module.exports = {
  ShowCompanies: companies => {
    if ((companies[0] !== '' && companies[1] === '') || (companies[0] !== ' ' && companies[1] === ' ')) {
      return `<td>${companies[0]}</td>`;
    } else if ((companies[0] === '' && companies[1] !== '') || (companies[0] === ' ' && companies[1] !== ' ')) {
      return `<td>${companies[1]}</td>`;
    } else if ((companies[0] !== '' && companies[1] !== '') && (companies[0] !== ' ' && companies[1] !== ' ')) {
      return `<td>${companies[0]} - ${companies[1]}</td>`;
    } else {
      return `<td></td>`;
    }
  },

  CheckAvailability: ws => {
    if (ws.activated === 'true') {
      return `<td>Enabled</td>`;
    } else if (ws.activated === 'false') {
      return `<td>Disabled</td>`;
    } else if (ws.activated === 'programmed') {
      return `<td>Programmed to ${GlobalHelpers.FormatDate(ws.startDate)}</td>`;
    }
  },

  CheckType: type => {
    if (type === 'Image')
      return `<td>Visitor Page</td>`;
    else 
      return `<td>Video</td>`;
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