"use strict";

/* =========================
   Floating Navbar
   Shown once the hero has scrolled out of view.
========================= */

function initFloatingNavbar() {
  const hero = document.querySelector(".hero");
  const floatingNavbar = document.querySelector(".navbar-floating");

  if (!hero || !floatingNavbar) return;

  const observer = new IntersectionObserver(([entry]) => {
    floatingNavbar.classList.toggle("visible", !entry.isIntersecting);
  });

  observer.observe(hero);
}

/* =========================
   Mobile Navigation
========================= */

function initMobileNav() {
  const toggles = document.querySelectorAll(".nav-toggle");

  // Must match the CSS breakpoint where the menu button appears (64rem).
  const desktopNav = window.matchMedia("(width > 64rem)");

  function setMenu(navbar, toggle, isOpen) {
    navbar.classList.toggle("menu-open", isOpen);

    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute(
      "aria-label",
      isOpen ? "Close navigation" : "Open navigation"
    );

    toggle
      .querySelector("ion-icon")
      ?.setAttribute("name", isOpen ? "close-outline" : "menu-outline");
  }

  toggles.forEach((toggle) => {
    const navbar = toggle.closest(".navbar");

    if (!navbar) return;

    toggle.addEventListener("click", () => {
      setMenu(navbar, toggle, !navbar.classList.contains("menu-open"));
    });

    // Close the menu after choosing a link
    navbar.addEventListener("click", (event) => {
      if (event.target.closest("a")) setMenu(navbar, toggle, false);
    });

    // Close the menu with Escape and return focus to the button
    navbar.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && navbar.classList.contains("menu-open")) {
        setMenu(navbar, toggle, false);
        toggle.focus();
      }
    });
  });

  // Reset any open menu when the window grows to the desktop layout
  desktopNav.addEventListener("change", (event) => {
    if (!event.matches) return;

    toggles.forEach((toggle) => {
      const navbar = toggle.closest(".navbar");

      if (navbar) setMenu(navbar, toggle, false);
    });
  });
}

/* =========================
   Gallery Carousel
========================= */

function initGallery() {
  const viewport = document.querySelector(".gallery-viewport");
  const track = document.querySelector(".gallery-track");
  const slides = document.querySelectorAll(".gallery-slide");
  const prevButton = document.querySelector(".gallery-arrow-prev");
  const nextButton = document.querySelector(".gallery-arrow-next");

  if (!viewport || !track || !slides.length) return;

  let currentIndex = 0;

  // Measure from the page itself, so the script never needs to know the
  // CSS breakpoints (3 slides on desktop, 1 on mobile).
  function getMetrics() {
    const slideWidth = slides[0].getBoundingClientRect().width;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    const step = slideWidth + gap;

    const visibleSlides = Math.max(
      1,
      Math.round((viewport.clientWidth + gap) / step)
    );

    return {
      step,
      maxIndex: Math.max(0, slides.length - visibleSlides),
    };
  }

  function goTo(index) {
    const { step, maxIndex } = getMetrics();

    currentIndex = Math.min(Math.max(index, 0), maxIndex);
    track.style.transform = `translateX(${-currentIndex * step}px)`;
  }

  nextButton?.addEventListener("click", () => {
    const { maxIndex } = getMetrics();

    goTo(currentIndex >= maxIndex ? 0 : currentIndex + 1);
  });

  prevButton?.addEventListener("click", () => {
    const { maxIndex } = getMetrics();

    goTo(currentIndex <= 0 ? maxIndex : currentIndex - 1);
  });

  // Re-align whenever the gallery changes size (also runs once on load)
  new ResizeObserver(() => goTo(currentIndex)).observe(viewport);
}

/* =========================
   Initialise
========================= */

initFloatingNavbar();
initMobileNav();
initGallery();
