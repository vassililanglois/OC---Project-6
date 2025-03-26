let media = []; // Variable globale pour stocker les médias
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

// Fonctions de tri
function sortMediasByLikes() {
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

// Fonction générique pour mettre à jour l'affichage des médias après un tri
function updateMediaDisplay() {
  const mediaContainer = document.querySelector(".media-container");
  mediaContainer.innerHTML = ""; // Vide le conteneur avant de réafficher
  displayPhotographerMedias(media, photographer); // Réaffiche les médias
  addLightboxEvents(media, photographer); // Réajoute les événements pour la lightbox
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
});

// Fonction pour ajouter les événements de la lightbox
function addLightboxEvents(media, photographer) {
  const lightbox = document.querySelector(".lightbox-container");
  const mediaItems = document.querySelectorAll(
    ".media-item img, .media-item video"
  );
  const currentMedia = document.getElementById("current-media");
  const currentMediaVideo = document.getElementById("current-media-video");
  const currentMediaTitle = document.querySelector(".lightbox-media-title");

  let currentIndex = 0;

  mediaItems.forEach((item, index) => {
    item.addEventListener("click", () => {
      currentIndex = index;
      lightbox.style.display = "flex"; // Affiche la lightbox

      const contactButton = document.querySelector(".contact_button");
      const logoLink = document.querySelector(".home-link");
      const dropdownButtons = document.querySelectorAll(".sort");

      // Toggle aria-hidden sur le logo
      logoLink.setAttribute(
        "aria-hidden",
        logoLink.getAttribute("aria-hidden") === "true" ? "false" : "true"
      );

      // Toggle aria-hidden sur le bouton de contact
      contactButton.setAttribute(
        "aria-hidden",
        contactButton.getAttribute("aria-hidden") === "true" ? "false" : "true"
      );

      // Toggle aria-hidden sur chaque bouton de dropdown
      dropdownButtons.forEach((button) => {
        button.setAttribute(
          "aria-hidden",
          button.getAttribute("aria-hidden") === "true" ? "false" : "true"
        );
      });

      // Mise à jour du média en fonction de l'élément cliqué
      updateLightboxMedia(
        photographer,
        media,
        currentIndex,
        currentMedia,
        currentMediaVideo,
        currentMediaTitle
      );
    });
  });

  // Flèches de navigation dans la lightbox
  document.querySelector(".right-arrow").addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % media.length;
    updateLightboxMedia(
      photographer,
      media,
      currentIndex,
      currentMedia,
      currentMediaVideo,
      currentMediaTitle
    );
  });

  document.querySelector(".left-arrow").addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + media.length) % media.length;
    updateLightboxMedia(
      photographer,
      media,
      currentIndex,
      currentMedia,
      currentMediaVideo,
      currentMediaTitle
    );
  });
}

// Fonction pour mettre à jour l'image ou la vidéo dans la lightbox
function updateLightboxMedia(
  photographer,
  media,
  currentIndex,
  currentMedia,
  currentMediaVideo,
  currentMediaTitle
) {
  const photographerName = photographer.name.replace(/ /g, "-");
  const currentItem = media[currentIndex];

  if (currentItem.image) {
    currentMedia.style.display = "block";
    currentMediaVideo.style.display = "none";
    currentMedia.src = `../assets/media/${photographerName}/${currentItem.image}`;
    currentMedia.alt = `Photo nommée : ${currentItem.title}`;
    currentMediaTitle.textContent = currentItem.title;
  } else if (currentItem.video) {
    currentMedia.style.display = "none";
    currentMediaVideo.style.display = "block";
    currentMediaVideo.controls = true;
    currentMediaVideo.src = `../assets/media/${photographerName}/${currentItem.video}`;
    currentMediaVideo.alt = `Vidéo nommée : ${currentItem.title}`;
    currentMediaTitle.textContent = currentItem.title;
  }
}

// Fonction pour fermer la lightbox
const close = document.querySelector(".cross");
close.addEventListener("click", closeLightbox);

function closeLightbox() {
  const lightbox = document.querySelector(".lightbox-container");
  lightbox.style.display = "none";
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

// Afficher les médias du photographe
function displayPhotographerMedias(media, photographer) {
  const mediaContainer = document.querySelector(".media-container");
  const photographerName = photographer.name.replace(/ /g, "-");
  let totalLikes = 0;

  // Affichage des médias
  media.forEach((item) => {
    const mediaElement = document.createElement("div");
    mediaElement.classList.add("media-item");

    if (item.image) {
      const img = document.createElement("img");
      img.src = `../assets/media/${photographerName}/${item.image}`;
      img.alt = item.title;
      mediaElement.appendChild(img);
    } else if (item.video) {
      const video = document.createElement("video");
      video.src = `../assets/media/${photographerName}/${item.video}`;
      mediaElement.appendChild(video);
    }

    const infos = document.createElement("div");
    infos.classList.add("media-infos");

    const title = document.createElement("p");
    title.textContent = item.title;
    title.classList.add("media-title");

    const heart = document.createElement("i");
    heart.classList.add("ri-heart-fill");

    const likes = document.createElement("p");
    const likesContainer = document.createElement("div");
    const totalNumber = document.querySelector(".total-number");

    let liked = false;
    likes.textContent = item.likes;
    totalLikes += item.likes;

    likesContainer.addEventListener("click", () => {
      if (liked) {
        likes.textContent = parseInt(likes.textContent) - 1;
        heart.classList.remove("liked");
        totalLikes -= 1;
      } else {
        likes.textContent = parseInt(likes.textContent) + 1;
        heart.classList.add("liked");
        totalLikes += 1;
      }
      liked = !liked;
      totalNumber.textContent = totalLikes;
    });

    totalNumber.textContent = totalLikes;

    likesContainer.classList.add("likes-container");
    likes.classList.add("media-likes");

    likesContainer.appendChild(likes);
    likesContainer.appendChild(heart);
    infos.appendChild(title);
    infos.appendChild(likesContainer);
    mediaElement.appendChild(infos);
    mediaContainer.appendChild(mediaElement);
  });
}

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
