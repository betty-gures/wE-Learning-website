/**
 * Global variables
 */
"use strict";

var userAgent = navigator.userAgent.toLowerCase(),
	initialDate = new Date(),

	$document = $(document),
	$window = $(window),
	$html = $("html"),

	isDesktop = $html.hasClass("desktop"),
	isIE = userAgent.indexOf("msie") != -1 ? parseInt(userAgent.split("msie")[1]) : userAgent.indexOf("trident") != -1 ? 11 : userAgent.indexOf("edge") != -1 ? 12 : false,
	isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
	isTouch = "ontouchstart" in window,
	c3ChartsArray = [],
	livedemo = false,
	isNoviBuilder,

	plugins = {
		pointerEvents: isIE < 11 ? "js/pointer-events.min.js" : false,
		bootstrapTooltip: $("[data-toggle='tooltip']"),
		bootstrapTabs: $(".tabs"),
		rdParallax: $(".rd-parallax"),
		materialParallax: $(".parallax-container"),
		rdAudioPlayer: $(".rd-audio"),
		rdVideoPlayer: $(".rd-video-player"),
		responsiveTabs: $(".responsive-tabs"),
		rdNavbar: $(".rd-navbar"),
		rdVideoBG: $(".rd-video"),
		stepper: $("input[type='number']"),
		toggles: $(".toggle-custom"),
		textRotator: $(".text-rotator"),
		owl: $(".owl-carousel"),
		swiper: $(".swiper-slider"),
		counter: $(".counter"),
		flickrfeed: $(".flickr"),
		twitterfeed: $(".twitter"),
		progressBar: $(".progress-linear"),
		circleProgress: $(".progress-bar-circle"),
		isotope: $(".isotope"),
		countDown: $(".countdown"),
		stacktable: $("table[data-responsive='true']"),
		customToggle: $("[data-custom-toggle]"),
		customWaypoints: $('[data-waypoint-to]'),
		resizable: $(".resizable"),
		selectFilter: $("select"),
		calendar: $(".rd-calendar"),
		productThumb: $(".product-thumbnails"),
		imgZoom: $(".img-zoom"),
		pageLoader: $(".page-loader"),
		search: $(".rd-search"),
		searchResults: $('.rd-search-results'),
		iframeEmbed: $("iframe.embed-responsive-item"),
		bootstrapDateTimePicker: $("[data-time-picker]"),
		checkoutRDTabs: $(".checkout-tabs"),
		higCharts: {
			charts: $(".higchart"),
			legend: $(".chart-legend")
		},
		d3Charts: $('.d3-chart'),
		flotCharts: $('.flot-chart'),
		captcha: $('.recaptcha'),
		galleryRDTabs: $(".gallery-tabs"),
		revolution: $("#rev_slider_1"),
		tilter: $(".tilter"),
		copyrightYear: $(".copyright-year"),
		videBG: $('.bg-vide'),
		rdInputLabel: $(".form-label"),
		regula: $("[data-constraints]"),
		rdMailForm: $(".rd-mailform"),
		mailchimp: $('.mailchimp-mailform'),
		campaignMonitor: $('.campaign-mailform'),
		canvasbg: $('#demo-canvas'),
		particlesContainer: $('#particles-container'),
		maps: $(".google-map-container"),
		lightGallery: $("[data-lightgallery='group']"),
		lightGalleryItem: $("[data-lightgallery='item']"),
		lightDynamicGalleryItem: $("[data-lightgallery='dynamic']")
	};

/**
 * isScrolledIntoView
 * @description  check the element whas been scrolled into the view
 */
function isScrolledIntoView(elem) {
	return elem.offset().top + elem.outerHeight() >= $window.scrollTop() && elem.offset().top <= $window.scrollTop() + $window.height();
}


$window.on( 'load', function() {
	// Progress bar
	if ( plugins.progressBar.length ) {
		for ( var i = 0; i < plugins.progressBar.length; i++) {
			var
				bar = $(plugins.progressBar[i]),
				initProgress = function() {
					var
						bar = $(this),
						end = bar.attr("data-to");

					if ( !bar.hasClass( "animated-first" ) && isScrolledIntoView( bar ) ) {
						bar.find('.progress-bar-linear').css({width: end + '%'});
						bar.find('.progress-value').countTo({
							refreshInterval: 40,
							from: 0,
							to: end,
							speed: 500
						});
						bar.addClass('animated-first');
					}
				};

			$.proxy( initProgress, bar )();
			$window.on( "scroll", $.proxy( initProgress, bar ) );
		}
	}

	// jQuery Count To
	if ( plugins.counter.length ) {
		for ( var i = 0; i < plugins.counter.length; i++ ) {
			var
				counter = $(plugins.counter[i]),
				initCount = function () {
					var counter = $(this);
					if ( !counter.hasClass( "animated-first" ) && isScrolledIntoView( counter ) ) {
						counter.countTo({
							refreshInterval: 40,
							speed: counter.attr("data-speed") || 1000
						});
						counter.addClass('animated-first');
					}
				};

			$.proxy( initCount, counter )();
			$window.on( "scroll", $.proxy( initCount, counter ) );
		}
	}

	// Circle Progress
	if ( plugins.circleProgress.length ) {
		for ( var i = 0; i < plugins.circleProgress.length; i++ ) {
			var circle = $(plugins.circleProgress[i]);

			circle.circleProgress({
				value: circle.attr('data-value'),
				size: circle.attr('data-size') ? circle.attr('data-size') : 175,
				fill: {
					gradient: circle.attr('data-gradient').split(","),
					gradientAngle: Math.PI / 4
				},
				startAngle: -Math.PI / 4 * 2,
				emptyFill: circle.attr('data-empty-fill') ? circle.attr('data-empty-fill') : "rgb(245,245,245)"
			}).on('circle-animation-progress', function (event, progress, stepValue) {
				$(this).find('span').text( String(stepValue.toFixed(2)).replace('0.', '').replace('1.', '1') );
			});

			if ( isScrolledIntoView( circle ) ) circle.addClass('animated-first');

			$window.on( 'scroll', $.proxy( function() {
				var circle = $(this);
				if ( !circle.hasClass( "animated-first" ) && isScrolledIntoView( circle ) ) {
					circle.circleProgress( 'redraw' );
					circle.addClass( 'animated-first' );
				}
			}, circle ) );
		}
	}
});


