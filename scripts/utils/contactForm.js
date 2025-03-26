const contactButton = document.querySelector(".contact_button");
const logoLink = document.querySelector(".home-link");
const dropdownButtons = document.querySelectorAll(".sort");

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
  const modal = document.getElementById("contact_modal");
  modal.style.display = "flex";
}

const closeButton = document.querySelector(".close_button");
closeButton.addEventListener("click", () => {
  closeModal();

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

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal();
  }
});

function closeModal() {
  const modal = document.getElementById("contact_modal");
  modal.style.display = "none";
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
