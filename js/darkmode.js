// Dark mode toggle
const darkModeToggle = document.getElementById("darkModeToggle");

darkModeToggle?.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");

  // Save preference in localStorage
  if (document.body.classList.contains("dark-mode")) {
    localStorage.setItem("darkMode", "enabled");
  } else {
    localStorage.removeItem("darkMode");
  }
});

// Apply dark mode on page load if enabled
document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("darkMode") === "enabled") {
    document.body.classList.add("dark-mode");
  }
});
