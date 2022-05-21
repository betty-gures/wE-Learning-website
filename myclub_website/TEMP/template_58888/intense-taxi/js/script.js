"use strict";

// Global variables
var
	userAgent = navigator.userAgent.toLowerCase(),
	initialDate = new Date(),

	$document = $( document ),
	$window = $( window ),
	$html = $( "html" ),

	isDesktop = $html.hasClass( "desktop" ),
	isIE = userAgent.indexOf( "msie" ) != -1 ? parseInt( userAgent.split( "msie" )[ 1 ] ) : userAgent.indexOf( "trident" ) != -1 ? 11 : userAgent.indexOf( "edge" ) != -1 ? 12 : false,
	isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test( navigator.userAgent ),
	isTouch = "ontouchstart" in window,
	isNoviBuilder,

	plugins = {
		bootstrapTooltip: $( "[data-toggle='tooltip']" ),
		responsiveTabs: $( ".responsive-tabs" ),
		rdNavbar: $( ".rd-navbar" ),
		owl: $( ".owl-carousel" ),
		counter: $( ".counter" ),
		flickrfeed: $( ".flickr" ),
		twitterfeed: $( ".twitter" ),
		progressBar: $( ".progress-linear" ),
		bootstrapDateTimePicker: $( "[data-time-picker]" ),
		dateCountdown: $( '.DateCountdown' ),
		rdInputLabel: $( ".form-label" ),
		customWaypoints: $( '[data-custom-scroll-to]' ),
		stepper: $( "input[type='number']" ),
		radio: $( "input[type='radio']" ),
		checkbox: $( "input[type='checkbox']" ),
		rdMailForm: $( ".rd-mailform" ),
		regula: $( "[data-constraints]" ),
		search: $( ".rd-search" ),
		searchResults: $( '.rd-search-results' ),
		navbarToggle: $( ".rd-navbar-toggle" ),
		materialParallax: $( ".parallax-container" ),
		copyrightYear: $( ".copyright-year" ),

		swiperGallery: $( ".gallery-top" ),
		rdGoogleMaps: $( ".rd-google-map" ),
		swiper: $( ".swiper-slider" ),
		photoSwipeGallery: $( "[data-photo-swipe-item]" )
	};


/**
 * Initialize All Scripts
 */
