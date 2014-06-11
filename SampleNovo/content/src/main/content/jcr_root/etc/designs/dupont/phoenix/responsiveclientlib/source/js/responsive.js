/* Dupont 2.1 ~ Responsive JS ~ Notes ~
  - Will revisit and make all this magic happen in stylesheets and templates without any javascript dependencies if possible.
  - In scripts.js modified - Select Menu Styling, overridden for mobile-breadcrumbs select menu */


(function($) {


  /* Mobile Sub Navigation Menu
    ~ Apply background color to hidden Secondary Nav */
  $(document).ready(function() {
      function viewAllSlider(selector){
          $(selector).click(function(){
              $('.sub_navigation_mobile').css('display','block');
              $('body').animate({left:'-100%'},400, function(){});
              event.preventDefault();
          });
          $('.back-categories').click(function(){
              $('body').animate({left:'0%'},400, function(){
                  $('.sub_navigation_mobile').css('display','none');
              });
              event.preventDefault();
          });
      }
      viewAllSlider('#view-all-categories');
  });

  function subNavigationMobileMenu() {
      if ( $('.sub_navigation .column li').length > 7 && $(window).innerWidth() < 480 ) {
          $('.sub_navigation .column').hide();
          $('.sub_navigation .column.mobile').css('display','inline-block');
      } else {
          $('.sub_navigation .column').css('display','inline-block');
          $('.sub_navigation .column.mobile').hide();
      }
  }

  subNavigationMobileMenu();
  $(window).resize(function() {
      subNavigationMobileMenu();
  });
  /* End Mobile Sub Navigation Menu */


  /* Start Mobile Global Navigation */
  $(document).ready(function() {

    $('.header-top-bar-nav').on('click', function(e) {

        if ($(window).width() > 600) return;

        // If menu is open >> Close it
        if ($(this).hasClass('active')) {

            $('.menu-container').animate({left: '-81%'}, 'fast', function () {
                $(this).removeAttr("style");
            });
            if($.browser.mozilla){
                $('#bg-container').animate({left: '0'}, 'fast', function () {
                    $(this).removeAttr('style');
                });
            }
            else{
                $('body').animate({left: '0'}, 'fast', function () {
                    $(this).removeAttr('style');
                });
            }

            $(this).removeClass('active');
            $(".menu-dropdown-content").removeAttr("style");

        } else {
            $(this).addClass('active');
            $(".brands2 .menu-dropdown-content").css("display","block");
            $('.menu-container').css('display', 'block').animate({left: '0'}, 'fast');
            if($.browser.mozilla){
                $('#bg-container').css({
                    'position':'fixed',
                    'overflow':'hidden',
                    'heigth':'100%'
                }).animate({left: '81%'}, 'fast');
            }
            else{
                $('body').css({
                    'position':'fixed',
                    'overflow':'hidden',
                    'heigth':'100%'
                }).animate({left: '81%'}, 'fast');
            }
        }

    });


    $(document).ready(function() {

        var lastWindowWidth = window.innerWidth;

        $(window).resize(function() {

            /* Ensure that Mobile Search Bar & Navigation is closed between mobile breakpoint */
            if ( $(window).width() > 600 ) {
                $('.search-option').removeClass('active'); // Mobile Search Bar
                $('.header-top-bar-nav').removeClass('active'); // Mobile Navigation
                $('.menu-container').removeAttr("style");
                $('.mobile-search-bar').removeAttr("style");
                $('body').removeAttr("style");
            }

            /* Calculate Previous and Current Window widths and adjust UI accordingly */
            var $window = $(this),
                windowWidth = $window.width();

            if ( windowWidth < 600 && lastWindowWidth > 600 ) {
                // from desktop to mobile view
                $('.navigation-item').removeClass('hovering');
                $('.menu-dropdown-content').css('display','none');
            } else if ( windowWidth > 600 && lastWindowWidth < 600 ) {
                // from mobile to desktop view
                $('.navigation-item').removeClass('hovering');
                $('.menu-dropdown-content').css('display','none');
            } else {
                return;
            }

            lastWindowWidth = windowWidth;

        });

    });
    /* End Mobile Global Navigation */



    $('.menu-container').on('click', function(e) {
        e.stopPropagation();
    });

    
    // Search toggle
      
    $('.search-option').click(function (e) {
      $(this).toggleClass('active');
      $('.mobile-search-bar').slideToggle("fast");
    });

    /* Country Selector
		~ Grab link from Country Selector and Apply to Mobile Menu */
    var mobileCountrySelectorLink = $('.country-selector a').attr('href');
    $('.menu-dropdown .n3, .country-selector').click(function() {
       window.location = mobileCountrySelectorLink;
    });

    printShareContact();

  });

  /* Print Share Contact
    ~ Mobile View ~ Move before Disclaimer */
  function printShareContact() {
    var printShareContactMobile = $('.print-share-contact').html();
    if ($(window).innerWidth() < 768) {
      $('<div class=\"print-share-contact mobile-print-share-contact\">' + printShareContactMobile + '</div>').insertBefore('.mod-disclaimer');
    }
  }

  /* Product Information Module ~ Mobile Menu ~ For 480px
    ~ toggle active class for down arrow on h2
    ~ toggle visibility on the list */
  $('.product_information_group').on('click', 'h2', function() {
    $(this).toggleClass('active');
    $(this).parent('.prod-info').find('ul').toggleClass('block');
  });





})(jQuery);
