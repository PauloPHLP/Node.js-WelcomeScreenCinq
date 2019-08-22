let startDateToKeep = '';
let endDateToKeep = '';

$(window).on("load", function() {
  $(".loader-wrapper").fadeOut("slow");
});

$(window).on("reload", function() {
  $(".loader-wrapper").fadeOut("slow");
});

$(document).ready(() => {
  $('[data-toggle="tooltip"]').tooltip();
  var actions = $("table td:last-child").html();

  $(document).on("click", ".delete", () => {
    $(this).parents("tr").remove();
    $(".add-new").removeAttr("disabled");
  });

  $('.gallery').slick({
    infinite: true,
    speed: 1000,
    fade: true,
    cssEase: 'linear',
    autoplay: true,
    autoplaySpeed: 15000,
    pauseOnFocus: false,
    pauseOnHover: false,
    centerMode: true,
    variableWidth: true,
    useTransform: false
  });
});

function validateVideoFileType(isOnEdit) {
  let fileName = document.getElementById("video").value;
  let idxDot = fileName.lastIndexOf(".") + 1;
  let extFile = fileName.substr(idxDot, fileName.length).toLowerCase();

  if (extFile == "avi" || extFile == "mp4" || extFile == "mpeg" || extFile == "mpg" || extFile == "wmv") {
    AddAndRemoveClassConditional("#video", "is-invalid", "is-valid");
    return true;
  } else if (extFile == '' || extFile == ' ') {
    if (isOnEdit === false) {
      $("#video").removeClass('is-valid');
      return false;
    } else {
      $("#video").removeClass('is-invalid');
      return true;
    }
  } else {
    Swal.fire ({
      title: 'Sorry',
      text: 'Only avi, mp4, mpeg, mpg and wmv files are allowed!',
      type: 'error',
      confirmButtonColor: '#EE9658'
    });
    AddAndRemoveClassConditional("#video", "is-valid", "is-invalid");
    return false;
  }   
}

function validateImageFileType(isOnEdit) {
  let fileName = document.getElementById("image").value;
  let idxDot = fileName.lastIndexOf(".") + 1;
  let extFile = fileName.substr(idxDot, fileName.length).toLowerCase();
  
  if (extFile == "gif" || extFile == "png" || extFile == "jpeg" || extFile == "jpg") {
    AddAndRemoveClassConditional("#image", "is-invalid", "is-valid");
    return true;
  } else if (extFile == '' || extFile == ' ') {
    if (isOnEdit === false) {
      $("#image").removeClass('is-valid');
      return false;
    } else {
      $("#image").removeClass('is-invalid');
      return true;
    }
  } else {
    Swal.fire ({
      title: 'Sorry',
      text: 'Only jpg, jpeg, png, anf gif files are allowed!',
      type: 'error',
      confirmButtonColor: '#EE9658'
    });
    AddAndRemoveClassConditional("#image", "is-valid", "is-invalid");
    return false;
  }   
}

function DeleteVideo(id) {
  Swal.fire({
    title: 'Are you sure about this?',
    text: 'You will not be able to recover this Welcome Screen!',
    type: 'question',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
    confirmButtonColor: '#EE9658',
    cancelButtonText: 'No, keep it!',
    cancelButtonColor: '#F50000'
  }).then(result => {
    if (result.value) {
      $.ajax({
        type:'DELETE',
        url: `/api/delete_welcome_screen_video/${id}`,
        contentType: 'application/json',
        success: data => {
          let socketVid = io();
          socketVid.emit('UpdateOnDatabase');

          Swal.fire({
            title: 'Deleted!',
            text: 'Welcome Screen deleted successfully!',
            type: 'success',
            confirmButtonText: 'OK, keep going!',
            confirmButtonColor: '#EE9658'
          }).then(result => {
            window.location.href = "/welcome_screens_list"
          });
        },
        error: () => {
          Swal.fire ({
            title: 'Sorry',
            text: 'An issue has occurred :(',
            type: 'error',
            confirmButtonColor: '#EE9658'
          });
        }
      });
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      Swal.fire({
        title: 'Cancelled',
        text: 'This Welcome Screen is safe :)',
        type: 'error',
        confirmButtonColor: '#EE9658'
      });
    }
  });
}

