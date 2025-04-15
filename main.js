// Astronomy Picture of the Day

const apodKey = "TG9eT25XdJXs0UZdFfMHzkvdlcJUjurbjTUGj9IK";
const apodURL = `https://api.nasa.gov/planetary/apod?api_key=${apodKey}`;

async function fetchAPOD() {

  try {
    
    let response = await fetch(apodURL);
    let data = await response.json();

    let img = document.getElementById("apod-img");
    let title = document.getElementById("apod-title");
    let desc = document.getElementById("apod-desc");
    let date = document.getElementById("apod-date");

    if (data.media_type === "image") {
      img.src = data.url;
    } 
    
    else {
      img.src = "https://apod.nasa.gov/apod/image/1901/NGC6357_HubbleESO_960.jpg";
    }

    title.textContent = data.title;
    desc.textContent = data.explanation;
    date.textContent = `Date: ${data.date}`;
  }

  catch (error) {
    console.error("Error fetching APOD:", error);
  }

}

fetchAPOD();

// Log-In and Sign-Up Form

let loginForm = document.getElementById("login-form");
let signupForm = document.getElementById("signup-form");
let showSignup = document.getElementById("show-signup");
let showLogin = document.getElementById("show-login");

// Keep your existing form toggle code

showSignup.addEventListener("click", function(e) {
  e.preventDefault();
  loginForm.classList.remove("active");
  signupForm.classList.add("active");
});

showLogin.addEventListener("click", function(e) {
  e.preventDefault();
  signupForm.classList.remove("active");
  loginForm.classList.add("active");
});

// Login function

loginForm.addEventListener("submit", async (e) => {

  e.preventDefault();
  const email = loginForm.querySelector('input[type="email"]').value;
  const password = loginForm.querySelector('input[type="password"]').value;
  
  try {
    await firebaseAuth.signInWithEmailAndPassword(auth, email, password);
    alert("Welcome back to Cosmic Explorer!");
    // You could redirect or update UI here
  } 
  
  catch (error) {
    alert("Login error: " + error.message);
  }
});

// Signup function

signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = signupForm.querySelector('input[type="email"]').value;
  const password = signupForm.querySelector('input[type="password"]').value;
  
  try {
    await firebaseAuth.createUserWithEmailAndPassword(auth, email, password);
    alert("Account created! Welcome to the cosmos.");
  } 
  
  catch (error) {
    alert("Signup error: " + error.message);
  }
});

// Password Reset Functionality

const forgotPassword = document.getElementById("forgot-password");
const resetModal = document.getElementById("reset-modal");
const closeReset = document.querySelector(".close-reset");
const submitReset = document.getElementById("submit-reset");

if (forgotPassword) {
  forgotPassword.addEventListener("click", (e) => {
    e.preventDefault();
    resetModal.style.display = "block";
  });
}

closeReset.addEventListener("click", () => {
  resetModal.style.display = "none";
});

submitReset.addEventListener("click", async () => {
  const email = document.getElementById("reset-email").value;
  
  if (!email) {
    alert("Please enter your email address");
    return;
  }

  try {
    await firebaseAuth.sendPasswordResetEmail(auth, email);
    alert("Password reset email sent! Check your inbox.");
    resetModal.style.display = "none";
  } 
  
  catch (error) {
    alert("Error: " + error.message);
  }
});

// Close modal when clicking outside

window.addEventListener("click", (e) => {
  if (e.target === resetModal) {
    resetModal.style.display = "none";
  }
});

// Planets of the Solar System

let planetCard = document.querySelector('a[href="#planets"]');
let planetList = document.getElementById("planet-list");

let planetImages = {
  Mercury: "https://upload.wikimedia.org/wikipedia/commons/4/4a/Mercury_in_true_color.jpg",
  Venus: "https://upload.wikimedia.org/wikipedia/commons/e/e5/Venus-real_color.jpg",
  Earth: "https://upload.wikimedia.org/wikipedia/commons/9/97/The_Earth_seen_from_Apollo_17.jpg",
  Mars: "https://upload.wikimedia.org/wikipedia/commons/0/02/OSIRIS_Mars_true_color.jpg",
  Jupiter: "https://upload.wikimedia.org/wikipedia/commons/e/e2/Jupiter.jpg",
  Saturn: "https://upload.wikimedia.org/wikipedia/commons/c/c7/Saturn_during_Equinox.jpg",
  Uranus: "https://upload.wikimedia.org/wikipedia/commons/3/3d/Uranus2.jpg",
  Neptune: "https://upload.wikimedia.org/wikipedia/commons/5/56/Neptune_Full.jpg"
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

    div.innerHTML = `
      <img src="${imgSrc}" alt="${planet.englishName}" class="planet-img"/>
      <h3>${planet.englishName}</h3>
      <p><strong>Mass:</strong> ${planet.mass.massValue} × 10^${planet.mass.massExponent} kg</p>
      <p><strong>Gravity:</strong> ${planet.gravity} m/s²</p>
      <p><strong>Mean Radius:</strong> ${planet.meanRadius} km</p>
      <p><strong>Orbit Period:</strong> ${planet.sideralOrbit} days</p>
      <button class="fav-btn" title="Mark as Favorite">⭐</button>
    `;

    planetList.appendChild(div);
  });
}

planetCard.addEventListener ("click", async function() {
  planetList.innerHTML = "";
  let planets = await fetchPlanetData();
  createPlanetCards(planets);
});

// Asteroid Tracker

