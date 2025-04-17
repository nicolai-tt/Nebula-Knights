// Log-In and Sign-Up Form

let loginForm = document.getElementById("login-form");
let signupForm = document.getElementById("signup-form");
let showSignup = document.getElementById("show-signup");
let showLogin = document.getElementById("show-login");

const previousPage = document.referrer;

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

// Login function

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = loginForm.querySelector('input[type="text"]').value; // Get username input
  const password = loginForm.querySelector('input[type="password"]').value;
  const previousPage = document.referrer; // Get the previous page URL

  // Retrieve user data from localStorage
  const userData = JSON.parse(localStorage.getItem(username));

  if (userData && userData.password === password) {
    try {
      // Use the stored email for Firebase Authentication
      await firebaseAuth.signInWithEmailAndPassword(auth, userData.email, password);
      alert("Welcome back to Cosmic Explorer!");
      if (previousPage && previousPage !== window.location.href) {
        window.location.href = previousPage;
      } else {
        window.location.href = "index.html";
      }
    } catch (error) {
      alert("Login error: " + error.message);
    }
  } else {
    alert("Login error: Username or password is incorrect.");
  }
});

// Signup function

signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = signupForm.querySelector('input[type="text"]').value; // Get username input
  const email = signupForm.querySelector('input[type="email"]').value;
  const password = signupForm.querySelector('input[type="password"]').value;

  try {
    // Create the user with email and password using Firebase Authentication
    const userCredential = await firebaseAuth.createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Store the username and other info in localStorage
    const userData = {
      username: username,
      email: email,
      password: password  // This is not ideal, consider hashing it if possible
    };
    localStorage.setItem(username, JSON.stringify(userData)); // Store by username

    alert("Account created! Welcome to the cosmos.");
  } catch (error) {
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

