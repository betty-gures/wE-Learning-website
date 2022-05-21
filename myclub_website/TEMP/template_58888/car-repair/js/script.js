"use strict";

(function () {
	// Global variables
	var
		userAgent = navigator.userAgent.toLowerCase(),
		initialDate = new Date(),

		$window = $( window ),
		$document = $( document ),
		$html = $( 'html' ),

		isDesktop = $html.hasClass( "desktop" ),
		isIE = userAgent.indexOf( "msie" ) != -1 ? parseInt( userAgent.split( "msie" )[ 1 ], 10 ) : userAgent.indexOf( "trident" ) != -1 ? 11 : userAgent.indexOf( "edge" ) != -1 ? 12 : false,
		isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test( navigator.userAgent ),
		plugins = {
			materialParallax: $( ".parallax-container" ),
			copyrightYear: $( "#copyright-year" ),
			owl: $( ".owl-carousel" ),
			camera: $( '.camera_wrap' ),
			maps: $( ".google-map-container" ),
			equalHeights: $( "[data-equal-group]" ),
			bootstrapDateTimePicker: $( "[data-time-picker]" ),
			selectFilter: $( "select" ),
			rdMailForm: $( ".rd-mailform" ),
			rdInputLabel: $( ".form-label" ),
			regula: $( "[data-constraints]" ),
			radio: $( "input[type='radio']" ),
			checkbox: $( "input[type='checkbox']" ),
			captcha: $( '.recaptcha' )
		};

	$document.ready( function () {
		var isNoviBuilder = window.xMode;

		// IE Polyfills
		if ( isIE ) {
			if ( isIE < 11 ) $html.addClass( "lt-ie11" );
			if ( isIE === 11 ) $html.addClass( "ie-11" );
			if ( isIE === 12 ) $html.addClass( "ie-edge" );
		}

		// isScrolledIntoView
		function isScrolledIntoView ( elem ) {
			if ( !isNoviBuilder ) {
				return elem.offset().top + elem.outerHeight() >= $window.scrollTop() && elem.offset().top <= $window.scrollTop() + $window.height();
			}
			else {
				return true;
			}
		}

		// initOnView
		function lazyInit ( element, func ) {
			var $win = jQuery( window );
			$win.on( 'load scroll', function () {
				if ( (!element.hasClass( 'lazy-loaded' ) && (isScrolledIntoView( element ))) ) {
					func.call();
					element.addClass( 'lazy-loaded' );
				}
			} );
		}

		// Google map function for getting latitude and longitude
		function getLatLngObject ( str, marker, map, callback ) {
			var coordinates = {};
			try {
				coordinates = JSON.parse( str );
				callback( new google.maps.LatLng(
					coordinates.lat,
					coordinates.lng
				), marker, map )
			} catch ( e ) {
				map.geocoder.geocode( { 'address': str }, function ( results, status ) {
					if ( status === google.maps.GeocoderStatus.OK ) {
						var latitude = results[ 0 ].geometry.location.lat();
						var longitude = results[ 0 ].geometry.location.lng();

						callback( new google.maps.LatLng(
							parseFloat( latitude ),
							parseFloat( longitude )
						), marker, map )
					}
				} )
			}
		}

		// initOwlCarousel
		function initOwlCarousel ( c ) {
			var aliaces = [ "-", "-xs-", "-sm-", "-md-", "-lg-", "-xl-" ],
				values = [ 0, 480, 768, 992, 1200, 1600 ],
				responsive = {},
				j, k;

			for ( j = 0; j < values.length; j++ ) {
				responsive[ values[ j ] ] = {};
				for ( k = j; k >= -1; k-- ) {
					if ( !responsive[ values[ j ] ][ "items" ] && c.attr( "data" + aliaces[ k ] + "items" ) ) {
						responsive[ values[ j ] ][ "items" ] = k < 0 ? 1 : parseInt( c.attr( "data" + aliaces[ k ] + "items" ), 10 );
					}
					if ( !responsive[ values[ j ] ][ "stagePadding" ] && responsive[ values[ j ] ][ "stagePadding" ] !== 0 && c.attr( "data" + aliaces[ k ] + "stage-padding" ) ) {
						responsive[ values[ j ] ][ "stagePadding" ] = k < 0 ? 0 : parseInt( c.attr( "data" + aliaces[ k ] + "stage-padding" ), 10 );
					}
					if ( !responsive[ values[ j ] ][ "margin" ] && responsive[ values[ j ] ][ "margin" ] !== 0 && c.attr( "data" + aliaces[ k ] + "margin" ) ) {
						responsive[ values[ j ] ][ "margin" ] = k < 0 ? 30 : parseInt( c.attr( "data" + aliaces[ k ] + "margin" ), 10 );
					}
				}
			}

			// Enable custom pagination
			if ( c.attr( 'data-dots-custom' ) ) {
				c.on( "initialized.owl.carousel", function ( event ) {
					var carousel = $( event.currentTarget ),
						customPag = $( carousel.attr( "data-dots-custom" ) ),
						active = 0;

					if ( carousel.attr( 'data-active' ) ) {
						active = parseInt( carousel.attr( 'data-active' ), 10 );
					}

					carousel.trigger( 'to.owl.carousel', [ active, 300, true ] );
					customPag.find( "[data-owl-item='" + active + "']" ).addClass( "active" );

					customPag.find( "[data-owl-item]" ).on( 'click', function ( e ) {
						e.preventDefault();
						carousel.trigger( 'to.owl.carousel', [ parseInt( this.getAttribute( "data-owl-item" ), 10 ), 300, true ] );
					} );

					carousel.on( "translate.owl.carousel", function ( event ) {
						customPag.find( ".active" ).removeClass( "active" );
						customPag.find( "[data-owl-item='" + event.item.index + "']" ).addClass( "active" )
					} );
				} );
			}

			c.owlCarousel( {
				autoplay: isNoviBuilder ? false : c.attr( "data-autoplay" ) === "true",
				loop: isNoviBuilder ? false : c.attr( "data-loop" ) !== "false",
				items: 1,
				dotsContainer: c.attr( "data-pagination-class" ) || false,
				navContainer: c.attr( "data-navigation-class" ) || false,
				mouseDrag: isNoviBuilder ? false : c.attr( "data-mouse-drag" ) !== "false",
				nav: c.attr( "data-nav" ) === "true",
				dots: ( isNoviBuilder && c.attr( "data-nav" ) !== "true" ) ? true : c.attr( "data-dots" ) === "true",
				dotsEach: c.attr( "data-dots-each" ) ? parseInt( c.attr( "data-dots-each" ), 10 ) : false,
				animateIn: c.attr( 'data-animation-in' ) ? c.attr( 'data-animation-in' ) : false,
				animateOut: c.attr( 'data-animation-out' ) ? c.attr( 'data-animation-out' ) : false,
				responsive: responsive,
				navText: c.attr( "data-nav-text" ) ? $.parseJSON( c.attr( "data-nav-text" ) ) : [],
				navClass: c.attr( "data-nav-class" ) ? $.parseJSON( c.attr( "data-nav-class" ) ) : [ 'owl-prev', 'owl-next' ]
			} );
		}

		// attachFormValidator
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

					if ( e.type != "blur" ) {
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


		// validateReCaptcha
		function validateReCaptcha ( captcha ) {
			var $captchaToken = captcha.find( '.g-recaptcha-response' ).val();

			if ( $captchaToken == '' ) {
				captcha
					.siblings( '.form-validation' )
					.html( 'Please, prove that you are not robot.' )
					.addClass( 'active' );
				captcha
					.closest( '.form-group' )
					.addClass( 'has-error' );

				captcha.on( 'propertychange', function () {
					var $this = $( this ),
						$captchaToken = $this.find( '.g-recaptcha-response' ).val();

					if ( $captchaToken != '' ) {
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

		// isValidated
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


		// onloadCaptchaCallback
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


		// To top
		if ( !isNoviBuilder && isDesktop ) {
			$().UItoTop( {
				easingType: 'easeOutQuart',
				containerClass: 'toTop fa fa-angle-up'
			} );
		}


		// WOW
		if ( !isNoviBuilder && !isIE && isDesktop ) {
			new WOW().init();
		}

		// EqualHeights
		if ( plugins.equalHeights.length > 0 ) {
			plugins.equalHeights.equalHeightsInit()
		}


		// Copyright Year
		if ( plugins.copyrightYear.length ) {
			plugins.copyrightYear.text( initialDate.getFullYear() );
		}


		// Owl Carousel
		if ( plugins.owl.length ) {
			for ( var i = 0; i < plugins.owl.length; i++ ) {
				var c = $( plugins.owl[ i ] );
				plugins.owl[ i ] = c;

				//skip owl in bootstrap tabs
				if ( !c.parents( '.tab-content' ).length ) {
					initOwlCarousel( c );
				}
			}
		}


		// Camera
		if ( plugins.camera.length ) {
			//if( !isIE ) jqueryMobileCustomized();

			$document.ready( function () {
				plugins.camera.camera( {
					autoAdvance: false,
					height: '40.91796875%',
					minHeight: '725px',
					pagination: true,
					thumbnails: false,
					playPause: false,
					hover: false,
					loader: 'none',
					navigation: false,
					navigationHover: true,
					mobileNavHover: false,
					time: 4000,
					transPeriod: 1000,
					fx: 'bottomLeftTopRight'
				} )
			} );
		}


		// Material Parallax
		if ( plugins.materialParallax.length ) {
			var i;

			if ( !isNoviBuilder && !isIE && !isMobile ) {
				plugins.materialParallax.parallax();
			} else {
				for ( i = 0; i < plugins.materialParallax.length; i++ ) {
					var parallax = $( plugins.materialParallax[ i ] ),
						imgPath = parallax.data( "parallax-img" );

					parallax.css( {
						"background-image": 'url(' + imgPath + ')',
						"background-attachment": "fixed",
						"background-size": "cover",
						"background-position": "center center"
					} );
				}
			}
		}


		// Google Maps
		if ( plugins.maps.length ) {
			var key;

			for ( var i = 0; i < plugins.maps.length; i++ ) {
				if ( plugins.maps[ i ].hasAttribute( "data-key" ) ) {
					key = plugins.maps[ i ].getAttribute( "data-key" );
					break;
				}
			}

			$.getScript( '//maps.google.com/maps/api/js?' + ( key ? 'key=' + key + '&' : '' ) + 'sensor=false&libraries=geometry,places&v=3.7', function () {
				var head = document.getElementsByTagName( 'head' )[ 0 ],
					insertBefore = head.insertBefore;

				head.insertBefore = function ( newElement, referenceElement ) {
					if ( newElement.href && newElement.href.indexOf( '//fonts.googleapis.com/css?family=Roboto' ) !== -1 || newElement.innerHTML.indexOf( 'gm-style' ) !== -1 ) {
						return;
					}
					insertBefore.call( head, newElement, referenceElement );
				};
				var geocoder = new google.maps.Geocoder;
				for ( var i = 0; i < plugins.maps.length; i++ ) {
					var zoom = parseInt( plugins.maps[ i ].getAttribute( "data-zoom" ), 10 ) || 11;
					var styles = plugins.maps[ i ].hasAttribute( 'data-styles' ) ? JSON.parse( plugins.maps[ i ].getAttribute( "data-styles" ) ) : [];
					var center = plugins.maps[ i ].getAttribute( "data-center" ) || "New York";

					// Initialize map
					var map = new google.maps.Map( plugins.maps[ i ].querySelectorAll( ".google-map" )[ 0 ], {
						zoom: zoom,
						styles: styles,
						scrollwheel: false,
						center: { lat: 0, lng: 0 }
					} );

					// Add map object to map node
					plugins.maps[ i ].map = map;
					plugins.maps[ i ].geocoder = geocoder;
					plugins.maps[ i ].google = google;

					// Get Center coordinates from attribute
					getLatLngObject( center, null, plugins.maps[ i ], function ( location, markerElement, mapElement ) {
						mapElement.map.setCenter( location );
					} );

					// Add markers from google-map-markers array
					var markerItems = plugins.maps[ i ].querySelectorAll( ".google-map-markers li" );

					if ( markerItems.length ) {
						var markers = [];
						for ( var j = 0; j < markerItems.length; j++ ) {
							var markerElement = markerItems[ j ];
							getLatLngObject( markerElement.getAttribute( "data-location" ), markerElement, plugins.maps[ i ], function ( location, markerElement, mapElement ) {
								var icon = markerElement.getAttribute( "data-icon" ) || mapElement.getAttribute( "data-icon" );
								var activeIcon = markerElement.getAttribute( "data-icon-active" ) || mapElement.getAttribute( "data-icon-active" );
								var info = markerElement.getAttribute( "data-description" ) || "";
								var infoWindow = new google.maps.InfoWindow( {
									content: info
								} );
								markerElement.infoWindow = infoWindow;
								var markerData = {
									position: location,
									map: mapElement.map
								}
								if ( icon ) {
									markerData.icon = icon;
								}
								var marker = new google.maps.Marker( markerData );
								markerElement.gmarker = marker;
								markers.push( { markerElement: markerElement, infoWindow: infoWindow } );
								marker.isActive = false;
								// Handle infoWindow close click
								google.maps.event.addListener( infoWindow, 'closeclick', (function ( markerElement, mapElement ) {
									var markerIcon = null;
									markerElement.gmarker.isActive = false;
									markerIcon = markerElement.getAttribute( "data-icon" ) || mapElement.getAttribute( "data-icon" );
									markerElement.gmarker.setIcon( markerIcon );
								}).bind( this, markerElement, mapElement ) );


								// Set marker active on Click and open infoWindow
								google.maps.event.addListener( marker, 'click', (function ( markerElement, mapElement ) {
									if ( markerElement.infoWindow.getContent().length === 0 ) return;
									var gMarker, currentMarker = markerElement.gmarker, currentInfoWindow;
									for ( var k = 0; k < markers.length; k++ ) {
										var markerIcon;
										if ( markers[ k ].markerElement === markerElement ) {
											currentInfoWindow = markers[ k ].infoWindow;
										}
										gMarker = markers[ k ].markerElement.gmarker;
										if ( gMarker.isActive && markers[ k ].markerElement !== markerElement ) {
											gMarker.isActive = false;
											markerIcon = markers[ k ].markerElement.getAttribute( "data-icon" ) || mapElement.getAttribute( "data-icon" )
											gMarker.setIcon( markerIcon );
											markers[ k ].infoWindow.close();
										}
									}

									currentMarker.isActive = !currentMarker.isActive;
									if ( currentMarker.isActive ) {
										if ( markerIcon = markerElement.getAttribute( "data-icon-active" ) || mapElement.getAttribute( "data-icon-active" ) ) {
											currentMarker.setIcon( markerIcon );
										}

										currentInfoWindow.open( map, marker );
									} else {
										if ( markerIcon = markerElement.getAttribute( "data-icon" ) || mapElement.getAttribute( "data-icon" ) ) {
											currentMarker.setIcon( markerIcon );
										}
										currentInfoWindow.close();
									}
								}).bind( this, markerElement, mapElement ) )
							} )
						}
					}
				}
			} );
		}


		// RD Input Label
		if ( plugins.rdInputLabel.length ) {
			plugins.rdInputLabel.RDInputLabel();
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


		// Regula
		if ( plugins.regula.length ) {
			attachFormValidator( plugins.regula );
		}


		// Google ReCaptcha
		if ( plugins.captcha.length ) {
			$.getScript( "//www.google.com/recaptcha/api.js?onload=onloadCaptchaCallback&render=explicit&hl=en" );
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
				},
				recipients = 'demo@link.com';

			for ( i = 0; i < plugins.rdMailForm.length; i++ ) {
				var $form = $( plugins.rdMailForm[ i ] ),
					formHasCaptcha = false;

				$form.attr( 'novalidate', 'novalidate' ).ajaxForm( {
					data: {
						"form-type": $form.attr( "data-form-type" ) || "contact",
						"recipients": recipients,
						"counter": i
					},
					beforeSubmit: function ( arr, $form, options ) {
						if ( isNoviBuilder )
							return;

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
									}

								formHasCaptcha = true;

								$.ajax( {
									method: "POST",
									url: "bat/reCaptcha.php",
									data: { 'g-recaptcha-response': captchaToken },
									async: false
								} )
									.done( function ( responceCode ) {
										if ( responceCode != 'CPT000' ) {
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
								output.html( '<p><span class="icon icon-xxs fa fa-circle-o-notch fa-spin"></span><span>Sending</span></p>' );
								output.addClass( "active" );
							}
						} else {
							return false;
						}
					},
					error: function ( result ) {
						if ( isNoviBuilder )
							return;

						var output = $( "#" + $( plugins.rdMailForm[ this.extraData.counter ] ).attr( "data-form-output" ) ),
							form = $( plugins.rdMailForm[ this.extraData.counter ] );

						output.text( msg[ result ] );
						form.removeClass( 'form-in-process' );

						if ( formHasCaptcha ) {
							grecaptcha.reset();
						}
					},
					success: function ( result ) {
						if ( isNoviBuilder )
							return;

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
								output.html( '<p><span class="icon icon-xxs fa-check"></span><span>' + msg[ result ] + '</span></p>' );
							} else {
								output.addClass( "active success" );
							}
						} else {
							if ( output.hasClass( "snackbars" ) ) {
								output.html( ' <p class="snackbars-left"><span class="icon icon-xxs fa-exclamation-triangle"></span><span>' + msg[ result ] + '</span></p>' );
							} else {
								output.addClass( "active error" );
							}
						}

						form.clearForm();
						form.find( 'input, textarea' ).trigger( 'blur' );

						if ( select.length ) {
							select.select2( "val", "" );
						}

						setTimeout( function () {
							output.removeClass( "active error success" );
							form.removeClass( 'success' );
						}, 3500 );
					}
				} );
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


		// Select2
		if ( plugins.selectFilter.length ) {
			for ( var i = 0; i < plugins.selectFilter.length; i++ ) {
				var $select = $( plugins.selectFilter[ i ] );

				$select.select2( {
					minimumResultsForSearch: Infinity,
					dropdownParent: $( 'body' )
				} );
			}
		}

	} );
}());
