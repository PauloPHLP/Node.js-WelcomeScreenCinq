function addAndRemoveClassConditional (field, classOne, classTwo) {
  if ($(field).val() === '' || $(field).val() === ' ') {
    $(field).addClass(classOne);
    $(field).removeClass(classTwo);
  } else {
    $(field).addClass(classTwo);
    $(field).removeClass(classOne);
  }
}

function addAndRemoveClassSimple (field, toAdd, toRemove) {
  $(field).removeClass(toRemove);
  $(field).addClass(toAdd);
} 

function getTomorrowsDate (dateNow) {
  return new Date(dateNow.getFullYear(), dateNow.getMonth(), (dateNow.getDate() + 1), dateNow.getHours(), dateNow.getMinutes(), dateNow.getSeconds()); 
}

function formatDateBeauty (date) {
  return moment(date).format('DD/MM/YYYY - HH:mm');
}

function formatDateUgly (date) {
  return moment(date).format('DD-M-YY H:m');
}

function formatDateToEnroll (date, month, year) {
  return date.getDate() + '-' + month + '-' + year + ' ' + date.getHours() + ':' + date.getMinutes();
}

function formatYear (year) {
  return year.getYear().toString().substring(1);
}

function getCorrectMonth (month) {
  return month.getMonth() + 1;
}
