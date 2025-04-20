// Planets of the Solar System

let planetCard = document.getElementById("planet-link");
let planetList = document.getElementById("planet-list");

let planetImages = {
  Mercury: "https://cdn.drop.media/nebulaknights/c3741e47-5a34-4cf8-9e42-8a79d2d024c3.png",
  Venus: "https://cdn.drop.media/nebulaknights/fd4b7024-e248-4594-866b-22f03f2a6e13.jpeg",
  Earth: "https://cdn.drop.media/nebulaknights/d7271f4f-3c7a-4bd6-bb26-3b8094bc53a9.jpeg",
  Mars: "https://cdn.drop.media/nebulaknights/cf40c488-3ba7-45c2-8dfe-372cab941c80.jpeg",
  Jupiter: "https://cdn.drop.media/guest/9bf73045-10fd-4490-9971-03a38f34dabb.jpeg",
  Saturn: "https://cdn.drop.media/nebulaknights/c665e959-cd90-4beb-8c35-246a185fd554.jpeg",
  Uranus: "https://cdn.drop.media/nebulaknights/2ed35673-302d-4fcb-b2cb-da4a30f2058d.png",
  Neptune: "https://cdn.drop.media/nebulaknights/db3dd6aa-5b64-463a-b141-88de04e5c9af.jpeg",
};

async function fetchPlanetData() {

  try {

    let res = await fetch("https://api.le-systeme-solaire.net/rest/bodies/?filter[]=isPlanet,eq,true");

    let data = await res.json();

    return data.bodies;

  } 
  
  catch (error) {
    console.error("Planet fetch error:", error);
    return null;
  }
}

function createPlanetCards (planets) {

  if (!planets) {
    planetList.innerHTML = "<p>Failed to load planet data.</p>";
    return;
  }

  planets.forEach (function(planet) {

    let div = document.createElement("div");
    div.className = "planet-card";
    let imgSrc = planetImages[planet.englishName] || "";

    div.setAttribute("data-type", "planets");
    div.setAttribute("data-id", planet.englishName);

    div.innerHTML = `
      <img src="${imgSrc}" alt="${planet.englishName}" class="planet-img"/>
      <h3>${planet.englishName}</h3>
      <p><strong>Mass:</strong> ${planet.mass.massValue} × 10^${planet.mass.massExponent} kg</p>
      <p><strong>Gravity:</strong> ${planet.gravity} m/s²</p>
      <p><strong>Mean Radius:</strong> ${planet.meanRadius} km</p>
      <p><strong>Orbit Period:</strong> ${planet.sideralOrbit} days</p>
      <button class="fav" title="Mark as Favorite">⭐</button>
    `;

    planetList.appendChild(div);
  });
}

document.addEventListener("DOMContentLoaded", async function() {
    let planets = await fetchPlanetData();
    createPlanetCards(planets);
  });