function DeleteImage(id) {
  Swal.fire({
    title: 'Are you sure about this?',
    text: 'You will not be able to recover this Welcome Screen!',
    type: 'question',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
    confirmButtonColor: '#EE9658',
    cancelButtonText: 'No, keep it!',
    cancelButtonColor: '#F50000'
  }).then(result => {
    if (result.value) {
      $.ajax({
        type:'DELETE',
        url: `/api/delete_welcome_screen_image/${id}`,
        contentType: 'application/json',
        success: data => {
          let socketImg = io();
          socketImg.emit('UpdateOnDatabase');

          Swal.fire({
            title: 'Deleted!',
            text: 'Welcome Screen deleted successfully!',
            type: 'success',
            confirmButtonText: 'OK, keep going!',
            confirmButtonColor: '#EE9658'
          }).then(result => {
            window.location.href = "/welcome_screens_list"
          })
        },
        error: () => {
          Swal.fire ({
            title: 'Sorry',
            text: 'An issue has occurred :(',
            type: 'error',
            confirmButtonColor: '#EE9658'
          });
        }
      });
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      Swal.fire({
        title: 'Cancelled',
        text: 'This Welcome Screen is safe :)',
        type: 'error',
        confirmButtonColor: '#EE9658'
      });
    }
  });
}

function AddAndRemoveClassConditional(field, classOne, classTwo) {
  if ($(field).val() === '' || $(field).val() === ' ') {
    $(field).addClass(classOne);
    $(field).removeClass(classTwo);
  } else {
    $(field).addClass(classTwo);
    $(field).removeClass(classOne);
  }
}

function AddAndRemoveClassSimple(field, toAdd, toRemove) {
  $(field).removeClass(toRemove);
  $(field).addClass(toAdd);
} 

function CleanStartEndField() {
  $('#startDate').removeClass('fulfilledFields');
  $('#startDate').removeClass('emptyFields');
  $('#endDate').removeClass('fulfilledFields');
  $('#endDate').removeClass('emptyFields');
  $('#startDate').val('');
  $('#endDate').val('');
}

function resetToScheduled() {
  $("#startScheduleWs").prop('checked', true);
  $('#startDate').prop('disabled', false);
  $('#endDate').prop('disabled', false);
}

function resetToUnscheduled() {
  $("#startScheduleWs").prop('checked', false);
  $('#startDate').prop('disabled', true);
  $('#endDate').prop('disabled', true);
  $("#startDate").val('');
  $("#endDate").val('');
  $('#startDate').removeClass('is-valid');
  $('#startDate').removeClass('is-invalid');
  $('#endDate').removeClass('is-valid');
  $('#endDate').removeClass('is-invalid');
}

function resetToDefault() {
  $('#defaultVideo').prop('checked', true);
  $('#video').prop('disabled', true);
  $('#title').prop('disabled', true);
  $('#title').prop('value', 'Default video');
  $('#defVidName').text('default_video.mp4');
}

function resetToDefaultImage() {
  $('#defaultImage').prop('checked', true);
  $('#image').prop('disabled', true);
  $('#defImgName').text('default_image.jpg');
}

function resetToNotDefault() {
  $('#defaultVideo').prop('checked', false);
  $('#video').prop('disabled', false);
  $('#title').prop('disabled', false);
}

function resetToNotDefaultImage() {
  $('#defaultImage').prop('checked', false);
  $('#image').prop('disabled', false);
}


function GetTodaysDatePlusOne(dateNow) {
  return new Date(dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDate(), (dateNow.getHours() + 1), dateNow.getMinutes(), dateNow.getSeconds()); 
}

function GetMinDate(dateNow) {
  return new Date(dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDate(), dateNow.getHours(), (dateNow.getMinutes() + 1), dateNow.getSeconds()); 
}

function GetTomorrowsDate(dateNow) {
  return new Date(dateNow.getFullYear(), dateNow.getMonth(), (dateNow.getDate() + 1), dateNow.getHours(), dateNow.getMinutes(), dateNow.getSeconds()); 
}

function FormatDateBeauty(date) {
  return moment(date).format('DD/MM/YYYY - HH:mm');
}

function FormatDateBeautyCorrectFormat (date) {
  return moment(date).format('MM/DD/YYYY - HH:mm');
}

function GetCorrectHour(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), (date.getHours() - 1), date.getMinutes(), date.getSeconds())
}

function FormatDateToShow(field, date) {
  $(field).data('datepicker').selectDate(new Date(moment(moment(date, 'DD/MM/YYYY HH:mm')).format('MM/DD/YYYY HH:mm')));
}

function FormatDateUgly(date) {
  return moment(date).format('DD-M-YY H:m');
}

