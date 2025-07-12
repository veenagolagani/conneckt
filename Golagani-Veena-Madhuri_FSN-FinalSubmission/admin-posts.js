const API_URL = "http://localhost:3000";
const postTableBody = document.getElementById("post-table-body");

let usersCache = {}; 

function fetchUsersAndPosts() {
  fetch(`${API_URL}/users`)
    .then(res => res.json())
    .then(users => {
      usersCache = {};
      users.forEach(user => {
        usersCache[user.id] = user; 
      });
      fetchPosts();
    })
    .catch(err => console.error("Error fetching users:", err));
}

// Fetch posts
function fetchPosts() {
  fetch(`${API_URL}/posts`)
    .then(res => res.json())
    .then(posts => renderPostTable(posts))
    .catch(err => console.error("Error fetching posts:", err));
}

// Render table with user names
function renderPostTable(posts) {
  postTableBody.innerHTML = "";
  posts.forEach(post => {
    const user = usersCache[Number(post.userId)];
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${post.id}</td>
      <td>${user?.name || "Unknown"}</td>
      <td>${post.content}</td>
      <td>${post.likes}</td>
      <td>
        <button class="delete-btn" onclick="deletePost(${post.id})">Delete</button>
        <button class="token-btn" onclick="tokenUser(${post.userId})">⚠️ Token</button>
        <button class="remove-token-btn" onclick="removeToken(${post.userId})">🟢 Remove Token</button>
      </td>
    `;
    postTableBody.appendChild(row);
  });
}

// Search by ID without _expand
function searchPost() {
  const id = document.getElementById("searchInput").value.trim();
  if (!id) return alert("Enter post ID");

  fetch(`${API_URL}/posts/${id}`)
    .then(res => {
      if (!res.ok) throw new Error("Post not found");
      return res.json();
    })
    .then(post => renderPostTable([post]))
    .catch(err => {
      alert("Post not found.");
      console.error(err);
    });
}


fetchUsersAndPosts();
