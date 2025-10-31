
/* stylo.js
	 - Reveal on scroll (IntersectionObserver)
	 - Ripple effect for clickable elements with .btn or .theme-button
	 - Smooth scroll for same-page anchors
	 - Respects prefers-reduced-motion
*/

(function () {
	'use strict';

	var prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	// Smooth scroll for anchor links
	function initSmoothScroll() {
		if (prefersReduced) return; // don't animate if user prefers reduced motion
		document.querySelectorAll('a[href^="#"]').forEach(function (a) {
			a.addEventListener('click', function (e) {
				var href = a.getAttribute('href');
				if (href.length > 1) {
					var target = document.querySelector(href);
					if (target) {
						e.preventDefault();
						target.scrollIntoView({behavior: 'smooth', block: 'start'});
						history.pushState(null, '', href);
					}
				}
			});
		});
	}

	// Reveal elements
	function initReveal() {
		var items = document.querySelectorAll('.reveal');
		if (!items.length) return;
		if (prefersReduced) { items.forEach(function (el) { el.classList.add('is-revealed'); }); return; }

			var obs = new IntersectionObserver(function (entries) {
				entries.forEach(function (entry) {
					if (entry.isIntersecting) {
						var container = entry.target;
						// stagger only for services list items for a nicer effect
						if (container.matches && container.matches('.services .service-list')) {
							var items = container.querySelectorAll('li');
							items.forEach(function (it, idx) {
								var delay = idx * 100;
								// alternate direction: even -> left, odd -> right
								var tx = (idx % 2 === 0) ? '-12px' : '12px';
								it.style.setProperty('--reveal-delay', delay + 'ms');
								it.style.setProperty('--reveal-tx', tx);
								it.classList.add('reveal');
								setTimeout(function () { it.classList.add('is-revealed'); }, delay);
							});
						} else if (container.matches && container.matches('.hero')) {
							// reveal hero children: text then image, opposite directions
							var heroText = container.querySelector('.hero-text');
							var heroImage = container.querySelector('.hero-image');
							var nodes = [heroText, heroImage].filter(Boolean);
							nodes.forEach(function (node, idx) {
								var delay = idx * 100;
								var tx = (idx === 0) ? '-18px' : '18px';
								node.style.setProperty('--reveal-delay', delay + 'ms');
								node.style.setProperty('--reveal-tx', tx);
								node.classList.add('reveal');
								setTimeout(function () { node.classList.add('is-revealed'); }, delay);
							});
						} else {
							// generic: reveal container itself
							container.classList.add('is-revealed');
						}
						obs.unobserve(container);
					}
				});
			}, { root: null, rootMargin: '0px 0px -8% 0px', threshold: 0.05 });

			items.forEach(function (el) {
				// initialize CSS variable
				el.style.setProperty('--reveal-delay', '0ms');
				obs.observe(el);
			});
	}

	// Ripple effect
	function createRipple(e) {
		var target = e.currentTarget;
		var rect = target.getBoundingClientRect();
		var ripple = document.createElement('span');
		ripple.className = 'ripple';
		var size = Math.max(rect.width, rect.height) * 1.2;
		ripple.style.width = ripple.style.height = size + 'px';
		ripple.style.left = (e.clientX - rect.left - size/2) + 'px';
		ripple.style.top = (e.clientY - rect.top - size/2) + 'px';
		ripple.style.background = getComputedStyle(target).getPropertyValue('--ripple-color') || 'rgba(0,0,0,0.12)';
		target.appendChild(ripple);
		ripple.style.transform = 'scale(0)';
		ripple.style.opacity = '0.9';
		ripple.style.transition = 'transform 600ms cubic-bezier(.22,.8,.3,1),opacity 600ms ease';
		requestAnimationFrame(function () {
			ripple.style.transform = 'scale(4)';
			ripple.style.opacity = '0';
		});
		setTimeout(function () { try { ripple.remove(); } catch (err) {} }, 700);
	}

	function initRipple() {
		if (prefersReduced) return;
		document.querySelectorAll('.btn, .theme-button').forEach(function (btn) {
			btn.addEventListener('pointerdown', function (e) {
				// only primary button
				if (e.button !== 0) return;
				createRipple(e);
			});
		});
	}

	// init all
	document.addEventListener('DOMContentLoaded', function () {
		initSmoothScroll();
		initReveal();
		initRipple();
	});

})();

