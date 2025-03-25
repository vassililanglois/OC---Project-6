const contactButton = document.querySelector(".contact_button");
contactButton.addEventListener("click", displayModal);

function displayModal() {
  const modal = document.getElementById("contact_modal");
  modal.style.display = "flex";
}

const closeButton = document.querySelector(".close_button");
closeButton.addEventListener("click", closeModal);

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
