export default class ImageModel {
  constructor(data) {
    this._date = data.date;
    this._id = data.id;
    this._media = `./assets/medias/${data.photographerId}/${data.image}`;
    this._likes = data.likes;
    this._photographerId = data.photographerId;
    this._price = data.price;
    this._title = data.title;
  }

  get date() {
    return this._date;
  }
  get id() {
    return this._id;
  }
  get title() {
    return this._title;
  }
  get media() {
    return this._media;
  }
  get likes() {
    return this._likes;
  }
  get photographerId() {
    return this._photographerId;
  }
  get price() {
    return this._price;
  }
}
