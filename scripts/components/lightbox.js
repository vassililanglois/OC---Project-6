import { trapFocus } from "../utils/trapFocus.js";

// Fonction pour ajouter les événements de la lightbox
export function addLightboxEvents(media, photographer) {
  const main = document.querySelector("main");
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

      // Gestion du aria-hidden
      lightbox.setAttribute("aria-hidden", "false");
      main.setAttribute("aria-hidden", "true");

      lightbox.setAttribute("tabindex", "-1");
      document.querySelector(".right-arrow").focus();

      trapFocus(lightbox);

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

// Gestion des flèches au clavier

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") {
    // Simule un clic sur la flèche droite
    document.querySelector(".right-arrow").click();
  }

  if (e.key === "ArrowLeft") {
    // Simule un clic sur la flèche gauche
    document.querySelector(".left-arrow").click();
  }
});

document.addEventListener("keydown", (e) => {
  if (
    e.key === "Enter" &&
    document.activeElement.classList.contains("likes-container")
  ) {
    document.activeElement.click();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const focused = document.activeElement;

    // Si l'élément focusé est une image ou une vidéo dans un media-item
    if (
      focused.matches(".media-item img") ||
      focused.matches(".media-item video")
    ) {
      focused.click();
    }
  }
});

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
  const main = document.querySelector("main");
  const lightbox = document.querySelector(".lightbox-container");
  lightbox.style.display = "none";

  trapFocus(lightbox);

  if (lightbox._removeFocusTrap) {
    lightbox._removeFocusTrap();
  }

  lightbox.setAttribute("aria-hidden", "true");
  main.setAttribute("aria-hidden", "false");
}
