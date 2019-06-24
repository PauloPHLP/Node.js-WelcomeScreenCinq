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
  let equality = checkEqualDate(startDateFormatted, expirationDateFormatted);
  startDateFormatted = configureDate(startDateFormatted);
  expirationDateFormatted = configureDate(expirationDateFormatted);

  if (startDateFormatted > expirationDateFormatted || equality === true) {
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
  start = start.getDate() + start.getMonth() + start.getYear();
  finish = finish.getDate() + finish.getMonth() + finish.getYear();

  if (start === finish) {
    return true;
  } else {
    return false;
  }
}

function configureDate(date) {
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  return date;
}