document.addEventListener("DOMContentLoaded", () => {
  const verifyBtn = document.getElementById("verifyBtn");
  const forgotMsg = document.getElementById("forgotMsg");
  const resetStep = document.getElementById("resetStep");
  const forgotUsername = document.getElementById("forgotUsername");
  const resetForm = document.getElementById("resetStep");

  let verifiedUserIndex = -1; // store which user is verified

  // STEP 1: VERIFY EMAIL
  verifyBtn.addEventListener("click", () => {
    let username = forgotUsername.value.trim().toLowerCase();

    // fix common typo
    if (username.includes("gamil.com")) {
      username = username.replace("gamil.com", "gmail.com");
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];
    verifiedUserIndex = users.findIndex(u => u.username.trim().toLowerCase() === username);

    if (verifiedUserIndex !== -1) {
      showMessage("✅ Email verified. Please reset your password.", "success");
      resetStep.classList.remove("hidden"); // show password fields
      forgotUsername.disabled = true;
      verifyBtn.disabled = true;
    } else {
      showMessage("⚠️ User not found!", "error");
    }
  });

  // STEP 2: RESET PASSWORD
  resetForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const newPassword = document.getElementById("forgotPassword").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();

    if (!newPassword || !confirmPassword) {
      showMessage("⚠️ Please fill in all fields.", "error");
      return;
    }

    if (newPassword !== confirmPassword) {
      showMessage("⚠️ Passwords do not match!", "error");
      return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    if (verifiedUserIndex !== -1) {
      users[verifiedUserIndex].password = newPassword;
      localStorage.setItem("users", JSON.stringify(users));
      showMessage("✅ Password reset successfully!", "success");
      resetForm.reset();
      resetStep.classList.add("hidden");
    }
  });

  // Helper function
  function showMessage(msg, type) {
    forgotMsg.style.display = "block";
    forgotMsg.textContent = msg;
    forgotMsg.className = type; // "success" or "error"
  }
});
