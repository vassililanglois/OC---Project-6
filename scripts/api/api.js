class Api {
  constructor(url) {
    this._url = url;
  }

  async get() {
    return fetch(this._url)
      .then(async (res) => {
        return await res.json();
      })
      .catch((err) => console.log("an error occurs", err));
  }
}

export default class PhotographersApi extends Api {
  constructor(url) {
    super(url);
  }
  async getPhotographers() {
    return await this.get();
  }

  async getPhotographer(photographerId) {
    const data = await this.get();
    const result = data.photographers.filter((photographer) => {
      return photographer.id === parseInt(photographerId);
    });
    return result;
  }

  async getMediasByPhotographerId(photographerId) {
    const dataMedias = await this.get();
    const resultMedias = dataMedias.media.filter((media) => {
      return media.photographerId === parseInt(photographerId);
    });
    return resultMedias;
  }
}
