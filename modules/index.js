import Core from "./core.js";
const core = new Core();
document
  .getElementById("add-note")
  .addEventListener("click", () => core.newNote());
document
  .getElementById("remove-note")
  .addEventListener("click", () => core.removeNote());

document.getElementById("font-format").addEventListener("click", () => {
  document.getElementById("submenu-fonts").classList.toggle("hidden");
});

document.querySelectorAll(".sub-item").forEach((sub) => {
  sub.addEventListener("click", (event) => {
    event.preventDefault();
    const tag = (event.currentTarget || {}).getAttribute("data-tag");
    core.format(tag);
    document.getElementById("submenu-fonts").classList.add("hidden");
  });
});
