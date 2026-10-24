// Student Portfolio interactions
"use strict";

const root = document.documentElement;
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const navItems = document.querySelectorAll(".nav-link");
const themeToggle = document.querySelector(".theme-toggle");
const filterButtons = document.querySelectorAll(".filter-button");
const projectCards = document.querySelectorAll(".project-card");
const detailButtons = document.querySelectorAll(".details-toggle");
const contactForm = document.querySelector("#contact-form");
const formStatus = document.querySelector("#form-status");
const backToTop = document.querySelector(".back-to-top");

// Set the current year automatically.
document.querySelector("#current-year").textContent = new Date().getFullYear();

// Mobile navigation: open/close menu and close after choosing a section.
menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
});

navItems.forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
  });
});

// Light/dark theme toggle.
themeToggle.addEventListener("click", () => {
  const isDark = root.dataset.theme !== "dark";
  if (isDark) {
    root.dataset.theme = "dark";
  } else {
    delete root.dataset.theme;
  }
  themeToggle.setAttribute("aria-label", isDark ? "Switch to light theme" : "Switch to dark theme");
  themeToggle.title = isDark ? "Switch to light theme" : "Switch to dark theme";
});

// Project category filters.
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selected = button.dataset.filter;
    filterButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle("active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    projectCards.forEach((card) => {
      card.hidden = selected !== "all" && card.dataset.category !== selected;
    });
  });
});

// Expand/collapse project learning notes.
detailButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const details = button.nextElementSibling;
    const expanded = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!expanded));
    details.hidden = expanded;
    button.querySelector("span").textContent = expanded ? "＋" : "−";
  });
});

// Validate contact form locally. This demo does not send or store messages.
const validators = {
  name(value) {
    if (!value.trim()) return "Please enter your name.";
    if (value.trim().length < 2) return "Name must be at least 2 characters.";
    return "";
  },
  email(value) {
    if (!value.trim()) return "Please enter your email address.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) return "Enter a valid email address.";
    return "";
  },
  message(value) {
    if (!value.trim()) return "Please enter a message.";
    if (value.trim().length < 10) return "Please enter at least 10 characters.";
    return "";
  }
};

function showFieldError(field, message) {
  const error = document.querySelector(`#${field.name}-error`);
  error.textContent = message;
  field.setAttribute("aria-invalid", String(Boolean(message)));
}

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  formStatus.textContent = "";
  const fields = ["name", "email", "message"].map((name) => contactForm.elements[name]);
  let isValid = true;

  fields.forEach((field) => {
    const error = validators[field.name](field.value);
    showFieldError(field, error);
    if (error) isValid = false;
  });

  if (isValid) {
    formStatus.textContent = "Thanks! The form passed validation. This demo has not sent your message.";
    contactForm.reset();
    fields.forEach((field) => showFieldError(field, ""));
  } else {
    formStatus.textContent = "Please check the highlighted fields and try again.";
    const firstInvalid = fields.find((field) => field.getAttribute("aria-invalid") === "true");
    if (firstInvalid) firstInvalid.focus();
  }
});

// Clear a field's error as the visitor edits it.
["name", "email", "message"].forEach((name) => {
  const field = contactForm.elements[name];
  field.addEventListener("input", () => {
    if (field.getAttribute("aria-invalid") === "true") {
      showFieldError(field, validators[name](field.value));
    }
    formStatus.textContent = "";
  });
});

// Highlight the current section in the navigation.
const sections = document.querySelectorAll("main section[id]");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navItems.forEach((link) => {
          const active = link.getAttribute("href") === `#${entry.target.id}`;
          link.classList.toggle("active", active);
          if (active) link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        });
      }
    });
  }, { rootMargin: "-35% 0px -55% 0px" });
  sections.forEach((section) => observer.observe(section));
}

// Back-to-top control appears after scrolling.
window.addEventListener("scroll", () => {
  backToTop.classList.toggle("visible", window.scrollY > 500);
}, { passive: true });

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
