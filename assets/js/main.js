;(function($) {

	var scrollWidth = scrollbarWidth();
	var $navList = $('.navigation__list');
	var $body = $('body');
	var $infobox = $('#infobox');
	var $map,
		coordinates,
		infowindow,
		requestLink;

	$(function() {

		//Init WOW
		new WOW().init({   
            mobile: false 
		});

		//Init smoothscroll
		SmoothScroll({
			touchpadSupport: true
		});

		// Slider
		$('.head-slider').slick({
			arrows: true,
			dots: false,
			slide: '.slide',
			speed: 1200,
			slidesToShow: 1,
			prevArrow: '.slider-arrow__prev',
			nextArrow: '.slider-arrow__next',
			//'infinite': false,
			//'autoplay': true,
			//'autoplaySpeed': 2000,
			responsive: [
				{
					breakpoint: 720,
				    settings: {
				        arrow: false,
				        draggable: false
				    }
				}
			]
		}); // end slider

		//Scroll page to need section
		$(document).on('click', '.navigation__link, .scroll-top__link', function(event) {
			event.preventDefault();

			var elementId = $(this).attr('href');

			if ( elementId.length > 2 ) {
				var top = $(elementId).offset().top;

				if ( $(event.target).attr('class') == 'navigation__link') {
					
					$body.removeClass('js-nav-open');
					
					setTimeout(function() {
						$body.animate({
							scrollTop: top
						}, 1200);
					}, 300);

				} else {
					$body.animate({
						scrollTop: top
					}, 1200);
				}
			}
		});// end click

		$(document).on('click', '.menu-toggle', function(event) {
			event.preventDefault();

			$body.toggleClass('js-nav-open');

			setTimeout(function() {
				$navList.slideToggle();
			}, 350);
		}); // end click

		$(document).on('click', '.head-slider .slider-arrow', function(event) {
			event.preventDefault();
			
			$(this).siblings().removeClass('slider-arrow__prev--active');
			$(this).addClass('slider-arrow__prev--active');
		});

	}); // end ready

	

	$(window).load(function() {

		coordinates = {lat: 54.208364, lng: 36.618842};

		var $map_options = {
		        center: coordinates, 
		        zoom: 13,
		        mapTypeId: google.maps.MapTypeId.ROADMAP, //ROADMAP, HYBRID etc
				disableDefaultUI: true, //disable controls zooms icon
				scrollwheel: false, // disable map scroll
				draggable: true // disable drag map with mouse
		    };

		var $map_div = $('#map')[0]; // [0] is important, if we use jQuery for a map
			$map = new google.maps.Map($map_div, $map_options);

		// Markers
		var $marker = new google.maps.Marker({
		    position: coordinates,
		    map: $map, // variable of our map
		    zIndex: 100,
		    icon: 'assets/img/map-marker.png' // path relative index.html
		});

		// Infowindow 
		//infowindow = new google.maps.InfoWindow();

		requestLink = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + coordinates.lat+ ',' + coordinates.lng;
						
		setAddress(requestLink);


		//infowindow.open($map, $marker);

		var infobox = new InfoBox({  
	        content: $infobox[0],  
	        disableAutoPan: false,  
	        //maxWidth: 135,  
	        pixelOffset: new google.maps.Size(-13, -33),  
	        zIndex: 1,    
	        closeBoxURL: "",  
	        infoBoxClearance: new google.maps.Size(1, 1)  
	    });  

	    infobox.open($map, $marker);  
        $map.panTo(coordinates);
	}); // end load

	$(window).resize(function(event) {

		var windowWidth = $(window).width();
		
		if(windowWidth <= (768 - scrollWidth) ) {
			$navList.slideUp();
			$body.removeClass('js-nav-open');

		} else {
			$navList.show();
		}

		//Set map center
		$map.setCenter(coordinates);
	}); // end resize

	$(window).scroll(function(event) {

		var windowWidth = $(window).width();

		//Show scroll to top arrow 
		var headerHeight = $('#scroll-top').outerHeight();
		var scroll = $(window).scrollTop();
		var $scrollTop = $('.scroll-top');

		$scrollTop.addClass('js-scroll');

		setTimeout(function() {
			$scrollTop.removeClass('js-scroll');
		}, 300);

		if(scroll > headerHeight) {
			$scrollTop.addClass('js-scroll-top-show');
		} else {
			$scrollTop.removeClass('js-scroll-top-show');
		}

		//Hide mobile menu
		if(windowWidth <= (768 + scrollWidth) ) {
			$navList.slideUp();
			$body.removeClass('js-nav-open');
		}
	}); // end scroll

	function scrollbarWidth() {
  		var documentWidth = parseInt(document.documentElement.clientWidth);
  		var windowsWidth = parseInt(window.innerWidth);
  		var scrollbarWidth = windowsWidth - documentWidth;
  		return scrollbarWidth;
	}

	function setAddress(request_link) {

		$.post (
			request_link, 
			{}, 
			function (response){
				if (typeof response.results != 'undefined' && response.status == 'OK'){
					coordinates = response.results[0].geometry.location;
					$infobox.html('<p class="info-text">' + response.results[0].address_components[1].long_name + '</p>');
				} else {
					alert('Address not found!');
				}
			}
		);
	}

})(jQuery);