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

  checkAvailability: ws => {
    if (ws.activated === 'true') {
      return `<td>Enabled</td>`;
    } else if (ws.activated === 'false') {
      return `<td>Disabled</td>`;
    } else if (ws.activated === 'programmed') {
      return `<td>Programmed to ${GlobalHelpers.FormatDate(ws.startDate)}</td>`;
    }
  },

  checkIsProgrammed: ws => {
    if (ws.activated === 'programmed') {
      return TemplateHelpers.ProgrammedWelcomeScreen(ws);
    } else if (ws.activated === 'true' && ws.startDate === null) {
      return TemplateHelpers.ActivetedWelcomeScreen(ws);
    } else if (ws.activated === 'true' && ws.startDate !== null) {
      return TemplateHelpers.ProgrammedWelcomeScreen(ws);
    } else if (ws.activated === 'false') {
      return TemplateHelpers.DisabledWelcomeScreen(ws);
    }
  }
}