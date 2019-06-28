const GlobalHelpers = require('./GlobalHelpers');
const TemplateHelpers = require('./TemplateHelpers');

module.exports = {
  guestList: guestName => {
    if (guestName !== '') 
      return `<li class="guest-item list-group-item col-xs-6 ">&#x2022; ${guestName}</li>`;
    else if (guestName === '') {
      return `<li class="guest-item list-group-item col-xs-6 ">&nbsp</li>`;
    }
  },

  companyList: companyName => {
    if (companyName !== '') 
      return `<li class="company_name list-group-item col-xs-6 "> ${companyName}</li>`;
    else if (companyName === '') {
      return `<li class="company_name list-group-item col-xs-6 ">&nbsp</li>`;
    }
  },

  showCompanies: companies => {
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

  checkAvailability: video => {
    if (video.activated === 'true') {
      return `<td>Enabled</td>`;
    } else if (video.activated === 'false') {
      return `<td>Disabled</td>`;
    } else if (video.activated === 'programmed') {
      return `<td>Programmed to ${GlobalHelpers.FormatDate(video.startDate)}</td>`;
    }
  },

  // checkAvailability: video => {
  //   if (video.activated === 'true' || video.activated === 'programmed' && GlobalHelpers.CheckProgrammedDate(video) === true) {
  //     return `<td>Enabled</td>`;
  //   } else if (video.activated === 'false' || video.activated === 'programmed' && GlobalHelpers.CheckProgrammedDate(video) === false) {
  //     return `<td>Disabled</td>`;
  //   } else if (video.activated === 'programmed' && GlobalHelpers.CheckProgrammedDate(video) === null) {
  //     return `<td>Programmed to ${GlobalHelpers.FormatDate(video.startDate)}</td>`;
  //   } 
  // },

  checkIsProgrammed: video => {
    if (video.activated === 'programmed') {
      return TemplateHelpers.ProgrammedWelcomeScreen(video);
    } else if (video.activated === 'true') {
      return TemplateHelpers.ActivetedWelcomeScreen(video);
    } else if (video.activated === 'false') {
      return TemplateHelpers.DisabledWelcomeScreen(video);
    }
  }
}