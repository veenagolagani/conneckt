const API_URL = "http://localhost:3000";
const userCount = document.getElementById("user-count");
const postCount = document.getElementById("post-count");
const jobCount = document.getElementById("job-count");
const appCount = document.getElementById("application-count");

let usersData = [];
let postsData = [];

Promise.all([
  fetch(`${API_URL}/users`).then(res => res.json()),
  fetch(`${API_URL}/posts`).then(res => res.json()),
  fetch(`${API_URL}/jobs`).then(res => res.json()),
  fetch(`${API_URL}/applications`).then(res => res.json())
])
.then(([users, posts, jobs, applications]) => {
  usersData = users;
  postsData = posts;

  userCount.textContent = `Users: ${users.length}`;
  postCount.textContent = `Posts: ${posts.length}`;
  jobCount.textContent = `Jobs: ${jobs.length}`;
  appCount.textContent = `Applications: ${applications.length}`;

  renderUserStatusChart(users);
  renderPostsPerUserChart(posts, users);
  renderApplicationsChart(applications, users);
})
.catch(err => {
  console.error("Dashboard loading error", err);
  userCount.textContent = "Users: Error";
  postCount.textContent = "Posts: Error";
  jobCount.textContent = "Jobs: Error";
  appCount.textContent = "Applications: Error";
});

// Chart: User Status
function renderUserStatusChart(users) {
  const active = users.filter(u => u.status !== 'blocked').length;
  const blocked = users.filter(u => u.status === 'blocked').length;

  new Chart(document.getElementById("userStatusChart"), {
    type: 'pie',
    data: {
      labels: ["Active", "Blocked"],
      datasets: [{
        data: [active, blocked],
        backgroundColor: ["#2ecc71", "#e74c3c"]
      }]
    }
  });
}

// Chart: Posts per User
function renderPostsPerUserChart(posts, users) {
  const userPostMap = {};
  posts.forEach(post => {
    const user = users.find(u => u.id == post.userId);
    const name = user ? user.name : `User ${post.userId}`;
    userPostMap[name] = (userPostMap[name] || 0) + 1;
  });

  const labels = Object.keys(userPostMap);
  const data = Object.values(userPostMap);

  new Chart(document.getElementById("postsPerUserChart"), {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: "Post Count",
        data: data,
        backgroundColor: "#3498db"
      }]
    },
    options: {
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

// Chart: Applications per User
function renderApplicationsChart(applications, users) {
  const userAppMap = {};
  applications.forEach(app => {
    const user = users.find(u => u.id == app.userId);
    const name = user ? user.name : `User ${app.userId}`;
    userAppMap[name] = (userAppMap[name] || 0) + 1;
  });

  const labels = Object.keys(userAppMap);
  const data = Object.values(userAppMap);

  new Chart(document.getElementById("applicationsPerUserChart"), {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: "Application Count",
        data: data,
        backgroundColor: "#9b59b6"
      }]
    },
    options: {
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}
