import { collection, getDocs, doc, setDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-firestore.js";
const db = window.db;

async function getFavourites(userId) {
  const favsRef = collection(db, "users", userId, "favourites");
  const querySnapshot = await getDocs(favsRef);
  const favourites = [];
  querySnapshot.forEach(doc => {
    favourites.push(doc.data());
  });
  return favourites;
}

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-auth.js";

let currentUser = null;

onAuthStateChanged(window.auth, (user) => {
  currentUser = user;

  if (document.readyState === "complete" || document.readyState === "interactive") {
    initFavouritesDisplay(); 
  } else {
    document.addEventListener("DOMContentLoaded", initFavouritesDisplay);
  }
});

document.addEventListener("click", async (e) => {
    const button = e.target.closest(".fav");
    if (!button) return;
  
    const card = button.closest("[data-type]");
    if (!card) {
      console.error("Card not found for this button.");
      return;
    }
  
    const type = card.dataset.type;
    let favData = {};
  
    if (type === "apod") {
        const apodImage = document.getElementById("apod-img").src;
        const apodTitle = document.getElementById("apod-title").textContent;
        const apodDesc = document.getElementById("apod-desc").textContent;
        const apodDate = document.getElementById("apod-date").textContent.replace('Date: ', '');  
        
        favData = {
          title: apodTitle,
          image: apodImage,
          description: apodDesc,
          date: apodDate, 
          type: "apod",
          id: apodDate 
};
} else if (type === "planets") {
    favData = {
      id: card.dataset.id, 
      title: card.querySelector("h3").textContent,  
      type: "planet", 
      image: card.querySelector("img").src,  
      mass: card.querySelector("p:nth-of-type(1)").textContent.split(":")[1].trim(),  
      gravity: card.querySelector("p:nth-of-type(2)").textContent.split(":")[1].trim(),  
      radius: card.querySelector("p:nth-of-type(3)").textContent.split(":")[1].trim(),  
      orbit: card.querySelector("p:nth-of-type(4)").textContent.split(":")[1].trim()
    };
  } else if (type === "asteroids") {
      favData = {
        id: card.dataset.id,
        title: card.querySelector("h3").textContent,
        type: "asteroid",
        hazardous: card.querySelector("p:nth-of-type(1)").textContent.split(":")[1].trim(),
        diameter: card.querySelector("p:nth-of-type(2)").textContent.split(":")[1].trim(),
        velocity: card.querySelector("p:nth-of-type(3)").textContent.split(":")[1].trim(),
        distance: card.querySelector("p:nth-of-type(4)").textContent.split(":")[1].trim(),
        orbiting: card.querySelector("p:nth-of-type(5)").textContent.split(":")[1].trim(),
        absMag: card.querySelector("p:nth-of-type(6)").textContent.split(":")[1].trim(),
        appMag: card.querySelector("p:nth-of-type(7)").textContent.split(":")[1].trim()
      };
    }
  
    try {
      const favRef = doc(db, "users", currentUser.uid, "favourites", favData.id);
      await setDoc(favRef, favData);
      alert(`✅ Saved ${favData.title} to favorites!`);
    } catch (err) {
      console.error("Error saving favorite:", err);
      alert("Error saving favorite.");
    }
  });

  async function initFavouritesDisplay() {
    const favouritesContainer = document.querySelector("#favourites-container");
  
    if (!favouritesContainer) {
      console.error("No favourites container found in HTML.");
      return;
    }
  
    try {
      const favourites = await getFavourites(currentUser.uid);
  
      if (favourites.length === 0) {
        favouritesContainer.innerHTML = "<p>No favourites saved yet.</p>";
        return;
      }
  
      favourites.forEach(fav => {
        const card = document.createElement("div");
        card.classList.add("fav-card");
  
        // Common fields for all types
        card.innerHTML = `
          <h3>${fav.title}</h3>
          ${fav.image ? `<img src="${fav.image}" alt="${fav.title}" />` : ""}
          <p>Type: ${fav.type}</p>
        `;
  
        // Type-specific fields
        if (fav.type === "apod") {
          card.innerHTML += `
            ${fav.description ? `<p>${fav.description}</p>` : ""}
            ${fav.date ? `<p>Date: ${fav.date}</p>` : ""}
          `;
        } else if (fav.type === "planet") {
          card.innerHTML += `
            <p>Mass: ${fav.mass}</p>
            <p>Gravity: ${fav.gravity}</p>
            <p>Radius: ${fav.radius}</p>
            <p>Orbit: ${fav.orbit}</p>
          `;
        } else if (fav.type === "asteroid") {
          card.innerHTML += `
            <p>Hazardous: ${fav.hazardous}</p>
            <p>Diameter: ${fav.diameter}</p>
            <p>Velocity: ${fav.velocity}</p>
            <p>Distance: ${fav.distance}</p>
            <p>Orbiting: ${fav.orbiting}</p>
            <p>Absolute Magnitude: ${fav.absMag}</p>
            <p>Apparent Magnitude: ${fav.appMag}</p>
          `;
        }
  
        // Add remove button
        card.innerHTML += `
          <button class="remove-fav" data-id="${fav.id}">⭐</button>
        `;
  
        favouritesContainer.appendChild(card);
  
        // Remove favorite functionality
        const removeButton = card.querySelector(".remove-fav");
        removeButton.addEventListener("click", async () => {
          try {
            const favRef = doc(db, "users", currentUser.uid, "favourites", fav.id);
            await deleteDoc(favRef);
  
            card.remove();
            alert(`❌ Removed ${fav.title} from favorites.`);
          } catch (error) {
            console.error("Error removing favorite:", error);
            alert("Error removing favorite.");
          }
        });
      });
  
    } catch (error) {
      console.error("Error loading favourites:", error);
      favouritesContainer.innerHTML = "<p>Failed to load favourites.</p>";
    }
  }