const API_URL = "http://localhost:3000";
const userTableBody = document.getElementById("user-table-body");
let usersData = [];

function fetchUsers() {
  Promise.all([
    fetch(`${API_URL}/users`).then(res => res.json()),
    fetch(`${API_URL}/posts`).then(res => res.json()),
    fetch(`${API_URL}/applications`).then(res => res.json())
  ])
  .then(([users, posts, applications]) => {
    usersData = users;
    renderUsers(users, posts, applications);
  })
  .catch(err => {
    console.error("Error fetching data:", err);
  });
}

function renderUsers(users, posts, applications) {
  userTableBody.innerHTML = "";
  users.forEach(user => {
    const postCount = posts.filter(post => post.userId == user.id).length;
    const applicationCount = applications.filter(app => app.userId == user.id).length;
    const tokenCount = user.tokenCount || 0;
    const status = user.status || "active";

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${user.id}</td>
      <td>${user.name || "No Name"}</td>
      <td>${user.email || "No Email"}</td>
      <td>${tokenCount}</td>
      <td>${postCount}</td>
      <td>${applicationCount}</td> <!-- NEW -->
      <td><span class="badge ${status}">${status.charAt(0).toUpperCase() + status.slice(1)}</span></td>
      <td>
        <button class="delete-btn" onclick="deleteUser(${user.id})">Delete</button>
        <button class="block-btn" onclick="blockUser(${user.id})" ${status === "blocked" ? "disabled" : ""}>Block</button>
        <button class="unblock-btn" onclick="unblockUser(${user.id})" ${status !== "blocked" ? "disabled" : ""}>Unblock</button>
      </td>
    `;
    userTableBody.appendChild(row);
  });
}

function deleteUser(id) {
  if (!confirm("Are you sure you want to delete this user?")) return;
  fetch(`${API_URL}/users/${id}`, { method: "DELETE" })
    .then(() => fetchUsers())
    .catch(err => console.error("Error deleting user:", err));
}

function blockUser(id) {
  fetch(`${API_URL}/users/${id}`)
    .then(res => res.json())
    .then(user => {
      user.status = "blocked";
      return fetch(`${API_URL}/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user)
      });
    })
    .then(() => fetchUsers());
}

function unblockUser(id) {
  fetch(`${API_URL}/users/${id}`)
    .then(res => res.json())
    .then(user => {
      user.status = "active";
      return fetch(`${API_URL}/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user)
      });
    })
    .then(() => fetchUsers());
}

function filterUsers() {
  const search = document.getElementById("searchInput").value.toLowerCase();
  const filtered = usersData.filter(user =>
    user.name.toLowerCase().includes(search) ||
    user.email.toLowerCase().includes(search)
  );
  Promise.all([
    fetch(`${API_URL}/posts`).then(res => res.json()),
    fetch(`${API_URL}/applications`).then(res => res.json())
  ])
  .then(([posts, applications]) => {
    renderUsers(filtered, posts, applications);
  });
}

function exportCSV() {
  let csv = "ID,Name,Email,Tokens,Posts,Applications,Status\n";
  Promise.all([
    fetch(`${API_URL}/posts`).then(res => res.json()),
    fetch(`${API_URL}/applications`).then(res => res.json())
  ])
  .then(([posts, applications]) => {
    usersData.forEach(user => {
      const postCount = posts.filter(p => p.userId == user.id).length;
      const applicationCount = applications.filter(app => app.userId == user.id).length;
      csv += `${user.id},${user.name},${user.email},${user.tokenCount || 0},${postCount},${applicationCount},${user.status || 'active'}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = "users_report.csv";
    link.click();
  });
}

fetchUsers();
