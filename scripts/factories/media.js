import ImageModel from "../models/ImageModel.js";
import VideoModel from "../models/VideoModel.js";

export default function photographerMediaFactory(data, mediaType) {
  if (mediaType === "image") {
    return new ImageModel(data);
  } else if (mediaType === "video") {
    return new VideoModel(data);
  } else {
    throw "Unknown type format";
  }
}
