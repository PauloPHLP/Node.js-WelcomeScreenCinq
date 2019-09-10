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

function DeleteVideo(id) {
  Swal.fire({
    title: 'Are you sure about this?',
    text: 'You will not be able to recover this video!',
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
            text: 'Video deleted successfully!',
            type: 'success',
            confirmButtonText: 'OK, keep going!',
            confirmButtonColor: '#EE9658'
          }).then(result => {
            let socketVid = io();
            socketVid.emit('UpdateOnDatabase');
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
        text: 'This video is safe :)',
        type: 'error',
        confirmButtonColor: '#EE9658'
      });
    }
  });
}

function deleteAllVideos() {
  const videos = getCheckedVideos();

  if (videos.length > 0) {
    Swal.fire({
      title: 'Are you sure about this?',
      text: 'You will not be able to recover the selected videos!',
      type: 'question',
      showCancelButton: true,
      confirmButtonText: "Yes, let's delete!",
      confirmButtonColor: '#EE9658',
      cancelButtonText: "No, let's keep!",
      cancelButtonColor: '#F50000'
    }).then(result => {
      if (result.value) {
        $.ajax({
          type:'DELETE',
          url: `/api/delete_selected_videos/${videos}`,
          contentType: 'application/json',
          success: data => {
            Swal.fire({
              title: 'Deleted!',
              text: 'Videos deleted successfully!',
              type: 'success',
              confirmButtonText: 'OK, keep going!',
              confirmButtonColor: '#EE9658'
            }).then(result => {
              let socketImg = io();
              socketImg.emit('UpdateOnDatabase');
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
          text: 'These videos are safe :)',
          type: 'error',
          confirmButtonColor: '#EE9658'
        });
      }
    });
  } else {
    Swal.fire({
      title: 'Nothing was selected',
      text: 'Please, select something to keep going :)',
      type: 'error',
      confirmButtonColor: '#EE9658'
    });
  }
}

function disableAllVideos() {
  const videos = getCheckedVideos();

  if (videos.length > 0) {
    Swal.fire({
      title: 'Are you sure about this?',
      text: 'This will disable everything, including the scheduled videos!',
      type: 'question',
      showCancelButton: true,
      confirmButtonText: "Yes, let's disable!",
      confirmButtonColor: '#EE9658',
      cancelButtonText: "No, let's keep!",
      cancelButtonColor: '#F50000'
    }).then(result => {
      if (result.value) {
        $.ajax({
          type:'PUT',
          url: `/api/disable_selected_videos/${videos}`,
          contentType: 'application/json',
          success: data => {
            Swal.fire({
              title: 'Disabled!',
              text: 'Videos disabled successfully!',
              type: 'success',
              confirmButtonText: 'OK, keep going!',
              confirmButtonColor: '#EE9658'
            }).then(result => {
              let socketImg = io();
              socketImg.emit('UpdateOnDatabase');
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
          text: 'These videos are safe :)',
          type: 'error',
          confirmButtonColor: '#EE9658'
        });
      }
    });
  } else {
    Swal.fire({
      title: 'Nothing was selected',
      text: 'Please, select something to keep going :)',
      type: 'error',
      confirmButtonColor: '#EE9658'
    });
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

function DeleteImage(id) {
  Swal.fire({
    title: 'Are you sure about this?',
    text: 'You will not be able to recover this visitor page!',
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
            text: 'Visitor page deleted successfully!',
            type: 'success',
            confirmButtonText: 'OK, keep going!',
            confirmButtonColor: '#EE9658'
          }).then(result => {
            let socketImg = io();
            socketImg.emit('UpdateOnDatabase');
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
        text: 'This visitor page is safe :)',
        type: 'error',
        confirmButtonColor: '#EE9658'
      });
    }
  });
}

function deleteAllImages() {
  const images = getCheckedImages();

  if (images.length > 0) {
    Swal.fire({
      title: 'Are you sure about this?',
      text: 'You will not be able to recover the selected visitor pages!',
      type: 'question',
      showCancelButton: true,
      confirmButtonText: "Yes, let's delete!",
      confirmButtonColor: '#EE9658',
      cancelButtonText: "No, let's keep!",
      cancelButtonColor: '#F50000'
    }).then(result => {
      if (result.value) {
        $.ajax({
          type:'DELETE',
          url: `/api/delete_selected_images/${images}`,
          contentType: 'application/json',
          success: data => {
            Swal.fire({
              title: 'Deleted!',
              text: 'Visitor pages deleted successfully!',
              type: 'success',
              confirmButtonText: 'OK, keep going!',
              confirmButtonColor: '#EE9658'
            }).then(result => {
              let socketImg = io();
              socketImg.emit('UpdateOnDatabase');
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
          text: 'These visitor pages are safe :)',
          type: 'error',
          confirmButtonColor: '#EE9658'
        });
      }
    });
  } else {
    Swal.fire({
      title: 'Nothing was selected',
      text: 'Please, select something to keep going :)',
      type: 'error',
      confirmButtonColor: '#EE9658'
    });
  }
}

function disableAllImages() {
  const images = getCheckedImages();

  if (images.length > 0) {
    Swal.fire({
      title: 'Are you sure about this?',
      text: 'This will disable everything, including the scheduled visitors pages!',
      type: 'question',
      showCancelButton: true,
      confirmButtonText: "Yes, let's disable!",
      confirmButtonColor: '#EE9658',
      cancelButtonText: "No, let's keep!",
      cancelButtonColor: '#F50000'
    }).then(result => {
      if (result.value) {
        $.ajax({
          type:'PUT',
          url: `/api/disable_selected_images/${images}`,
          contentType: 'application/json',
          success: data => {
            Swal.fire({
              title: 'Disabled!',
              text: 'Visitor pages disabled successfully!',
              type: 'success',
              confirmButtonText: 'OK, keep going!',
              confirmButtonColor: '#EE9658'
            }).then(result => {
              let socketImg = io();
              socketImg.emit('UpdateOnDatabase');
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
          text: 'These visitor pages are safe :)',
          type: 'error',
          confirmButtonColor: '#EE9658'
        });
      }
    });
  } else {
    Swal.fire({
      title: 'Nothing was selected',
      text: 'Please, select something to keep going :)',
      type: 'error',
      confirmButtonColor: '#EE9658'
    });
  }
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
  $('#startDate').removeClass('is-valid');
  $('#startDate').removeClass('is-invalid');
  $('#endDate').removeClass('is-valid');
  $('#endDate').removeClass('is-invalid');
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
    RemoveClassForDateFields('is-valid');
  } else if (isProgrammed === 'true') {
    $("#isEnableLabel").text(`\xA0 This WS is enabled`);
    $("#isEnable").prop("checked", true);
    RemoveClassForDateFields('is-valid');
  } else if (isProgrammed === 'false') {
    $("#isEnableLabel").text(`\xA0 This WS is disabled`);
    RemoveClassForDateFields('is-valid');
  } else if (isProgrammed === 'activated') {
    $("#isEnableLabel").text(`\xA0 This WS is enabled`);
    $("#isEnable").prop("checked", true);
    FormatDateToShow('#startDate', initialStartDate);
    FormatDateToShow('#endDate', initialEndDate);
    RemoveClassForDateFields('is-valid');
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
  CompareSelectedDates();

  if (startDateFormatted > expirationDateFormatted || CheckEqualDate(FormatDateSimple(startDateFormatted), FormatDateSimple(expirationDateFormatted))) {
    AddAndRemoveClassSimple('#startDate', 'is-invalid', 'is-valid');
    AddAndRemoveClassSimple('#endDate', 'is-invalid', 'is-valid');
    Toast.fire({
      type: 'warning',
      title: 'End date should be greater than start date!'
    });
    return false;
  } else {
    AddAndRemoveClassSimple('#startDate', 'is-valid', 'is-invalid');
    AddAndRemoveClassSimple('#endDate', 'is-valid', 'is-invalid');
    return true;
  };
}

function CompareSelectedDates() {
  if ($("#startDate").val() > $('#endDate').val()) {
    AddAndRemoveClassSimple('#startDate', 'is-invalid', 'is-valid');
    AddAndRemoveClassSimple('#endDate', 'is-invalid', 'is-valid');
  }
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

function selectAllImages(source) {
  let checkboxes = document.getElementsByName('ws_image');

  for (let i = 0, n = checkboxes.length; i < n ; i++)
    checkboxes[i].checked = source.checked;
}

function selectAllVideos(source) {
  let checkboxes = document.getElementsByName('ws_video');

  for (let i = 0, n = checkboxes.length; i < n ; i++)
    checkboxes[i].checked = source.checked;
}

function getAllImageCheckboxes() {
  return Array.from(document.getElementsByName('ws_image'));
}

function getAllVideoCheckboxes() {
  return Array.from(document.getElementsByName('ws_video'));
}

function getAllImagesCheckboxes() {
  let checkboxes = getAllImageCheckboxes();
  let selectAll = document.getElementById('image_select_all');
  let checkList = [];

  selectAll.addEventListener('change', () => {
    if ($('#image_select_all').is(':checked')) {
      checkboxes.map(item => {
        checkList.push(item.id);
      });
    } else {
      checkList = [];
    }
  });

  checkboxes.map(item => {
    item.addEventListener('change', () => {
      if (checkList.includes(item.id)) 
        checkList = checkList.filter(ws => ws !== item.id);
      else 
        checkList.push(item.id);

      if (checkList.length == checkboxes.length)
        document.getElementById('image_select_all').checked = true;
      else
        document.getElementById('image_select_all').checked = false;
    });
  });
}

function getAllVideosCheckboxes() {
  let checkboxes = getAllVideoCheckboxes();
  let selectAll = document.getElementById('video_select_all');
  let checkList = [];

  selectAll.addEventListener('change', () => {
    if ($('#video_select_all').is(':checked')) {
      checkboxes.map(item => {
        checkList.push(item.id);
      });
    } else {
      checkList = [];
    }
  });

  checkboxes.map(item => {
    item.addEventListener('change', () => {
      if (checkList.includes(item.id)) 
        checkList = checkList.filter(id => { return id != item.id; });
      else 
        checkList.push(item.id);

      if (checkList.length == checkboxes.length)
        document.getElementById('video_select_all').checked = true;
      else 
        document.getElementById('video_select_all').checked = false;
    });
  });
}

function getCheckedImages() {
  const images = getAllImageCheckboxes();
  let finalArray = [];

  images.map(image => {
    if ($('#' + image.id).is(':checked'))
      finalArray.push(image.id.replace('image_', ''));
  });

  return finalArray;
}

function getCheckedVideos() {
  const videos = getAllVideoCheckboxes();
  let finalArray = [];

  videos.map(video => {
    if ($('#' + video.id).is(':checked'))
      finalArray.push(video.id.replace('video_', ''));
  });

  return finalArray;
}