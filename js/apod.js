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


