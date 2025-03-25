document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const photographerId = urlParams.get("id");

  if (photographerId) {
    try {
      const { photographer, media } = await getPhotographerInfos(
        photographerId
      );
      if (photographer) {
        console.log("Photographe trouvé:", photographer);
        console.log("Médias trouvés", media);
        displayPhotographerData(photographer);
        displayPhotographerMedias(media, photographer); // Affiche les médias
        addLightboxEvents(media, photographer);
      } else {
        console.error("Photographe non trouvé");
      }
    } catch (error) {
      console.error(
        "Erreur lors du chargement des données des photographes:",
        error
      );
    }
  } else {
    console.error("Aucun ID de photographe trouvé dans l'URL");
  }
});

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
      lightbox.style.display = "flex";

      const currentItem = media[currentIndex]; // Récupérer les données du média

      if (item.tagName === "IMG") {
        currentMedia.style.display = "block";
        currentMediaVideo.style.display = "none";
        currentMedia.src = item.src;
        currentMedia.alt = `Photo nommée : ${currentItem.title}`; // Utiliser title de media[]
        currentMediaTitle.textContent = currentItem.title;
      } else if (item.tagName === "VIDEO") {
        currentMedia.style.display = "none";
        currentMediaVideo.style.display = "block";
        currentMediaVideo.controls = true;
        currentMediaVideo.src = item.src;
        currentMediaVideo.alt = `Vidéo nommée : ${currentItem.title}`; // Utiliser title de media[]
        currentMediaTitle.textContent = currentItem.title;
      }
    });
  });

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
  if (!photographer || !photographer.name) {
    console.error("Photographer object is not defined or missing 'name'");
    return; // Sortir de la fonction si l'objet photographer est invalide
  }
  // Récupérer le nom du photographe et remplacer les espaces par des tirets
  const photographerName = photographer.name.replace(/ /g, "-");

  // Récupérer l'élément du tableau media selon currentIndex
  const currentItem = media[currentIndex];

  // Vérifier si l'élément actuel est une image ou une vidéo
  if (currentItem.image) {
    // Construire le chemin pour l'image en utilisant le nom du photographe
    currentMedia.style.display = "block";
    currentMediaVideo.style.display = "none";
    currentMedia.src = `../assets/media/${photographerName}/${currentItem.image}`;
    currentMedia.alt = `Photo nommée : ${currentItem.title}`;
    currentMediaTitle.textContent = currentItem.title;
  } else if (currentItem.video) {
    // Construire le chemin pour la vidéo en utilisant le nom du photographe
    currentMedia.style.display = "none";
    currentMediaVideo.style.display = "block";
    currentMediaVideo.controls = true;
    currentMediaVideo.src = `../assets/media/${photographerName}/${currentItem.video}`;
    currentMediaVideo.alt = `Vidéo nommée : ${currentItem.title}`;
    currentMediaTitle.textContent = currentItem.title;
  }
}

// Fermer la lightbox
function closeLightbox() {
  const lightbox = document.querySelector(".lightbox-container");
  lightbox.style.display = "none";
}

async function getPhotographerInfos(id) {
  try {
    const response = await fetch("../data/photographers.json");
    const data = await response.json();

    const photographer = data.photographers.find((p) => p.id == id);
    const media = data.media.filter((m) => m.photographerId == id); // Filtrer les médias du photographe

    return { photographer, media }; // Retourne un objet contenant les deux
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des informations du photographe:",
      error
    );
  }
}

function displayPhotographerData(photographer) {
  const { name, portrait, city, country, tagline, price } = photographer;

  // Mettre à jour les éléments de la page avec les données du photographe
  const photographeInfo = document.querySelector(".photographe-info");
  const emplacementPortrait = document.querySelector(".emplacement-portrait");
  const contactName = document.querySelector(".contact-name");

  // Modale
  contactName.textContent = name;

  // Name
  const h2 = document.createElement("h2");
  h2.ariaLabel = "Nom du photographe";
  h2.textContent = name;

  // Ville & Pays
  const location = document.createElement("p");
  location.textContent = `${city}, ${country}`;
  location.ariaLabel = "Localisation du photographe";
  location.classList.add("location");

  // Tagline
  const taglineElement = document.createElement("p");
  taglineElement.textContent = tagline;
  taglineElement.ariaLabel = "Phrase d'accroche du photographe";
  taglineElement.classList.add("tagline");

  // Image
  const img = document.createElement("img");
  img.setAttribute("src", `../assets/photographers/${portrait}`);
  img.setAttribute("alt", `Portrait de ${name}`);

  // Ajout des éléments à ".photographe-info"
  photographeInfo.appendChild(h2);
  photographeInfo.appendChild(location);
  photographeInfo.appendChild(taglineElement);

  // Ajout de l'image à ".emplacement-portrait"
  emplacementPortrait.appendChild(img);
}

