// Astronomy SoLuna

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
  resultContainer.style.display = "block";
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

const locationInput = document.getElementById("location-input");

if (locationInput) {
  locationInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      handleSunMoonButtonClick();
    }
  });
}

document.getElementById("get-sunmoon").addEventListener("click", function() {
  handleSunMoonButtonClick();
});

const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

if(isLoggedIn){
  document.getElementById('login-nav').style.display = 'none';
  document.getElementById('user-nav').style.display = 'block';
}
