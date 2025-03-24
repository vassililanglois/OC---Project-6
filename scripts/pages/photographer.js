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
        addLightboxEvents();
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

function addLightboxEvents() {
  const lightbox = document.querySelector(".lightbox-container");
  const mediaItems = document.querySelectorAll(
    ".media-item img, .media-item video"
  );

  console.log("Médias détectés :", mediaItems); // Vérifier que les médias existent

  mediaItems.forEach((item) => {
    item.addEventListener("click", () => {
      lightbox.style.display = "flex";
      console.log("Image cliquée !");
    });
  });

  function closeLightbox() {
    lightbox.style.display = "none";
  }
}

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
  const mediaContainer = document.querySelector(".media-container"); // Conteneur où afficher les médias
  const photographerName = photographer.name.replace(/ /g, "-");
  const photographerPrice = document.querySelector(".photographer-price");

  photographerPrice.textContent = `${photographer.price}€/jour`;

  let totalLikes = 0;

  media.forEach((item) => {
    const mediaElement = document.createElement("div");
    mediaElement.classList.add("media-item");

    // Images et vidéos

    if (item.image) {
      const img = document.createElement("img");
      img.src = `../assets/media/${photographerName}/${item.image}`;
      //console.log(img.src);
      img.alt = item.title;
      mediaElement.appendChild(img);
    } else if (item.video) {
      const video = document.createElement("video");
      video.src = `../assets/media/${photographerName}/${item.video}`;
      mediaElement.appendChild(video);
    }

    // Infos du média

    const infos = document.createElement("div");
    infos.classList.add("media-infos");

    // Titre

    const title = document.createElement("p");
    title.textContent = item.title;
    title.classList.add("media-title");

    // Partie Likes

    const likesContainer = document.createElement("div");
    likesContainer.classList.add("likes-container");

    const likes = document.createElement("p");
    likes.textContent = item.likes;
    likes.classList.add("media-likes");

    const heart = document.createElement("i");
    heart.classList.add("ri-heart-fill");

    // Répartitition dans les différents containers

    infos.appendChild(title);
    likesContainer.appendChild(likes);
    likesContainer.appendChild(heart);
    infos.appendChild(likesContainer);
    mediaElement.appendChild(infos);

    mediaContainer.appendChild(mediaElement);

    totalLikes += item.likes;
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
