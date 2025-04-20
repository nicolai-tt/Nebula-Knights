// Asteroid Tracker

const asteroidApiKey = "gbufKhurtMUGGgrNsOIKyFuawe4BQMXBclRgzher";

const asteroidBtn = document.getElementById("fetch-asteroids");
const resultContainer = document.getElementById("asteroid-results");
const dateInputField = document.getElementById("date-input");

if (dateInputField) {
  dateInputField.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      asteroidBtn.click(); 
    }
  });
}

async function fetchAsteroidData (dateInput) {

  const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${dateInput}&end_date=${dateInput}&api_key=${asteroidApiKey}`;

  try {
    let res = await fetch(url);
    let data = await res.json();
    return data.near_earth_objects[dateInput];
  } 
  
  catch (error) {
    console.error("Error fetching asteroid data:", error);
    return null;
  }
}

function createAsteroidCard(asteroid) {

  const card = document.createElement("div");
  card.classList.add("card");
  card.setAttribute("data-type", "asteroids");
  card.setAttribute("data-id", asteroid.id);



  let hazardous = "No";

  if (asteroid.is_potentially_hazardous_asteroid) {
    hazardous = "Yes";
  }

  const h = asteroid.absolute_magnitude_h;
const r = Number(asteroid.close_approach_data[0].orbiting_body === "Earth"
  ? asteroid.close_approach_data[0].miss_distance.astronomical
  : 1); 

const delta = Number(asteroid.close_approach_data[0].miss_distance.astronomical);
const apparentMagnitude = (h + 5 * Math.log10(r * delta)).toFixed(2);

  card.innerHTML = `
    <h3>${asteroid.name}</h3>
    <p><strong>Hazardous: </strong> ${hazardous}</p>
    <p><strong>Diameter (m): </strong> ${asteroid.estimated_diameter.meters.estimated_diameter_min.toFixed(2)} - ${asteroid.estimated_diameter.meters.estimated_diameter_max.toFixed(2)}</p>
    <p><strong>Velocity (km/h): </strong> ${Number(asteroid.close_approach_data[0].relative_velocity.kilometers_per_hour).toLocaleString()}</p>
    <p><strong>Miss Distance (km): </strong> ${Number(asteroid.close_approach_data[0].miss_distance.kilometers).toLocaleString()}</p>
    <p><strong>Orbiting: </strong> ${asteroid.close_approach_data[0].orbiting_body}</p>
    <p><strong>Absolute Magnitude (H): </strong> ${asteroid.absolute_magnitude_h}</p>
    <p><strong>Apparent Magnitude (approx.): </strong>${apparentMagnitude}</p>
    <button class="fav" title="Mark as Favorite">⭐</button>
  `;

  return card;
}

async function displayAsteroids(dateInput) {

  const asteroids = await fetchAsteroidData(dateInput);

  resultContainer.innerHTML = "";

  if (!asteroids || asteroids.length === 0) {
    resultContainer.innerHTML = "<p>No asteroids found for this date.</p>";
    return;
  }

  for (let i = 0; i < asteroids.length; i++) {
    const asteroid = asteroids[i];
    const card = createAsteroidCard(asteroid);
    resultContainer.appendChild(card);
  }
}

if (asteroidBtn) {

  asteroidBtn.addEventListener("click", function() {

    const dateInput = document.getElementById("date-input").value;

    if (!dateInput) {
      alert("Please select a date.");
      return;
    }

    displayAsteroids(dateInput);
  });
}



