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