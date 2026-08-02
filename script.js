const menuButton = document.querySelector("[data-menu]");
const mainNav = document.querySelector("[data-nav]");
const searchToggle = document.querySelector("[data-search-toggle]");
const searchDrawer = document.querySelector("[data-search-drawer]");
const searchInputs = document.querySelectorAll("[data-site-search]");
const searchForms = document.querySelectorAll("[data-search-form]");
const suggestions = document.querySelector("[data-suggestions]");
const topButton = document.querySelector("[data-top]");

const base = document.body.dataset.base || "./";
const searchIndex = [
  { title: "Beginner Guide", hint: "first hours, combat, signals, progression", url: `${base}guide/` },
  { title: "Characters", hint: "Lute, Castella, Aria, Dana, Theresia, Kalien", url: `${base}characters/` },
  { title: "Stages & Activities", hint: "campaign, chapters, dungeons, quests, co-op", url: `${base}stages/` },
  { title: "Tips & Tricks", hint: "resources, exploration, bosses, PC settings", url: `${base}tips/` },
  { title: "FAQ", hint: "gacha, offline, Steam Deck, price, requirements", url: `${base}faq/` }
];

function closeMenu() {
  if (!menuButton || !mainNav) return;
  menuButton.setAttribute("aria-expanded", "false");
  mainNav.classList.remove("open");
  document.body.classList.remove("menu-open");
}

if (menuButton && mainNav) {
  menuButton.addEventListener("click", () => {
    const open = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!open));
    mainNav.classList.toggle("open", !open);
    document.body.classList.toggle("menu-open", !open);
  });
  mainNav.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeMenu();
  });
}

if (searchToggle && searchDrawer) {
  searchToggle.addEventListener("click", () => {
    const open = searchDrawer.classList.toggle("open");
    searchToggle.setAttribute("aria-expanded", String(open));
    if (open) searchDrawer.querySelector("input")?.focus();
  });
}

function matchesFor(query) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return searchIndex;
  return searchIndex.filter((item) =>
    `${item.title} ${item.hint}`.toLowerCase().includes(normalized)
  );
}

function renderSuggestions(query) {
  if (!suggestions) return;
  const matches = matchesFor(query).slice(0, 5);
  suggestions.innerHTML = matches.length
    ? matches.map((item) => `<a href="${item.url}"><strong>${item.title}</strong><span>${item.hint}</span></a>`).join("")
    : `<a href="${base}faq/"><strong>No direct match</strong><span>Browse the FAQ or try a broader term.</span></a>`;
  suggestions.classList.add("visible");
}

searchInputs.forEach((input) => {
  input.addEventListener("input", () => renderSuggestions(input.value));
  input.addEventListener("focus", () => {
    if (input.closest(".search-drawer")) renderSuggestions(input.value);
  });
});

searchForms.forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = form.querySelector("[data-site-search]");
    const firstMatch = matchesFor(input?.value || "")[0];
    window.location.href = firstMatch?.url || `${base}faq/`;
  });
});

document.addEventListener("click", (event) => {
  if (suggestions && !event.target.closest(".search-box")) {
    suggestions.classList.remove("visible");
  }
});

const filterButtons = document.querySelectorAll("[data-filter]");
const characterCards = document.querySelectorAll("[data-character]");
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.toggle("active", item === button));
    characterCards.forEach((card) => {
      card.classList.toggle("hidden", filter !== "all" && card.dataset.character !== filter);
    });
  });
});

if (topButton) {
  window.addEventListener("scroll", () => {
    topButton.classList.toggle("visible", window.scrollY > 700);
  }, { passive: true });
  topButton.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

// Remove the advertising service worker used by the previous Monetag integration.
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => {
        const workers = [registration.active, registration.waiting, registration.installing].filter(Boolean);
        if (workers.some((worker) => new URL(worker.scriptURL).pathname === "/sw.js")) {
          registration.unregister();
        }
      });
    }).catch(() => {});
  });
}