function FormatDateToEnroll(date, month, year) {
  return date.getDate() + '-' + month + '-' + year + ' ' + date.getHours() + ':' + date.getMinutes();
}

function FormatYear(year) {
  return year.getYear().toString().substring(1);
}

function GetCorrectMonth(month) {
  return month.getMonth() + 1;
}

function ChangeCheckBoxLabelText(field, isChecked) {
  if (isChecked) {
    $(field).text('\u00A0 This WS is enabled');
  } else {
    $(field).text('\u00A0 This WS is disabled');
  }
}

function CheckBoxCheck(isProgrammed, initialStartDate, initialEndDate) {
  if (isProgrammed === 'programmed') {
    $("#isEnableLabel").text(`\xA0 This WS is disabled`);
    FormatDateToShow('#startDate', initialStartDate);
    FormatDateToShow('#endDate', initialEndDate);
    RemoveClassForDateFields('fulfilledFields');
  } else if (isProgrammed === 'true') {
    $("#isEnableLabel").text(`\xA0 This WS is enabled`);
    $("#isEnable").prop("checked", true);
    RemoveClassForDateFields('fulfilledFields');
  } else if (isProgrammed === 'false') {
    $("#isEnableLabel").text(`\xA0 This WS is disabled`);
    RemoveClassForDateFields('fulfilledFields');
  } else if (isProgrammed === 'activated') {
    $("#isEnableLabel").text(`\xA0 This WS is enabled`);
    $("#isEnable").prop("checked", true);
    FormatDateToShow('#startDate', initialStartDate);
    FormatDateToShow('#endDate', initialEndDate);
    RemoveClassForDateFields('fulfilledFields');
  }
}

function EnableDisableVideoAndTitle(isEnable) {
  $('#video').prop('disabled', isEnable);
  $('#title').prop('disabled', isEnable);
}

function EnableDisableScheduled(isEnabled) {
  DisableScheduleFields(isEnabled);
}

function RemoveClassForDateFields(className) {
  $('#startDate').removeClass(className);
  $('#endDate').removeClass(className);
}

function DisableScheduleFields(isEnabled) {
  if (isEnabled === 'disabled') {
    $("#startScheduleWs").prop("checked", false);
    $("#startDate").prop("disabled", true);
    $("#endDate").prop("disabled", true);
    this.startDateToKeep = $("#startDate").val();
    this.endDateToKeep = $("#endDate").val();
    CleanStartEndField();
  } else if (isEnabled === 'enabled') {
    $("#startScheduleWs").prop("checked", false);
    $("#startDate").prop("disabled", true);
    $("#endDate").prop("disabled", true);
  } else if (isEnabled === 'programmed') {
    $("#isEnable").prop("checked", false);
    $("#startScheduleWs").prop("checked", true);
    $("#startDate").prop("disabled", false);
    $("#endDate").prop("disabled", false);
    $("#startDate").val(this.startDateToKeep);
    $("#endDate").val(this.endDateToKeep);
  }
}

function FormatDate(date) {
  return moment(moment(date, 'DD/MM/YYYY HH:mm')).format('DD/MM/YYYY - HH:mm');
}

function FormatDateSimple(date) {
  return moment(date).format('DD/MM/YYYY HH:mm');
}

function CheckEqualDate(start, finish) {
  if (start === finish) {
    return true;
  } else {
    return false;
  }
}

function CheckTime() {
  if (startDateFormatted > expirationDateFormatted || CheckEqualDate(FormatDateSimple(startDateFormatted), FormatDateSimple(expirationDateFormatted))) {
    AddAndRemoveClassSimple('#startDate', 'emptyFields', 'fulfilledFields');
    AddAndRemoveClassSimple('#endDate', 'emptyFields', 'fulfilledFields');
    Toast.fire({
      type: 'warning',
      title: 'End date should be greater than start date!'
    });
    return false;
  } else {
    AddAndRemoveClassSimple('#startDate', 'fulfilledFields', 'emptyFields');
    AddAndRemoveClassSimple('#endDate', 'fulfilledFields', 'emptyFields');
    return true;
  };
}

function CheckIsProgrammed(isChecked) {
  if (isChecked === true) {
    return 'programmed';
  } else {
    return 'true';
  }
}

function CheckSchedule(isScheduled) {
  if (!isScheduled && $("#isEnable").is(':checked')) {
    return 'true'
  } else if (!isScheduled && !$("#isEnable").is(':checked')) {
    return 'false'
  } else if (isScheduled && !$("#isEnable").is(':checked')) {
    return 'programmed'
  }
}