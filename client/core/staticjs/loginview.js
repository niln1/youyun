$('#login-form input').on("focus", function highlightLogo () {
	$('.school-logo').addClass('active');
});

$('#login-form input').on("blur", function highlightLogo () {
	$('.school-logo').removeClass('active');
});