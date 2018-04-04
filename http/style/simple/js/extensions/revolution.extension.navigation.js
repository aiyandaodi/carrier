!
function(O) {
	var p = jQuery.fn.revolution,
		v = p.is_mobile(),
		J = {
			alias: "Navigation Min JS",
			name: "revolution.extensions.navigation.min.js",
			min_core: "5.3",
			version: "1.3.2"
		};
	jQuery.extend(!0, p, {
		hideUnHideNav: function(b) {
			var a = b.c.width(),
				d = b.navigation.arrows,
				c = b.navigation.bullets,
				g = b.navigation.thumbnails,
				f = b.navigation.tabs;
			q(d) && w(b.c.find(".tparrows"), d.hide_under, a, d.hide_over);
			q(c) && w(b.c.find(".tp-bullets"), c.hide_under, a, c.hide_over);
			q(g) && w(b.c.parent().find(".tp-thumbs"), g.hide_under, a, g.hide_over);
			q(f) && w(b.c.parent().find(".tp-tabs"), f.hide_under, a, f.hide_over);
			D(b)
		},
		resizeThumbsTabs: function(b, a) {
			if (b.navigation && b.navigation.tabs.enable || b.navigation && b.navigation.thumbnails.enable) {
				var d = (jQuery(window).width() - 480) / 500,
					c = new punchgs.TimelineLite,
					g = b.navigation.tabs,
					f = b.navigation.thumbnails,
					m = b.navigation.bullets;
				if (c.pause(), d = 1 < d ? 1 : 0 > d ? 0 : d, q(g) && (a || g.width > g.min_width) && E(d, c, b.c, g, b.slideamount, "tab"), q(f) && (a || f.width > f.min_width) && E(d, c, b.c, f, b.slideamount, "thumb"), q(m) && a) {
					var e = b.c.find(".tp-bullets");
					e.find(".tp-bullet").each(function(a) {
						var b = jQuery(this);
						a += 1;
						var c = b.outerWidth() + parseInt(void 0 === m.space ? 0 : m.space, 0),
							d = b.outerHeight() + parseInt(void 0 === m.space ? 0 : m.space, 0);
						"vertical" === m.direction ? (b.css({
							top: (a - 1) * d + "px",
							left: "0px"
						}), e.css({
							height: (a - 1) * d + b.outerHeight(),
							width: b.outerWidth()
						})) : (b.css({
							left: (a - 1) * c + "px",
							top: "0px"
						}), e.css({
							width: (a - 1) * c + b.outerWidth(),
							height: b.outerHeight()
						}))
					})
				}
				c.play();
				D(b)
			}
			return !0
		},
		updateNavIndexes: function(b) {
			function a(a) {
				0 < d.find(a).lenght && d.find(a).each(function(a) {
					jQuery(this).data("liindex", a)
				})
			}
			var d = b.c;
			a(".tp-tab");
			a(".tp-bullet");
			a(".tp-thumb");
			p.resizeThumbsTabs(b, !0);
			p.manageNavigation(b)
		},
		manageNavigation: function(b) {
			var a = p.getHorizontalOffset(b.c.parent(), "left"),
				d = p.getHorizontalOffset(b.c.parent(), "right");
			q(b.navigation.bullets) && ("fullscreen" != b.sliderLayout && "fullwidth" != b.sliderLayout && (b.navigation.bullets.h_offset_old = void 0 === b.navigation.bullets.h_offset_old ? b.navigation.bullets.h_offset : b.navigation.bullets.h_offset_old, b.navigation.bullets.h_offset = "center" === b.navigation.bullets.h_align ? b.navigation.bullets.h_offset_old + a / 2 - d / 2 : b.navigation.bullets.h_offset_old + a - d), u(b.c.find(".tp-bullets"), b.navigation.bullets, b));
			q(b.navigation.thumbnails) && u(b.c.parent().find(".tp-thumbs"), b.navigation.thumbnails, b);
			q(b.navigation.tabs) && u(b.c.parent().find(".tp-tabs"), b.navigation.tabs, b);
			q(b.navigation.arrows) && ("fullscreen" != b.sliderLayout && "fullwidth" != b.sliderLayout && (b.navigation.arrows.left.h_offset_old = void 0 === b.navigation.arrows.left.h_offset_old ? b.navigation.arrows.left.h_offset : b.navigation.arrows.left.h_offset_old, b.navigation.arrows.left.h_offset = "right" === b.navigation.arrows.left.h_align ? b.navigation.arrows.left.h_offset_old + d : b.navigation.arrows.left.h_offset_old + a, b.navigation.arrows.right.h_offset_old = void 0 === b.navigation.arrows.right.h_offset_old ? b.navigation.arrows.right.h_offset : b.navigation.arrows.right.h_offset_old, b.navigation.arrows.right.h_offset = "right" === b.navigation.arrows.right.h_align ? b.navigation.arrows.right.h_offset_old + d : b.navigation.arrows.right.h_offset_old + a), u(b.c.find(".tp-leftarrow.tparrows"), b.navigation.arrows.left, b), u(b.c.find(".tp-rightarrow.tparrows"), b.navigation.arrows.right, b));
			q(b.navigation.thumbnails) && x(b.c.parent().find(".tp-thumbs"), b.navigation.thumbnails);
			q(b.navigation.tabs) && x(b.c.parent().find(".tp-tabs"), b.navigation.tabs)
		},
		createNavigation: function(b, a) {
			if ("stop" === p.compare_version(J).check) return !1;
			var d = b.parent(),
				c = a.navigation.arrows,
				g = a.navigation.bullets,
				f = a.navigation.thumbnails,
				m = a.navigation.tabs,
				e = q(c),
				l = q(g),
				h = q(f),
				k = q(m);
			K(b, a);
			L(b, a);
			e && M(b, c, a);
			a.li.each(function(c) {
				c = jQuery(a.li[a.li.length - 1 - c]);
				var d = jQuery(this);
				l && (a.navigation.bullets.rtl ? F(b, g, c, a) : F(b, g, d, a));
				h && (a.navigation.thumbnails.rtl ? y(b, f, c, "tp-thumb", a) : y(b, f, d, "tp-thumb", a));
				k && (a.navigation.tabs.rtl ? y(b, m, c, "tp-tab", a) : y(b, m, d, "tp-tab", a))
			});
			b.bind("revolution.slide.onafterswap revolution.nextslide.waiting", function() {
				var k = 0 == b.find(".next-revslide").length ? b.find(".active-revslide").data("index") : b.find(".next-revslide").data("index");
				b.find(".tp-bullet").each(function() {
					var a = jQuery(this);
					a.data("liref") === k ? a.addClass("selected") : a.removeClass("selected")
				});
				d.find(".tp-thumb, .tp-tab").each(function() {
					var a = jQuery(this);
					a.data("liref") === k ? (a.addClass("selected"), a.hasClass("tp-tab") ? x(d.find(".tp-tabs"), m) : x(d.find(".tp-thumbs"), f)) : a.removeClass("selected")
				});
				var h = 0,
					l = !1;
				a.thumbs && jQuery.each(a.thumbs, function(a, b) {
					h = !1 === l ? a : h;
					l = b.id === k || a === k || l
				});
				var g = 0 < h ? h - 1 : a.slideamount - 1,
					e = h + 1 == a.slideamount ? 0 : h + 1;
				if (!0 === c.enable) {
					var p = c.tmp;
					(void 0 != a.thumbs[g] && jQuery.each(a.thumbs[g].params, function(a, b) {
						p = p.replace(b.from, b.to)
					}), c.left.j.html(p), p = c.tmp, e > a.slideamount) || (jQuery.each(a.thumbs[e].params, function(a, b) {
						p = p.replace(b.from, b.to)
					}), c.right.j.html(p), punchgs.TweenLite.set(c.left.j.find(".tp-arr-imgholder"), {
						backgroundImage: "url(" + a.thumbs[g].src + ")"
					}), punchgs.TweenLite.set(c.right.j.find(".tp-arr-imgholder"), {
						backgroundImage: "url(" + a.thumbs[e].src + ")"
					}))
				}
			});
			z(c);
			z(g);
			z(f);
			z(m);
			d.on("mouseenter mousemove", function() {
				d.hasClass("tp-mouseover") || (d.addClass("tp-mouseover"), punchgs.TweenLite.killDelayedCallsTo(t), e && c.hide_onleave && t(d.find(".tparrows"), c, "show"), l && g.hide_onleave && t(d.find(".tp-bullets"), g, "show"), h && f.hide_onleave && t(d.find(".tp-thumbs"), f, "show"), k && m.hide_onleave && t(d.find(".tp-tabs"), m, "show"), v && (d.removeClass("tp-mouseover"), G(b, a)))
			});
			d.on("mouseleave", function() {
				d.removeClass("tp-mouseover");
				G(b, a)
			});
			e && c.hide_onleave && t(d.find(".tparrows"), c, "hide", 0);
			l && g.hide_onleave && t(d.find(".tp-bullets"), g, "hide", 0);
			h && f.hide_onleave && t(d.find(".tp-thumbs"), f, "hide", 0);
			k && m.hide_onleave && t(d.find(".tp-tabs"), m, "hide", 0);
			h && A(d.find(".tp-thumbs"), a);
			k && A(d.find(".tp-tabs"), a);
			"carousel" === a.sliderType && A(b, a, !0);
			"on" == a.navigation.touch.touchenabled && A(b, a, "swipebased")
		}
	});
	var x = function(b, a) {
			var d = (b.hasClass("tp-thumbs") ? ".tp-thumbs" : ".tp-tabs", b.hasClass("tp-thumbs") ? ".tp-thumb-mask" : ".tp-tab-mask"),
				c = b.hasClass("tp-thumbs") ? ".tp-thumbs-inner-wrapper" : ".tp-tabs-inner-wrapper",
				g = b.hasClass("tp-thumbs") ? ".tp-thumb" : ".tp-tab",
				d = b.find(d),
				c = d.find(c),
				f = a.direction;
			a = "vertical" === f ? d.find(g).first().outerHeight(!0) + a.space : d.find(g).first().outerWidth(!0) + a.space;
			var m = "vertical" === f ? d.height() : d.width(),
				e = parseInt(d.find(g + ".selected").data("liindex"), 0),
				g = m / a,
				l = "vertical" === f ? d.height() : d.width(),
				e = 0 - e * a,
				h = "vertical" === f ? c.height() : c.width(),
				k = e < 0 - (h - l) ? 0 - (h - l) : 0 < k ? 0 : e,
				p = c.data("offset");
			2 < g && (k = 0 >= e - (p + a) ? e - (p + a) < 0 - a ? p : k + a : k, k = e - a + p + m < a && e + (Math.round(g) - 2) * a < p ? e + (Math.round(g) - 2) * a : k);
			k = k < 0 - (h - l) ? 0 - (h - l) : 0 < k ? 0 : k;
			"vertical" !== f && d.width() >= c.width() && (k = 0);
			"vertical" === f && d.height() >= c.height() && (k = 0);
			b.hasClass("dragged") || ("vertical" === f ? c.data("tmmove", punchgs.TweenLite.to(c, .5, {
				top: k + "px",
				ease: punchgs.Power3.easeInOut
			})) : c.data("tmmove", punchgs.TweenLite.to(c, .5, {
				left: k + "px",
				ease: punchgs.Power3.easeInOut
			})), c.data("offset", k))
		},
		E = function(b, a, d, c, g, f) {
			d = d.parent().find(".tp-" + f + "s");
			var m = d.find(".tp-" + f + "s-inner-wrapper"),
				e = d.find(".tp-" + f + "-mask"),
				l = c.width * b < c.min_width ? c.min_width : Math.round(c.width * b),
				h = Math.round(l / c.width * c.height);
			b = "vertical" === c.direction ? l : l * g + c.space * (g - 1);
			g = "vertical" === c.direction ? h * g + c.space * (g - 1) : h;
			a.add(punchgs.TweenLite.set(d, "vertical" === c.direction ? {
				width: l + "px"
			} : {
				height: h + "px"
			}));
			a.add(punchgs.TweenLite.set(m, {
				width: b + "px",
				height: g + "px"
			}));
			a.add(punchgs.TweenLite.set(e, {
				width: b + "px",
				height: g + "px"
			}));
			f = m.find(".tp-" + f);
			return f && jQuery.each(f, function(b, d) {
				"vertical" === c.direction ? a.add(punchgs.TweenLite.set(d, {
					top: b * (h + parseInt(void 0 === c.space ? 0 : c.space, 0)),
					width: l + "px",
					height: h + "px"
				})) : "horizontal" === c.direction && a.add(punchgs.TweenLite.set(d, {
					left: b * (l + parseInt(void 0 === c.space ? 0 : c.space, 0)),
					width: l + "px",
					height: h + "px"
				}))
			}), a
		},
		K = function(b, a) {
			"on" === a.navigation.keyboardNavigation && jQuery(document).keydown(function(d) {
				("horizontal" == a.navigation.keyboard_direction && 39 == d.keyCode || "vertical" == a.navigation.keyboard_direction && 40 == d.keyCode) && (a.sc_indicator = "arrow", a.sc_indicator_dir = 0, p.callingNewSlide(b, 1));
				("horizontal" == a.navigation.keyboard_direction && 37 == d.keyCode || "vertical" == a.navigation.keyboard_direction && 38 == d.keyCode) && (a.sc_indicator = "arrow", a.sc_indicator_dir = 1, p.callingNewSlide(b, -1))
			})
		},
		L = function(b, a) {
			if ("on" === a.navigation.mouseScrollNavigation || "carousel" === a.navigation.mouseScrollNavigation) {
				a.isIEEleven = !! navigator.userAgent.match(/Trident.*rv\:11\./);
				a.isSafari = !! navigator.userAgent.match(/safari/i);
				a.ischrome = !! navigator.userAgent.match(/chrome/i);
				var d = a.ischrome ? -49 : a.isIEEleven || a.isSafari ? -9 : navigator.userAgent.match(/mozilla/i) ? -29 : -49,
					c = a.ischrome ? 49 : a.isIEEleven || a.isSafari ? 9 : navigator.userAgent.match(/mozilla/i) ? 29 : 49;
				b.on("mousewheel DOMMouseScroll", function(g) {
					var f;
					f = g.originalEvent;
					var m = 0,
						e = 0,
						l = 0,
						h = 0;
					f = ("detail" in f && (e = f.detail), "wheelDelta" in f && (e = -f.wheelDelta / 120), "wheelDeltaY" in f && (e = -f.wheelDeltaY / 120), "wheelDeltaX" in f && (m = -f.wheelDeltaX / 120), "axis" in f && f.axis === f.HORIZONTAL_AXIS && (m = e, e = 0), l = 1 * m, h = 1 * e, "deltaY" in f && (h = f.deltaY), "deltaX" in f && (l = f.deltaX), (l || h) && f.deltaMode && (l *= 1, h *= 1), l && !m && (m = 1 > l ? -1 : 1), h && !e && (e = 1 > h ? -1 : 1), h = navigator.userAgent.match(/mozilla/i) ? 10 * h : h, (300 < h || -300 > h) && (h /= 10), {
						spinX: m,
						spinY: e,
						pixelX: l,
						pixelY: h
					});
					m = b.find(".tp-revslider-slidesli.active-revslide").index();
					e = b.find(".tp-revslider-slidesli.processing-revslide").index();
					l = -1 != m && 0 == m || -1 != e && 0 == e;
					h = -1 != m && m == a.slideamount - 1 || 1 != e && e == a.slideamount - 1;
					m = !0;
					"carousel" == a.navigation.mouseScrollNavigation && (l = h = !1); - 1 == e ? f.pixelY < d ? (l || (a.sc_indicator = "arrow", "reverse" !== a.navigation.mouseScrollReverse && (a.sc_indicator_dir = 1, p.callingNewSlide(b, -1)), m = !1), h || (a.sc_indicator = "arrow", "reverse" === a.navigation.mouseScrollReverse && (a.sc_indicator_dir = 0, p.callingNewSlide(b, 1)), m = !1)) : f.pixelY > c && (h || (a.sc_indicator = "arrow", "reverse" !== a.navigation.mouseScrollReverse && (a.sc_indicator_dir = 0, p.callingNewSlide(b, 1)), m = !1), l || (a.sc_indicator = "arrow", "reverse" === a.navigation.mouseScrollReverse && (a.sc_indicator_dir = 1, p.callingNewSlide(b, -1)), m = !1)) : m = !1;
					e = a.c.offset().top - jQuery("body").scrollTop();
					l = e + a.c.height();
					return "carousel" != a.navigation.mouseScrollNavigation ? ("reverse" !== a.navigation.mouseScrollReverse && (0 < e && 0 < f.pixelY || l < jQuery(window).height() && 0 > f.pixelY) && (m = !0), "reverse" === a.navigation.mouseScrollReverse && (0 > e && 0 > f.pixelY || l > jQuery(window).height() && 0 < f.pixelY) && (m = !0)) : m = !1, 0 == m ? (g.preventDefault(g), !1) : void 0
				})
			}
		},
		C = function(b, a, d) {
			return b = v ? jQuery(d.target).closest("." + b).length || jQuery(d.srcElement).closest("." + b).length : jQuery(d.toElement).closest("." + b).length || jQuery(d.originalTarget).closest("." + b).length, !0 === b || 1 === b ? 1 : 0
		},
		A = function(b, a, d) {
			var c = a.carousel;
		//	jQuery(".bullet, .bullets, .tp-bullets, .tparrows").addClass("noSwipe");
			c.Limit = "endless";
			var g = (v || "Firefox" === p.get_browser(), b),
				f = "vertical" === a.navigation.thumbnails.direction || "vertical" === a.navigation.tabs.direction ? "none" : "vertical",
				m = a.navigation.touch.swipe_direction || "horizontal";
			jQuery.fn.swipetp || (jQuery.fn.swipetp = jQuery.fn.swipe);
			jQuery.fn.swipetp.defaults && jQuery.fn.swipetp.defaults.excludedElements || jQuery.fn.swipetp.defaults || (jQuery.fn.swipetp.defaults = {});
		//	jQuery.fn.swipetp.defaults.excludedElements = "label, button, input, select, textarea, .noSwipe";
			g.swipetp({
				allowPageScroll: "swipebased" == d && "vertical" == m ? "none" : d ? "vertical" : f,
				triggerOnTouchLeave: !0,
				treshold: a.navigation.touch.swipe_treshold,
				fingers: a.navigation.touch.swipe_min_touches,
				excludeElements: jQuery.fn.swipetp.defaults.excludedElements,
				swipeStatus: function(d, f, h, k, g, n, r) {
					g = C("rev_slider_wrapper", b, d);
					n = C("tp-thumbs", b, d);
					r = C("tp-tabs", b, d);
					d = !! jQuery(this).attr("class").match(/tp-tabs|tp-thumb/gi);
					if ("carousel" === a.sliderType && (("move" === f || "end" === f || "cancel" == f) && a.dragStartedOverSlider && !a.dragStartedOverThumbs && !a.dragStartedOverTabs || "start" === f && 0 < g && 0 === n && 0 === r)) switch (a.dragStartedOverSlider = !0, k = h && h.match(/left|up/g) ? Math.round(-1 * k) : k = Math.round(1 * k), f) {
					case "start":
						void 0 !== c.positionanim && (c.positionanim.kill(), c.slide_globaloffset = "off" === c.infinity ? c.slide_offset : p.simp(c.slide_offset, c.maxwidth));
						c.overpull = "none";
						c.wrap.addClass("dragged");
						break;
					case "move":
						if (a.c.find(".tp-withaction").addClass("tp-temporarydisabled"), c.slide_offset = "off" === c.infinity ? c.slide_globaloffset + k : p.simp(c.slide_globaloffset + k, c.maxwidth), "off" === c.infinity) f = "center" === c.horizontal_align ? (c.wrapwidth / 2 - c.slide_width / 2 - c.slide_offset) / c.slide_width : (0 - c.slide_offset) / c.slide_width, "none" !== c.overpull && 0 !== c.overpull || !(0 > f || f > a.slideamount - 1) ? 0 <= f && f <= a.slideamount - 1 && (0 <= f && k > c.overpull || f <= a.slideamount - 1 && k < c.overpull) && (c.overpull = 0) : c.overpull = k, c.slide_offset = 0 > f ? c.slide_offset + (c.overpull - k) / 1.1 + Math.sqrt(Math.abs((c.overpull - k) / 1.1)) : f > a.slideamount - 1 ? c.slide_offset + (c.overpull - k) / 1.1 - Math.sqrt(Math.abs((c.overpull - k) / 1.1)) : c.slide_offset;
						p.organiseCarousel(a, h, !0, !0);
						break;
					case "end":
					case "cancel":
						c.slide_globaloffset = c.slide_offset, c.wrap.removeClass("dragged"), p.carouselToEvalPosition(a, h), a.dragStartedOverSlider = !1, a.dragStartedOverThumbs = !1, a.dragStartedOverTabs = !1, setTimeout(function() {
							a.c.find(".tp-withaction").removeClass("tp-temporarydisabled")
						}, 19)
					} else {
						if (("move" !== f && "end" !== f && "cancel" != f || a.dragStartedOverSlider || !a.dragStartedOverThumbs && !a.dragStartedOverTabs) && !("start" === f && 0 < g && (0 < n || 0 < r))) {
							if ("end" == f && !d) {
								if (a.sc_indicator = "arrow", "horizontal" == m && "left" == h || "vertical" == m && "up" == h) return a.sc_indicator_dir = 0, p.callingNewSlide(a.c, 1), !1;
								if ("horizontal" == m && "right" == h || "vertical" == m && "down" == h) return a.sc_indicator_dir = 1, p.callingNewSlide(a.c, -1), !1
							}
							return a.dragStartedOverSlider = !1, a.dragStartedOverThumbs = !1, a.dragStartedOverTabs = !1, !0
						}
						0 < n && (a.dragStartedOverThumbs = !0);
						0 < r && (a.dragStartedOverTabs = !0);
						g = a.dragStartedOverThumbs ? ".tp-thumbs" : ".tp-tabs";
						r = a.dragStartedOverThumbs ? ".tp-thumb-mask" : ".tp-tab-mask";
						n = a.dragStartedOverThumbs ? ".tp-thumbs-inner-wrapper" : ".tp-tabs-inner-wrapper";
						var e = a.dragStartedOverThumbs ? ".tp-thumb" : ".tp-tab",
							l = a.dragStartedOverThumbs ? a.navigation.thumbnails : a.navigation.tabs;
						k = h && h.match(/left|up/g) ? Math.round(-1 * k) : k = Math.round(1 * k);
						h = b.parent().find(r);
						n = h.find(n);
						r = l.direction;
						var q = "vertical" === r ? n.height() : n.width(),
							t = "vertical" === r ? h.height() : h.width(),
							l = "vertical" === r ? h.find(e).first().outerHeight(!0) + l.space : h.find(e).first().outerWidth(!0) + l.space,
							u = void 0 === n.data("offset") ? 0 : parseInt(n.data("offset"), 0),
							e = 0;
						switch (f) {
						case "start":
							b.parent().find(g).addClass("dragged");
							u = "vertical" === r ? n.position().top : n.position().left;
							n.data("offset", u);
							n.data("tmmove") && n.data("tmmove").pause();
							break;
						case "move":
							if (q <= t) return !1;
							e = u + k;
							e = 0 < e ? "horizontal" === r ? e - n.width() * (e / n.width() * e / n.width()) : e - n.height() * (e / n.height() * e / n.height()) : e;
							k = "vertical" === r ? 0 - (n.height() - h.height()) : 0 - (n.width() - h.width());
							e = e < k ? "horizontal" === r ? e + n.width() * (e - k) / n.width() * (e - k) / n.width() : e + n.height() * (e - k) / n.height() * (e - k) / n.height() : e;
							"vertical" === r ? punchgs.TweenLite.set(n, {
								top: e + "px"
							}) : punchgs.TweenLite.set(n, {
								left: e + "px"
							});
							break;
						case "end":
						case "cancel":
							if (d) return e = u + k, e = "vertical" === r ? e < 0 - (n.height() - h.height()) ? 0 - (n.height() - h.height()) : e : e < 0 - (n.width() - h.width()) ? 0 - (n.width() - h.width()) : e, e = 0 < e ? 0 : e, e = Math.abs(k) > l / 10 ? 0 >= k ? Math.floor(e / l) * l : Math.ceil(e / l) * l : 0 > k ? Math.ceil(e / l) * l : Math.floor(e / l) * l, e = "vertical" === r ? e < 0 - (n.height() - h.height()) ? 0 - (n.height() - h.height()) : e : e < 0 - (n.width() - h.width()) ? 0 - (n.width() - h.width()) : e, e = 0 < e ? 0 : e, "vertical" === r ? punchgs.TweenLite.to(n, .5, {
								top: e + "px",
								ease: punchgs.Power3.easeOut
							}) : punchgs.TweenLite.to(n, .5, {
								left: e + "px",
								ease: punchgs.Power3.easeOut
							}), e = e ? e : "vertical" === r ? n.position().top : n.position().left, n.data("offset", e), n.data("distance", k), setTimeout(function() {
								a.dragStartedOverSlider = !1;
								a.dragStartedOverThumbs = !1;
								a.dragStartedOverTabs = !1
							}, 100), b.parent().find(g).removeClass("dragged"), !1
						}
					}
				}
			})
		},
		z = function(b) {
			b.hide_delay = jQuery.isNumeric(parseInt(b.hide_delay, 0)) ? b.hide_delay / 1E3 : .2;
			b.hide_delay_mobile = jQuery.isNumeric(parseInt(b.hide_delay_mobile, 0)) ? b.hide_delay_mobile / 1E3 : .2
		},
		q = function(b) {
			return b && b.enable
		},
		B = function(b) {
			return b && b.enable && !0 === b.hide_onleave && (void 0 === b.position || !b.position.match(/outer/g))
		},
		G = function(b, a) {
			b = b.parent();
			B(a.navigation.arrows) && punchgs.TweenLite.delayedCall(v ? a.navigation.arrows.hide_delay_mobile : a.navigation.arrows.hide_delay, t, [b.find(".tparrows"), a.navigation.arrows, "hide"]);
			B(a.navigation.bullets) && punchgs.TweenLite.delayedCall(v ? a.navigation.bullets.hide_delay_mobile : a.navigation.bullets.hide_delay, t, [b.find(".tp-bullets"), a.navigation.bullets, "hide"]);
			B(a.navigation.thumbnails) && punchgs.TweenLite.delayedCall(v ? a.navigation.thumbnails.hide_delay_mobile : a.navigation.thumbnails.hide_delay, t, [b.find(".tp-thumbs"), a.navigation.thumbnails, "hide"]);
			B(a.navigation.tabs) && punchgs.TweenLite.delayedCall(v ? a.navigation.tabs.hide_delay_mobile : a.navigation.tabs.hide_delay, t, [b.find(".tp-tabs"), a.navigation.tabs, "hide"])
		},
		t = function(b, a, d, c) {
			switch (c = void 0 === c ? .5 : c, d) {
			case "show":
				punchgs.TweenLite.to(b, c, {
					autoAlpha: 1,
					ease: punchgs.Power3.easeInOut,
					overwrite: "auto"
				});
				break;
			case "hide":
				punchgs.TweenLite.to(b, c, {
					autoAlpha: 0,
					ease: punchgs.Power3.easeInOu,
					overwrite: "auto"
				})
			}
		},
		M = function(b, a, d) {
			a.style = void 0 === a.style ? "" : a.style;
			a.left.style = void 0 === a.left.style ? "" : a.left.style;
			a.right.style = void 0 === a.right.style ? "" : a.right.style;
			0 === b.find(".tp-leftarrow.tparrows").length && b.append('<div class="tp-leftarrow tparrows ' + a.style + " " + a.left.style + '">' + a.tmp + "</div>");
			0 === b.find(".tp-rightarrow.tparrows").length && b.append('<div class="tp-rightarrow tparrows ' + a.style + " " + a.right.style + '">' + a.tmp + "</div>");
			var c = b.find(".tp-leftarrow.tparrows"),
				g = b.find(".tp-rightarrow.tparrows");
			a.rtl ? (c.click(function() {
				d.sc_indicator = "arrow";
				d.sc_indicator_dir = 0;
				b.revnext()
			}), g.click(function() {
				d.sc_indicator = "arrow";
				d.sc_indicator_dir = 1;
				b.revprev()
			})) : (g.click(function() {
				d.sc_indicator = "arrow";
				d.sc_indicator_dir = 0;
				b.revnext()
			}), c.click(function() {
				d.sc_indicator = "arrow";
				d.sc_indicator_dir = 1;
				b.revprev()
			}));
			a.right.j = b.find(".tp-rightarrow.tparrows");
			a.left.j = b.find(".tp-leftarrow.tparrows");
			a.padding_top = parseInt(d.carousel.padding_top || 0, 0);
			a.padding_bottom = parseInt(d.carousel.padding_bottom || 0, 0);
			u(c, a.left, d);
			u(g, a.right, d);
			a.left.opt = d;
			a.right.opt = d;
			"outer-left" != a.position && "outer-right" != a.position || (d.outernav = !0)
		},
		H = function(b, a, d) {
			var c = b.outerHeight(!0),
				g = (b.outerWidth(!0), void 0 == a.opt ? 0 : 0 == d.conh ? d.height : d.conh);
			d = "layergrid" == a.container ? "fullscreen" == d.sliderLayout ? d.height / 2 - d.gridheight[d.curWinRange] * d.bh / 2 : "on" == d.autoHeight || void 0 != d.minHeight && 0 < d.minHeight ? g / 2 - d.gridheight[d.curWinRange] * d.bh / 2 : 0 : 0;
			a = "top" === a.v_align ? {
				top: "0px",
				y: Math.round(a.v_offset + d) + "px"
			} : "center" === a.v_align ? {
				top: "90%",
				y: Math.round(0 - c / 2 + a.v_offset) + "px"
			} : {
				top: "90%",
				y: Math.round(0 - (c + a.v_offset + d)) + "px"
			};
			b.hasClass("outer-bottom") || punchgs.TweenLite.set(b, a)
		},
		I = function(b, a, d) {
			var c = (b.outerHeight(!0), b.outerWidth(!0));
			d = "layergrid" == a.container ? "carousel" === d.sliderType ? 0 : d.width / 2 - d.gridwidth[d.curWinRange] * d.bw / 2 : 0;
			punchgs.TweenLite.set(b, "left" === a.h_align ? {
				left: "0px",
				x: Math.round(a.h_offset + d) + "px"
			} : "center" === a.h_align ? {
				left: "50%",
				x: Math.round(0 - c / 2 + a.h_offset) + "px"
			} : {
				left: "50%",
				x: Math.round(0 - (c + a.h_offset + d)) + "px"
			})
		},
		u = function(b, a, d) {
			var c = 0 < b.closest(".tp-simpleresponsive").length ? b.closest(".tp-simpleresponsive") : 0 < b.closest(".tp-revslider-mainul").length ? b.closest(".tp-revslider-mainul") : 0 < b.closest(".rev_slider_wrapper").length ? b.closest(".rev_slider_wrapper") : b.parent().find(".tp-revslider-mainul"),
				g = c.width(),
				c = c.height();
			if (H(b, a, d), I(b, a, d), "outer-left" !== a.position || "fullwidth" != a.sliderLayout && "fullscreen" != a.sliderLayout ? "outer-right" !== a.position || "fullwidth" != a.sliderLayout && "fullscreen" != a.sliderLayout || punchgs.TweenLite.set(b, {
				right: 0 - b.outerWidth() + "px",
				x: a.h_offset + "px"
			}) : punchgs.TweenLite.set(b, {
				left: 0 - b.outerWidth() + "px",
				x: a.h_offset + "px"
			}), b.hasClass("tp-thumbs") || b.hasClass("tp-tabs")) {
				var f = b.data("wr_padding"),
					m = b.data("maxw"),
					e = b.data("maxh"),
					l = b.hasClass("tp-thumbs") ? b.find(".tp-thumb-mask") : b.find(".tp-tab-mask"),
					h = parseInt(a.padding_top || 0, 0),
					k = parseInt(a.padding_bottom || 0, 0);
				m > g && "outer-left" !== a.position && "outer-right" !== a.position ? (punchgs.TweenLite.set(b, {
					left: "0px",
					x: 0,
					maxWidth: g - 2 * f + "px"
				}), punchgs.TweenLite.set(l, {
					maxWidth: g - 2 * f + "px"
				})) : (punchgs.TweenLite.set(b, {
					maxWidth: m + "px"
				}), punchgs.TweenLite.set(l, {
					maxWidth: m + "px"
				}));
				e + 2 * f > c && "outer-bottom" !== a.position && "outer-top" !== a.position ? (punchgs.TweenLite.set(b, {
					top: "0px",
					y: 0,
					maxHeight: h + k + (c - 2 * f) + "px"
				}), punchgs.TweenLite.set(l, {
					maxHeight: h + k + (c - 2 * f) + "px"
				})) : (punchgs.TweenLite.set(b, {
					maxHeight: e + "px"
				}), punchgs.TweenLite.set(l, {
					maxHeight: e + "px"
				}));
				"outer-left" !== a.position && "outer-right" !== a.position && (h = 0, k = 0);
				!0 === a.span && "vertical" === a.direction ? (punchgs.TweenLite.set(b, {
					maxHeight: h + k + (c - 2 * f) + "px",
					height: h + k + (c - 2 * f) + "px",
					top: 0 - h,
					y: 0
				}), H(l, a, d)) : !0 === a.span && "horizontal" === a.direction && (punchgs.TweenLite.set(b, {
					maxWidth: "100%",
					width: g - 2 * f + "px",
					left: 0,
					x: 0
				}), I(l, a, d))
			}
		},
		F = function(b, a, d, c) {
			0 === b.find(".tp-bullets").length && (a.style = void 0 === a.style ? "" : a.style, b.append('<div class="tp-bullets ' + a.style + " " + a.direction + '"></div>'));
			var g = b.find(".tp-bullets"),
				f = d.data("index"),
				m = a.tmp;
			jQuery.each(c.thumbs[d.index()].params, function(a, b) {
				m = m.replace(b.from, b.to)
			});
			g.append('<div class="justaddedbullet tp-bullet">' + m + "</div>");
			var e = b.find(".justaddedbullet"),
				l = b.find(".tp-bullet").length,
				h = e.outerWidth() + parseInt(void 0 === a.space ? 0 : a.space, 0),
				k = e.outerHeight() + parseInt(void 0 === a.space ? 0 : a.space, 0);
			"vertical" === a.direction ? (e.css({
				left: (l - 1) * k + "px",
				top: "0px"
			}), g.css({
				height: (l - 1) * k + e.outerHeight(),
				width: e.outerWidth()
			})) : (e.css({
				left: (l - 1) * h + "px",
				top: "0px"
			}), g.css({
				width: (l - 1) * h + e.outerWidth(),
				height: e.outerHeight()
			}));
			e.find(".tp-bullet-image").css({
				backgroundImage: "url(" + c.thumbs[d.index()].src + ")"
			});
			e.data("liref", f);
			e.click(function() {
				c.sc_indicator = "bullet";
				b.revcallslidewithid(f);
				b.find(".tp-bullet").removeClass("selected");
				jQuery(this).addClass("selected")
			});
			e.removeClass("justaddedbullet");
			a.padding_top = parseInt(c.carousel.padding_top || 0, 0);
			a.padding_bottom = parseInt(c.carousel.padding_bottom || 0, 0);
			a.opt = c;
			"outer-left" != a.position && "outer-right" != a.position || (c.outernav = !0);
			g.addClass("nav-pos-hor-" + a.h_align);
			g.addClass("nav-pos-ver-" + a.v_align);
			g.addClass("nav-dir-" + a.direction);
			u(g, a, c)
		},
		N = function(b, a) {
			a = parseFloat(a);
			b = b.replace("#", "");
			var d = parseInt(b.substring(0, 2), 16),
				c = parseInt(b.substring(2, 4), 16);
			b = parseInt(b.substring(4, 6), 16);
			return "rgba(" + d + "," + c + "," + b + "," + a + ")"
		},
		y = function(b, a, d, c, g) {
			var f = "tp-thumb" === c ? ".tp-thumbs" : ".tp-tabs",
				m = "tp-thumb" === c ? ".tp-thumb-mask" : ".tp-tab-mask",
				e = "tp-thumb" === c ? ".tp-thumbs-inner-wrapper" : ".tp-tabs-inner-wrapper",
				l = "tp-thumb" === c ? ".tp-thumb" : ".tp-tab",
				h = "tp-thumb" === c ? ".tp-thumb-image" : ".tp-tab-image";
			if (a.visibleAmount = a.visibleAmount > g.slideamount ? g.slideamount : a.visibleAmount, a.sliderLayout = g.sliderLayout, 0 === b.parent().find(f).length) {
				a.style = void 0 === a.style ? "" : a.style;
				var k = '<div class="' + c + "s " + (!0 === a.span ? "tp-span-wrapper" : "") + " " + a.position + " " + a.style + '"><div class="' + c + '-mask"><div class="' + c + 's-inner-wrapper" style="position:relative;"></div></div></div>';
				"outer-top" === a.position ? b.parent().prepend(k) : "outer-bottom" === a.position ? b.after(k) : b.append(k);
				a.padding_top = parseInt(g.carousel.padding_top || 0, 0);
				a.padding_bottom = parseInt(g.carousel.padding_bottom || 0, 0);
				"outer-left" != a.position && "outer-right" != a.position || (g.outernav = !0)
			}
			var p = d.data("index"),
				k = b.parent().find(f),
				m = k.find(m),
				n = m.find(e),
				r = "horizontal" === a.direction ? a.width * a.visibleAmount + a.space * (a.visibleAmount - 1) : a.width,
				q = "horizontal" === a.direction ? a.height : a.height * a.visibleAmount + a.space * (a.visibleAmount - 1),
				t = a.tmp;
			jQuery.each(g.thumbs[d.index()].params, function(a, b) {
				t = t.replace(b.from, b.to)
			});
			n.append('<div data-liindex="' + d.index() + '" data-liref="' + p + '" class="justaddedthumb ' + c + '" style="width:' + a.width + "px;height:" + a.height + 'px;">' + t + "</div>");
			c = k.find(".justaddedthumb");
			var l = k.find(l).length,
				v = c.outerWidth() + parseInt(void 0 === a.space ? 0 : a.space, 0),
				w = c.outerHeight() + parseInt(void 0 === a.space ? 0 : a.space, 0);
			c.find(h).css({
				backgroundImage: "url(" + g.thumbs[d.index()].src + ")"
			});
			"vertical" === a.direction ? (c.css({
				top: (l - 1) * w + "px",
				left: "0px"
			}), n.css({
				height: (l - 1) * w + c.outerHeight(),
				width: c.outerWidth()
			})) : (c.css({
				left: (l - 1) * v + "px",
				top: "0px"
			}), n.css({
				width: (l - 1) * v + c.outerWidth(),
				height: c.outerHeight()
			}));
			k.data("maxw", r);
			k.data("maxh", q);
			k.data("wr_padding", a.wrapper_padding);
			d = "outer-top" === a.position || "outer-bottom" === a.position ? "relative" : "absolute";
			"outer-top" !== a.position && "outer-bottom" !== a.position || "center" !== a.h_align ? "0" : "auto";
			m.css({
				maxWidth: r + "px",
				maxHeight: q + "px",
				overflow: "hidden",
				position: "relative"
			});
			k.css({
				maxWidth: r + "px",
				maxHeight: q + "px",
				overflow: "visible",
				position: d,
				background: N(a.wrapper_color, a.wrapper_opacity),
				padding: a.wrapper_padding + "px",
				boxSizing: "contet-box"
			});
			c.click(function() {
				g.sc_indicator = "bullet";
				var a = b.parent().find(e).data("distance");
				10 > Math.abs(void 0 === a ? 0 : a) && (b.revcallslidewithid(p), b.parent().find(f).removeClass("selected"), jQuery(this).addClass("selected"))
			});
			c.removeClass("justaddedthumb");
			a.opt = g;
			k.addClass("nav-pos-hor-" + a.h_align);
			k.addClass("nav-pos-ver-" + a.v_align);
			k.addClass("nav-dir-" + a.direction);
			u(k, a, g)
		},
		D = function(b) {
			var a = b.c.parent().find(".outer-top"),
				d = b.c.parent().find(".outer-bottom");
			b.top_outer = a.hasClass("tp-forcenotvisible") ? 0 : a.outerHeight() || 0;
			b.bottom_outer = d.hasClass("tp-forcenotvisible") ? 0 : d.outerHeight() || 0
		},
		w = function(b, a, d, c) {
			/*a > d || d > c ? b.addClass("tp-forcenotvisible") : b.removeClass("tp-forcenotvisible")*/
		}
}(jQuery);