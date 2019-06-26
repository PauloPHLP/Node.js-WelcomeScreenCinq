let startDateToKeep = '';
let endDateToKeep = '';

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

function cleanStartEndField () {
  $('#startDate').removeClass('fulfilledFields');
  $('#startDate').removeClass('emptyFields');
  $('#endDate').removeClass('fulfilledFields');
  $('#endDate').removeClass('emptyFields');
  $('#startDate').val('');
  $('#endDate').val('');
}

function getTomorrowsDate (dateNow) {
  return new Date(dateNow.getFullYear(), dateNow.getMonth(), (dateNow.getDate() + 1), dateNow.getHours(), dateNow.getMinutes(), dateNow.getSeconds()); 
}

function formatDateBeauty (date) {
  return moment(date).format('DD/MM/YYYY - HH:mm');
}

function formatDateToShow (field, date) {
  $(field).data('datepicker').selectDate(new Date(moment(moment(date, 'DD/MM/YYYY HH:mm')).format('MM/DD/YYYY HH:mm')));
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

function changeCheckBoxLabelText (field, isChecked) {
  if (isChecked) {
    $(field).text('\u00A0 This Welcome Screen is enabled');
  } else {
    $(field).text('\u00A0 This Welcome Screen is disabled');
  }
}

function checkBoxCheck (isProgrammed, initialStartDate, initialEndDate) {
  if (isProgrammed === 'programmed') {
    $("#isEnableLabel").text(`\xA0 This Welcome Screen is disabled`);
    formatDateToShow('#startDate', initialStartDate);
    formatDateToShow('#endDate', initialEndDate);
    $('#startDate').removeClass('fulfilledFields');
    $('#endDate').removeClass('fulfilledFields');
  } else if (isProgrammed === 'true') {
    $("#isEnableLabel").text(`\xA0 This Welcome Screen is enabled`);
    $("#isEnable").prop("checked", true);
    $('#startDate').removeClass('fulfilledFields');
    $('#endDate').removeClass('fulfilledFields');
  } else if (isProgrammed === 'false') {
    $("#isEnableLabel").text(`\xA0 This Welcome Screen is disabled`);
    $('#startDate').removeClass('fulfilledFields');
    $('#endDate').removeClass('fulfilledFields');
  }
}

function unableDisableSchedule (isEnabled) {
  disableScheduleFields(isEnabled);
}

function disableScheduleFields (isEnabled) {
  if (isEnabled === 'disabled') {
    $("#startScheduleWs").prop("checked", false);
    $("#startDate").prop("disabled", true);
    $("#endDate").prop("disabled", true);
    this.startDateToKeep = $("#startDate").val();
    this.endDateToKeep = $("#endDate").val();
    cleanStartEndField();
  } else if (isEnabled === 'enabled') {
    $("#startScheduleWs").prop("checked", false);
    $("#startDate").prop("disabled", true);
    $("#endDate").prop("disabled", true);
    $("#startDate").val(this.startDateToKeep);
    $("#endDate").val(this.endDateToKeep);
  } else if (isEnabled === 'programmed') {
    $("#isEnable").prop("checked", false);
    $("#startScheduleWs").prop("checked", true);
    $("#startDate").prop("disabled", false);
    $("#endDate").prop("disabled", false);
    $("#startDate").val(this.startDateToKeep);
    $("#endDate").val(this.endDateToKeep);
  }
}

function enableDisableScheduledVideo (id, activation) {
  const dateToChange = {
    id: id,
    activated: activation
  }

  $.ajax({
    type:'POST',
    url: `/api/check_scheduled_video/${id}/${activation}`,
    data: JSON.stringify(dateToChange),
    contentType: 'application/json'
  });
}