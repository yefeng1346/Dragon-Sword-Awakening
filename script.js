const header = document.querySelector("[data-header]");
const menuButton = document.querySelector("[data-menu]");
const navigation = document.querySelector("[data-nav]");
const topButton = document.querySelector("[data-top]");

function updatePageChrome() {
  const hasScrolled = window.scrollY > 24;
  header.classList.toggle("scrolled", hasScrolled);
  topButton.classList.toggle("visible", window.scrollY > 700);
}

menuButton.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  navigation.classList.toggle("open", !isOpen);
});

navigation.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    menuButton.setAttribute("aria-expanded", "false");
    navigation.classList.remove("open");
  }
});

topButton.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

window.addEventListener("scroll", updatePageChrome, { passive: true });
updatePageChrome();
