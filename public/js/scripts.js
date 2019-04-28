$(document).ready(function() {
	$('[data-toggle="tooltip"]').tooltip();
    var actions = $("table td:last-child").html();

	$(document).on("click", ".delete", function() {
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

    $('.gallery').on('beforeChange', function(event, slick, currentSlide) {
        if (slick.$slides.length - 1 == currentSlide) {
            refreshPage();
        } 
    });

    if ($('.gallery .current_image').length == 1) {
        timedRefresh(15000);
    }

    if ($('#current_video').length === 0 && $('#current_image').length === 0) {
        timedRefresh(1000);
    }
});

function deleteVideo(id) {
    let confirmation = confirm("Are you sure about this?");

    if (confirmation === true) {
        $.ajax({
            type:'DELETE',
            url: `/api/delete_welcome_screen_video/${id}`,
            contentType: 'application/json',
            success: (data) => {
                alert('Welcome Screen deleted successfully!');
                window.location.href = "/welcome_screens_list"
            },
            error: () => {
                alert('An issue has occurred!');
            }
        })
    }
}

function deleteImage(id) {
    let confirmation = confirm("Are you sure about this?");

    if (confirmation === true) {
        $.ajax({
            type:'DELETE',
            url: `/api/delete_welcome_screen_image/${id}`,
            contentType: 'application/json',
            success: (data) => {
                alert('Welcome Screen deleted successfully!');
                window.location.href = "/welcome_screens_list"
            },
            error: () => {
                alert('An issue has occurred!');
            }
        })
    }
}