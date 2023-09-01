/*=========================================================================================
  File Name: app.js
  Description: Template related app JS.
==========================================================================================*/

(function (window, document, $) {
	"use strict";
	var $html = $("html");
	var $body = $("body");
	var $danger = "#FF5B5C";
	var $primary = "#5A8DEE";
	var $textcolor = "#304156";

	function scrollTopFn() {
		var $scrollTop = $(window).scrollTop();
		if ($scrollTop > 68) {
			$("body").addClass("navbar-scrolled");
		} else {
			$("body").removeClass("navbar-scrolled");
		}
		if ($scrollTop > 20) {
			$("body").addClass("page-scrolled");
		} else {
			$("body").removeClass("page-scrolled");
		}
	}
	$(window).scroll(function () {
		scrollTopFn();
	});

	$(window).on("load", function () {
		var rtl;
		var compactMenu = false; // Set it to true, if you want default menu to be compact

		if ($body.hasClass("menu-collapsed")) {
			compactMenu = true;
		}

		if ($("html").data("textdirection") == "rtl") {
			rtl = true;
		}

		setTimeout(function () {
			$html.removeClass("loading").addClass("loaded");
		}, 1200);

		$.app.menu.init(compactMenu);

		// Navigation configurations
		var config = {
			speed: 300 // set speed to expand / collpase menu
		}

		if ($.app.nav.initialized === false) {
			$.app.nav.init(config);
		}

		Unison.on("change", function (bp) {
			$.app.menu.change(compactMenu);
		});

		// Top Navbars - Hide on Scroll
		if ($(".navbar-hide-on-scroll").length > 0) {
			$(".navbar-hide-on-scroll.fixed-top").headroom({
				offset: 205,
				tolerance: 5,
				classes: {
					// when element is initialised
					initial: "headroom",
					// when scrolling up
					pinned: "headroom--pinned-top",
					// when scrolling down
					unpinned: "headroom--unpinned-top"
				}
			});
			// Bottom Navbars - Hide on Scroll
			$(".navbar-hide-on-scroll.fixed-bottom").headroom({
				offset: 205,
				tolerance: 5,
				classes: {
					// when element is initialised
					initial: "headroom",
					// when scrolling up
					pinned: "headroom--pinned-bottom",
					// when scrolling down
					unpinned: "headroom--unpinned-bottom"
				}
			});
		}

		// Collapsible Card
		$('a[data-action="collapse"]').on("click", function (e) {
			e.preventDefault();
			$(this)
				.closest(".card")
				.children(".card-content")
				.collapse("toggle");
			// Adding bottom padding on card collapse
			$(this)
				.closest(".card")
				.children(".card-header")
				.css("padding-bottom", "1.5rem");
			$(this)
				.closest(".card")
				.find('[data-action="collapse"]')
				.toggleClass("rotate");
		});

		// Toggle fullscreen
		$('a[data-action="expand"]').on("click", function (e) {
			e.preventDefault();
			$(this)
				.closest(".card")
				.find('[data-action="expand"] i')
				.toggleClass("bx-fullscreen bx-exit-fullscreen");
			$(this)
				.closest(".card")
				.toggleClass("card-fullscreen");
		});

		//  Notifications & messages scrollable
		$(".scrollable-container").each(function () {
			var scrollable_container = new PerfectScrollbar($(this)[0], {
				wheelPropagation: false
			});
		});

		// Reload Card
		$('a[data-action="reload"]').on("click", function () {
			var block_ele = $(this)
				.closest(".card")
				.find(".card-content");
			var reloadActionOverlay;
			if ($body.hasClass("dark-layout")) {
				var reloadActionOverlay = "#10163a";
			} else {
				var reloadActionOverlay = "#fff";
			}
			// Block Element
			block_ele.block({
				message: '<div class="bx bx-sync icon-spin font-medium-2 text-primary"></div>',
				timeout: 2000, //unblock after 2 seconds
				overlayCSS: {
					backgroundColor: reloadActionOverlay,
					cursor: "wait"
				},
				css: {
					border: 0,
					padding: 0,
					backgroundColor: "none"
				}
			});
		});

		// Close Card
		$('a[data-action="close"]').on("click", function () {
			$(this)
				.closest(".card")
				.removeClass()
				.slideUp("fast");
		});

		// Match the height of each card in a row
		setTimeout(function () {
			$(".row.match-height").each(function () {
				$(this)
					.find(".card")
					.not(".card .card")
					.matchHeight(); // Not .card .card prevents collapsible cards from taking height
			});
		}, 500);

		$('.card .heading-elements a[data-action="collapse"]').on(
			"click",
			function () {
				var $this = $(this),
					card = $this.closest(".card");
				var cardHeight;

				if (parseInt(card[0].style.height, 10) > 0) {
					cardHeight = card.css("height");
					card.css("height", "").attr("data-height", cardHeight);
				} else {
					if (card.data("height")) {
						cardHeight = card.data("height");
						card.css("height", cardHeight).attr("data-height", "");
					}
				}
			}
		);

		// Add sidebar group active class to active menu
		$(".main-menu-content")
			.find("li.active")
			.parents("li")
			.addClass("sidebar-group-active");

		// Add open class to parent list item if subitem is active except compact menu
		var menuType = $body.data("menu");
		if (menuType != "horizontal-menu" && compactMenu === false) {
			$(".main-menu-content")
				.find("li.active")
				.parents("li")
				.addClass("open");
		}
		if (menuType == "horizontal-menu") {
			$(".main-menu-content")
				.find("li.active")
				.parents("li:not(.nav-item)")
				.addClass("open");
			$(".main-menu-content")
				.find("li.active")
				.parents("li")
				.addClass("active");
		}

		$(".content-overlay").on("click", function () {
			$(".search-list").removeClass("show");
			$(".app-content").removeClass("show-overlay");
			$(".bookmark-wrapper .bookmark-input").removeClass("show");
		});
	});
	
	$(document).on("click", ".menu-toggle, .modern-nav-toggle", function (e) {
		e.preventDefault();

		// Toggle menu
		$.app.menu.toggle();

		setTimeout(function () {
			$(window).trigger("resize");
		}, 200);

		if ($("#collapsed-sidebar").length > 0) {
			setTimeout(function () {
				if ($body.hasClass("menu-expanded") || $body.hasClass("menu-open")) {
					$("#collapsed-sidebar").prop("checked", false);
				} else {
					$("#collapsed-sidebar").prop("checked", true);
				}
			}, 1000);
		}

		// Hides dropdown on click of menu toggle
		// $('[data-toggle="dropdown"]').dropdown('hide');

		// Hides collapse dropdown on click of menu toggle
		if (
			$(".vertical-overlay-menu .navbar-with-menu .navbar-container .navbar-collapse").hasClass("show")
		) {
			$(".vertical-overlay-menu .navbar-with-menu .navbar-container .navbar-collapse").removeClass("show");
		}

		return false;
	});

	// Add Children Class
	$(".navigation")
		.find("li")
		.has("ul")
		.addClass("has-sub");

	$(document).ready(function () {
		/**********************************
		 *   Form Wizard Step Icon
		 **********************************/
		$(".step-icon").each(function () {
			var $this = $(this);
			if ($this.siblings("span.step").length > 0) {
				$this.siblings("span.step").empty();
				$(this).appendTo($(this).siblings("span.step"));
			}
		});
	});

	// Update manual scroller when window is resized
	$(window).resize(function () {
		$.app.menu.manualScroller.updateHeight();
		// To show shadow in main menu when menu scrolls
		var container = document.getElementsByClassName("main-menu-content");
		if (container.length > 0) {
			container[0].addEventListener("ps-scroll-y", function () {
				if (
					$(this)
					.find(".ps__thumb-y")
					.position().top > 0
				) {
					$(".shadow-bottom").css("display", "block");
				} else {
					$(".shadow-bottom").css("display", "none");
				}
			});
		}
	});

	$("#sidebar-page-navigation").on("click", "a.nav-link", function (e) {
		e.preventDefault();
		e.stopPropagation();
		var $this = $(this),
			href = $this.attr("href");
		var offset = $(href).offset();
		var scrollto = offset.top - 80; // minus fixed header height
		$("html, body").animate({
			scrollTop: scrollto
		}, 0);
		setTimeout(function () {
			$this
				.parent(".nav-item")
				.siblings(".nav-item")
				.children(".nav-link")
				.removeClass("active");
			$this.addClass("active");
		}, 100);
	});

})(window, document, jQuery);
