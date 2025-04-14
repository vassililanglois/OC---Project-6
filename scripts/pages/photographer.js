import { sortMediasByLikes } from "../components/dropdown.js";
import { addLightboxEvents } from "../components/lightbox.js";

export let media = []; // Variable globale pour stocker les médias
let photographer = null; // Variable globale pour le photographe

// Fonction appelée dès que le DOM est chargé
document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const photographerId = urlParams.get("id");

  if (photographerId) {
    try {
      // Récupération des informations du photographe et des médias
      const data = await getPhotographerInfos(photographerId);
      photographer = data.photographer;
      media = data.media;

      if (photographer) {
        console.log("Photographe trouvé:", photographer);
        console.log("Médias trouvés", media);

        // Affichage des informations du photographe et des médias
        displayPhotographerData(photographer);
        displayPhotographerMedias(media, photographer);

        // Tri par popularité par défaut
        sortMediasByLikes();

        // Ajouter les événements de lightbox
        addLightboxEvents(media, photographer);
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
  displayPhotographerMedias(media, photographer); // Réaffiche les médias
  addLightboxEvents(media, photographer); // Réajoute les événements pour la lightbox
}

// Récupérer les informations du photographe depuis un fichier JSON
async function getPhotographerInfos(id) {
  try {
    const response = await fetch("../data/photographers.json");
    const data = await response.json();

    const photographer = data.photographers.find((p) => p.id == id);
    const media = data.media.filter((m) => m.photographerId == id); // Filtrer les médias du photographe

    return { photographer, media };
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des informations du photographe:",
      error
    );
  }
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

  // Afficher le prix journalier du photgraphe

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
  const photographerName = photographer.name.replace(/ /g, "-");
  const totalNumber = document.querySelector(".total-number");
  let totalLikes = 0;

  media.forEach((item) => {
    const mediaElement = document.createElement("div");
    mediaElement.classList.add("media-item");

    const mediaSrc = item.image
      ? `../assets/media/${photographerName}/${item.image}`
      : `../assets/media/${photographerName}/${item.video}`;

    const mediaTag = item.image
      ? `<img src="${mediaSrc}" alt="${item.title}" tabindex="0">`
      : `<video src="${mediaSrc}" tabindex="0"></video>`;

    mediaElement.innerHTML = `
      ${mediaTag}
      <div class="media-infos">
        <p class="media-title">${item.title}</p>
        <div class="likes-container" tabindex="0">
          <p class="media-likes">${item.likes}</p>
          <i class="ri-heart-fill"></i>
        </div>
      </div>
    `;

    totalLikes += item.likes;
    mediaContainer.appendChild(mediaElement);

    // Gestion du like (à faire après que le HTML a été injecté)
    const likesContainer = mediaElement.querySelector(".likes-container");
    const likes = mediaElement.querySelector(".media-likes");
    const heart = mediaElement.querySelector(".ri-heart-fill");

    let liked = false;

    likesContainer.addEventListener("click", () => {
      let currentLikes = parseInt(likes.textContent);
      if (liked) {
        likes.textContent = currentLikes - 1;
        heart.classList.remove("liked");
        totalLikes -= 1;
      } else {
        likes.textContent = currentLikes + 1;
        heart.classList.add("liked");
        totalLikes += 1;
      }
      liked = !liked;
      totalNumber.textContent = totalLikes;
    });
  });

  // Mise à jour globale du total
  totalNumber.textContent = totalLikes;
}
