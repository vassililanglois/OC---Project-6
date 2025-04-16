import { media, updateMediaDisplay } from "../pages/photographer.js";
import { trapFocus } from "../utils/trapFocus.js";

// Fonctions de tri
export function sortMediasByLikes() {
  media.sort((a, b) => b.likes - a.likes);
  updateMediaDisplay();
}

function sortMediasByDate() {
  media.sort((a, b) => new Date(b.date) - new Date(a.date));
  updateMediaDisplay();
}

function sortMediasByTitle() {
  media.sort((a, b) => a.title.localeCompare(b.title));
  updateMediaDisplay();
}

// Sélection des éléments
const dropdownOptions = document.querySelectorAll(".sort");

// Ajout d'un écouteur d'événement sur chaque option de tri
dropdownOptions.forEach((option) => {
  option.addEventListener("click", () => {
    // Vérifier si l'option cliquée est déjà sélectionnée (class current)
    if (option.classList.contains("current")) {
      return; // Ne rien faire si l'option actuelle est cliquée
    }

    // Sélection de l'option actuelle et de son texte
    const currentOption = document.querySelector(".current");
    const currentText = currentOption.querySelector(".sort-text");

    // Échanger les textes entre l'option cliquée et l'option actuelle
    const tempText = currentText.textContent;
    currentText.textContent = option.querySelector(".sort-text").textContent;
    option.querySelector(".sort-text").textContent = tempText;

    // Appliquer le tri en fonction du nouveau texte affiché
    const selectedText = currentText.textContent.trim();
    if (selectedText === "Popularité") {
      sortMediasByLikes();
    } else if (selectedText === "Date") {
      sortMediasByDate();
    } else if (selectedText === "Titre") {
      sortMediasByTitle();
    }
  });
});

// Fonction pour empecher que les click sur le dropdown-menu ouvre la vidéo
const dropdownMenu = document.querySelector(".dropdown-menu");
const videos = document.querySelectorAll(".media-container video");

dropdownMenu.addEventListener("click", () => {
  const isOpen = dropdownMenu.classList.toggle("open"); // Ajoute/enlève une classe "open"

  videos.forEach((video) => {
    if (isOpen) {
      video.classList.add("video-under-dropdown");
    } else {
      video.classList.remove("video-under-dropdown");
    }
  });
  // Gestion du trapFocus sur le dropdown lorsqu'il est ouvert

  if (isOpen) {
    trapFocus(dropdownMenu);
  }
});

// Gestion de l'affichage du menu déroulant
const others = document.querySelectorAll(".other");
const arrow = document.querySelector(".arrow");

dropdownMenu.addEventListener("click", () => {
  others.forEach((element) => {
    element.style.display = element.style.display === "flex" ? "none" : "flex";
  });
  arrow.classList.toggle("rotate");
  dropdownMenu.setAttribute(
    "aria-expanded",
    dropdownMenu.ariaExpanded === "true" ? "false" : "true"
  );
});
