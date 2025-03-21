async function getPhotographers() {
  // Récupération des pièces depuis le fichier JSON
  const reponse = await fetch("../data/photographers.json");
  const photographers = await reponse.json();
  console.log(photographers);
  return photographers;
}

async function displayData(photographers) {
  const photographersSection = document.querySelector(".photographer_section");

  photographers.forEach((photographer) => {
    const photographerModel = photographerTemplate(photographer);
    const userCardDOM = photographerModel.getUserCardDOM();
    photographersSection.appendChild(userCardDOM);
  });
}

async function init() {
  // Récupère les datas des photographes
  const { photographers } = await getPhotographers();
  displayData(photographers);
}

init();