function displayPhotographerMedias(media, photographer) {
  const mediaContainer = document.querySelector(".media-container");
  const photographerName = photographer.name.replace(/ /g, "-");
  const photographerPrice = document.querySelector(".photographer-price");

  photographerPrice.textContent = `${photographer.price}€/jour`;

  let totalLikes = 0;

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

    let liked = false;
    likes.textContent = item.likes;
    totalLikes += item.likes;

    heart.addEventListener("click", () => {
      if (liked) {
        likes.textContent = parseInt(likes.textContent) - 1;
        totalLikes -= 1;
        heart.classList.remove("liked");
      } else {
        likes.textContent = parseInt(likes.textContent) + 1;
        totalLikes += 1;
        heart.classList.add("liked");
      }
      liked = !liked;

      // Met à jour l'affichage du total des likes
      document.querySelector(".total-number").textContent = totalLikes;
    });

    likesContainer.classList.add("likes-container");
    likes.classList.add("media-likes");

    likesContainer.appendChild(likes);
    likesContainer.appendChild(heart);
    infos.appendChild(title);
    infos.appendChild(likesContainer);
    mediaElement.appendChild(infos);
    mediaContainer.appendChild(mediaElement);
  });

  const totalNumber = document.querySelector(".total-number");
  totalNumber.textContent = totalLikes;
}

const dropdownMenu = document.querySelector(".dropdown-menu");
const others = document.querySelectorAll(".other");
const arrow = document.querySelector(".arrow"); // Vérifie bien que l'élément a cette classe

document.addEventListener("DOMContentLoaded", async () => {
  others.forEach((element) => {
    element.style.display = "none";
  });
});

dropdownMenu.addEventListener("click", () => {
  others.forEach((element) => {
    element.style.display = element.style.display === "flex" ? "none" : "flex";
  });

  arrow.classList.toggle("rotate");
});

const sort2 = document.querySelector(".sort2"); // Balise <p> contenant "Date"
const sort3 = document.querySelector(".sort3"); // Balise <p> contenant "Titre"

// Fonction pour échanger uniquement le texte dans les balises <p>
const swapText = (element1, element2) => {
  const temp = element1.textContent;
  element1.textContent = element2.textContent;
  element2.textContent = temp;
};

// Gérer les clics sur les éléments de tri en cliquant sur toute la div
document.querySelectorAll(".sort").forEach((sortItem) => {
  sortItem.addEventListener("click", () => {
    if (sortItem !== document.querySelector(".current")) {
      const currentSort = document.querySelector(".current");
      swapText(currentSort.querySelector("p"), sortItem.querySelector("p"));
      currentSort.classList.remove("current");
      sortItem.classList.add("current");
    }
  });
});

const dropdownOptions = document.querySelectorAll(".sort"); // Sélectionne les options
const dropdownText = document.querySelector(".sort-text"); // Texte affiché du dropdown

dropdownOptions.forEach((option) => {
  option.addEventListener("click", () => {
    const selectedText = option.textContent.trim(); // Récupère le texte cliqué
    dropdownText.textContent = selectedText; // Met à jour le texte affiché

    // Applique le tri en fonction du texte sélectionné
    if (selectedText === "Popularité") {
      sortMediasByLikes();
    } else if (selectedText === "Date") {
      sortMediasByDate();
    } else if (selectedText === "Titre") {
      sortMediasByTitle();
    }
  });
});

// Fonctions de tri (exemples)
function sortMediasByLikes() {
  media.sort((a, b) => b.likes - a.likes);
  displayPhotographerMedias(media, photographer);
}

function sortMediasByDate() {
  media.sort((a, b) => new Date(b.date) - new Date(a.date));
  displayPhotographerMedias(media, photographer);
}

function sortMediasByTitle() {
  media.sort((a, b) => a.title.localeCompare(b.title));
  displayPhotographerMedias(media, photographer);
}
