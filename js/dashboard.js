  document.addEventListener("DOMContentLoaded", () => {
    // Get logged-in user
    const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));

    // If not logged in → redirect to login
    if (!loggedInUser) {
      window.location.href = "login.html";
      return;
    }

    // Only admin can access dashboard
    if (loggedInUser.username !== "admin@enkonix.in" || loggedInUser.password !== "admin123") {
      // Redirect any normal user to homepage
      window.location.href = "index.html";
      return;
    }

    // ----- Dashboard logic for admin only -----
    let users = JSON.parse(localStorage.getItem("users")) || [];
    const tbody = document.getElementById("userTableBody");
    let totalUsersChart, todaySignupChart;

    // Render users table (exclude admin itself)
    function renderUsers() {
      tbody.innerHTML = "";
      users.forEach((u, index) => {
        if (u.username !== "admin@enkonix.in") {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${u.username}</td>
            <td>${u.password}</td>
            <td><button class="delete-btn" onclick="deleteUser(${index})">Delete</button></td>
          `;
          tbody.appendChild(row);
        }
      });
    }

    // Render charts
    function renderCharts() {
      const normalUsers = users.filter(u => u.username !== "admin@enkonix.in");
      const totalUsers = normalUsers.length;
      const today = new Date().toISOString().split("T")[0];
      const todaySignups = normalUsers.filter(u => u.signupDate === today).length;

      if (totalUsersChart) totalUsersChart.destroy();
      if (todaySignupChart) todaySignupChart.destroy();

      totalUsersChart = new Chart(document.getElementById("totalUsersChart"), {
        type: "doughnut",
        data: {
          labels: ["Users"],
          datasets: [{ label: "Total Users", data: [totalUsers], backgroundColor: ["#007bff"] }]
        },
        options: { plugins: { legend: { display: false } } }
      });

      todaySignupChart = new Chart(document.getElementById("todaySignupChart"), {
        type: "bar",
        data: {
          labels: ["Signups Today"],
          datasets: [{ label: "Users", data: [todaySignups], backgroundColor: "#28a745" }]
        },
        options: {
          plugins: { legend: { display: false } },
          scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
        }
      });
    }

    // Delete user
    window.deleteUser = function(index) {
      const userToDelete = users[index];
      if (userToDelete.username === "admin@enkonix.in") return; // cannot delete admin

      if (confirm("Are you sure you want to delete this user?")) {
        users.splice(index, 1);
        localStorage.setItem("users", JSON.stringify(users));
        renderUsers();
        renderCharts();
      }
    };

    renderUsers();
    renderCharts();
  });
