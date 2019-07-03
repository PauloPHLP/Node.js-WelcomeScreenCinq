let startDateToKeep = '';
let endDateToKeep = '';

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
          Swal.fire(
            'Sorry',
            'An issue has occurred :(',
            'error'
          );
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
          Swal.fire(
            'Sorry',
            'An issue has occurred :(',
            'error'
          );
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

function AddAndRemoveClassConditional (field, classOne, classTwo) {
  if ($(field).val() === '' || $(field).val() === ' ') {
    $(field).addClass(classOne);
    $(field).removeClass(classTwo);
  } else {
    $(field).addClass(classTwo);
    $(field).removeClass(classOne);
  }
}

function AddAndRemoveClassSimple (field, toAdd, toRemove) {
  $(field).removeClass(toRemove);
  $(field).addClass(toAdd);
} 

function CleanStartEndField () {
  $('#startDate').removeClass('fulfilledFields');
  $('#startDate').removeClass('emptyFields');
  $('#endDate').removeClass('fulfilledFields');
  $('#endDate').removeClass('emptyFields');
  $('#startDate').val('');
  $('#endDate').val('');
}

function GetTodaysDatePlusOne (dateNow) {
  return new Date(dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDate(), (dateNow.getHours() + 1), dateNow.getMinutes(), dateNow.getSeconds()); 
}

function GetTomorrowsDate (dateNow) {
  return new Date(dateNow.getFullYear(), dateNow.getMonth(), (dateNow.getDate() + 1), dateNow.getHours(), dateNow.getMinutes(), dateNow.getSeconds()); 
}

function FormatDateBeauty (date) {
  return moment(date).format('DD/MM/YYYY - HH:mm');
}

function FormatDateToShow (field, date) {
  $(field).data('datepicker').selectDate(new Date(moment(moment(date, 'DD/MM/YYYY HH:mm')).format('MM/DD/YYYY HH:mm')));
}

function FormatDateUgly (date) {
  return moment(date).format('DD-M-YY H:m');
}

function FormatDateToEnroll (date, month, year) {
  return date.getDate() + '-' + month + '-' + year + ' ' + date.getHours() + ':' + date.getMinutes();
}

function FormatYear (year) {
  return year.getYear().toString().substring(1);
}

function GetCorrectMonth (month) {
  return month.getMonth() + 1;
}

function ChangeCheckBoxLabelText (field, isChecked) {
  if (isChecked) {
    $(field).text('\u00A0 This Welcome Screen is enabled');
  } else {
    $(field).text('\u00A0 This Welcome Screen is disabled');
  }
}

function CheckBoxCheck (isProgrammed, initialStartDate, initialEndDate) {
  if (isProgrammed === 'programmed') {
    $("#isEnableLabel").text(`\xA0 This Welcome Screen is disabled`);
    FormatDateToShow('#startDate', initialStartDate);
    FormatDateToShow('#endDate', initialEndDate);
    RemoveClassForDateFields('fulfilledFields');
  } else if (isProgrammed === 'true') {
    $("#isEnableLabel").text(`\xA0 This Welcome Screen is enabled`);
    $("#isEnable").prop("checked", true);
    RemoveClassForDateFields('fulfilledFields');
  } else if (isProgrammed === 'false') {
    $("#isEnableLabel").text(`\xA0 This Welcome Screen is disabled`);
    RemoveClassForDateFields('fulfilledFields');
  } else if (isProgrammed === 'activated') {
    $("#isEnableLabel").text(`\xA0 This Welcome Screen is enabled`);
    $("#isEnable").prop("checked", true);
    FormatDateToShow('#startDate', initialStartDate);
    FormatDateToShow('#endDate', initialEndDate);
    RemoveClassForDateFields('fulfilledFields');
  }
}

function UnableDisableScheduled (isEnabled) {
  DisableScheduleFields(isEnabled);
}

function RemoveClassForDateFields (className) {
  $('#startDate').removeClass(className);
  $('#endDate').removeClass(className);
}

function DisableScheduleFields (isEnabled) {
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

function FormatDate (date) {
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
    $("#startDate").removeClass('fulfilledFields');
    $("#startDate").addClass('emptyFields');
    $("#endDate").removeClass('fulfilledFields');
    $("#endDate").addClass('emptyFields');
    Toast.fire({
      type: 'warning',
      title: 'End date should be greater than start date!'
    });
    return false;
  } else {
    $("#startDate").removeClass('emptyFields');
    $("#startDate").addClass('fulfilledFields');
    $("#endDate").removeClass('emptyFields');
    $("#endDate").addClass('fulfilledFields');
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