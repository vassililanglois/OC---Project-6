import { trapFocus } from "./trapFocus.js";

const contactButton = document.querySelector(".contact_button");
const logoLink = document.querySelector(".home-link");
const dropdownButtons = document.querySelectorAll(".sort");
const main = document.querySelector("main");
const modal = document.getElementById("contact_modal");

contactButton.addEventListener("click", () => {
  displayModal();

  // Toggle aria-hidden sur le logo
  logoLink.setAttribute(
    "aria-hidden",
    logoLink.getAttribute("aria-hidden") === "true" ? "false" : "true"
  );

  // Toggle aria-hidden sur chaque bouton de dropdown
  dropdownButtons.forEach((button) => {
    button.setAttribute(
      "aria-hidden",
      button.getAttribute("aria-hidden") === "true" ? "false" : "true"
    );
  });
});

function displayModal() {
  modal.style.display = "flex";

  // Gestion du aria-hidden
  modal.setAttribute("aria-hidden", "false");
  main.setAttribute("aria-hidden", "true");

  modal.setAttribute("tabindex", "-1");

  const firstInput = document.getElementById("prenom");
  firstInput.focus();

  trapFocus(modal);
}

const closeButton = document.querySelector(".close_button");
closeButton.addEventListener("click", () => {
  closeModal();

  if (modal._removeFocusTrap) {
    modal._removeFocusTrap();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal();
  }
});

function closeModal() {
  modal.style.display = "none";

  // Gestion du aria-hidden
  modal.setAttribute("aria-hidden", "true");
  main.setAttribute("aria-hidden", "false");
}

const form = document.querySelector("form");
const balisePrenom = document.getElementById("prenom");
const baliseNom = document.getElementById("nom");
const baliseEmail = document.getElementById("email");
const baliseMessage = document.getElementById("message");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  console.log(balisePrenom.value);
  console.log(baliseNom.value);
  console.log(baliseEmail.value);
  console.log(baliseMessage.value);
});
