export function photographerTemplate(data) {
  const { name, portrait, city, country, tagline, price, id } = data;

  const picture = `assets/photographers/${portrait}`;

  function getUserCardDOM() {
    const article = document.createElement("article");
    article.setAttribute("aria-label", `Aller sur le profil de ${name}`);

    // Image
    const img = document.createElement("img");
    img.setAttribute("src", picture);
    img.setAttribute("alt", `Portrait de ${name}`);
    img.setAttribute("role", "img");

    // Nom
    const h2 = document.createElement("h2");
    h2.ariaLabel = "Nom du photographe";
    h2.textContent = name;

    // Ville & Pays
    const location = document.createElement("p");
    location.textContent = `${city}, ${country}`;
    location.ariaLabel = "Localisation du photographe";
    location.classList.add("location");

    // Tagline
    const taglineElement = document.createElement("p");
    taglineElement.textContent = tagline;
    taglineElement.ariaLabel = "Phrase d'accroche du photographe";
    taglineElement.classList.add("tagline");

    // Prix
    const priceElement = document.createElement("p");
    priceElement.textContent = `${price}€/jour`;
    priceElement.ariaLabel = "Prix du photographe";
    priceElement.classList.add("price");

    // Lien vers "photographer.html"

    const photographersLink = document.createElement("a");
    photographersLink.href = `photographer.html?id=${id}`;
    photographersLink.ariaLabel = `Lien vers la page du photographe ${name}`;

    // Ajout des éléments au lien vers "photographer.html"

    photographersLink.appendChild(img);
    photographersLink.appendChild(h2);

    // Ajout des éléments à l'article

    article.appendChild(photographersLink);
    article.appendChild(location);
    article.appendChild(taglineElement);
    article.appendChild(priceElement);

    return article;
  }

  return { name, picture, getUserCardDOM };
}
