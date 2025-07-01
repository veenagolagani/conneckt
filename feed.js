const user = JSON.parse(localStorage.getItem("loggedInUser"));
if (!user || !user.id) {
  window.location.href = "index.html";
}

document.getElementById("profile-name").textContent = user.name;
document.getElementById("profile-title").textContent = user.position || "N/A";
document.querySelector(".location").textContent = user.location || "N/A";
document.querySelector(".industry").textContent = user.industry || "N/A";
document.getElementById("sidebar-pic").src = user.profileImage || "default.jpg";

const postList = document.getElementById("post-list");
let currentPage = 1;
const limit = 5;
let loading = false;
let allUsers = [];

function preloadUsers() {
  return fetch("http://localhost:3000/users")
    .then(res => res.json())
    .then(users => {
      allUsers = users;
    });
}

function getUserById(id) {
  return allUsers.find(u => String(u.id) === String(id));
}

function loadPosts(page = 1) {
  loading = true;
  fetch(`http://localhost:3000/posts?_sort=id&_order=desc&_page=${page}&_limit=${limit * 2}`) // Load more for filtering
    .then(res => res.json())
    .then(posts => {
      const filteredPosts = posts.filter(post => String(post.userId) !== String(user.id));
      filteredPosts.slice(0, limit).forEach(post => {
        const postUser = getUserById(post.userId);
        renderPost(post, postUser);
        loadComments(post.id);
      });
      loading = false;
    });
}

function renderPost(post, postUser) {
  const postCard = document.createElement("div");
  postCard.className = "post";
  postCard.innerHTML = `
    <div class="user-info">
      <img src="${postUser?.profileImage || 'default.jpg'}" style="width:30px;height:30px;border-radius:50%;margin-right:8px;vertical-align:middle;">
      ${postUser?.name || "User"} - ${postUser?.position || ""}
    </div>
    <p>${post.content}</p>
    ${post.image ? `<img src="${post.image}" alt="Post image" style="width:100%;max-height:300px;object-fit:contain;border-radius:10px;">` : ""}
    <button type="button" class="like-btn" id="like-btn-${post.id}" onclick="likePost(${post.id}, ${post.likes})">👍 Like (${post.likes})</button>
    <div class="comment-section" id="comments-${post.id}"></div>
    <div class="comment-input-row">
      <input type="text" placeholder="Add a comment..." id="comment-input-${post.id}" />
      <button type="button" onclick="submitComment(${post.id})">📩</button>
    </div>
  `;
  postList.appendChild(postCard);
}

function loadComments(postId) {
  fetch(`http://localhost:3000/comments?postId=${postId}`)
    .then(res => res.json())
    .then(comments => {
      const commentSection = document.getElementById(`comments-${postId}`);
      commentSection.innerHTML = comments.map(c => {
        const commentUser = getUserById(c.userId);
        return `<div class="comment"><strong>${commentUser?.name || 'Anonymous'}:</strong> ${c.text}</div>`;
      }).join("");
    });
}

function submitComment(postId) {
  const input = document.getElementById(`comment-input-${postId}`);
  const text = input.value.trim();
  if (!text) return;

  const commentData = {
    postId,
    userId: user.id,
    text,
    timestamp: new Date().toISOString()
  };

  fetch("http://localhost:3000/comments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(commentData)
  }).then(() => {
    input.value = "";
    loadComments(postId);
  });
}

function likePost(postId, currentLikes) {
  fetch(`http://localhost:3000/posts/${postId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ likes: currentLikes + 1 })
  }).then(() => {
    const btn = document.getElementById(`like-btn-${postId}`);
    if (btn) btn.textContent = `👍 Like (${currentLikes + 1})`;
  });
}

window.addEventListener("scroll", () => {
  if (
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 10 &&
    !loading
  ) {
    currentPage++;
    loadPosts(currentPage);
  }
});

preloadUsers().then(() => {
  loadPosts();
});
