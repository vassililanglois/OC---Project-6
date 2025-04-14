import PhotographersApi from "../api/Api.js";
import photographerFactory from "../factories/photographer.js";
import PhotographerCard from "../templates/PhotographerCard.js";

class Index {
  constructor() {
    this.photographersSection = document.querySelector(".photographer_section");
    this.photographersApi = new PhotographersApi("./data/photographers.json");
  }

  // Initialisation de la page principale

  async init() {
    const photographersData = await this.photographersApi.getPhotographers();
    photographersData.photographers.forEach((photographer) => {
      const photographerModel = photographerFactory(photographer);
      const photographerCardItem = new PhotographerCard(photographerModel);
      const photographerCard = photographerCardItem.getPhotographerCard();
      this.photographersSection.appendChild(photographerCard);
    });
  }
}

const index = new Index();
index.init();
