// Planets of the Solar System

let planetCard = document.getElementById("planet-link");
let planetList = document.getElementById("planet-list");

let planetImages = {
  Mercury: "../images/mercury.jpg",
  Venus: "../images/venus.jpg",
  Earth: "https://upload.wikimedia.org/wikipedia/commons/9/97/The_Earth_seen_from_Apollo_17.jpg",
  Mars: "../images/mars.jpg",
  Jupiter: "../images/jupiter.jpg",
  Saturn: "../images/saturn.jpg",
  Uranus: "../images/uranus.jpg",
  Neptune: "../images/neptune.jpg",
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