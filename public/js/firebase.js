import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js";
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-auth.js";
import { getFirestore, doc, setDoc, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCe4mRoC0ugu0QQRv7qMw78kN_QEeXQwGQ",
  authDomain: "nebula-website-38265.firebaseapp.com",
  projectId: "nebula-website-38265",
  storageBucket: "nebula-website-38265.firebasestorage.app",
  messagingSenderId: "281085588972",
  appId: "1:281085588972:web:6fc787e51a1ace5c4e7cc9",
  measurementId: "G-M0JT5WC23E"
};

     // Initialize Firebase
     const app = initializeApp(firebaseConfig);
     const auth = getAuth(app);
     const db = getFirestore(app);
   
     window.auth = auth;
     window.db = db;
     window.firebaseAuth = { createUserWithEmailAndPassword, signInWithEmailAndPassword };
     window.firestore = { doc, setDoc, collection, query, where, getDocs };

     onAuthStateChanged(auth, async function(user) {
        const authLink = document.getElementById("auth-link");
        const favourites = document.getElementById("favourites");
        const emailDisplay = document.getElementById("user-email");
        const nameDisplay = document.getElementById("user-name");
        const profileDropdown = document.querySelector(".profile-dropdown");
      
        if (authLink && favourites) {
          if (user) {
            authLink.style.display = "none";
            favourites.style.display = "inline-block";
      
            try {
              const userDocRef = doc(db, "users", user.uid);
              const userSnap = await getDocs(query(collection(db, "users"), where("email", "==", user.email)));
      
              let userData = null;
      
              userSnap.forEach(doc => {
                userData = doc.data();
              });
      
              if (userData) {
                if (nameDisplay) {
                  nameDisplay.textContent = userData.username;
                }
      
                if (emailDisplay) {
                  emailDisplay.innerHTML = `<small>${userData.email}</small>`;
                }
              } else {
                console.warn("User data not found in Firestore");
              }
            } catch (err) {
              console.error("Error fetching user data from Firestore:", err);
            }
      
            if (profileDropdown) {
              profileDropdown.style.display = "inline-block";
            }
          } else {
            authLink.style.display = "";
            favourites.style.display = "none";
      
            if (emailDisplay) emailDisplay.textContent = "";
            if (nameDisplay) nameDisplay.textContent = "";
      
            if (profileDropdown) {
              profileDropdown.style.display = "none";
            }
          }
        }
      });

import { signOut } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-auth.js";

function handleSignOut() {
  signOut(auth).then(() => {
    const authLink = document.getElementById("auth-link");
    const favourites = document.getElementById("favourites");
    const emailDisplay = document.getElementById("user-email");

    if (authLink && favourites) {
      authLink.style.display = "";
      favourites.style.display = "none";
    }

    if (emailDisplay) {
      emailDisplay.textContent = "";
    }

    const profileDropdown = document.querySelector(".profile-dropdown");
    if (profileDropdown) {
      profileDropdown.style.display = "none";
    }
  }).catch((error) => {
    console.error("Sign out error: ", error);
  });
}

const logoutButton = document.getElementById("logout-button");
if (logoutButton) {
  logoutButton.addEventListener("click", handleSignOut);
}