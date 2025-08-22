

  // ================== Dark / Light Theme Toggle ==================
  const toggleBtn = document.getElementById("themeToggle");

  // Load previously saved theme
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-theme");
    toggleBtn.textContent = "☀️";
  }

  toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme");

    if (document.body.classList.contains("dark-theme")) {
      localStorage.setItem("theme", "dark");
      toggleBtn.textContent = "☀️"; // sun = light mode available
    } else {
      localStorage.setItem("theme", "light");
      toggleBtn.textContent = "🌙"; // moon = dark mode available
    }
  });

