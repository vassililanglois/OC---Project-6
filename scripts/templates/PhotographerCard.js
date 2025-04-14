export default class PhotographerCard {
  constructor(photographer) {
    this._photographer = photographer;
  }

  getPhotographerCard() {
    const article = document.createElement("article");
    const photographerCard = `
      <a href="photographer.html?id=${this._photographer.id}" aria-label="Profil de ${this._photographer.name}">
        <img src="${this._photographer.portrait}" alt="Portrait de ${this._photographer.name}">
        <h2>${this._photographer.name}</h2>
      </a>
      <p class="location">${this._photographer.location}</p>
      <p class="tagline">${this._photographer.tagline}</p>
      <p class="price">${this._photographer.price}€/jour</p>
    `;

    article.innerHTML = photographerCard;
    return article;
  }
}
