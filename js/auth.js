document.addEventListener("DOMContentLoaded", () => {
  // ----- SIGNUP -----
  const signupForm = document.getElementById("signupForm");
  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const firstName = document.getElementById("signupFirstName").value.trim();
      const lastName = document.getElementById("signupLastName").value.trim();
      const username = document.getElementById("signupUsername").value.trim();
      const password = document.getElementById("signupPassword").value.trim();
      const confirmPassword = document.getElementById("signupConfirmPassword").value.trim();

      if (username === "admin@enkonix.in") {
        alert("⚠️ This username is reserved!");
        return;
      }

      let users = JSON.parse(localStorage.getItem("users")) || [];

      if (users.find(u => u.username === username)) {
        alert("⚠️ Username already exists!");
        return;
      }

      if (password !== confirmPassword) {
        alert("⚠️ Passwords do not match!");
        return;
      }

      const signupDate = new Date().toISOString().split("T")[0];

      users.push({ firstName, lastName, username, password, signupDate, loginCount: 0 });
      localStorage.setItem("users", JSON.stringify(users));

      alert("✅ Signup successful! Please login.");
      window.location.href = "login.html";
    });
  }

  // ----- LOGIN -----
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const username = document.getElementById("loginUsername").value.trim();
      const password = document.getElementById("loginPassword").value.trim();

      let users = JSON.parse(localStorage.getItem("users")) || [];

      // Admin login check
      if (username === "admin@enkonix.in" && password === "admin123") {
        sessionStorage.setItem("loggedInUser", JSON.stringify({ username, password }));
        window.location.href = "dashboard.html";
        return;
      }

      // Normal user login check
      const userIndex = users.findIndex(u => u.username === username && u.password === password);
      if (userIndex !== -1) {
        // ✅ increase login count
        users[userIndex].loginCount = (users[userIndex].loginCount || 0) + 1;
        localStorage.setItem("users", JSON.stringify(users));

        sessionStorage.setItem("loggedInUser", JSON.stringify(users[userIndex]));
        window.location.href = "index.html"; // redirect normal user
      } else {
        alert("⚠️ Invalid credentials!");
      }
    });
  }
});

// ----- LOGOUT -----
function logout() {
  sessionStorage.removeItem("loggedInUser");
  window.location.href = "login.html";
}

// ----- PASSWORD TOGGLE -----
function togglePassword(fieldId, toggleIcon) {
  const field = document.getElementById(fieldId);
  if (field.type === "password") {
    field.type = "text";
    toggleIcon.textContent = "🙈";
  } else {
    field.type = "password";
    toggleIcon.textContent = "👁️";
  }
}
