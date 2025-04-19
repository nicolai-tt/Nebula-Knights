// Live Timer

function updateLiveTimer() {

  const timerDiv = document.getElementById("live-timer");
  const now = new Date();
  const timeString = now.toLocaleTimeString();
  const dateString = now.toLocaleDateString();
  timerDiv.textContent = `Current Time: ${dateString} ${timeString}`;

}

document.addEventListener("DOMContentLoaded", function() {
  const currentPage = window.location.pathname.split("/").pop();
  const navLinks = document.querySelectorAll("nav a");

  navLinks.forEach(link => {
    if (link.getAttribute("href") === currentPage) {
      link.classList.add("active");
    }
  });
});

setInterval(updateLiveTimer, 1000);

updateLiveTimer();

const container = document.getElementById("shooting-star-container");

  function createShootingStar() {
    const star = document.createElement("div");
    star.classList.add("shooting-star");

    // Random start position
    const startX = Math.random() * window.innerWidth * 0.8;
    const startY = Math.random() * window.innerHeight * 0.4;

    star.style.left = `${startX}px`;
    star.style.top = `${startY}px`;

    container.appendChild(star);

    // Remove after animation ends
    setTimeout(() => {
      star.remove();
    }, 2000);
  }

  // Repeat every 2-5 seconds
  setInterval(() => {
    createShootingStar();
  }, Math.random() * 3000 + 2000);