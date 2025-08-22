// auth-check.js
document.addEventListener("DOMContentLoaded", () => {
  const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));

  // If no logged-in user → redirect to login
  if (!loggedInUser) {
    window.location.href = "login.html";
  }
});
