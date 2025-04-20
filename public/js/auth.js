// Log-In and Sign-Up Form

let loginForm = document.getElementById("login-form");
let signupForm = document.getElementById("signup-form");
let showSignup = document.getElementById("show-signup");
let showLogin = document.getElementById("show-login");

let previousPage = document.referrer;

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

// Signup Function
document.getElementById('signup-form').addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = e.target.querySelector('input[type="text"]').value;
  const email = e.target.querySelector('input[type="email"]').value;
  const password = e.target.querySelector('input[type="password"]').value;


  try {
    const userCredential = await firebaseAuth.createUserWithEmailAndPassword(
      auth, 
      email, 
      password
    );
    
    await firestore.setDoc(
      firestore.doc(db, "users", userCredential.user.uid), 
      {
        username: username,
        email: email
      }
    );

    alert("Account created! Welcome to the cosmos.");
    window.location.href = "../html/auth.html";
    e.target.reset();
  } catch (error) {
    alert("Signup error: " + error.message);
  }
});

// Login Function 
document.getElementById('login-form').addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("login-username").value;
  const password = document.getElementById("login-password").value;

  try {
    const usersRef = firestore.collection(db, "users");
    const q = firestore.query(usersRef, firestore.where("username", "==", username));
    const querySnapshot = await firestore.getDocs(q);

    if (querySnapshot.empty) {
      throw new Error("❌ Username not found");
    }

    const userData = querySnapshot.docs[0].data();
    const userEmail = userData.email;

    if (!userEmail) {
      throw new Error("❌ No email linked to this username");
    }

    await firebaseAuth.signInWithEmailAndPassword(auth, userEmail, password);

    alert(`✅ Welcome back, ${username}!`);
    if (previousPage && previousPage !== window.location.href) {
      window.location.href = previousPage;
    } else {
      window.location.href = "../index.html";
    }
    
    e.target.reset();
    } catch (error) {
    console.error("Login error:", error);
    
    let errorMsg = "Login failed. Please try again.";
    if (error.message.includes("invalid-login-credentials")) {
      errorMsg = "❌ Incorrect password";
    } else if (error.message.includes("Username not found")) {
      errorMsg = "❌ Username does not exist";
    }
    
    alert(errorMsg);
  }
});


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

// Close modal when pressing 'Escape' key
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    resetModal.style.display = "none";
  }
});

const resetEmailInput = document.getElementById("reset-email");

if (resetEmailInput) {
  resetEmailInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      submitReset.click();
    }
  });
}