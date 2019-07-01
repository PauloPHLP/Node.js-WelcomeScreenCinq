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

function deleteVideo(id) {
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

function deleteImage(id) {
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

function checkTime() {
  if (startDateFormatted > expirationDateFormatted || checkEqualDate(formatDate(startDateFormatted), formatDate(expirationDateFormatted))) {
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

function checkEqualDate(start, finish) {
  if (start === finish) {
    return true;
  } else {
    return false;
  }
}

function formatDate(date) {
  return moment(date).format('DD/MM/YYYY HH:mm');
}

function checkIsProgrammed(isChecked) {
  if (isChecked === true) {
    return 'programmed';
  } else {
    return 'true';
  }
}

function checkSchedule(isScheduled) {
  if (!isScheduled && $("#isEnable").is(':checked')) {
    return 'true'
  } else if (!isScheduled && !$("#isEnable").is(':checked')) {
    return 'false'
  } else if (isScheduled && !$("#isEnable").is(':checked')) {
    return 'programmed'
  }
}