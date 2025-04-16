export default class MediaCard {
  constructor(media, mediaType) {
    this._media = media;
    this._mediaType = mediaType;
  }

  addMedia(media, photographer) {
    const mediaContainer = document.querySelector(".media-container");
    const photographerName = photographer.name.replace(/ /g, "-");
    const totalNumber = document.querySelector(".total-number");

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
          <div class="likes-container" tabindex="0" aria-pressed="false" aria-label="Bouton pour liker le média">
            <p class="media-likes">${item.likes}</p>
            <i class="ri-heart-fill"></i>
          </div>
        </div>
      `;

      mediaContainer.appendChild(mediaElement);

      // Gestion du like
      const likesContainer = mediaElement.querySelector(".likes-container");
      const likes = mediaElement.querySelector(".media-likes");
      const heart = mediaElement.querySelector(".ri-heart-fill");

      likesContainer.addEventListener("click", () => {
        let currentLikes = parseInt(likes.textContent);
        const isLiked = heart.classList.contains("liked");

        if (isLiked) {
          likes.textContent = currentLikes - 1;
          heart.classList.remove("liked");
          totalNumber.textContent = parseInt(totalNumber.textContent) - 1; // Décrémente le total global
        } else {
          likes.textContent = currentLikes + 1;
          heart.classList.add("liked");
          totalNumber.textContent = parseInt(totalNumber.textContent) + 1; // Incrémente le total global
        }
      });
    });
  }
}
