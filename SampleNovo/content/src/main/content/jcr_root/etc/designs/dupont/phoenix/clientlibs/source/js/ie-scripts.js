$(document).ready(function() {

	/* T_7_3 Template - 3 Items Per Row, Every 3rd remove margin-right and Every 4th Clear Left */
	$('.grid-wrapper .grid-item:nth-child(3n)').addClass('no-margin-right');
	$('.grid-wrapper .grid-item:nth-child(3n+1)').addClass('clr-left');

	/* HLM Empty DIV Issue */
	if ($('.row-3col li').length) {
	    $(this).hide();
	};

});