$document.ready( function () {
	isNoviBuilder = window.xMode;

	// TODO DEL
	console.table( function () {
		var result = {};
		for ( var key in plugins ) if ( plugins[ key ].length ) result[ key ] = plugins[ key ].length;
		return result;
	}() );

	/**
	 * toggleSwiperInnerVideos
	 * @description  toggle swiper videos on active slides
	 */
	function toggleSwiperInnerVideos ( swiper ) {
		var prevSlide = $( swiper.slides[ swiper.previousIndex ] ),
			nextSlide = $( swiper.slides[ swiper.activeIndex ] ),
			videos;

		prevSlide.find( "video" ).each( function () {
			this.pause();
		} );

		videos = nextSlide.find( "video" );
		if ( videos.length ) {
			videos.get( 0 ).play();
		}
	}

	/**
	 * toggleSwiperCaptionAnimation
	 * @description  toggle swiper animations on active slides
	 */
	function toggleSwiperCaptionAnimation ( swiper ) {
		var prevSlide = $( swiper.container ),
			nextSlide = $( swiper.slides[ swiper.activeIndex ] );

		prevSlide
			.find( "[data-caption-animate]" )
			.each( function () {
				var $this = $( this );
				$this
					.removeClass( "animated" )
					.removeClass( $this.attr( "data-caption-animate" ) )
					.addClass( "not-animated" );
			} );

		nextSlide
			.find( "[data-caption-animate]" )
			.each( function () {
				var $this = $( this ),
					delay = $this.attr( "data-caption-delay" );

				setTimeout( function () {
					$this
						.removeClass( "not-animated" )
						.addClass( $this.attr( "data-caption-animate" ) )
						.addClass( "animated" );
				}, delay ? parseInt( delay ) : 0 );
			} );
	}

	/**
	 * makeParallax
	 * @description  create swiper parallax scrolling effect
	 */
	function makeParallax ( el, speed, wrapper, prevScroll ) {
		var scrollY = window.scrollY || window.pageYOffset;

		if ( prevScroll != scrollY ) {
			prevScroll = scrollY;
			el.addClass( 'no-transition' );
			el[ 0 ].style[ 'transform' ] = 'translate3d(0,' + -scrollY * (1 - speed) + 'px,0)';
			el.height();
			el.removeClass( 'no-transition' );

			if ( el.attr( 'data-fade' ) === 'true' ) {
				var bound = el[ 0 ].getBoundingClientRect(),
					offsetTop = bound.top * 2 + scrollY,
					sceneHeight = wrapper.outerHeight(),
					sceneDevider = wrapper.offset().top + sceneHeight / 2.0,
					layerDevider = offsetTop + el.outerHeight() / 2.0,
					pos = sceneHeight / 6.0,
					opacity;
				if ( sceneDevider + pos > layerDevider && sceneDevider - pos < layerDevider ) {
					el[ 0 ].style[ "opacity" ] = 1;
				} else {
					if ( sceneDevider - pos < layerDevider ) {
						opacity = 1 + ((sceneDevider + pos - layerDevider) / sceneHeight / 3.0 * 5);
					} else {
						opacity = 1 - ((sceneDevider - pos - layerDevider) / sceneHeight / 3.0 * 5);
					}
					el[ 0 ].style[ "opacity" ] = opacity < 0 ? 0 : opacity > 1 ? 1 : opacity.toFixed( 2 );
				}
			}
		}

		requestAnimationFrame( function () {
			makeParallax( el, speed, wrapper, prevScroll );
		} );
	}

	/**
	 * isScrolledIntoView
	 * @description  check the element whas been scrolled into the view
	 */
	function isScrolledIntoView ( elem ) {
		var $window = $( window );
		return elem.offset().top + elem.outerHeight() >= $window.scrollTop() && elem.offset().top <= $window.scrollTop() + $window.height();
	}

	/**
	 * initOnView
	 * @description  calls a function when element has been scrolled into the view
	 */
	function lazyInit ( element, func ) {
		var $win = jQuery( window );
		$win.on( 'load scroll', function () {
			if ( (!element.hasClass( 'lazy-loaded' ) && (isScrolledIntoView( element ))) ) {
				func.call();
				element.addClass( 'lazy-loaded' );
			}
		} );
	}

	/**
	 * Live Search
	 * @description  create live search results
	 */
	function liveSearch ( options ) {
		$( '#' + options.live ).removeClass( 'cleared' ).html();
		options.current++;
		options.spin.addClass( 'loading' );
		$.get( handler, {
			s: decodeURI( options.term ),
			liveSearch: options.live,
			dataType: "html",
			liveCount: options.liveCount,
			filter: options.filter,
			template: options.template
		}, function ( data ) {
			options.processed++;
			var live = $( '#' + options.live );
			if ( options.processed == options.current && !live.hasClass( 'cleared' ) ) {
				live.find( '> #search-results' ).removeClass( 'active' );
				live.html( data );
				setTimeout( function () {
					live.find( '> #search-results' ).addClass( 'active' );
				}, 50 );
			}
			options.spin.parents( '.rd-search' ).find( '.input-group-addon' ).removeClass( 'loading' );
		} )
	}

	/**
	 * attachFormValidator
	 * @description  attach form validation to elements
	 */
	function attachFormValidator ( elements ) {
		for ( var i = 0; i < elements.length; i++ ) {
			var o = $( elements[ i ] ), v;
			o.addClass( "form-control-has-validation" ).after( "<span class='form-validation'></span>" );
			v = o.parent().find( ".form-validation" );
			if ( v.is( ":last-child" ) ) {
				o.addClass( "form-control-last-child" );
			}
		}

		elements
			.on( 'input change propertychange blur', function ( e ) {
				var $this = $( this ), results;

				if ( e.type !== "blur" ) {
					if ( !$this.parent().hasClass( "has-error" ) ) {
						return;
					}
				}

				if ( $this.parents( '.rd-mailform' ).hasClass( 'success' ) ) {
					return;
				}

				if ( (results = $this.regula( 'validate' )).length ) {
					for ( i = 0; i < results.length; i++ ) {
						$this.siblings( ".form-validation" ).text( results[ i ].message ).parent().addClass( "has-error" )
					}
				} else {
					$this.siblings( ".form-validation" ).text( "" ).parent().removeClass( "has-error" )
				}
			} )
			.regula( 'bind' );

		var regularConstraintsMessages = [
			{
				type: regula.Constraint.Required,
				newMessage: "The text field is required."
			},
			{
				type: regula.Constraint.Email,
				newMessage: "The email is not a valid email."
			},
			{
				type: regula.Constraint.Numeric,
				newMessage: "Only numbers are required"
			},
			{
				type: regula.Constraint.Selected,
				newMessage: "Please choose an option."
			}
		];

		for ( var i = 0; i < regularConstraintsMessages.length; i++ ) {
			var regularConstraint = regularConstraintsMessages[ i ];

			regula.override( {
				constraintType: regularConstraint.type,
				defaultMessage: regularConstraint.newMessage
			} );
		}
	}

	/**
	 * isValidated
	 * @description  check if all elemnts pass validation
	 */
	function isValidated ( elements, captcha ) {
		var results, errors = 0;

		if ( elements.length ) {
			for ( j = 0; j < elements.length; j++ ) {

				var $input = $( elements[ j ] );
				if ( (results = $input.regula( 'validate' )).length ) {
					for ( k = 0; k < results.length; k++ ) {
						errors++;
						$input.siblings( ".form-validation" ).text( results[ k ].message ).parent().addClass( "has-error" );
					}
				} else {
					$input.siblings( ".form-validation" ).text( "" ).parent().removeClass( "has-error" )
				}
			}

			if ( captcha ) {
				if ( captcha.length ) {
					return validateReCaptcha( captcha ) && errors == 0
				}
			}

			return errors == 0;
		}
		return true;
	}

	/**
	 * validateReCaptcha
	 * @description  validate google reCaptcha
	 */
	function validateReCaptcha ( captcha ) {
		var captchaToken = captcha.find( '.g-recaptcha-response' ).val();

		if ( captchaToken.length === 0 ) {
			captcha
				.siblings( '.form-validation' )
				.html( 'Please, prove that you are not robot.' )
				.addClass( 'active' );
			captcha
				.closest( '.form-group' )
				.addClass( 'has-error' );

			captcha.on( 'propertychange', function () {
				var $this = $( this ),
					captchaToken = $this.find( '.g-recaptcha-response' ).val();

				if ( captchaToken.length > 0 ) {
					$this
						.closest( '.form-group' )
						.removeClass( 'has-error' );
					$this
						.siblings( '.form-validation' )
						.removeClass( 'active' )
						.html( '' );
					$this.off( 'propertychange' );
				}
			} );

			return false;
		}

		return true;
	}

	/**
	 * onloadCaptchaCallback
	 * @description  init google reCaptcha
	 */
	window.onloadCaptchaCallback = function () {
		for ( i = 0; i < plugins.captcha.length; i++ ) {
			var $capthcaItem = $( plugins.captcha[ i ] );

			grecaptcha.render(
				$capthcaItem.attr( 'id' ),
				{
					sitekey: $capthcaItem.attr( 'data-sitekey' ),
					size: $capthcaItem.attr( 'data-size' ) ? $capthcaItem.attr( 'data-size' ) : 'normal',
					theme: $capthcaItem.attr( 'data-theme' ) ? $capthcaItem.attr( 'data-theme' ) : 'light',
					callback: function ( e ) {
						$( '.recaptcha' ).trigger( 'propertychange' );
					}
				}
			);
			$capthcaItem.after( "<span class='form-validation'></span>" );
		}
	};

	/**
	 * Init Bootstrap tooltip
	 * @description  calls a function when need to init bootstrap tooltips
	 */
	function initBootstrapTooltip ( tooltipPlacement ) {
		if ( window.innerWidth < 599 ) {
			plugins.bootstrapTooltip.tooltip( 'destroy' );
			plugins.bootstrapTooltip.tooltip( {
				placement: 'bottom'
			} );
		} else {
			plugins.bootstrapTooltip.tooltip( 'destroy' );
			plugins.bootstrapTooltip.tooltipPlacement;
			plugins.bootstrapTooltip.tooltip();
		}
	}

	/**
	 * ChangeExternalButtons
	 * @description Change active tab in responsive active tab by external buttons (next tab, prev tab)
	 */
	function changeExternalButtons ( respTabItem, direction ) {
		var prev,
			next,
			activeItem;

		respTabItem.find( '.resp-tabs-extertal-list li' ).removeClass( 'active' );

		activeItem = respTabItem.find( '.resp-tab-item.resp-tab-active' );

		next = activeItem.next();
		if ( !next.length ) {
			next = respTabItem.find( '.resp-tab-item:first-child()' );
		}

		prev = activeItem.prev();
		if ( !prev.length ) {
			prev = respTabItem.find( '.resp-tab-item:last-child()' );
		}

		if ( direction ) {
			if ( direction === 'next' ) {
				next.trigger( 'click' );
			} else {
				prev.trigger( 'click' );
			}

			setTimeout( function () {
				changeExternalButtons( respTabItem );
			}, 10 );
		}

		respTabItem.find( '.resp-tab-external-prev li:nth-child(' + (prev.index() + 1) + ')' ).addClass( 'active' );
		respTabItem.find( '.resp-tab-external-next li:nth-child(' + (next.index() + 1) + ')' ).addClass( 'active' );
	}

	// Copyright Year
	if ( plugins.copyrightYear.length ) {
		for ( var i = 0; i < plugins.copyrightYear.length; i++ ) {
			$( plugins.copyrightYear[ i ] ).text( initialDate.getFullYear() );
		}
	}

	// IE Classes
	if ( isIE ) {
		if ( isIE < 10 ) $html.addClass( "lt-ie-10" );
		if ( isIE < 11 ) $html.addClass( "ie-10" );
		if ( isIE === 11 ) $( "html" ).addClass( "ie-11" );
		if ( isIE >= 12 ) $( "html" ).addClass( "ie-edge" );
	}

	// Bootstrap Tooltips
	if ( plugins.bootstrapTooltip.length ) {
		var tooltipPlacement = plugins.bootstrapTooltip.attr( 'data-placement' );
		initBootstrapTooltip( tooltipPlacement );
		$( window ).on( 'resize orientationchange', function () {
			initBootstrapTooltip( tooltipPlacement );
		} )
	}

	// RD Google Maps
	if ( plugins.rdGoogleMaps.length ) {
		var i;

		$.getScript( "//maps.google.com/maps/api/js?key=AIzaSyAFeB0kVA6ouyJ_gEvFbMaefLy3cBCyRwo&sensor=false&libraries=geometry,places&v=3.7", function () {
			var head = document.getElementsByTagName( 'head' )[ 0 ],
				insertBefore = head.insertBefore;

			head.insertBefore = function ( newElement, referenceElement ) {
				if ( newElement.href && newElement.href.indexOf( '//fonts.googleapis.com/css?family=Roboto' ) != -1 || newElement.innerHTML.indexOf( 'gm-style' ) != -1 ) {
					return;
				}
				insertBefore.call( head, newElement, referenceElement );
			};

			for ( i = 0; i < plugins.rdGoogleMaps.length; i++ ) {

				var $googleMapItem = $( plugins.rdGoogleMaps[ i ] );

				lazyInit( $googleMapItem, $.proxy( function () {
					var $this = $( this ),
						styles = $this.attr( "data-styles" );

					$this.googleMap( {
						styles: styles ? JSON.parse( styles ) : [],
						onInit: function ( map ) {
							var inputAddress = $( '#rd-google-map-address' );

							if ( inputAddress.length ) {
								var input = inputAddress;
								var geocoder = new google.maps.Geocoder();
								var marker = new google.maps.Marker(
									{
										map: map,
										icon: "images/gmap_marker.png",
									}
								);
								var autocomplete = new google.maps.places.Autocomplete( inputAddress[ 0 ] );
								autocomplete.bindTo( 'bounds', map );
								inputAddress.attr( 'placeholder', '' );
								inputAddress.on( 'change', function () {
									$( "#rd-google-map-address-submit" ).trigger( 'click' );
								} );
								inputAddress.on( 'keydown', function ( e ) {
									if ( e.keyCode == 13 ) {
										$( "#rd-google-map-address-submit" ).trigger( 'click' );
									}
								} );


								$( "#rd-google-map-address-submit" ).on( 'click', function ( e ) {
									e.preventDefault();
									var address = input.val();
									geocoder.geocode( { 'address': address }, function ( results, status ) {
										if ( status == google.maps.GeocoderStatus.OK ) {
											var latitude = results[ 0 ].geometry.location.lat();
											var longitude = results[ 0 ].geometry.location.lng();

											map.setCenter( new google.maps.LatLng(
												parseFloat( latitude ),
												parseFloat( longitude )
											) );
											marker.setPosition( new google.maps.LatLng(
												parseFloat( latitude ),
												parseFloat( longitude )
											) )
										}
									} );
								} );
							}
						}
					} );
				}, $googleMapItem ) );
			}
		} );
	}

	// Responsive Tabs
	if ( plugins.responsiveTabs.length > 0 ) {
		var i;

		for ( i = 0; i < plugins.responsiveTabs.length; i++ ) {
			var responsiveTabsItem = $( plugins.responsiveTabs[ i ] );

			responsiveTabsItem.easyResponsiveTabs( {
				type: responsiveTabsItem.attr( "data-type" ) === "accordion" ? "accordion" : "default"
			} );

			//If have owl carousel inside tab - resize owl carousel on click
			if ( responsiveTabsItem.find( '.owl-carousel' ).length ) {
				responsiveTabsItem.find( '.resp-tab-item' ).on( 'click', $.proxy( function ( event ) {
					var $this = $( this ),
						carouselObj = ($this.find( '.resp-tab-content-active .owl-carousel' ).owlCarousel()).data( 'owlCarousel' );

					if ( carouselObj && typeof carouselObj.onResize === "function" ) {
						carouselObj.onResize();
					}
				}, responsiveTabsItem ) );
			}

			// Enable external buttons (prev, text tab)
			if ( responsiveTabsItem.attr( 'data-external-buttons' ) == "true" ) {
				var list = responsiveTabsItem.find( '.resp-tabs-list li' ),
					newList = '<ul class="resp-tabs-extertal-list">';

				for ( var j = 0; j < list.length; j++ ) {
					newList += '<li><span>' + $( list[ j ] ).text() + '</span></li>';
				}
				newList += '</ul>';


				responsiveTabsItem.find( '.resp-tabs-container' ).before( '<div class="resp-tab-external-prev"></div>' )
				responsiveTabsItem.find( '.resp-tab-external-prev' ).html( newList );
				responsiveTabsItem.find( '.resp-tabs-container' ).after( '<div class="resp-tab-external-next"></div>' );
				responsiveTabsItem.find( '.resp-tab-external-next' ).html( newList );

				changeExternalButtons( responsiveTabsItem );

				responsiveTabsItem.find( '.resp-tab-external-prev' ).on( 'click', $.proxy( function ( event ) {
					var $this = $( this );

					changeExternalButtons( $this, 'prev' );
				}, responsiveTabsItem ) );

				responsiveTabsItem.find( '.resp-tab-external-next' ).on( 'click', $.proxy( function ( event ) {
					var $this = $( this );

					changeExternalButtons( $this, 'next' );
				}, responsiveTabsItem ) );

				responsiveTabsItem.find( '.resp-tabs-list .resp-tab-item' ).on( 'click', $.proxy( function ( event ) {
					var $this = $( this );

					changeExternalButtons( $this );
				}, responsiveTabsItem ) );
			}
		}
	}

	// RD Twitter Feed
	if ( plugins.twitterfeed.length > 0 ) {
		var i;
		for ( i = 0; i < plugins.twitterfeed.length; i++ ) {
			var twitterfeedItem = plugins.twitterfeed[ i ];
			$( twitterfeedItem ).RDTwitter( {
				hideReplies: false,
				localTemplate: {
					avatar: "images/features/rd-twitter-post-avatar-48x48.jpg"
				},
				callback: function () {
					$window.trigger( "resize" );
				}
			} );
		}
	}

	// RD Flickr Feed
	if ( plugins.flickrfeed.length > 0 ) {
		var i;
		for ( i = 0; i < plugins.flickrfeed.length; i++ ) {
			var flickrfeedItem = $( plugins.flickrfeed[ i ] );
			flickrfeedItem.RDFlickr( {
				callback: function () {
					var items = flickrfeedItem.find( "[data-photo-swipe-item]" );

					if ( items.length ) {
						for ( var j = 0; j < items.length; j++ ) {
							var image = new Image();
							image.setAttribute( 'data-index', j );
							image.onload = function () {
								items[ this.getAttribute( 'data-index' ) ].setAttribute( 'data-size', this.naturalWidth + 'x' + this.naturalHeight );
							};
							image.src = items[ j ].getAttribute( 'href' );
						}
					}
				}
			} );
		}
	}

	// Stepper
	if ( plugins.stepper.length ) {
		plugins.stepper.stepper( {
			labels: {
				up: "",
				down: ""
			}
		} );
	}

	// Radio
	if ( plugins.radio.length ) {
		var i;
		for ( i = 0; i < plugins.radio.length; i++ ) {
			var $this = $( plugins.radio[ i ] );
			$this.addClass( "radio-custom" ).after( "<span class='radio-custom-dummy'></span>" )
		}
	}

	// Checkbox
	if ( plugins.checkbox.length ) {
		var i;
		for ( i = 0; i < plugins.checkbox.length; i++ ) {
			var $this = $( plugins.checkbox[ i ] );
			$this.addClass( "checkbox-custom" ).after( "<span class='checkbox-custom-dummy'></span>" )
		}
	}

	// Bootstrap Date time picker
	if ( plugins.bootstrapDateTimePicker.length ) {
		var i;
		for ( i = 0; i < plugins.bootstrapDateTimePicker.length; i++ ) {
			var $dateTimePicker = $( plugins.bootstrapDateTimePicker[ i ] );
			var options = {};

			options[ 'format' ] = 'dddd DD MMMM YYYY - HH:mm';
			if ( $dateTimePicker.attr( "data-time-picker" ) == "date" ) {
				options[ 'format' ] = 'dddd DD MMMM YYYY';
				options[ 'minDate' ] = new Date();
			} else if ( $dateTimePicker.attr( "data-time-picker" ) == "time" ) {
				options[ 'format' ] = 'HH:mm';
			}

			options[ "time" ] = ($dateTimePicker.attr( "data-time-picker" ) != "date");
			options[ "date" ] = ($dateTimePicker.attr( "data-time-picker" ) != "time");
			options[ "shortTime" ] = true;

			$dateTimePicker.bootstrapMaterialDatePicker( options );
		}
	}

	// TimeCircles
	if ( plugins.dateCountdown.length ) {
		var i;
		for ( i = 0; i < plugins.dateCountdown.length; i++ ) {
			var dateCountdownItem = $( plugins.dateCountdown[ i ] ),
				time = {
					"Days": {
						"text": "Days",
						"color": "#fbc318",
						"show": true
					},
					"Hours": {
						"text": "Hours",
						"color": "#fbc318",
						"show": true
					},
					"Minutes": {
						"text": "Minutes",
						"color": "#fbc318",
						"show": true
					},
					"Seconds": {
						"text": "Seconds",
						"color": "#fbc318",
						"show": true
					}
				};
			dateCountdownItem.TimeCircles( {
				fg_width: 0.025,
				circle_bg_color: "#f4f4f4",
				bg_width: 0.5
			} );
			$( window ).on( 'load resize orientationchange', function () {
				if ( window.innerWidth < 479 ) {
					dateCountdownItem.TimeCircles( {
						time: {
							Days: {
								color: "#43d0d9",
								show: true
							},
							Hours: {
								color: "#43d0d9",
								show: true
							},
							Minutes: {
								color: "#43d0d9",
								show: true
							},
							Seconds: { show: false }
						}
					} ).rebuild();
				} else if ( window.innerWidth < 991 ) {
					dateCountdownItem.TimeCircles( {
						time: {
							Days: {
								color: "#43d0d9",
								show: true
							},
							Hours: {
								color: "#43d0d9",
								show: true
							},
							Minutes: {
								color: "#43d0d9",
								show: true
							},
							Seconds: { show: false }
						}
					} ).rebuild();
				} else {
					dateCountdownItem.TimeCircles( { time: time } ).rebuild();
				}
			} );
		}
	}

	// Progress bar
	if ( plugins.progressBar.length ) {
		for ( i = 0; i < plugins.progressBar.length; i++ ) {
			var progressBar = $( plugins.progressBar[ i ] );
			$window
				.on( "scroll load", $.proxy( function () {
					var bar = $( this );
					if ( !bar.hasClass( 'animated-first' ) && isScrolledIntoView( bar ) ) {
						var end = bar.attr( "data-to" );
						bar.find( '.progress-bar-linear' ).css( { width: end + '%' } );
						bar.find( '.progress-value' ).countTo( {
							refreshInterval: 40,
							from: 0,
							to: end,
							speed: 500
						} );
						bar.addClass( 'animated-first' );
					}
				}, progressBar ) );
		}
	}

	// UI To Top
	if ( isDesktop ) {
		$().UItoTop( {
			easingType: 'easeOutQuart',
			containerClass: 'ui-to-top fa fa-angle-up'
		} );
	}

	// RD Navbar
	if ( plugins.rdNavbar.length ) {
		plugins.rdNavbar.RDNavbar( {
			stickUpClone: (plugins.rdNavbar.attr( "data-stick-up-clone" )) ? plugins.rdNavbar.attr( "data-stick-up-clone" ) === 'true' : false
		} );
		if ( plugins.rdNavbar.attr( "data-body-class" ) ) {
			document.body.className += ' ' + plugins.rdNavbar.attr( "data-body-class" );
		}
	}

	// Swiper 3.1.7
	if ( plugins.swiper.length ) {
		var i;
		for ( i = 0; i < plugins.swiper.length; i++ ) {
			var s = $( plugins.swiper[ i ] );
			var pag = s.find( ".swiper-pagination" ),
				next = s.find( ".swiper-button-next" ),
				prev = s.find( ".swiper-button-prev" ),
				bar = s.find( ".swiper-scrollbar" ),
				parallax = s.parents( '.rd-parallax' ).length,
				swiperSlide = s.find( ".swiper-slide" );

			for ( j = 0; j < swiperSlide.length; j++ ) {
				var $this = $( swiperSlide[ j ] ),
					url;

				if ( url = $this.attr( "data-slide-bg" ) ) {
					$this.css( {
						"background-image": "url(" + url + ")",
						"background-size": "cover"
					} )
				}
			}

			swiperSlide.end()
				.find( "[data-caption-animate]" )
				.addClass( "not-animated" )
				.end()
				.swiper( {
					autoplay: s.attr( 'data-autoplay' ) ? s.attr( 'data-autoplay' ) === "false" ? undefined : s.attr( 'data-autoplay' ) : 5000,
					direction: s.attr( 'data-direction' ) ? s.attr( 'data-direction' ) : "horizontal",
					effect: s.attr( 'data-slide-effect' ) ? s.attr( 'data-slide-effect' ) : "slide",
					speed: s.attr( 'data-slide-speed' ) ? s.attr( 'data-slide-speed' ) : 600,
					keyboardControl: s.attr( 'data-keyboard' ) === "true",
					mousewheelControl: s.attr( 'data-mousewheel' ) === "true",
					mousewheelReleaseOnEdges: s.attr( 'data-mousewheel-release' ) === "true",
					nextButton: next.length ? next.get( 0 ) : null,
					prevButton: prev.length ? prev.get( 0 ) : null,
					pagination: pag.length ? pag.get( 0 ) : null,
					paginationClickable: pag.length ? pag.attr( "data-clickable" ) !== "false" : false,
					paginationBulletRender: pag.length ? pag.attr( "data-index-bullet" ) === "true" ? function ( index, className ) {
						return '<span class="' + className + '">' + (index + 1) + '</span>';
					} : null : null,
					scrollbar: bar.length ? bar.get( 0 ) : null,
					scrollbarDraggable: bar.length ? bar.attr( "data-draggable" ) !== "false" : true,
					scrollbarHide: bar.length ? bar.attr( "data-draggable" ) === "false" : false,
					loop: s.attr( 'data-loop' ) !== "false",
					simulateTouch: s.attr( 'data-simulate-touch' ) ? s.attr( 'data-simulate-touch' ) === "true" : false,
					onTransitionStart: function ( swiper ) {
						toggleSwiperInnerVideos( swiper );
					},
					onTransitionEnd: function ( swiper ) {
						toggleSwiperCaptionAnimation( swiper );
					},
					onInit: function ( swiper ) {
						toggleSwiperInnerVideos( swiper );
						toggleSwiperCaptionAnimation( swiper );

						var swiperParalax = s.find( ".swiper-parallax" );

						for ( var k = 0; k < swiperParalax.length; k++ ) {
							var $this = $( swiperParalax[ k ] ),
								speed;

							if ( parallax && !isIEBrows && !isMobile ) {
								if ( speed = $this.attr( "data-speed" ) ) {
									makeParallax( $this, speed, s, false );
								}
							}
						}
						$( window ).on( 'resize', function () {
							swiper.update( true );
						} )
					}
				} );
		}
	}

	// Swiper Gallery Top
	if ( plugins.swiperGallery.length ) {
		for ( i = 0; i < plugins.swiperGallery.length; i++ ) {
			var galleryTop = new Swiper( plugins.swiperGallery, {
				prevButton: '.swiper-button-prev',
				nextButton: '.swiper-button-next',
				spaceBetween: 0
			} );
			var galleryThumbs = new Swiper( '.gallery-thumbs', {
				spaceBetween: 0,
				centeredSlides: true,
				slidesPerView: 'auto',
				touchRatio: 0.2,
				slideToClickedSlide: true
			} );
			galleryTop.params.control = galleryThumbs;
			galleryThumbs.params.control = galleryTop;
		}
	}

	// Custom scroll
	if ( $( '#section-change-color' ).length ) {
		if ( plugins.navbarToggle.length ) {
			if ( $( window ).width() > 1182 ) {
				for ( i = 0; i < plugins.navbarToggle.length; i++ ) {
					var $navbarToggle = $( plugins.navbarToggle[ i ] ),
						$changeColor = $( '#section-change-color' ),
						$navbarToogleInv = $changeColor.offset().top - '60';

					if ( window.pageYOffset >= $navbarToogleInv ) {
						$navbarToggle.addClass( "rd-navbar-toggle-inverse" );
					}

					$( window ).on( 'scroll', function () {
						if ( window.pageYOffset >= $navbarToogleInv ) {
							$navbarToggle.addClass( "rd-navbar-toggle-inverse" );
						}
						else {
							$navbarToggle.removeClass( "rd-navbar-toggle-inverse" );
						}
					} );
				}
			}
		}
	}

	// RD Search
	if ( plugins.search.length || plugins.searchResults ) {
		var handler = "bat/rd-search.php";
		var defaultTemplate = '<h5 class="search_title"><a target="_top" href="#{href}" class="search_link">#{title}</a></h5>' +
			'<p>...#{token}...</p>' +
			'<p class="match"><em>Terms matched: #{count} - URL: #{href}</em></p>';
		var defaultFilter = '*.html';

		if ( plugins.search.length ) {

			for ( i = 0; i < plugins.search.length; i++ ) {
				var searchItem = $( plugins.search[ i ] ),
					options = {
						element: searchItem,
						filter: (searchItem.attr( 'data-search-filter' )) ? searchItem.attr( 'data-search-filter' ) : defaultFilter,
						template: (searchItem.attr( 'data-search-template' )) ? searchItem.attr( 'data-search-template' ) : defaultTemplate,
						live: (searchItem.attr( 'data-search-live' )) ? searchItem.attr( 'data-search-live' ) : false,
						liveCount: (searchItem.attr( 'data-search-live-count' )) ? parseInt( searchItem.attr( 'data-search-live' ) ) : 4,
						current: 0, processed: 0, timer: {}
					};

				if ( $( '.rd-navbar-search-toggle' ).length ) {
					var toggle = $( '.rd-navbar-search-toggle' );
					toggle.on( 'click', function () {
						if ( !($( this ).hasClass( 'active' )) ) {
							searchItem.find( 'input' ).val( '' ).trigger( 'propertychange' );
						}
					} );
				}

				if ( options.live ) {
					var clearHandler = false;

					searchItem.find( 'input' ).on( "keyup input propertychange", $.proxy( function () {
						this.term = this.element.find( 'input' ).val().trim();
						this.spin = this.element.find( '.input-group-addon' );

						clearTimeout( this.timer );

						if ( this.term.length > 2 ) {
							this.timer = setTimeout( liveSearch( this ), 200 );

							if ( clearHandler == false ) {
								clearHandler = true;

								$( "body" ).on( "click", function ( e ) {
									if ( $( e.toElement ).parents( '.rd-search' ).length == 0 ) {
										$( '#rd-search-results-live' ).addClass( 'cleared' ).html( '' );
									}
								} )
							}

						} else if ( this.term.length == 0 ) {
							$( '#' + this.live ).addClass( 'cleared' ).html( '' );
						}
					}, options, this ) );
				}

				searchItem.submit( $.proxy( function () {
					$( '<input />' ).attr( 'type', 'hidden' )
						.attr( 'name', "filter" )
						.attr( 'value', this.filter )
						.appendTo( this.element );
					return true;
				}, options, this ) )
			}
		}

		if ( plugins.searchResults.length ) {
			var regExp = /\?.*s=([^&]+)\&filter=([^&]+)/g;
			var match = regExp.exec( location.search );

			if ( match != null ) {
				$.get( handler, {
					s: decodeURI( match[ 1 ] ),
					dataType: "html",
					filter: match[ 2 ],
					template: defaultTemplate,
					live: ''
				}, function ( data ) {
					plugins.searchResults.html( data );
				} )
			}
		}
	}

	// Owl carousel
	if ( plugins.owl.length ) {
		var k;
		for ( k = 0; k < plugins.owl.length; k++ ) {
			var c = $( plugins.owl[ k ] ),
				responsive = {};

			var aliaces = [ "-", "-xs-", "-sm-", "-md-", "-lg-" ],
				values = [ 0, 480, 768, 992, 1200 ],
				i, j;

			for ( i = 0; i < values.length; i++ ) {
				responsive[ values[ i ] ] = {};
				for ( j = i; j >= -1; j-- ) {
					if ( !responsive[ values[ i ] ][ "items" ] && c.attr( "data" + aliaces[ j ] + "items" ) ) {
						responsive[ values[ i ] ][ "items" ] = j < 0 ? 1 : parseInt( c.attr( "data" + aliaces[ j ] + "items" ) );
					}
					if ( !responsive[ values[ i ] ][ "stagePadding" ] && responsive[ values[ i ] ][ "stagePadding" ] !== 0 && c.attr( "data" + aliaces[ j ] + "stage-padding" ) ) {
						responsive[ values[ i ] ][ "stagePadding" ] = j < 0 ? 0 : parseInt( c.attr( "data" + aliaces[ j ] + "stage-padding" ) );
					}
					if ( !responsive[ values[ i ] ][ "margin" ] && responsive[ values[ i ] ][ "margin" ] !== 0 && c.attr( "data" + aliaces[ j ] + "margin" ) ) {
						responsive[ values[ i ] ][ "margin" ] = j < 0 ? 30 : parseInt( c.attr( "data" + aliaces[ j ] + "margin" ) );
					}
					if ( !responsive[ values[ i ] ][ "dotsEach" ] && responsive[ values[ i ] ][ "dotsEach" ] !== 0 && c.attr( "data" + aliaces[ j ] + "dots-each" ) ) {
						responsive[ values[ i ] ][ "dotsEach" ] = j < 0 ? false : parseInt( c.attr( "data" + aliaces[ j ] + "dots-each" ) );
					}
				}
			}

			// Create custom Pagination
			if ( c.attr( 'data-dots-custom' ) ) {
				c.on( "initialized.owl.carousel", function ( event ) {
					var carousel = $( event.currentTarget ),
						customPag = $( carousel.attr( "data-dots-custom" ) ),
						active = 0;

					if ( carousel.attr( 'data-active' ) ) {
						active = parseInt( carousel.attr( 'data-active' ) );
					}

					carousel.trigger( 'to.owl.carousel', [ active, 300, true ] );
					customPag.find( "[data-owl-item='" + active + "']" ).addClass( "active" );

					customPag.find( "[data-owl-item]" ).on( 'click', function ( e ) {
						e.preventDefault();
						carousel.trigger( 'to.owl.carousel', [ parseInt( this.getAttribute( "data-owl-item" ) ), 300, true ] );
					} );

					carousel.on( "translate.owl.carousel", function ( event ) {
						customPag.find( ".active" ).removeClass( "active" );
						customPag.find( "[data-owl-item='" + event.item.index + "']" ).addClass( "active" )
					} );
				} );
			}

			// Create custom Navigation
			if ( c.attr( 'data-nav-custom' ) ) {
				c.on( "initialized.owl.carousel", function ( event ) {
					var carousel = $( event.currentTarget ),
						customNav = $( carousel.attr( "data-nav-custom" ) );

					customNav.find( "[data-owl-prev]" ).on( 'click', function ( e ) {
						e.preventDefault();
						carousel.trigger( 'prev.owl.carousel', [ 300 ] );
					} );

					customNav.find( "[data-owl-next]" ).on( 'click', function ( e ) {
						e.preventDefault();
						carousel.trigger( 'next.owl.carousel', [ 300 ] );
					} );
				} );
			}

			c.owlCarousel( {
				autoplay: c.attr( "data-autoplay" ) === "true",
				loop: c.attr( "data-loop" ) === "true",
				items: 1,
				autoplaySpeed: 600,
				autoplayTimeout: 3000,
				dotsContainer: c.attr( "data-pagination-class" ) || false,
				navContainer: c.attr( "data-navigation-class" ) || false,
				mouseDrag: c.attr( "data-mouse-drag" ) === "true",
				nav: c.attr( "data-nav" ) === "true",
				dots: c.attr( "data-dots" ) === "true",
				dotsEach: c.attr( "data-dots-each" ) ? parseInt( c.attr( "data-dots-each" ) ) : false,
				responsive: responsive,
				animateIn: c.attr( "data-animation-in" ) || false,
				animateOut: c.attr( "data-animation-out" ) || false,
				navText: $.parseJSON( c.attr( "data-nav-text" ) ) || [],
				navClass: $.parseJSON( c.attr( "data-nav-class" ) ) || [ 'owl-prev', 'owl-next' ]
			} );

		}
	}

	// jQuery Count To
	if ( plugins.counter.length ) {
		var i;

		for ( i = 0; i < plugins.counter.length; i++ ) {
			var $counterNotAnimated = $( plugins.counter[ i ] ).not( '.animated' );
			$document
				.on( "scroll", $.proxy( function () {
					var $this = this;

					if ( (!$this.hasClass( "animated" )) && (isScrolledIntoView( $this )) ) {
						$this.countTo( {
							refreshInterval: 40,
							speed: $this.attr( "data-speed" ) || 1000
						} );
						$this.addClass( 'animated' );
					}
				}, $counterNotAnimated ) )
				.trigger( "scroll" );
		}
	}

	// WOW
	if ( isDesktop && $html.hasClass( "wow-animation" ) && $( ".wow" ).length ) {
		new WOW().init();
	}

	// RD Input Label
	if ( plugins.rdInputLabel.length ) {
		plugins.rdInputLabel.RDInputLabel();
	}

	// Regula
	if ( plugins.regula.length ) {
		attachFormValidator( plugins.regula );
	}

	// RD Mailform
	if ( plugins.rdMailForm.length ) {
		var i, j, k,
			msg = {
				'MF000': 'Successfully sent!',
				'MF001': 'Recipients are not set!',
				'MF002': 'Form will not work locally!',
				'MF003': 'Please, define email field in your form!',
				'MF004': 'Please, define type of your form!',
				'MF254': 'Something went wrong with PHPMailer!',
				'MF255': 'Aw, snap! Something went wrong.'
			};

		for ( i = 0; i < plugins.rdMailForm.length; i++ ) {
			var $form = $( plugins.rdMailForm[ i ] ),
				formHasCaptcha = false;

			$form.attr( 'novalidate', 'novalidate' ).ajaxForm( {
				data: {
					"form-type": $form.attr( "data-form-type" ) || "contact",
					"counter": i
				},
				beforeSubmit: function ( arr, $form, options ) {

					var form = $( plugins.rdMailForm[ this.extraData.counter ] ),
						inputs = form.find( "[data-constraints]" ),
						output = $( "#" + form.attr( "data-form-output" ) ),
						captcha = form.find( '.recaptcha' ),
						captchaFlag = true;

					output.removeClass( "active error success" );

					if ( isValidated( inputs, captcha ) ) {

						// veify reCaptcha
						if ( captcha.length ) {
							var captchaToken = captcha.find( '.g-recaptcha-response' ).val(),
								captchaMsg = {
									'CPT001': 'Please, setup you "site key" and "secret key" of reCaptcha',
									'CPT002': 'Something wrong with google reCaptcha'
								};

							formHasCaptcha = true;

							$.ajax( {
								method: "POST",
								url: "bat/reCaptcha.php",
								data: { 'g-recaptcha-response': captchaToken },
								async: false
							} )
								.done( function ( responceCode ) {
									if ( responceCode !== 'CPT000' ) {
										if ( output.hasClass( "snackbars" ) ) {
											output.html( '<p><span class="icon text-middle mdi mdi-check icon-xxs"></span><span>' + captchaMsg[ responceCode ] + '</span></p>' )

											setTimeout( function () {
												output.removeClass( "active" );
											}, 3500 );

											captchaFlag = false;
										} else {
											output.html( captchaMsg[ responceCode ] );
										}

										output.addClass( "active" );
									}
								} );
						}

						if ( !captchaFlag ) {
							return false;
						}

						form.addClass( 'form-in-process' );

						if ( output.hasClass( "snackbars" ) ) {
							output.html( '<p><span class="icon text-middle fa fa-circle-o-notch fa-spin icon-xxs"></span><span>Sending</span></p>' );
							output.addClass( "active" );
						}
					} else {
						return false;
					}
				},
				error: function ( result ) {

					var output = $( "#" + $( plugins.rdMailForm[ this.extraData.counter ] ).attr( "data-form-output" ) ),
						form = $( plugins.rdMailForm[ this.extraData.counter ] );

					output.text( msg[ result ] );
					form.removeClass( 'form-in-process' );

					if ( formHasCaptcha ) {
						grecaptcha.reset();
					}
				},
				success: function ( result ) {

					var form = $( plugins.rdMailForm[ this.extraData.counter ] ),
						output = $( "#" + form.attr( "data-form-output" ) ),
						select = form.find( 'select' );

					form
						.addClass( 'success' )
						.removeClass( 'form-in-process' );

					if ( formHasCaptcha ) {
						grecaptcha.reset();
					}

					result = result.length === 5 ? result : 'MF255';
					output.text( msg[ result ] );

					if ( result === "MF000" ) {
						if ( output.hasClass( "snackbars" ) ) {
							output.html( '<p><span class="icon text-middle mdi mdi-check icon-xxs"></span><span>' + msg[ result ] + '</span></p>' );
						} else {
							output.addClass( "active success" );
						}
					} else {
						if ( output.hasClass( "snackbars" ) ) {
							output.html( ' <p class="snackbars-left"><span class="icon icon-xxs mdi mdi-alert-outline text-middle"></span><span>' + msg[ result ] + '</span></p>' );
						} else {
							output.addClass( "active error" );
						}
					}

					form.clearForm();

					if ( select.length ) {
						select.select2( "val", "" );
					}

					form.find( 'input, textarea' ).trigger( 'blur' );

					setTimeout( function () {
						output.removeClass( "active error success" );
						form.removeClass( 'success' );
					}, 3500 );
				}
			} );
		}
	}

	// PhotoSwipe Gallery
	if ( plugins.photoSwipeGallery.length ) {

		// init image click event
		$document.delegate( "[data-photo-swipe-item]", "click", function ( event ) {
			event.preventDefault();

			var $el = $( this ),
				$galleryItems = $el.parents( "[data-photo-swipe-gallery]" ).find( "a[data-photo-swipe-item]" ),
				pswpElement = document.querySelectorAll( '.pswp' )[ 0 ],
				encounteredItems = {},
				pswpItems = [],
				options,
				pswpIndex = 0,
				pswp;

			if ( $galleryItems.length == 0 ) {
				$galleryItems = $el;
			}

			// loop over the gallery to build up the photoswipe items
			$galleryItems.each( function () {
				var $item = $( this ),
					src = $item.attr( 'href' ),
					size = $item.attr( 'data-size' ).split( 'x' ),
					pswdItem;

				if ( $item.is( ':visible' ) ) {

					// if we have this image the first time
					if ( !encounteredItems[ src ] ) {
						// build the photoswipe item
						pswdItem = {
							src: src,
							w: parseInt( size[ 0 ], 10 ),
							h: parseInt( size[ 1 ], 10 ),
							el: $item // save link to element for getThumbBoundsFn
						};

						// store that we already had this item
						encounteredItems[ src ] = {
							item: pswdItem,
							index: pswpIndex
						};

						// push the item to the photoswipe list
						pswpItems.push( pswdItem );
						pswpIndex++;
					}
				}
			} );

			options = {
				index: encounteredItems[ $el.attr( 'href' ) ].index,

				getThumbBoundsFn: function ( index ) {
					var $el = pswpItems[ index ].el,
						offset = $el.offset();

					return {
						x: offset.left,
						y: offset.top,
						w: $el.width()
					};
				}
			};

			// open the photoswipe gallery
			pswp = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, pswpItems, options );
			pswp.init();
		} );
	}

	// Custom Waypoints
	if ( plugins.customWaypoints.length ) {
		var i;
		for ( i = 0; i < plugins.customWaypoints.length; i++ ) {
			var $this = $( plugins.customWaypoints[ i ] );

			$this.on( 'click', function ( e ) {
				e.preventDefault();
				$( "body, html" ).stop().animate( {
					scrollTop: $( "#" + $( this ).attr( 'data-custom-scroll-to' ) ).offset().top
				}, 1000, function () {
					$( window ).trigger( "resize" );
				} );
			} );
		}
	}

	// Material Parallax
	if ( plugins.materialParallax.length ) {
		if ( !isIE && !isMobile ) {
			plugins.materialParallax.parallax();
		} else {
			for ( var i = 0; i < plugins.materialParallax.length; i++ ) {
				var parallax = $( plugins.materialParallax[ i ] ),
					imgPath = parallax.data( "parallax-img" );

				parallax.css( {
					"background-image": 'url(' + imgPath + ')',
					"background-attachment": "fixed",
					"background-size": "cover"
				} );
			}
		}
	}
} );

