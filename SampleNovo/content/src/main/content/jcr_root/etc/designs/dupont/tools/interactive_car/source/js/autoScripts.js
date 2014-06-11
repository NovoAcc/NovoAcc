/* Landing Page Nav */
$('#landing .landingButton').click(function() {
		var $clickedID = null;
		var $clickedID = $(this).attr('id');
		var $clickedID = '#'+$clickedID.substring(0,$clickedID.length-6);//trim last 6 characters from end of ID
		$('#landing').hide('slow');
		$('#contentSlides').delay('slow').slideDown('slow');
		$('#dock div a'+$clickedID+'Icon').trigger('click');
		return false;
});

/* Menu Links */
$('#homeIcon').click(function() {
	$('#contentSlides, #bodySlide, #chassisSlide, #hybridSlide, #electricalSlide, #fuelSlide, #interiorSlide, #powertrainSlide, #safetySlide, #thermalSlide').hide(0);
	$('a').removeClass('activeSlide');
  $('#landing').show('slow');
	return false;
});

$(function() {   
  $('#details').cycle({	
	fx: 'fade',
	speed: 1000, 
  timeout: 0,
	width: 628, //added to force initial iPad load of large image
	height: 498, //added to force initial iPad load of large image
	fit: true //added to force initial iPad load of large image
	});	
});

$('#aftermarketIcon').click(function() { 
  $('#details').cycle(0);
	$('a').removeClass('activeSlide');
	$('#aftermarketIcon').addClass('activeSlide');
    return false; 
});
$('#bodyIcon').click(function() { 
  $('#details').cycle(1);
	$('a').removeClass('activeSlide');
	$('#bodyIcon').addClass('activeSlide');
    return false; 
});
$('#chassisIcon').click(function() { 
  $('#details').cycle(2);
	$('a').removeClass('activeSlide');
	$('#chassisIcon').addClass('activeSlide');
    return false; 
});
$('#electricalIcon').click(function() { 
  $('#details').cycle(3);
	$('a').removeClass('activeSlide');
	$('#electricalIcon').addClass('activeSlide');
    return false; 
});
$('#fuelIcon').click(function() { 
  $('#details').cycle(4);
	$('a').removeClass('activeSlide');
	$('#fuelIcon').addClass('activeSlide');
    return false; 
});
$('#hybridIcon').click(function() { 
  $('#details').cycle(5);
	$('a').removeClass('activeSlide');
	$('#hybridIcon').addClass('activeSlide');
    return false; 
});
$('#interiorIcon').click(function() { 
  $('#details').cycle(6);
	$('a').removeClass('activeSlide');
	$('#interiorIcon').addClass('activeSlide');
    return false; 
});
$('#powertrainIcon').click(function() { 
  $('#details').cycle(7);
	$('a').removeClass('activeSlide');
	$('#powertrainIcon').addClass('activeSlide');
    return false; 
});
$('#thermalIcon').click(function() { 
  $('#details').cycle(8);
	$('a').removeClass('activeSlide');
	$('#thermalIcon').addClass('activeSlide');
    return false; 
});
$('#transmissionIcon').click(function() { 
  $('#details').cycle(9);
	$('a').removeClass('activeSlide');
	$('#transmissionIcon').addClass('activeSlide');
    return false; 
});

/* Tool Tips */
$('#details div div a').click(function() {
	var $linkURL = $(this).attr('href');
	window.open($linkURL);
});

$('#details div div').click(function() {
	var $currentTipID = null;
	var $currentTipID = $(this).attr('id');
	var $currentTipID = '#'+$currentTipID;
	if($currentTipID.slice(-3) == 'tip') {
		$($currentTipID).fadeOut(400);
		$('.tooltip.isOpen').removeClass('isOpen');
		return false;
	}
});

$('#details div div').click(function() {
	var $currentTipID = null;
	var $currentTipID = $(this).attr('id');
	$('#'+$currentTipID).addClass('visited');
	var $currentTipID = '#'+$currentTipID+'tip';
	$('.tooltip.isOpen').fadeOut(400);
	$('.tooltip.isOpen').removeClass('isOpen');
	$($currentTipID).fadeIn('slow');
	$($currentTipID).addClass('isOpen');
	return false;
});
