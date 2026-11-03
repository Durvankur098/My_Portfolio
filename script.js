const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");
const navItems = Array.from(document.querySelectorAll(".nav-link"));
const backToTop = document.getElementById("back-to-top");
const modal = document.getElementById("project-modal");
const modalTitle = document.getElementById("modal-title");
const modalDescription = document.getElementById("modal-description");
const modalFeatures = document.getElementById("modal-features");
const modalTech = document.getElementById("modal-tech");
const closeModalButtons = document.querySelectorAll("[data-close-modal]");
let lastFocusedElement = null;

const projectInfo = {
  skillsprint: {
    title: "SkillSprint",
    description: "SkillSprint is an AI-powered interview preparation and assessment platform concept designed to help learners practice and improve their readiness for technical interviews.",
    features: [
      "Practice aptitude and DSA questions.",
      "Support structured assessments and submissions.",
      "Help learners review their performance and identify areas to improve."
    ],
    technologies: "Technologies: React · Node.js · MongoDB"
  },
  music: {
    title: "Music Recommendation System",
    description: "A Python-based music recommendation project that compares song information to suggest tracks with similar characteristics.",
    features: [
      "Uses TF-IDF vectorization to represent text features.",
      "Uses cosine similarity to compare songs.",
      "Includes a simple graphical interface built with Tkinter."
    ],
    technologies: "Technologies: Python · TF-IDF · Cosine Similarity · Tkinter"
  }
};

// Mobile navigation
function closeMobileMenu() {
  navLinks.classList.remove("open");
  menuToggle.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation menu");
}
menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.classList.toggle("is-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
});
navItems.forEach((link) => link.addEventListener("click", closeMobileMenu));
document.addEventListener("click", (event) => {
  if (window.innerWidth <= 767 && navLinks.classList.contains("open") &&
      !navLinks.contains(event.target) && !menuToggle.contains(event.target)) {
    closeMobileMenu();
  }
});
window.addEventListener("resize", () => {
  if (window.innerWidth > 767) closeMobileMenu();
});

// Reveal sections when they enter the viewport.
const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("in-view"));
}

// Highlight the current navigation section and show back-to-top after scrolling.
const sections = Array.from(document.querySelectorAll("main section[id]"));
function updateScrollUI() {
  backToTop.classList.toggle("visible", window.scrollY > 450);
  let currentId = "home";
  const marker = window.scrollY + 150;
  sections.forEach((section) => {
    if (section.offsetTop <= marker) currentId = section.id;
  });
  navItems.forEach((item) => {
    const active = item.getAttribute("href") === `#${currentId}`;
    item.classList.toggle("active", active);
    if (active) item.setAttribute("aria-current", "location");
    else item.removeAttribute("aria-current");
  });
}
window.addEventListener("scroll", updateScrollUI, { passive: true });
window.addEventListener("load", updateScrollUI);
backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

// Project detail modal.
function openProjectModal(projectKey, trigger) {
  const project = projectInfo[projectKey];
  if (!project) return;
  lastFocusedElement = trigger;
  modalTitle.textContent = project.title;
  modalDescription.textContent = project.description;
  modalFeatures.replaceChildren();
  project.features.forEach((feature) => {
    const li = document.createElement("li");
    li.textContent = feature;
    modalFeatures.appendChild(li);
  });
  modalTech.textContent = project.technologies;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  modal.querySelector(".modal-close").focus();
}
function closeProjectModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  if (lastFocusedElement) lastFocusedElement.focus();
}
document.querySelectorAll("[data-project]").forEach((button) => {
  button.addEventListener("click", () => openProjectModal(button.dataset.project, button));
});
closeModalButtons.forEach((button) => button.addEventListener("click", closeProjectModal));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal.classList.contains("open")) closeProjectModal();
});