$document.ready( function () {
	isNoviBuilder = window.xMode;

	/**
	 * initOnView
	 * @description  calls a function when element has been scrolled into the view
	 */
	function lazyInit( element, func ) {
		var init = function () {
			if ( !element.hasClass( 'lazy-loaded' ) && isScrolledIntoView( element ) ) {
				func.call( element );
				element.addClass( 'lazy-loaded' );
			}
		};

		init();
		$window.on( 'scroll', init );
	}

	/**
	 * Google map function for getting latitude and longitude
	 */
	function getLatLngObject(str, marker, map, callback) {
		var coordinates = {};
		try {
			coordinates = JSON.parse(str);
			callback(new google.maps.LatLng(
				coordinates.lat,
				coordinates.lng
			), marker, map)
		} catch (e) {
			map.geocoder.geocode({'address': str}, function (results, status) {
				if (status === google.maps.GeocoderStatus.OK) {
					var latitude = results[0].geometry.location.lat();
					var longitude = results[0].geometry.location.lng();

					callback(new google.maps.LatLng(
						parseFloat(latitude),
						parseFloat(longitude)
					), marker, map)
				}
			})
		}
	}

	/**
	 * toggleSwiperInnerVideos
	 * @description  toggle swiper videos on active slides
	 */
	function toggleSwiperInnerVideos(swiper) {
		var videos;

		$.grep(swiper.slides, function (element, index) {
			var $slide = $(element),
				video;

			if (index === swiper.activeIndex) {
				videos = $slide.find("video");
				if (videos.length) {
					videos.get(0).play();
				}
			} else {
				$slide.find("video").each(function () {
					this.pause();
				});
			}
		});
	}

	/**
	 * toggleSwiperCaptionAnimation
	 * @description  toggle swiper animations on active slides
	 */
	function toggleSwiperCaptionAnimation(swiper) {
		if (isIE && isIE < 10) {
			return;
		}

		var prevSlide = $(swiper.container),
			nextSlide = $(swiper.slides[swiper.activeIndex]);

		prevSlide
			.find("[data-caption-animate]")
			.each(function () {
				var $this = $(this);
				$this
					.removeClass("animated")
					.removeClass($this.attr("data-caption-animate"))
					.addClass("not-animated");
			});

		nextSlide
			.find("[data-caption-animate]")
			.each(function () {
				var $this = $(this),
					delay = $this.attr("data-caption-delay");

				setTimeout(function () {
					$this
						.removeClass("not-animated")
						.addClass($this.attr("data-caption-animate"))
						.addClass("animated");
				}, delay ? parseInt(delay) : 0);
			});
	}

	/**
	 * makeParallax
	 * @description  create swiper parallax scrolling effect
	 */
	function makeParallax(el, speed, wrapper, prevScroll) {
		var scrollY = window.scrollY || window.pageYOffset;

		if (prevScroll != scrollY) {
			prevScroll = scrollY;
			el.addClass('no-transition');
			el[0].style['transform'] = 'translate3d(0,' + -scrollY * (1 - speed) + 'px,0)';
			el.height();
			el.removeClass('no-transition');

			if (el.attr('data-fade') === 'true') {
				var bound = el[0].getBoundingClientRect(),
					offsetTop = bound.top * 2 + scrollY,
					sceneHeight = wrapper.outerHeight(),
					sceneDevider = wrapper.offset().top + sceneHeight / 2.0,
					layerDevider = offsetTop + el.outerHeight() / 2.0,
					pos = sceneHeight / 6.0,
					opacity;
				if (sceneDevider + pos > layerDevider && sceneDevider - pos < layerDevider) {
					el[0].style["opacity"] = 1;
				} else {
					if (sceneDevider - pos < layerDevider) {
						opacity = 1 + ((sceneDevider + pos - layerDevider) / sceneHeight / 3.0 * 5);
					} else {
						opacity = 1 - ((sceneDevider - pos - layerDevider) / sceneHeight / 3.0 * 5);
					}
					el[0].style["opacity"] = opacity < 0 ? 0 : opacity > 1 ? 1 : opacity.toFixed(2);
				}
			}
		}

		requestAnimationFrame(function () {
			makeParallax(el, speed, wrapper, prevScroll);
		});
	}

	/**
	 * Live Search
	 * @description  create live search results
	 */
	function liveSearch(options) {
		$('#' + options.live).removeClass('cleared').html();
		options.current++;
		options.spin.addClass('loading');
		$.get(handler, {
			s: decodeURI(options.term),
			liveSearch: options.live,
			dataType: "html",
			liveCount: options.liveCount,
			filter: options.filter,
			template: options.template
		}, function (data) {
			options.processed++;
			var live = $('#' + options.live);
			if (options.processed == options.current && !live.hasClass('cleared')) {
				live.find('> #search-results').removeClass('active');
				live.html(data);
				setTimeout(function () {
					live.find('> #search-results').addClass('active');
				}, 50);
			}
			options.spin.parents('.rd-search').find('.input-group-addon').removeClass('loading');
		})
	}

	/**
	 * attachFormValidator
	 * @description  attach form validation to elements
	 */
	function attachFormValidator(elements) {
		for (var i = 0; i < elements.length; i++) {
			var o = $(elements[i]), v;
			o.addClass("form-control-has-validation").after("<span class='form-validation'></span>");
			v = o.parent().find(".form-validation");
			if (v.is(":last-child")) {
				o.addClass("form-control-last-child");
			}
		}

		elements
			.on('input change propertychange blur', function (e) {
				var $this = $(this), results;

				if (e.type !== "blur") {
					if (!$this.parent().hasClass("has-error")) {
						return;
					}
				}

				if ($this.parents('.rd-mailform').hasClass('success')) {
					return;
				}

				if ((results = $this.regula('validate')).length) {
					for (i = 0; i < results.length; i++) {
						$this.siblings(".form-validation").text(results[i].message).parent().addClass("has-error")
					}
				} else {
					$this.siblings(".form-validation").text("").parent().removeClass("has-error")
				}
			})
			.regula('bind');

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

		for (var i = 0; i < regularConstraintsMessages.length; i++) {
			var regularConstraint = regularConstraintsMessages[i];

			regula.override({
				constraintType: regularConstraint.type,
				defaultMessage: regularConstraint.newMessage
			});
		}
	}

	/**
	 * isValidated
	 * @description  check if all elemnts pass validation
	 */
	function isValidated(elements, captcha) {
		var results, errors = 0;

		if (elements.length) {
			for (j = 0; j < elements.length; j++) {

				var $input = $(elements[j]);
				if ((results = $input.regula('validate')).length) {
					for (k = 0; k < results.length; k++) {
						errors++;
						$input.siblings(".form-validation").text(results[k].message).parent().addClass("has-error");
					}
				} else {
					$input.siblings(".form-validation").text("").parent().removeClass("has-error")
				}
			}

			if (captcha) {
				if (captcha.length) {
					return validateReCaptcha(captcha) && errors == 0
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
	function validateReCaptcha(captcha) {
		var captchaToken = captcha.find('.g-recaptcha-response').val();

		if (captchaToken.length === 0) {
			captcha
				.siblings('.form-validation')
				.html('Please, prove that you are not robot.')
				.addClass('active');
			captcha
				.closest('.form-group')
				.addClass('has-error');

			captcha.on('propertychange', function () {
				var $this = $(this),
					captchaToken = $this.find('.g-recaptcha-response').val();

				if (captchaToken.length > 0) {
					$this
						.closest('.form-group')
						.removeClass('has-error');
					$this
						.siblings('.form-validation')
						.removeClass('active')
						.html('');
					$this.off('propertychange');
				}
			});

			return false;
		}

		return true;
	}

	/**
	 * onloadCaptchaCallback
	 * @description  init google reCaptcha
	 */
	window.onloadCaptchaCallback = function () {
		for (i = 0; i < plugins.captcha.length; i++) {
			var $capthcaItem = $(plugins.captcha[i]);

			grecaptcha.render(
				$capthcaItem.attr('id'),
				{
					sitekey: $capthcaItem.attr('data-sitekey'),
					size: $capthcaItem.attr('data-size') ? $capthcaItem.attr('data-size') : 'normal',
					theme: $capthcaItem.attr('data-theme') ? $capthcaItem.attr('data-theme') : 'light',
					callback: function (e) {
						$('.recaptcha').trigger('propertychange');
					}
				}
			);
			$capthcaItem.after("<span class='form-validation'></span>");
		}
	};

	/**
	 * parseJSONObject
	 * @description  return JSON object witch methods
	 */
	function parseJSONObject(element, attr) {
		return JSON.parse($(element).attr(attr), function (key, value) {
			if ((typeof value) === 'string') {
				if (value.indexOf('function') == 0) {
					return eval('(' + value + ')');
				}
			}
			return value;
		});
	}

	/**
	 * makeUniqueRandom
	 * @description  make random for gallery tabs
	 */
	function makeUniqueRandom(count) {
		if (!uniqueRandoms.length) {
			for (var i = 0; i < count; i++) {
				uniqueRandoms.push(i);
			}
		}
		var index = Math.floor(Math.random() * uniqueRandoms.length);
		var val = uniqueRandoms[index];
		uniqueRandoms.splice(index, 1);
		return val;
	}

	/**
	 * makeVisible
	 * @description  set class to gallery tabs to make it visible
	 */
	function makeVisible(el) {
		var count = el.length,
			k = 0,
			step = 2.5;
		for (var i = 0; i < count; i++) {
			timer = setTimeout(function () {
				var rand = makeUniqueRandom(count);
				el.eq(rand).addClass('visible');
			}, k * 35);
			k += step;
		}
		timer2 = setTimeout(function () {
			el.not('.visible').addClass('visible');
		}, count * step * 35)
	}

	/**
	 * makeInVisible
	 * @description  set class to gallery tabs to make it invisible
	 */
	function makeInvisible() {
		var el = $('.image.visible');
		el.removeClass('visible');
		uniqueRandoms = [];
		clearTimeout(timer);
		clearTimeout(timer2);
	}

	/**
	 * IE Polyfills
	 * @description  Adds some loosing functionality to IE browsers
	 */
	if (isIE) {
		if (isIE < 10) {
			$html.addClass("lt-ie-10");
		}

		if (isIE < 11) {
			if (plugins.pointerEvents) {
				$.getScript(plugins.pointerEvents)
					.done(function () {
						$html.addClass("ie-10");
						PointerEventsPolyfill.initialize({});
					});
			}
		}

		if (isIE === 11) {
			$("html").addClass("ie-11");
		}

		if (isIE === 12) {
			$("html").addClass("ie-edge");
		}
	}

	/**
	 * Revolution slider
	 * @description  Initialize Revolution slider
	 */
	if (plugins.revolution.length) {
		plugins.revolution.show().revolution({
			delay: 9000,
			sliderLayout: 'fullscreen',
			responsiveLevels: [1200, 992, 768, 480],
			gridwidth: [1200, 992, 768, 480],
			visibilityLevels: [1200, 992, 768, 480],
			minHeight: ['630', '630', '630', '500'],
			stopLoop: 'on',
			stopAfterLoops: 0,
			stopAtSlide: 1,
			spinner: 'spinner3',
			extensions: 'js/extensions/',
			viewPort: {
				enable: true,
				outof: 'wait',
				visible_area: '80%',
				presize: true
			},
			navigation: {
				arrows: {
					enable: true,
					hide_onleave: true,
					hide_onmobile: true,
					hide_under: 1360,
					style: 'uranus',
				},
				bullets: {
					enable: true,
					style: 'uranus',
					hide_onleave: false,
					h_align: 'center',
					v_align: 'bottom',
					h_offset: 0,
					v_offset: 20,
					space: 10
				},
				touch: {
					touchenabled: "on",						// Enable Swipe Function : on/off
					swipe_treshold: 75,					// The number of pixels that the user must move their finger by before it is considered a swipe.
					swipe_min_touches: 1,					// Min Finger (touch) used for swipe
					drag_block_vertical: false,				// Prevent Vertical Scroll during Swipe
					swipe_direction: "horizontal"
				},
			},
			parallax: {
				type: 'scroll',
				origo: "slidercenter",
				speed: 1000,
				levels: [5, 10, 15, 20, 25, 30, 35, 40,
					45, 46, 47, 48, 49, 50, 51, 55],
				disable_onmobile: 'on'
			},
		});
	}

	/**
	 * Tilter
	 */
	if (plugins.tilter.length) {
		var tiltSettings = [
			{},
			{
				movement: {
					lines: {
						translation: {x: 40, y: 40, z: 0},
						reverseAnimation: {duration: 1500, easing: 'easeOutElastic'}
					},
					caption: {
						translation: {x: 20, y: 20, z: 0},
						rotation: {x: 0, y: 0, z: -5},
						reverseAnimation: {duration: 1000, easing: 'easeOutExpo'}
					},
					overlay: {
						translation: {x: -30, y: -30, z: 0},
						rotation: {x: 0, y: 0, z: 3},
						reverseAnimation: {duration: 750, easing: 'easeOutExpo'}
					},
					shine: {
						translation: {x: 100, y: 100, z: 0},
						reverseAnimation: {duration: 750, easing: 'easeOutExpo'}
					}
				}
			},
			{
				movement: {
					lines: {
						translation: {x: 40, y: 40, z: 0},
						reverseAnimation: {duration: 1500, easing: 'easeOutElastic'}
					},
					caption: {
						translation: {x: 20, y: 20, z: 0},
						rotation: {x: 0, y: 0, z: -5},
						reverseAnimation: {duration: 1000, easing: 'easeOutExpo'}
					},
					overlay: {
						translation: {x: -30, y: -30, z: 0},
						rotation: {x: 0, y: 0, z: 3},
						reverseAnimation: {duration: 750, easing: 'easeOutExpo'}
					},
					shine: {
						translation: {x: 100, y: 100, z: 0},
						reverseAnimation: {duration: 750, easing: 'easeOutExpo'}
					}
				}
			}];

		plugins.tilter.each(function (pos, el) {
			var idx = 0;
			idx = pos % 2 === 0 ? idx + 1 : idx;
			new TiltFx(el, tiltSettings[idx - 1]);
		});
	}

	/**
	 * Swiper 3.1.7
	 * @description  Enable Swiper Slider
	 */
	if (plugins.swiper.length) {
		plugins.swiper.each(function () {
			var slider = $(this),
				pag      = slider.find(".swiper-pagination"),
				next     = slider.find(".swiper-button-next"),
				prev     = slider.find(".swiper-button-prev"),
				bar      = slider.find(".swiper-scrollbar"),
				parallax = slider.parents('.rd-parallax').length;

			slider.find(".swiper-slide")
				.each( function () {
					var $this = $(this), url;
					if ( url = $this.attr("data-slide-bg") ) {
						$this.css({
							"background-image": "url(" + url + ")",
							"background-size": "cover"
						})
					}

				})
				.end()
				.find("[data-caption-animate]")
				.addClass("not-animated")
				.end()
				.swiper({
					autoplay:                 !isNoviBuilder && $.isNumeric( slider.attr( 'data-autoplay' ) ) ? slider.attr( 'data-autoplay' ) : false,
					direction:                slider.attr('data-direction') || "horizontal",
					effect:                   slider.attr('data-slide-effect') || "slide",
					speed:                    slider.attr('data-slide-speed') || 600,
					keyboardControl:          !isNoviBuilder ? slider.attr('data-keyboard') === "true" : false,
					mousewheelControl:        !isNoviBuilder ? slider.attr('data-mousewheel') === "true" : false,
					mousewheelReleaseOnEdges: slider.attr('data-mousewheel-release') === "true",
					nextButton:               next.length ? next.get(0) : null,
					prevButton:               prev.length ? prev.get(0) : null,
					pagination:               pag.length ? pag.get(0) : null,
					simulateTouch:            false,
					paginationClickable:      pag.length ? pag.attr("data-clickable") !== "false" : false,
					paginationBulletRender:   pag.length ? pag.attr("data-index-bullet") === "true" ? function ( index, className ) {
						return '<span class="'+ className +'">'+ (index + 1) +'</span>';
					} : null : null,
					scrollbar:                bar.length ? bar.get(0) : null,
					scrollbarDraggable:       bar.length ? bar.attr("data-draggable") !== "false" : true,
					scrollbarHide:            bar.length ? bar.attr("data-draggable") === "false" : false,
					loop:                     !isNoviBuilder ? slider.attr('data-loop') !== "false" : false,
					loopAdditionalSlides:     0,
					loopedSlides:             0,
					onTransitionStart: function ( swiper ) {
						if( !isNoviBuilder ) toggleSwiperInnerVideos( swiper );
					},
					onTransitionEnd: function ( swiper ) {
						if( !isNoviBuilder ) toggleSwiperCaptionAnimation( swiper );
						$(window).trigger("resize");
					},

					onInit: function ( swiper ) {
						if ( plugins.pageLoader.length ) {
							var srcFirst = $("#page-loader").attr("data-slide-bg"),
								image = document.createElement('img');

							image.src = srcFirst;
							image.onload = function () {
								plugins.pageLoader.addClass( "loaded" );
							};
						}

						if( !isNoviBuilder ) toggleSwiperInnerVideos( swiper );
						if( !isNoviBuilder ) toggleSwiperCaptionAnimation( swiper );

						// Create parallax effect on swiper caption
						slider.find(".swiper-parallax")
							.each( function () {
								var $this = $(this), speed;

								if ( parallax && !isIE && !isMobile ) {
									if ( speed = $this.attr("data-speed") ) {
										makeParallax( $this, speed, slider, false );
									}
								}
							});
						$(window).on('resize', function () {
							swiper.update(true);
						})
					},
					onSlideChangeStart: function (swiper) {
						if ( isNoviBuilder ) return;

						var activeSlideIndex = swiper.activeIndex,
							slidesCount = swiper.slides.not(".swiper-slide-duplicate").length,
							thumbsToShow = 3;

						//If there is not enough slides
						if ( slidesCount < thumbsToShow ) return false;

						//Fix index count
						if ( activeSlideIndex === slidesCount + 1 ) activeSlideIndex = 1;
						else if ( activeSlideIndex === 0 ) activeSlideIndex = slidesCount;

						//Lopp that adds background to thumbs
						for (var i = -thumbsToShow; i < thumbsToShow + 1; i++) {
							if ( i === 0 ) continue;

							//Previous btn thumbs
							if ( i < 0 ) {
								//If there is no slides before current
								if ( ( activeSlideIndex + i - 1) < 0 ) {
									$(swiper.container).find( '.swiper-button-prev .preview__img-'+ Math.abs(i) )
										.css("background-image", "url(" + swiper.slides[slidesCount + i + 1].getAttribute("data-preview-bg") + ")");
								} else {
									$(swiper.container).find( '.swiper-button-prev .preview__img-'+ Math.abs(i) )
										.css("background-image", "url(" + swiper.slides[activeSlideIndex + i].getAttribute("data-preview-bg") + ")");
								}

								//Next btn thumbs
							} else {
								//If there is no slides after current
								if ( activeSlideIndex + i - 1 > slidesCount ) {
									$(swiper.container).find('.swiper-button-next .preview__img-' + i)
										.css("background-image", "url(" + swiper.slides[i].getAttribute("data-preview-bg") + ")");
								} else {
									$(swiper.container).find('.swiper-button-next .preview__img-' + i)
										.css("background-image", "url(" + swiper.slides[activeSlideIndex + i].getAttribute("data-preview-bg") + ")");
								}
							}
						}
					},
				});

			$(window)
				.load(function () {
					slider.find("video").each(function () {
						if (!$(this).parents(".swiper-slide-active").length) {
							this.pause();
						}
					});
				})
				.trigger("resize");
		});
	}

	/**
	 * Copyright Year
	 * @description  Evaluates correct copyright year
	 */
	if ( plugins.copyrightYear.length ) {
		plugins.copyrightYear.text( initialDate.getFullYear() );
	}

	/**
	 * jQuery Countdown
	 * @description  Enable countdown plugin
	 */
	if ( plugins.countDown.length ) {
		for ( var i = 0; i < plugins.countDown.length; i++) {
			var $countDownItem = $( plugins.countDown[i] ),
				settings = {
					format: $countDownItem.attr('data-format'),
					layout: $countDownItem.attr('data-layout')
				};

			if ( livedemo ) {
				var d = new Date();
				d.setDate(d.getDate() + 42);
				settings[ $countDownItem.attr('data-type') ] = d;
			} else {
				settings[ $countDownItem.attr('data-type') ] = new Date( $countDownItem.attr( 'data-time' ) );
			}

			if ( $countDownItem.parents('.countdown-modern').length ) {
				settings['onTick'] = function () {
					var section = $(this).find(".countdown-section");
					for ( var j = 0; j < section.length; j++ ) {
						$(section[section.length - j - 1]).append( '<span class="countdown-letter">'+ settings.format[settings.format.length - j - 1] +'</span>' )
					}
				}
			}

			$countDownItem.countdown( settings );
		}
	}

	/**
	 * Bootstrap tabs
	 * @description Activate Bootstrap Tabs
	 */
	if (plugins.bootstrapTabs.length) {
		var i;
		for (i = 0; i < plugins.bootstrapTabs.length; i++) {
			var bootstrapTab = $(plugins.bootstrapTabs[i]);

			bootstrapTab.on("click", "a", function (event) {
				event.preventDefault();
				$(this).tab('show');
			});
		}
	}

	/**
	 * Bootstrap Tooltips
	 * @description Activate Bootstrap Tooltips
	 */
	if (plugins.bootstrapTooltip.length) {
		plugins.bootstrapTooltip.tooltip();
	}

	/**
	 * RD Audio player
	 * @description Enables RD Audio player plugin
	 */
	if (plugins.rdAudioPlayer.length) {
		var i;
		for (i = 0; i < plugins.rdAudioPlayer.length; i++) {
			$(plugins.rdAudioPlayer[i]).RDAudio();
		}
		var playlistButton = $('.rd-audio-playlist-button');
		var playlist = plugins.rdAudioPlayer.find('.rd-audio-playlist-wrap');
		if (playlistButton.length) {
			playlistButton.on('click', function (e) {
				e.preventDefault();
				plugins.rdAudioPlayer.toggleClass('playlist-show');
				if (playlist.is(':hidden')) {
					playlist.slideDown(300);
				} else {
					playlist.slideUp(300);
				}
			});
			$document.on('click', function (e) {
				if (!$(e.target).is(playlist) && playlist.find($(e.target)).length == 0 && !$(e.target).is(playlistButton)) {
					playlist.slideUp(300);
				}
			});
		}
	}

	/**
	 * RD Video Player
	 * @description Enables RD Video player plugin
	 */
	function hidePlaylist() {
		$(".rd-video-player").removeClass("playlist-show");
	}

	function showPlaylist() {
		$(".rd-video-player").addClass("playlist-show");
	}

	if (plugins.rdVideoPlayer.length) {
		var i;
		for (i = 0; i < plugins.rdVideoPlayer.length; i++) {
			var videoItem = $(plugins.rdVideoPlayer[i]);

			$window.on("scroll", $.proxy(function () {
				var video = $(this);
				if (isDesktop && !video.hasClass("played") && video.hasClass('play-on-scroll') && isScrolledIntoView(video)) {
					video.find("video")[0].play();
					video.addClass("played");
				}
			}, videoItem));

			videoItem.RDVideoPlayer({
				callbacks: {
					onPlay: hidePlaylist,
					onPaused: showPlaylist,
					onEnded: showPlaylist
				}
			});
			$window.on('load', showPlaylist);

			var volumeWrap = $(".rd-video-volume-wrap");

			volumeWrap.on("mouseenter", function () {
				$(this).addClass("hover")
			});

			volumeWrap.on("mouseleave", function () {
				$(this).removeClass("hover")
			});

			if (isTouch) {
				volumeWrap.find(".rd-video-volume").on("click", function () {
					$(this).toggleClass("hover")
				});
				$document.on("click", function (e) {
					if (!$(e.target).is(volumeWrap) && $(e.target).parents(volumeWrap).length == 0) {
						volumeWrap.find(".rd-video-volume").removeClass("hover")
					}
				})
			}
		}
	}

	/**
	 * Responsive Tabs
	 * @description Enables Responsive Tabs plugin
	 */
	if (plugins.responsiveTabs.length ) {
		for ( var i = 0; i < plugins.responsiveTabs.length; i++ ) {
			var $this = $(plugins.responsiveTabs[i]);
			$this.easyResponsiveTabs({
				type: $this.attr( "data-type" ),
				tabidentify: $this.find( ".resp-tabs-list" ).attr( "data-group" ) || "tab"
			});
		}
	}

	/**
	 * Google maps
	 */
	if( plugins.maps.length ) {
		var key;

		for ( var i = 0; i < plugins.maps.length; i++ ) {
			if ( plugins.maps[i].hasAttribute( "data-key" ) ) {
				key = plugins.maps[i].getAttribute( "data-key" );
				break;
			}
		}

		$.getScript('//maps.google.com/maps/api/js?'+ ( key ? 'key='+ key + '&' : '' ) +'sensor=false&libraries=geometry,places&v=3.7', function () {
			var head = document.getElementsByTagName('head')[0],
				insertBefore = head.insertBefore;

			head.insertBefore = function (newElement, referenceElement) {
				if (newElement.href && newElement.href.indexOf('//fonts.googleapis.com/css?family=Roboto') !== -1 || newElement.innerHTML.indexOf('gm-style') !== -1) {
					return;
				}
				insertBefore.call(head, newElement, referenceElement);
			};
			var geocoder = new google.maps.Geocoder;
			for (var i = 0; i < plugins.maps.length; i++) {
				var zoom = parseInt(plugins.maps[i].getAttribute("data-zoom"), 10) || 11;
				var styles = plugins.maps[i].hasAttribute('data-styles') ? JSON.parse(plugins.maps[i].getAttribute("data-styles")) : [];
				var center = plugins.maps[i].getAttribute("data-center") || "New York";

				// Initialize map
				var map = new google.maps.Map(plugins.maps[i].querySelectorAll(".google-map")[0], {
					zoom: zoom,
					styles: styles,
					scrollwheel: false,
					center: {lat: 0, lng: 0}
				});

				// Add map object to map node
				plugins.maps[i].map = map;
				plugins.maps[i].geocoder = geocoder;
				plugins.maps[i].google = google;

				// Get Center coordinates from attribute
				getLatLngObject(center, null, plugins.maps[i], function (location, markerElement, mapElement) {
					mapElement.map.setCenter(location);
				});

				// Add markers from google-map-markers array
				var markerItems = plugins.maps[i].querySelectorAll(".google-map-markers li");

				if (markerItems.length){
					var markers = [];
					for (var j = 0; j < markerItems.length; j++){
						var markerElement = markerItems[j];
						getLatLngObject(markerElement.getAttribute("data-location"), markerElement, plugins.maps[i], function(location, markerElement, mapElement){
							var icon = markerElement.getAttribute("data-icon") || mapElement.getAttribute("data-icon");
							var activeIcon = markerElement.getAttribute("data-icon-active") || mapElement.getAttribute("data-icon-active");
							var info = markerElement.getAttribute("data-description") || "";
							var infoWindow = new google.maps.InfoWindow({
								content: info
							});
							markerElement.infoWindow = infoWindow;
							var markerData = {
								position: location,
								map: mapElement.map
							}
							if (icon){
								markerData.icon = icon;
							}
							var marker = new google.maps.Marker(markerData);
							markerElement.gmarker = marker;
							markers.push({markerElement: markerElement, infoWindow: infoWindow});
							marker.isActive = false;
							// Handle infoWindow close click
							google.maps.event.addListener(infoWindow,'closeclick',(function(markerElement, mapElement){
								var markerIcon = null;
								markerElement.gmarker.isActive = false;
								markerIcon = markerElement.getAttribute("data-icon") || mapElement.getAttribute("data-icon");
								markerElement.gmarker.setIcon(markerIcon);
							}).bind(this, markerElement, mapElement));


							// Set marker active on Click and open infoWindow
							google.maps.event.addListener(marker, 'click', (function(markerElement, mapElement) {
								if (markerElement.infoWindow.getContent().length === 0) return;
								var gMarker, currentMarker = markerElement.gmarker, currentInfoWindow;
								for (var k =0; k < markers.length; k++){
									var markerIcon;
									if (markers[k].markerElement === markerElement){
										currentInfoWindow = markers[k].infoWindow;
									}
									gMarker = markers[k].markerElement.gmarker;
									if (gMarker.isActive && markers[k].markerElement !== markerElement){
										gMarker.isActive = false;
										markerIcon = markers[k].markerElement.getAttribute("data-icon") || mapElement.getAttribute("data-icon")
										gMarker.setIcon(markerIcon);
										markers[k].infoWindow.close();
									}
								}

								currentMarker.isActive = !currentMarker.isActive;
								if (currentMarker.isActive) {
									if (markerIcon = markerElement.getAttribute("data-icon-active") || mapElement.getAttribute("data-icon-active")){
										currentMarker.setIcon(markerIcon);
									}

									currentInfoWindow.open(map, marker);
								}else{
									if (markerIcon = markerElement.getAttribute("data-icon") || mapElement.getAttribute("data-icon")){
										currentMarker.setIcon(markerIcon);
									}
									currentInfoWindow.close();
								}
							}).bind(this, markerElement, mapElement))
						})
					}
				}
			}
		});
	}

	/**
	 * RD Flickr Feed
	 * @description Enables RD Flickr Feed plugin
	 */
	if (plugins.flickrfeed.length > 0) {
		for ( var i = 0; i < plugins.flickrfeed.length; i++ ) {
			$(plugins.flickrfeed[i]).RDFlickr();
		}
	}

	/**
	 * RD Twitter Feed
	 * @description Enables RD Twitter Feed plugin
	 */
	if (plugins.twitterfeed.length > 0) {
		var i;
		for (i = 0; i < plugins.twitterfeed.length; i++) {
			var twitterfeedItem = plugins.twitterfeed[i];
			$(twitterfeedItem).RDTwitter({
				hideReplies: false,
				localTemplate: {
					avatar: "images/features/rd-twitter-post-avatar-48x48.jpg"
				},
				callback: function () {
					$window.trigger("resize");
				}
			});
		}
	}

	/**
	 * RD Input Label
	 * @description Enables RD Input Label Plugin
	 */
	if (plugins.rdInputLabel.length) {
		plugins.rdInputLabel.RDInputLabel();
	}

	/**
	 * Stepper
	 * @description Enables Stepper Plugin
	 */
	if (plugins.stepper.length) {
		plugins.stepper.stepper({
			labels: {
				up: "",
				down: ""
			}
		});
	}

	/**
	 * Toggles
	 * @description Make toggles from input[type="checkbox"]
	 */
	if (plugins.toggles.length) {
		var i;
		for (i = 0; i < plugins.toggles.length; i++) {
			var $this = $(plugins.toggles[i]);
			$this.after("<span class='toggle-custom-dummy'></span>")
		}
	}

	/**
	 * Regula
	 * @description Enables Regula plugin
	 */
	if (plugins.regula.length) {
		attachFormValidator(plugins.regula);
	}

	/**
	 * WOW
	 * @description Enables Wow animation plugin
	 */
	if ( !isNoviBuilder && $html.hasClass('desktop') && $html.hasClass("wow-animation") && $(".wow").length ) {
		new WOW().init();
	}

	/**
	 * Text Rotator
	 * @description Enables Text Rotator plugin
	 */
	if ( !isNoviBuilder && plugins.textRotator.length ) {
		for ( var i = 0; i < plugins.textRotator.length; i++ ) {
			$(plugins.textRotator[i]).rotator();
		}
	}

	/**
	 * Owl carousel
	 * @description Enables Owl carousel plugin
	 */
	if ( plugins.owl.length ) {
		for ( var n = 0; n < plugins.owl.length; n++ ) {
			var carousel = $(plugins.owl[n]),
				responsive = {},
				aliaces = ["-xs-", "-sm-", "-md-", "-lg-", "-xl-", "-xxl-"],
				values = [0, 480, 768, 992, 1200, 1600];

			for ( var i = 0; i < values.length; i++ ) {
				responsive[values[i]] = {};
				for ( var j = i; j >= -1; j-- ) {
					if (!responsive[values[i]]["items"] && carousel.attr("data" + aliaces[j] + "items")) {
						responsive[values[i]]["items"] = j < 0 ? 1 : parseInt(carousel.attr("data" + aliaces[j] + "items"));
					}
					if (!responsive[values[i]]["stagePadding"] && responsive[values[i]]["stagePadding"] !== 0 && carousel.attr("data" + aliaces[j] + "stage-padding")) {
						responsive[values[i]]["stagePadding"] = j < 0 ? 0 : parseInt(carousel.attr("data" + aliaces[j] + "stage-padding"));
					}
					if (!responsive[values[i]]["margin"] && responsive[values[i]]["margin"] !== 0 && carousel.attr("data" + aliaces[j] + "margin")) {
						responsive[values[i]]["margin"] = j < 0 ? 30 : parseInt(carousel.attr("data" + aliaces[j] + "margin"));
					}
					if (!responsive[values[i]]["dotsEach"] && responsive[values[i]]["dotsEach"] !== 0 && carousel.attr("data" + aliaces[j] + "dots-each")) {
						responsive[values[i]]["dotsEach"] = j < 0 ? false : parseInt(carousel.attr("data" + aliaces[j] + "dots-each"));
					}
				}
			}

			// Create custom Pagination
			if (carousel.attr('data-dots-custom')) {
				carousel.on("initialized.owl.carousel", function (event) {
					var carousel = $(event.currentTarget),
						customPag = $(carousel.attr("data-dots-custom")),
						active = 0;

					if (carousel.attr('data-active')) {
						active = parseInt(carousel.attr('data-active'));
					}

					carousel.trigger('to.owl.carousel', [active, 300, true]);
					customPag.find("[data-owl-item='" + active + "']").addClass("active");

					customPag.find("[data-owl-item]").on('click', function (e) {
						e.preventDefault();
						carousel.trigger('to.owl.carousel', [parseInt(this.getAttribute("data-owl-item")), 300, true]);
					});

					carousel.on("translate.owl.carousel", function (event) {
						customPag.find(".active").removeClass("active");
						customPag.find("[data-owl-item='" + event.item.index + "']").addClass("active")
					});
				});
			}

			// Create custom Navigation
			if (carousel.attr('data-nav-custom')) {
				carousel.on("initialized.owl.carousel", function (event) {
					var carousel = $(event.currentTarget),
						customNav = $(carousel.attr("data-nav-custom"));

					customNav.find("[data-owl-prev]").on('click', function (e) {
						e.preventDefault();
						carousel.trigger('prev.owl.carousel', [300]);
					});

					customNav.find("[data-owl-next]").on('click', function (e) {
						e.preventDefault();
						carousel.trigger('next.owl.carousel', [300]);
					});
				});
			}

			carousel.owlCarousel({
				autoplay: !isNoviBuilder ? carousel.attr("data-autoplay") === "true" : false,
				loop: !isNoviBuilder ? carousel.attr("data-loop") === "true" : false,
				items: 1,
				autoplaySpeed: 600,
				autoplayTimeout: 3000,
				dotsContainer: carousel.attr("data-pagination-class") || false,
				navContainer: carousel.attr("data-navigation-class") || false,
				mouseDrag: !isNoviBuilder ? carousel.attr("data-mouse-drag") === "true" : false,
				nav: carousel.attr("data-nav") === "true",
				dots: carousel.attr("data-dots") === "true",
				dotsEach: carousel.attr("data-dots-each") ? parseInt(carousel.attr("data-dots-each")) : false,
				responsive: responsive,
				animateOut: carousel.attr("data-animation-out") || false,
				navText: carousel.attr("data-nav-text") ? $.parseJSON( carousel.attr("data-nav-text") ) : [],
				navClass: carousel.attr("data-nav-class") ? $.parseJSON( carousel.attr("data-nav-class") ) : ['owl-prev', 'owl-next']
				});
		}
	}

	/**
	 * Isotope
	 * @description Enables Isotope plugin
	 */
	if (plugins.isotope.length) {
		var isogroup = [];
		for ( var i = 0; i < plugins.isotope.length; i++ ) {
			var isotopeItem = plugins.isotope[i],
				filterItems = $(isotopeItem).closest('.isotope-wrap').find('[data-isotope-filter]'),
				iso = new Isotope(isotopeItem,
					{
						itemSelector: '.isotope-item',
						layoutMode: isotopeItem.getAttribute('data-isotope-layout') ? isotopeItem.getAttribute('data-isotope-layout') : 'masonry',
						filter: '*',
					}
				);

			isogroup.push(iso);

			filterItems.on("click", function (e) {
				e.preventDefault();
				var filter = $(this),
					iso = $('.isotope[data-isotope-group="' + this.getAttribute("data-isotope-group") + '"]'),
					filtersContainer = filter.closest(".isotope-filters");

				filtersContainer
					.find('.active')
					.removeClass("active");
				filter.addClass("active");

				iso.isotope({
					itemSelector: '.isotope-item',
					layoutMode: iso.attr('data-isotope-layout') ? iso.attr('data-isotope-layout') : 'masonry',
					filter: this.getAttribute("data-isotope-filter") == '*' ? '*' : '[data-filter*="' + this.getAttribute("data-isotope-filter") + '"]'
				});

				$window.trigger('resize');

				// If d3Charts contains in isotop, resize it on click.
				if (filtersContainer.hasClass('isotope-has-d3-graphs') && c3ChartsArray != undefined) {
					setTimeout(function () {
						for (var j = 0; j < c3ChartsArray.length; j++) {
							c3ChartsArray[j].resize();
						}
					}, 500);
				}

			}).eq(0).trigger("click");
		}

		setTimeout(function () {
			for ( var i = 0; i < isogroup.length; i++ ) {
				isogroup[i].element.classList.add( "isotope--loaded" );
				isogroup[i].layout();
			}
		}, 1200);
	}

	/**
	 * RD Video
	 * @description Enables RD Video plugin
	 */
	if (plugins.rdVideoBG.length) {
		for (i = 0; i < plugins.rdVideoBG.length; i++) {
			var videoItem = $(plugins.rdVideoBG[i]);
			videoItem.RDVideo({});
		}
	}

	/**
	 * RD Navbar
	 * @description Enables RD Navbar plugin
	 */
	if ( plugins.rdNavbar.length ) {
		var navbar = plugins.rdNavbar,
			aliases = { '0':'-', '480':'-xs-', '768':'-sm-', '992':'-md-', '1200':'-lg-' },
			responsiveNavbar = {};

		for ( var alias in aliases ) {
			responsiveNavbar[ alias ] = {};
			if ( navbar.attr( 'data'+ aliases[ alias ] +'layout' ) ) responsiveNavbar[ alias ].layout = navbar.attr( 'data'+ aliases[ alias ] +'layout' );
			else responsiveNavbar[ alias ].layout = 'rd-navbar-fixed';
			if ( navbar.attr( 'data'+ aliases[ alias ] +'device-layout' ) ) responsiveNavbar[ alias ].deviceLayout = navbar.attr( 'data'+ aliases[ alias ] +'device-layout' );
			else responsiveNavbar[ alias ].deviceLayout = 'rd-navbar-fixed';
			if ( navbar.attr( 'data'+ aliases[ alias ] +'hover-on' ) ) responsiveNavbar[ alias ].focusOnHover = navbar.attr( 'data'+ aliases[ alias ] +'hover-on' ) === 'true';
			if ( navbar.attr( 'data'+ aliases[ alias ] +'auto-height' ) ) responsiveNavbar[ alias ].autoHeight = navbar.attr( 'data'+ aliases[ alias ] +'auto-height' ) === 'true';
			if ( navbar.attr( 'data'+ aliases[ alias ] +'stick-up-offset' ) ) responsiveNavbar[ alias ].stickUpOffset = navbar.attr( 'data'+ aliases[ alias ] +'stick-up-offset');
			if ( navbar.attr( 'data'+ aliases[ alias ] +'stick-up' ) && !isNoviBuilder ) responsiveNavbar[ alias ].stickUp = navbar.attr( 'data'+ aliases[ alias ] +'stick-up' ) === 'true';
			else responsiveNavbar[ alias ].stickUp = false;

			if ( $.isEmptyObject( responsiveNavbar[ alias ] ) ) delete responsiveNavbar[ alias ];
		}

		navbar.RDNavbar({
			stickUpClone: ( !isNoviBuilder && navbar.attr("data-stick-up-clone") ) ? navbar.attr("data-stick-up-clone") === 'true' : false,
			stickUpOffset: ( navbar.attr("data-stick-up-offset") ) ? navbar.attr("data-stick-up-offset") : 1,
			anchorNavOffset: -78,
			anchorNav: !isNoviBuilder,
			anchorNavEasing: 'linear',
			focusOnHover: !isNoviBuilder,
			responsive: responsiveNavbar,
			onDropdownOver: function () {
				return !isNoviBuilder;
			}
		});

		if ( navbar.attr( "data-body-class" ) ) {
			document.body.className += ' ' + navbar.attr("data-body-class");
		}
	}

	/**
	 * Stacktable
	 * @description Enables Stacktable plugin
	 */
	if (plugins.stacktable.length) {
		var i;
		for (i = 0; i < plugins.stacktable.length; i++) {
			var stacktableItem = $(plugins.stacktable[i]);
			stacktableItem.stacktable();
		}
	}

	/**
	 * Select2
	 * @description Enables select2 plugin
	 */
	if (plugins.selectFilter.length) {
		var i;
		for (i = 0; i < plugins.selectFilter.length; i++) {
			var select = $(plugins.selectFilter[i]);

			select.select2({
				theme: "bootstrap"
			}).next().addClass(select.attr("class").match(/(input-sm)|(input-lg)|($)/i).toString().replace(new RegExp(",", 'g'), " "));
		}
	}

	/**
	 * Product Thumbnails
	 * @description Enables product thumbnails
	 */
	if (plugins.productThumb.length) {
		var i;
		for (i = 0; i < plugins.productThumb.length; i++) {
			var thumbnails = $(plugins.productThumb[i]);

			thumbnails.find("li").on('click', function () {
				var item = $(this);
				item.parent().find('.active').removeClass('active');
				var image = item.parents(".product").find(".product-image-area");
				image.removeClass('animateImageIn');
				image.addClass('animateImageOut');
				item.addClass('active');
				setTimeout(function () {
					var src = item.find("img").attr("src");
					if (item.attr('data-large-image')) {
						src = item.attr('data-large-image');
					}
					image.attr("src", src);
					image.removeClass('animateImageOut');
					image.addClass('animateImageIn');
				}, 300);
			})
		}
	}

	/**
	 * RD Calendar
	 * @description Enables RD Calendar plugin
	 */
	if (plugins.calendar.length) {
		for (i = 0; i < plugins.calendar.length; i++) {
			var calendarItem = $(plugins.calendar[i]);

			calendarItem.rdCalendar({
				days: calendarItem.attr("data-days") ? c.attr("data-days").split(/\s?,\s?/i) : ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
				month: calendarItem.attr("data-months") ? c.attr("data-months").split(/\s?,\s?/i) : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
			});
		}
	}

	/**
	 * jQuery elevateZoom
	 * @description Enables jQuery elevateZoom plugin
	 */
	if (plugins.imgZoom.length) {
		for (i = 0; i < plugins.imgZoom.length; i++) {
			var zoomItem = $(plugins.imgZoom[i]);

			zoomItem.elevateZoom({
				zoomType: "inner",
				cursor: "crosshair",
				zoomWindowFadeIn: 300,
				zoomWindowFadeOut: 300,
				scrollZoom: true
			});
		}
	}

	/**
	 * Page loader
	 * @description Enables Page loader
	 */
	if ( plugins.pageLoader.length ) {
		var pageLoaded = function() {
			plugins.pageLoader.addClass( 'loaded' );
			$window.trigger( 'resize' );
		};

		if ( !isNoviBuilder ) setTimeout( pageLoaded, 200 );
		else pageLoaded();
	}

	/**
	 * RD Search
	 * @description Enables search
	 */
	if (plugins.search.length || plugins.searchResults) {
		var handler = "bat/rd-search.php";
		var defaultTemplate = '<h5 class="search_title"><a target="_top" href="#{href}" class="search_link">#{title}</a></h5>' +
			'<p>...#{token}...</p>' +
			'<p class="match"><em>Terms matched: #{count} - URL: #{href}</em></p>';
		var defaultFilter = '*.html';

		if (plugins.search.length) {

			for (i = 0; i < plugins.search.length; i++) {
				var searchItem = $(plugins.search[i]),
					options = {
						element: searchItem,
						filter: (searchItem.attr('data-search-filter')) ? searchItem.attr('data-search-filter') : defaultFilter,
						template: (searchItem.attr('data-search-template')) ? searchItem.attr('data-search-template') : defaultTemplate,
						live: (searchItem.attr('data-search-live')) ? searchItem.attr('data-search-live') : false,
						liveCount: (searchItem.attr('data-search-live-count')) ? parseInt(searchItem.attr('data-search-live')) : 4,
						current: 0, processed: 0, timer: {}
					};

				if ($('.rd-navbar-search-toggle').length) {
					var toggle = $('.rd-navbar-search-toggle');
					toggle.on('click', function () {
						if (!($(this).hasClass('active'))) {
							searchItem.find('input').val('').trigger('propertychange');
						}
					});
				}

				if (options.live) {
					searchItem.find('input').on("keyup input propertychange", $.proxy(function () {
						this.term = this.element.find('input').val().trim();
						this.spin = this.element.find('.input-group-addon');
						clearTimeout(this.timer);

						if (this.term.length > 2) {
							this.timer = setTimeout(liveSearch(this), 200);
						} else if (this.term.length == 0) {
							$('#' + this.live).addClass('cleared').html('');
						}
					}, options, this));
				}

				searchItem.submit($.proxy(function () {
					$('<input />').attr('type', 'hidden')
						.attr('name', "filter")
						.attr('value', this.filter)
						.appendTo(this.element);
					return true;
				}, options, this))
			}
		}

		if (plugins.searchResults.length) {
			var regExp = /\?.*s=([^&]+)\&filter=([^&]+)/g;
			var match = regExp.exec(location.search);

			if (match != null) {
				$.get(handler, {
					s: decodeURI(match[1]),
					dataType: "html",
					filter: match[2],
					template: defaultTemplate,
					live: ''
				}, function (data) {
					plugins.searchResults.html(data);
				})
			}
		}
	}

	/**
	 * UI To Top
	 * @description Enables ToTop Button
	 */
	if ( !isNoviBuilder && isDesktop ) {
		$().UItoTop({
			easingType: 'easeOutQuart',
			containerClass: 'ui-to-top icon icon-xs icon-circle icon-darker-filled mdi mdi-chevron-up'
		});
	}

	/**
	 * Google ReCaptcha
	 * @description Enables Google ReCaptcha
	 */
	if (plugins.captcha.length) {
		$.getScript("//www.google.com/recaptcha/api.js?onload=onloadCaptchaCallback&render=explicit&hl=en");
	}

	/**
	 * MailChimp Ajax subscription
	 */
	if ( plugins.mailchimp.length ) {
		for ( var i = 0; i < plugins.mailchimp.length; i++ ) {
			var $mailchimpItem = $(plugins.mailchimp[i]),
				$email = $mailchimpItem.find('input[type="email"]');

			// Required by MailChimp
			$mailchimpItem.attr('novalidate', 'true');
			$email.attr('name', 'EMAIL');

			$mailchimpItem.on('submit', $.proxy(function (e) {
				e.preventDefault();

				var $this = this;

				var data = {},
					url = $this.attr('action').replace('/post?', '/post-json?').concat('&c=?'),
					dataArray = $this.serializeArray(),
					$output = $("#" + $this.attr("data-form-output"));

				for (i = 0; i < dataArray.length; i++) {
					data[dataArray[i].name] = dataArray[i].value;
				}

				$.ajax({
					data: data,
					url: url,
					dataType: 'jsonp',
					error: function (resp, text) {
						$output.html('Server error: ' + text);

						setTimeout(function () {
							$output.removeClass("active");
						}, 4000);
					},
					success: function (resp) {
						$output.html(resp.msg).addClass('active');

						setTimeout(function () {
							$output.removeClass("active");
						}, 6000);
					},
					beforeSend: function (data) {
						// Stop request if builder or inputs are invalide
						if ( !isValidated( $this.find('[data-constraints]') ) )
							return false;

						$output.html('Submitting...').addClass('active');
					}
				});

				// Clear inputs after submit
				var inputs = $this[0].getElementsByTagName( 'input' );
				for ( var i = 0; i < inputs.length; i++ ) inputs[i].value = '';

				return false;
			}, $mailchimpItem));
		}
	}

	/**
	 * Campaign Monitor ajax subscription
	 */
	if (plugins.campaignMonitor.length) {
		for (i = 0; i < plugins.campaignMonitor.length; i++) {
			var $campaignItem = $(plugins.campaignMonitor[i]);

			$campaignItem.on('submit', $.proxy(function (e) {
				var data = {},
					url = this.attr('action'),
					dataArray = this.serializeArray(),
					$output = $("#" + plugins.campaignMonitor.attr("data-form-output")),
					$this = $(this);

				for (i = 0; i < dataArray.length; i++) {
					data[dataArray[i].name] = dataArray[i].value;
				}

				$.ajax({
					data: data,
					url: url,
					dataType: 'jsonp',
					error: function (resp, text) {
						$output.html('Server error: ' + text);

						setTimeout(function () {
							$output.removeClass("active");
						}, 4000);
					},
					success: function (resp) {
						$output.html(resp.Message).addClass('active');

						setTimeout(function () {
							$output.removeClass("active");
						}, 6000);
					},
					beforeSend: function (data) {
						// Stop request if builder or inputs are invalide
						if (isNoviBuilder || !isValidated($this.find('[data-constraints]')))
							return false;

						$output.html('Submitting...').addClass('active');
					}
				});

				// Clear inputs after submit
				var inputs = $this[0].getElementsByTagName( 'input' );
				for ( var i = 0; i < inputs.length; i++ ) inputs[i].value = '';

				return false;
			}, $campaignItem));
		}
	}

	/**
	 * RD Mailform
	 */
	if (plugins.rdMailForm.length) {
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

		for (i = 0; i < plugins.rdMailForm.length; i++) {
			var $form = $(plugins.rdMailForm[i]),
				formHasCaptcha = false;

			$form.attr('novalidate', 'novalidate').ajaxForm({
				data: {
					"form-type": $form.attr("data-form-type") || "contact",
					"counter": i
				},
				beforeSubmit: function (arr, $form, options) {

					var form = $(plugins.rdMailForm[this.extraData.counter]),
						inputs = form.find("[data-constraints]"),
						output = $("#" + form.attr("data-form-output")),
						captcha = form.find('.recaptcha'),
						captchaFlag = true;

					output.removeClass("active error success");

					if (isValidated(inputs, captcha)) {

						// veify reCaptcha
						if (captcha.length) {
							var captchaToken = captcha.find('.g-recaptcha-response').val(),
								captchaMsg = {
									'CPT001': 'Please, setup you "site key" and "secret key" of reCaptcha',
									'CPT002': 'Something wrong with google reCaptcha'
								};

							formHasCaptcha = true;

							$.ajax({
								method: "POST",
								url: "bat/reCaptcha.php",
								data: {'g-recaptcha-response': captchaToken},
								async: false
							}).done(function (responceCode) {
								if (responceCode !== 'CPT000') {
									if (output.hasClass("snackbars")) {
										output.html('<p><span class="icon text-middle mdi mdi-check icon-xxs"></span><span>' + captchaMsg[responceCode] + '</span></p>')

										setTimeout(function () {
											output.removeClass("active");
										}, 3500);

										captchaFlag = false;
									} else {
										output.html(captchaMsg[responceCode]);
									}

									output.addClass("active");
								}
							});
						}

						if (!captchaFlag) {
							return false;
						}

						form.addClass('form-in-process');

						if (output.hasClass("snackbars")) {
							output.html('<p><span class="icon text-middle fa fa-circle-o-notch fa-spin icon-xxs"></span><span>Sending</span></p>');
							output.addClass("active");
						}
					} else {
						return false;
					}
				},
				error: function (result) {

					var output = $("#" + $(plugins.rdMailForm[this.extraData.counter]).attr("data-form-output")),
						form = $(plugins.rdMailForm[this.extraData.counter]);

					output.text(msg[result]);
					form.removeClass('form-in-process');

					if (formHasCaptcha) {
						grecaptcha.reset();
					}
				},
				success: function (result) {

					var form = $(plugins.rdMailForm[this.extraData.counter]),
						output = $("#" + form.attr("data-form-output")),
						select = form.find('select');

					form
						.addClass('success')
						.removeClass('form-in-process');

					if (formHasCaptcha) {
						grecaptcha.reset();
					}

					result = result.length === 5 ? result : 'MF255';
					output.text(msg[result]);

					if (result === "MF000") {
						if (output.hasClass("snackbars")) {
							output.html('<p><span class="icon text-middle mdi mdi-check icon-xxs"></span><span>' + msg[result] + '</span></p>');
						} else {
							output.addClass("active success");
						}
					} else {
						if (output.hasClass("snackbars")) {
							output.html(' <p class="snackbars-left"><span class="icon icon-xxs mdi mdi-alert-outline text-middle"></span><span>' + msg[result] + '</span></p>');
						} else {
							output.addClass("active error");
						}
					}

					form.clearForm();

					if (select.length) {
						select.select2("val", "");
					}

					form.find('input, textarea').trigger('blur');

					setTimeout(function () {
						output.removeClass("active error success");
						form.removeClass('success');
					}, 3500);
				}
			});
		}
	}

	/**
	 * Custom Toggles
	 */
	if (plugins.customToggle.length) {
		var i;
		for (i = 0; i < plugins.customToggle.length; i++) {
			var $this = $(plugins.customToggle[i]);
			$this.on('click', function (e) {
				e.preventDefault();
				$("#" + $(this).attr('data-custom-toggle')).add(this).toggleClass('active');
			});

			if ($this.attr("data-custom-toggle-disable-on-blur") === "true") {
				$("body").on("click", $this, function (e) {
					if (e.target !== e.data[0] && $("#" + e.data.attr('data-custom-toggle')).find($(e.target)).length == 0 && e.data.find($(e.target)).length == 0) {
						$("#" + e.data.attr('data-custom-toggle')).add(e.data[0]).removeClass('active');
					}
				})
			}
		}
	}

	/**
	 * Custom Waypoints
	 */
	if (plugins.customWaypoints.length) {
		var i;
		plugins.customWaypoints = $document.find('[data-waypoint-to]');

		for (i = 0; i < plugins.customWaypoints.length; i++) {
			var item = plugins.customWaypoints[i];

			$(item).on("click", function (e) {
				e.preventDefault();
				console.log($(this));
				$("body, html").stop().animate({
					scrollTop: $($(this).attr('data-waypoint-to')).offset().top
				}, 1000, function () {
					$(window).trigger("resize");
				});
			});
		}
	}

	/**
	 * Bootstrap Date time picker
	 */
	if (plugins.bootstrapDateTimePicker.length) {
		for ( var i = 0; i < plugins.bootstrapDateTimePicker.length; i++) {
			var
				$dateTimePicker = $(plugins.bootstrapDateTimePicker[i]),
				options = {
					date: $dateTimePicker.attr("data-time-picker") === "date",
					time: $dateTimePicker.attr("data-time-picker") === "time",
					shortTime: true
				};

			if ( options.date ) {
				options.format = 'dddd DD MMMM YYYY';
				options.minDate = new Date();
			} else if ( options.time ) {
				options.format = 'HH:mm';
			} else {
				options.format = 'dddd DD MMMM YYYY - HH:mm';
			}

			$dateTimePicker.bootstrapMaterialDatePicker( options );
		}
	}

	/**
	 * Checkout RD Material Tabs
	 */
	if (plugins.checkoutRDTabs.length) {
		var i, step = 0;
		for (i = 0; i < plugins.checkoutRDTabs.length; i++) {
			var checkoutTab = $(plugins.checkoutRDTabs[i]);

			checkoutTab.RDMaterialTabs({
				dragList: true,
				dragContent: false,
				items: 1,
				marginContent: 10,
				margin: 0,
				responsive: {
					480: {
						items: 2
					},
					768: {
						dragList: false,
						items: 3
					}
				},
				callbacks: {
					onChangeStart: function (active, indexTo) {
						if (indexTo > step + 1) {
							return false;
						} else if (indexTo == step + 1) {
							for (var j = 0; j < this.$content.find(".rd-material-tab").length; j++) {
								if (j <= step) {
									var inputs = this.$content.find(".rd-material-tab").eq(j).find("[data-constraints]");

									if (!isValidated(inputs)) {
										this.setContentTransition(this, this.options.speed)
										this.moveTo(j);
										return false
									}
								}
							}
							if (indexTo > step) step = indexTo;
						}

					},
					onChangeEnd: function () {

					},
					onInit: function (tabs) {
						attachFormValidator(tabs.$element.find("[data-constraints]"));

						$('.checkout-step-btn').on("click", function (e) {
							e.preventDefault();
							var index = this.getAttribute("data-index-to"),
								inputs = tabs.$content.find(".rd-material-tab").eq(index - 1).find("[data-constraints]");

							if (isValidated(inputs)) {
								tabs.setContentTransition(tabs, tabs.options.speed);
								tabs.moveTo(parseInt(index));
								if (index > step) step = index;
							}
						});
					}
				}
			});
		}
	}

	/**
	 * Highcharts
	 * @description Enables Highcharts plugin
	 */
	if (plugins.higCharts.charts.length) {
		var i,
			detailChart,
			masterChart;

		for (i = 0; i < plugins.higCharts.charts.length; i++) {
			var higchartsItem = $(plugins.higCharts.charts[i]),
				higChartsItemObject = parseJSONObject(higchartsItem, 'data-graph-object');

			if (!higchartsItem.attr('data-parent-chart') && !higchartsItem.attr('data-child-chart')) {
				higchartsItem.highcharts(
					higChartsItemObject
				);
			} else {
				if (higchartsItem.attr('data-child-chart')) {
					var childGraph = higchartsItem.attr('data-child-chart'),
						higChartsChildObject = parseJSONObject(childGraph, 'data-graph-object');

					masterChart = higchartsItem.highcharts(
						higChartsItemObject, function () {
							detailChart = $(childGraph).highcharts(
								higChartsChildObject
							).highcharts();
						}
					).highcharts();
				}
			}
		}
	}

	/**
	 * Highcharts
	 * @description Enables legends for highcharts plugin
	 */
	if (plugins.higCharts.legend.length) {
		var i, j;

		for (i = 0; i < plugins.higCharts.legend.length; i++) {
			var higchartsLegend = plugins.higCharts.legend[i],
				legendId = $(higchartsLegend).attr('data-chart-id'),
				legendItems = $(higchartsLegend).find('.legend-item');

			for (j = 0; j < legendItems.length; j++) {
				var legendItem = $(legendItems[j]),
					itemId = legendItem.attr('data-chart-id'),
					legend = $(legendId).highcharts().series[itemId],
					legendName = legend.name,
					legendObj;

				if (legendItem.is('input')) {
					if (legend.visible) {
						legendItem.prop('checked', true);
					} else {
						legendItem.prop('checked', false);
					}
				}

				legendItem.html(legendName);
				legendObj = {
					legendItem: legendItem,
					legend: legend
				};

				// assign click handler which toggles legend data
				legendItem.on('click', $.proxy(function (e) {
					var _this = this;

					if (_this.legendItem.attr('href')) {
						e.preventDefault();
					}
					if (_this.legend.visible) {
						_this.legend.hide();
						_this.legendItem.toggleClass('active');
					} else {
						_this.legend.show();
						_this.legendItem.toggleClass('active');
					}
				}, legendObj));
			}
		}
	}

	/**
	 * D3 Charts
	 * @description Enables D3 Charts plugin
	 */
	if (plugins.d3Charts.length) {
		var i;

		for (i = 0; i < plugins.d3Charts.length; i++) {
			var d3ChartsItem = $(plugins.d3Charts[i]),
				d3ChartItemObject = parseJSONObject(d3ChartsItem, 'data-graph-object');
			c3ChartsArray.push(c3.generate(d3ChartItemObject));
		}
	}

	/**
	 * Flot Charts
	 * @description Enables Flot Charts plugin
	 */
	if (plugins.flotCharts.length) {
		var i;

		for (i = 0; i < plugins.flotCharts.length; i++) {
			var flotChartsItem = plugins.flotCharts[i],
				flotChartItemObject = parseJSONObject(flotChartsItem, 'data-graph-object'),
				gridObject = parseJSONObject(flotChartsItem, 'data-grid-object');

			$.plot(flotChartsItem, flotChartItemObject, gridObject);
		}
	}

	/**
	 * Gallery RD Material Tabs
	 */
	if (plugins.galleryRDTabs.length) {
		var uniqueRandoms = [];
		var timer = false,
			timer2 = false;
		plugins.galleryRDTabs.RDMaterialTabs({
			responsive: {
				0: {
					items: 3
				},
				768: {
					margin: 50
				},
				992: {
					margin: 100,
					items: 4
				},
				1200: {
					items: 5
				},
				1600: {
					items: 6
				}
			},
			callbacks: {
				onInit: function () {
					plugins.galleryRDTabs.addClass('loaded');
					if ($html.hasClass('desktop')) {
						makeVisible(plugins.galleryRDTabs.find('.rd-material-tab:first-child .image'));
					}
				},
				onChangeStart: function () {
					if ($html.hasClass('desktop')) {
						makeInvisible();
					}
				},
				onChangeEnd: function () {
					if ($html.hasClass('desktop')) {
						makeVisible(plugins.galleryRDTabs.find('.rd-material-tab-active .image'));
					}
				}
			}
		});
		$window.trigger("resize");
	}

	/**
	 * RD Parallax
	 * @description Enables RD Parallax plugin
	 */
	if ( plugins.rdParallax.length ) {
		if ( !isNoviBuilder && !isIE && !isMobile ) {
			$.RDParallax();

			$window.on('scroll', function () {
				for ( var i = 0; i < plugins.rdParallax.length; i++ ) {
					var $parallax = $(plugins.rdParallax[i]);
					if ( isScrolledIntoView( $parallax ) ) $parallax.find('.rd-parallax-inner').css('position', 'fixed');
					else $parallax.find('.rd-parallax-inner').css('position', 'absolute');
				}
			});
		} else {
			for ( var i = 0; i < plugins.rdParallax.length; i++ ) {
				var $parallax = $(plugins.rdParallax[i]),
					$layers = $parallax.find( '.rd-parallax-layer[data-type=media]' );

				$parallax.addClass( 'rd-parallax-disabled' );

				for ( var n = 0; n < $layers.length; n++ ) {
					var layer = $($layers[n]);
					layer.css({ 'background-image': 'url('+ layer.attr('data-url') +')' });
				}
			}
		}

		$("a[href='#']").on("click", function (e) {
			setTimeout(function () {
				$(window).trigger("resize");
			}, 300);
		});
	}

	/**
	 * Material Parallax
	 * @description Enables Material Parallax plugin
	 */
	if ( plugins.materialParallax.length ) {
		if ( !isNoviBuilder && !isIE && !isMobile) {
			plugins.materialParallax.parallax();
		} else {
			for ( var i = 0; i < plugins.materialParallax.length; i++ ) {
				var $parallax = $(plugins.materialParallax[i]);

				$parallax.addClass( 'parallax-disabled' );
				$parallax.css({ "background-image": 'url('+ $parallax.data("parallax-img") +')' });
			}
		}
	}

	/**
	 * Background Video
	 * @description  Enable Video plugin
	 */
	if ( plugins.videBG.length ) {
		for( var i =0; i < plugins.videBG.length; i++ ) {
			var $element = $(plugins.videBG[i]),
				options = $element.data('vide-options'),
				path = $element.data('vide-bg');
			$element.vide( path, options );
		}
	}

	/**
	 * lightGallery
	 * @description Enables lightGallery plugin
	 */
	function initLightGallery(itemsToInit, addClass) {
		$(itemsToInit).lightGallery({
			thumbnail: $(itemsToInit).attr("data-lg-thumbnail") !== "false",
			selector: "[data-lightgallery='item']",
			autoplay: $(itemsToInit).attr("data-lg-autoplay") === "true",
			pause: parseInt($(itemsToInit).attr("data-lg-autoplay-delay")) || 5000,
			addClass: addClass,
			mode: $(itemsToInit).attr("data-lg-animation") || "lg-slide",
			loop: $(itemsToInit).attr("data-lg-loop") !== "false"
		});
	}

	function initDynamicLightGallery(itemsToInit, addClass) {
		$(itemsToInit).on("click", function() {
			$(itemsToInit).lightGallery({
				thumbnail: $(itemsToInit).attr("data-lg-thumbnail") !== "false",
				selector: "[data-lightgallery='item']",
				autoplay: $(itemsToInit).attr("data-lg-autoplay") === "true",
				pause: parseInt($(itemsToInit).attr("data-lg-autoplay-delay")) || 5000,
				addClass: addClass,
				mode: $(itemsToInit).attr("data-lg-animation") || "lg-slide",
				loop: $(itemsToInit).attr("data-lg-loop") !== "false",
				dynamic: true,
				dynamicEl:
				JSON.parse($(itemsToInit).attr("data-lg-dynamic-elements")) || []
			});
		});
	}

	function initLightGalleryItem(itemToInit, addClass) {
		$(itemToInit).lightGallery({
			selector: "this",
			addClass: addClass,
			counter: false,
			youtubePlayerParams: {
				modestbranding: 1,
				showinfo: 0,
				rel: 0,
				controls: 0
			},
			vimeoPlayerParams: {
				byline: 0,
				portrait: 0
			}
		});
	}

	if ( !isNoviBuilder && plugins.lightGallery.length ) {
		for ( var i = 0; i < plugins.lightGallery.length; i++ ) initLightGallery( plugins.lightGallery[i] );
	}

	if ( !isNoviBuilder && plugins.lightGalleryItem.length ) {
		for ( var i = 0; i < plugins.lightGalleryItem.length; i++ ) initLightGalleryItem( plugins.lightGalleryItem[i] );
	}

	if ( !isNoviBuilder && plugins.lightDynamicGalleryItem.length ) {
		for ( var i = 0; i < plugins.lightDynamicGalleryItem.length; i++ ) initDynamicLightGallery( plugins.lightDynamicGalleryItem[i] );
	}

	/**
	 * Particles canvas bg
	 */
	if ( plugins.canvasbg.length ) {
		canvasbg();
	}

	/**
	 * Particles.js
	 */
	if ( plugins.particlesContainer.length ) {
		particlesJS(
			'particles-container', {
				'particles': {
					'number': {
						'value': 200,
						'density': {
							'enable': true,
							'value_area': 800
						}
					},
					'color': {
						'value': '#85e2ff'
					},
					'shape': {
						'type': 'circle',
						'stroke': {
							'width': 0,
							'color': '#85e2ff'
						},
						'polygon': {
							'nb_sides': 5
						},
						'image': {
							'src': 'img/github.svg',
							'width': 100,
							'height': 100
						}
					},
					'opacity': {
						'value': 0.5,
						'random': false,
						'anim': {
							'enable': false,
							'speed': 1,
							'opacity_min': 0.1,
							'sync': false
						}
					},
					'size': {
						'value': 3,
						'random': true,
						'anim': {
							'enable': false,
							'speed': 40,
							'size_min': 0.1,
							'sync': false
						}
					},
					'line_linked': {
						'enable': true,
						'distance': 150,
						'color': '#85e2ff',
						'opacity': 0.4,
						'width': 1
					},
					'move': {
						'enable': true,
						'speed': 3,
						'direction': 'none',
						'random': false,
						'straight': false,
						'out_mode': 'out',
						'bounce': false,
						'attract': {
							'enable': false,
							'rotateX': 600,
							'rotateY': 1200
						}
					}
				},
				'interactivity': {
					'detect_on': 'canvas',
					'events': {
						'onhover': {
							'enable': true,
							'mode': 'grab'
						},
						'onclick': {
							'enable': true,
							'mode': ''
						},
						'resize': true
					},
					'modes': {
						'grab': {
							'distance': 140,
							'line_linked': {
								'opacity': 1
							}
						},
						'bubble': {
							'distance': 400,
							'size': 40,
							'duration': 2,
							'opacity': 8,
							'speed': 3
						},
						'repulse': {
							'distance': 100,
							'duration': 0.4
						},
						'push': {
							'particles_nb': 4
						},
						'remove': {
							'particles_nb': 2
						}
					}
				},
				'retina_detect': true
			}
		);
	}
});
