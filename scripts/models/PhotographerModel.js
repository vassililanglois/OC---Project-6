export default class PhotographerModel {
  constructor(data) {
    this._name = data.name;
    this._id = data.id;
    this._location = data.city + ", " + data.country;
    this._tagline = data.tagline;
    this._price = data.price;
    this._portrait = `./assets/photographers/${data.portrait}`;
  }

  get name() {
    return this._name;
  }

  get id() {
    return this._id;
  }

  get location() {
    return this._location;
  }

  get tagline() {
    return this._tagline;
  }

  get price() {
    return this._price;
  }

  get portrait() {
    return this._portrait;
  }
}
