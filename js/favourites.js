import { collection, getDocs } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-firestore.js";

async function getFavourites(userId) {
  const favsRef = collection(db, "users", userId, "favourites");
  const querySnapshot = await getDocs(favsRef);
  const favourites = [];
  querySnapshot.forEach(doc => {
    favourites.push(doc.data());
  });
  return favourites;
}

document.addEventListener("DOMContentLoaded", () => {
    const favButtons = document.querySelectorAll(".fav-btn");
  
    favButtons.forEach(button => {
      button.addEventListener("click", async () => {
        const card = button.closest(".planet-card");
        const favData = {
          id: card.dataset.id,
          title: card.dataset.title,
          type: card.dataset.type
        };
  
        const user = auth.currentUser;
        if (!user) {
          alert("Please log in to save favorites!");
          return;
        }
  
        try {
          const favRef = firestore.doc(db, "users", user.uid, "favourites", favData.id);
          await firestore.setDoc(favRef, favData);
          alert(`✅ Saved ${favData.title} to favorites!`);
        } catch (err) {
          console.error("Error saving favorite:", err);
          alert("Error saving favorite.");
        }
      });
    });
  });

  
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-firestore.js";

async function saveFavourite(userId, favData) {
  const favRef = doc(db, "users", userId, "favourites", favData.id);
  await setDoc(favRef, favData);
}