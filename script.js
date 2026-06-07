const header = document.querySelector(".site-header");
const progress = document.querySelector(".reading-progress span");
const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".site-nav");
const navLinks = [...document.querySelectorAll('.site-nav a[href^="#"]')];
const sections = [...document.querySelectorAll("main section[id]")];

function updateScrollState() {
  const top = window.scrollY;
  const height = document.documentElement.scrollHeight - window.innerHeight;
  header.classList.toggle("scrolled", top > 30);
  progress.style.width = `${height > 0 ? (top / height) * 100 : 0}%`;

  let current = sections[0]?.id;
  for (const section of sections) {
    if (top >= section.offsetTop - 180) current = section.id;
  }

  navLinks.forEach((link) => {
    const target = link.getAttribute("href").slice(1);
    const isProjects = target === "projects" && /^task-/.test(current);
    link.classList.toggle("active", target === current || isProjects);
  });
}

window.addEventListener("scroll", updateScrollState, { passive: true });
window.addEventListener("resize", updateScrollState);
updateScrollState();

window.addEventListener("load", () => {
  const target = document.querySelector(window.location.hash);
  if (!target) return;
  window.setTimeout(() => target.scrollIntoView({ block: "start", behavior: "auto" }), 350);
});

menuButton.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(open));
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
  });
});

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("visible");
    observer.unobserve(entry.target);
  });
}, { threshold: 0.08, rootMargin: "0px 0px -35px" });

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

const lightbox = document.querySelector(".lightbox");
const lightboxImage = lightbox.querySelector("img");
const lightboxCaption = lightbox.querySelector("p");

document.querySelectorAll(".image-button").forEach((button) => {
  button.addEventListener("click", () => {
    const image = button.querySelector("img");
    lightboxImage.src = button.dataset.full || image.src;
    lightboxImage.alt = image.alt;
    lightboxCaption.textContent = image.alt;
    lightbox.showModal();
  });
});

lightbox.querySelector(".lightbox-close").addEventListener("click", () => lightbox.close());
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) lightbox.close();
});