const asteroidBtn = document.getElementById("fetch-asteroids");
const resultContainer = document.getElementById("asteroid-results");
const asteroidApiKey = "gbufKhurtMUGGgrNsOIKyFuawe4BQMXBclRgzher";

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

  let hazardous = "No";

  if (asteroid.is_potentially_hazardous_asteroid) {
    hazardous = "Yes";
  }

  card.innerHTML = `
    <h3>${asteroid.name}</h3>
    <p><strong>Hazardous:</strong> ${hazardous}</p>
    <p><strong>Diameter (m):</strong> ${asteroid.estimated_diameter.meters.estimated_diameter_min.toFixed(2)} - ${asteroid.estimated_diameter.meters.estimated_diameter_max.toFixed(2)}</p>
    <p><strong>Velocity (km/h):</strong> ${Number(asteroid.close_approach_data[0].relative_velocity.kilometers_per_hour).toLocaleString()}</p>
    <p><strong>Miss Distance (km):</strong> ${Number(asteroid.close_approach_data[0].miss_distance.kilometers).toLocaleString()}</p>
    <p><strong>Orbiting: </strong> ${asteroid.close_approach_data[0].orbiting_body}</p>
    <button class="fav-btn" title="Mark as Favorite">⭐</button>
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

document.addEventListener("DOMContentLoaded", function() {

  const cards = document.querySelectorAll(".card");
  const sections = document.querySelectorAll(".section-content");

  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];

    if (section.id === "apod") {
      section.style.display = "block";
    } 
    
    else {
      section.style.display = "none";
    }
  }

  for (let i = 0; i < cards.length; i++) {

    const card = cards[i];

    card.addEventListener("click", function(e) {
      e.preventDefault();
      const targetId = card.getAttribute("href").substring(1);

      for (let j = 0; j < sections.length; j++) {
        const section = sections[j];
        section.style.display = "none";
      }

      const target = document.getElementById(targetId);

      if (target) {
        target.style.display = "block";
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  }
});

// Astronomy Sun and Moon Data

const apiKey = "50ebae937ead4c1981ddcd10eb03f79d";

async function getLocationData (location) {

  const url = `https://api.ipgeolocation.io/astronomy?apiKey=${apiKey}&location=${encodeURIComponent(location)}`;
  
  try {
    let res = await fetch(url);
    let data = await res.json();
    return data;
  } 
  
  catch (error) {
    console.error(error);
    return null;
  }
}

function generateLocationHTML(data) {

  const loc = data.location;

  return `
    <h3>Astronomy Data for ${loc.city || loc.location}</h3>
    <p><strong>Country:</strong> ${loc.country}</p>
    <p><strong>State:</strong> ${loc.state || "N/A"}</p>
    <p><strong>City:</strong> ${loc.city || "N/A"}</p>
    <p><strong>Latitude:</strong> ${loc.latitude}</p>
    <p><strong>Longitude:</strong> ${loc.longitude}</p>
    <p><strong>Date:</strong> ${data.date}</p>
    <p><strong>Current Time:</strong> ${data.current_time}</p>
    <hr/>
  `;
}

function generateSunDataHTML(data) {

  return `
    <h4>🌞 Sun</h4>
    <p><strong>Sunrise:</strong> ${data.sunrise}</p>
    <p><strong>Sunset:</strong> ${data.sunset}</p>
    <p><strong>Solar Noon:</strong> ${data.solar_noon}</p>
    <p><strong>Day Length:</strong> ${data.day_length}</p>
    <p><strong>Sun Altitude:</strong> ${data.sun_altitude.toFixed(2)}°</p>
    <p><strong>Sun Azimuth:</strong> ${data.sun_azimuth.toFixed(2)}°</p>
    <p><strong>Sun Distance:</strong> ${data.sun_distance.toLocaleString()} km</p>
    <hr/>
  `;
}

function generateMoonDataHTML(data) {

  return `
    <h4>🌙 Moon</h4>
    <p><strong>Moonrise:</strong> ${data.moonrise}</p>
    <p><strong>Moonset:</strong> ${data.moonset}</p>
    <p><strong>Moon Phase:</strong> ${data.moon_phase.replace("_", " ")}</p>
    <p><strong>Moon Illumination:</strong> ${data.moon_illumination_percentage.toLocaleString()}%</p>
    <p><strong>Moon Altitude:</strong> ${data.moon_altitude.toFixed(2)}°</p>
    <p><strong>Moon Azimuth:</strong> ${data.moon_azimuth.toFixed(2)}°</p>
    <p><strong>Moon Distance:</strong> ${data.moon_distance.toLocaleString()} km</p>
  `;
}

function displaySunMoonData(data) {
  const resultContainer = document.getElementById("sunmoon-results");
  resultContainer.innerHTML = generateLocationHTML(data) + generateSunDataHTML(data) + generateMoonDataHTML(data);
}

function handleError() {
  document.getElementById("sunmoon-results").innerHTML = `<p>Error fetching data. Try again.</p>`;
}

async function handleSunMoonButtonClick() {

  const location = document.getElementById("location-input").value.trim();
  
  if (!location) {
    alert("Please enter a location.");
    return;
  }

  const data = await getLocationData(location);

  if (data) {
    displaySunMoonData(data);
  } 
  
  else {
    handleError();
  }
}

document.getElementById("get-sunmoon").addEventListener("click", function() {
  handleSunMoonButtonClick();
});

// Live Timer

function updateLiveTimer() {

  const timerDiv = document.getElementById("live-timer");
  const now = new Date();
  const timeString = now.toLocaleTimeString();
  const dateString = now.toLocaleDateString();
  timerDiv.textContent = `Current Time: ${dateString} ${timeString}`;

}

setInterval(updateLiveTimer, 1000);

updateLiveTimer();
