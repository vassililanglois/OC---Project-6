import { sortMediasByLikes } from "../components/dropdown.js";
import { addLightboxEvents } from "../components/lightbox.js";
import photographerMediaFactory from "../factories/media.js";
import MediaCard from "../templates/MediaCard.js";
import PhotographersApi from "../api/Api.js";

export let media = []; // Variable globale pour stocker les médias
let photographer = null; // Variable globale pour le photographe

// Instance de l'API
const photographersApi = new PhotographersApi("../data/photographers.json");

// Fonction appelée dès que le DOM est chargé
document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const photographerId = urlParams.get("id");

  if (photographerId) {
    try {
      // Récupération des informations du photographe et des médias via l'API
      photographer = await photographersApi.getPhotographer(photographerId);
      media = await photographersApi.getMediasByPhotographerId(photographerId);

      if (photographer.length > 0) {
        console.log("Photographe trouvé:", photographer[0]);
        console.log("Médias trouvés", media);

        // Affichage des informations du photographe et des médias
        displayPhotographerData(photographer[0]);
        displayPhotographerMedias(media, photographer[0]);

        // Tri par popularité par défaut
        sortMediasByLikes();

        // Ajouter les événements de lightbox
        addLightboxEvents(media, photographer[0]);
      } else {
        console.error("Photographe non trouvé");
      }
    } catch (error) {
      console.error("Erreur lors du chargement des données :", error);
    }
  } else {
    console.error("Aucun ID de photographe trouvé dans l'URL");
  }
});

// Fonction générique pour mettre à jour l'affichage des médias après un tri
export function updateMediaDisplay() {
  const mediaContainer = document.querySelector(".media-container");
  mediaContainer.innerHTML = ""; // Vide le conteneur avant de réafficher
  displayPhotographerMedias(media, photographer[0]); // Réaffiche les médias
  addLightboxEvents(media, photographer[0]); // Réajoute les événements pour la lightbox
}

// Afficher les données du photographe (nom, portrait, ville, etc.)
function displayPhotographerData(photographer) {
  const { name, portrait, city, country, tagline, price } = photographer;

  const photographeInfo = document.querySelector(".photographe-info");
  const emplacementPortrait = document.querySelector(".emplacement-portrait");

  // Modale
  const contactName = document.querySelector(".contact-name");
  contactName.textContent = name;

  // Créer et ajouter les éléments de la page
  photographeInfo.innerHTML = `
    <h1 aria-label="Nom du photographe">${name}</h1>
    <p class="location" aria-label="Localisation du photographe">${city}, ${country}</p>
    <p class="tagline" aria-label="Phrase d'accroche du photographe">${tagline}</p>
  `;

  // Afficher le prix journalier du photographe
  const photographerPrice = document.querySelector(".photographer-price");
  photographerPrice.textContent = `${price}€/jour`;

  // Ajouter l'image du photographe
  const img = document.createElement("img");
  img.setAttribute("src", `../assets/photographers/${portrait}`);
  img.setAttribute("alt", `Portrait de ${name}`);
  emplacementPortrait.appendChild(img);
}

function displayPhotographerMedias(media, photographer) {
  const mediaContainer = document.querySelector(".media-container");
  const totalNumber = document.querySelector(".total-number");
  let totalLikes = 0;

  // Vider le conteneur avant d'ajouter les médias
  mediaContainer.innerHTML = "";

  media.forEach((item) => {
    // Déterminer le type de média (image ou vidéo)
    const mediaType = item.image ? "image" : "video";

    // Utiliser la factory pour créer une instance de modèle (ImageModel ou VideoModel)
    const mediaModel = photographerMediaFactory(item, mediaType);

    // Créer une carte média à l'aide de MediaCard
    const mediaCard = new MediaCard(mediaModel, mediaType);

    // Ajouter la carte média au conteneur
    mediaCard.addMedia([item], photographer);

    // Ajouter les likes au total
    totalLikes += mediaModel.likes;
  });

  // Mettre à jour le total des likes
  totalNumber.textContent = totalLikes;
}

// Gestion de aria-pressed sur les boutons de likes
const likeButtons = document.querySelectorAll(".likes-container button");

likeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // Vérifier l'état actuel de aria-pressed
    const isPressed = button.getAttribute("aria-pressed") === "true";

    // Inverser l'état de aria-pressed
    button.setAttribute("aria-pressed", !isPressed);
  });
});

// Responsive de l'intitulé du photographe
function handleResponsiveHeader() {
  const photographHeader = document.querySelector(".photograph-header");

  if (window.innerWidth <= 1024) {
    // Changer l'ordre des éléments
    const info = document.querySelector(".photographe-info");
    const portrait = document.querySelector(".emplacement-portrait");
    const button = document.querySelector(".contact_button");

    photographHeader.innerHTML = ""; // Vider le conteneur
    photographHeader.appendChild(portrait);
    photographHeader.appendChild(info);
    photographHeader.appendChild(button);
  }
}

// Ajouter un écouteur pour surveiller les changements de taille de la fenêtre
window.addEventListener("resize", handleResponsiveHeader);

// Appeler la fonction au chargement initial
handleResponsiveHeader();
