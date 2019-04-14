$(document).ready(function() {
	$('[data-toggle="tooltip"]').tooltip();
    var actions = $("table td:last-child").html();

	$(document).on("click", ".delete", function() {
        $(this).parents("tr").remove();
		$(".add-new").removeAttr("disabled");
    });
});