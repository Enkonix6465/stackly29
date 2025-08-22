
  document.addEventListener("DOMContentLoaded", function () {
    const newsletterForm = document.getElementById("newsletter-form");
    const successMsg = document.getElementById("newsletter-success");

    newsletterForm.addEventListener("submit", function (e) {
      e.preventDefault(); // Prevent actual page reload
      successMsg.style.display = "block"; // Show Thank You message
      newsletterForm.reset(); // Clear the input field
    });
  });
