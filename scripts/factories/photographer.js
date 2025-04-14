import PhotographerModel from "../models/PhotographerModel.js";

export default function photographerFactory(data) {
  return new PhotographerModel(data);
}
