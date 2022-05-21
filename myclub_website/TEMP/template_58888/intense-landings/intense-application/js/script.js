"use strict";

var
	userAgent = navigator.userAgent.toLowerCase(),
	initialDate = new Date(),

	$document = $(document),
	$window = $(window),
	$html = $("html"),

	isDesktop = $html.hasClass("desktop"),
	isIE = userAgent.indexOf("msie") != -1 ? parseInt(userAgent.split("msie")[1]) : userAgent.indexOf("trident") != -1 ? 11 : userAgent.indexOf("edge") != -1 ? 12 : false,
	c3ChartsArray = [],
	isNoviBuilder,

	plugins = {
		rdNavbar: $(".rd-navbar"),
		customWaypoints: $('[data-custom-scroll-to]'),
		higCharts: {
			charts: $(".higchart"),
			legend: $(".chart-legend")
		},
		d3Charts: $('.d3-chart'),
		flotCharts: $('.flot-chart'),
		captcha: $('.recaptcha'),
		rdInputLabel: $(".form-label"),
		regula: $("[data-constraints]"),
		rdMailForm: $(".rd-mailform"),
		copyrightYear: $("#copyright-year"),
	};


// Initialize scripts that require ready document
$document.ready(function () {
	isNoviBuilder = window.xMode;

	// IE Classes
	if (isIE) {
		if (isIE < 10) $html.addClass("lt-ie-10");
		if (isIE < 11) $html.addClass("ie-10");
		if (isIE === 11) $("html").addClass("ie-11");
		if (isIE >= 12) $("html").addClass("ie-edge");
	}

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

	// Copyright Year
	if (plugins.copyrightYear.length) {
		plugins.copyrightYear.text(initialDate.getFullYear());
	}

	// RD Input Label
	if (plugins.rdInputLabel.length) {
		plugins.rdInputLabel.RDInputLabel();
	}

	// Regula
	if (plugins.regula.length) {
		attachFormValidator(plugins.regula);
	}

	// WOW
	if ( !isNoviBuilder && $html.hasClass('desktop') && $html.hasClass("wow-animation") && $(".wow").length ) {
		new WOW().init();
	}

	// RD Navbar
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
			anchorNavEasing: 'easeOutQuad',
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

	// UI To Top
	if ( !isNoviBuilder && isDesktop ) {
		$().UItoTop({
			easingType: 'easeOutQuart',
			containerClass: 'ui-to-top icon icon-xs icon-circle icon-darker-filled mdi mdi-chevron-up'
		});
	}

	// RD Mailform
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
							})
								.done(function (responceCode) {
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

	// Custom Waypoints
	if ( plugins.customWaypoints.length ) {
		$document.delegate( "[data-custom-scroll-to]", "click", function (e) {
			e.preventDefault();
			var top = $("#" + $(this).attr('data-custom-scroll-to')).offset().top;
			$("body, html").stop().animate({ scrollTop: top }, 500, 'easeOutQuad' );
		});
	}

	// Highcharts
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

	// Highcharts legends
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

	// D3 Charts
	if (plugins.d3Charts.length) {
		var i;

		for (i = 0; i < plugins.d3Charts.length; i++) {
			var d3ChartsItem = $(plugins.d3Charts[i]),
				d3ChartItemObject = parseJSONObject(d3ChartsItem, 'data-graph-object');
			c3ChartsArray.push(c3.generate(d3ChartItemObject));
		}
	}

	// Flot Charts
	if (plugins.flotCharts.length) {
		var i;

		for (i = 0; i < plugins.flotCharts.length; i++) {
			var flotChartsItem = plugins.flotCharts[i],
				flotChartItemObject = parseJSONObject(flotChartsItem, 'data-graph-object'),
				gridObject = parseJSONObject(flotChartsItem, 'data-grid-object');

			$.plot(flotChartsItem, flotChartItemObject, gridObject);
		}
	}
});
