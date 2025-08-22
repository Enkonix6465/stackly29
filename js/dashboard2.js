let totalUsersChart, todaySignupChart, weeklySignupChart, rolesChart;

document.addEventListener("DOMContentLoaded", () => {
  let users = JSON.parse(localStorage.getItem("users")) || [];

  // Normalize users (add missing fields if old data exists)
  users = users.map(u => ({
    firstName: u.firstName || "",
    lastName: u.lastName || "",
    username: u.username,
    password: u.password, // still stored for login
    loginCount: u.loginCount || 0,
    signupDate: u.signupDate || new Date().toISOString().split("T")[0]
  }));
  localStorage.setItem("users", JSON.stringify(users));

  // Populate user table
  const tbody = document.getElementById("userTableBody");
  tbody.innerHTML = "";
  users.forEach((u, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${(u.firstName || "") + " " + (u.lastName || "")}</td>
      <td>${u.username}</td>
      <td>${u.signupDate}</td>
      <td><button class="delete-btn" onclick="deleteUser(${index})">Delete</button></td>
    `;
    tbody.appendChild(row);
  });

  renderCharts(users);
  showSummary(users);

  // Profile dropdown toggle
  const profile = document.getElementById("profile-dropdown-toggle");
  profile.addEventListener("click", () => {
    profile.classList.toggle("open");
  });

  // Theme toggle
  document.getElementById("themeToggle").addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
  });
});

// Delete user
function deleteUser(index) {
  let users = JSON.parse(localStorage.getItem("users")) || [];
  users.splice(index, 1);
  localStorage.setItem("users", JSON.stringify(users));
  location.reload();
}

// Render charts
function renderCharts(users) {
  const normalUsers = users.filter(u => u.username !== "admin@enkonix.in");
  const totalUsers = normalUsers.length;
  const today = new Date().toISOString().split("T")[0];
  const todaySignups = normalUsers.filter(u => u.signupDate === today).length;

  // Weekly signups
  const signupCounts = Array(7).fill(0);
  normalUsers.forEach(u => {
    if (u.signupDate) {
      const d = new Date(u.signupDate).getDay();
      const adjustedDay = d === 0 ? 6 : d - 1; // make Monday = 0
      signupCounts[adjustedDay]++;
    }
  });

  // Destroy old charts
  if (totalUsersChart) totalUsersChart.destroy();
  if (todaySignupChart) todaySignupChart.destroy();
  if (weeklySignupChart) weeklySignupChart.destroy();
  if (rolesChart) rolesChart.destroy();

  // Total Users → Line Chart
  totalUsersChart = new Chart(document.getElementById("totalUsersChart"), {
    type: "line",
    data: {
      labels: ["Users"],
      datasets: [{
        label: "Total Users",
        data: [totalUsers],
        borderColor: "#007bff",
        backgroundColor: "rgba(0,123,255,0.3)",
        tension: 0.3,
        fill: true
      }]
    },
    options: { responsive: true, plugins: { legend: { display: true } } }
  });

  // Today Signups → Bar Chart
  todaySignupChart = new Chart(document.getElementById("todaySignupChart"), {
    type: "bar",
    data: {
      labels: ["Today"],
      datasets: [{
        label: "New Signups",
        data: [todaySignups],
        backgroundColor: "#28a745"
      }]
    },
    options: { responsive: true, scales: { y: { beginAtZero: true, stepSize: 1 } } }
  });

  // Weekly Signups → Line Chart
  weeklySignupChart = new Chart(document.getElementById("weeklySignupChart"), {
    type: "line",
    data: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      datasets: [{
        label: "Weekly Signups",
        data: signupCounts,
        borderColor: "#ff5733",
        backgroundColor: "rgba(255,87,51,0.3)",
        fill: true,
        tension: 0.4
      }]
    },
    options: { responsive: true, scales: { y: { beginAtZero: true, stepSize: 1 } } }
  });

  // Roles → Doughnut Chart
  rolesChart = new Chart(document.getElementById("rolesChart"), {
    type: "doughnut",
    data: {
      labels: ["Admins", "Members"],
      datasets: [{
        data: [1, totalUsers],
        backgroundColor: ["#ffc107", "#17a2b8"]
      }]
    },
    options: { plugins: { legend: { position: "bottom" } } }
  });
}

// ----- Summary Cards -----
function showSummary(users) {
  const normalUsers = users.filter(u => u.username !== "admin@enkonix.in");

  // Most active user
  let mostActive = "-";
  if (normalUsers.length > 0) {
    const sortedByLogin = [...normalUsers].sort((a, b) => (b.loginCount || 0) - (a.loginCount || 0));
    if ((sortedByLogin[0].loginCount || 0) > 0) {
      mostActive = `${(sortedByLogin[0].firstName || "")} ${(sortedByLogin[0].lastName || "")} 
        (${sortedByLogin[0].username}) - ${sortedByLogin[0].loginCount} logins`;
    }
  }
  document.getElementById("mostActiveUser").textContent = mostActive;

  // Top signups day
  const dateCounts = {};
  normalUsers.forEach(u => {
    if (u.signupDate) {
      dateCounts[u.signupDate] = (dateCounts[u.signupDate] || 0) + 1;
    }
  });

  let topDay = "-";
  if (Object.keys(dateCounts).length > 0) {
    const maxDate = Object.keys(dateCounts).reduce((a, b) => dateCounts[a] > dateCounts[b] ? a : b);
    topDay = `${maxDate} (${dateCounts[maxDate]} signups)`;
  }
  document.getElementById("topSignupDay").textContent = topDay;

  // Total users
  document.getElementById("totalUsersCard").textContent = normalUsers.length;
}
