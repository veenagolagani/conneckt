const user = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
if (!user.id) {
  alert("Please login first.");
  window.location.href = "index.html";
}

const suggestionList = document.getElementById("suggestionList");

async function loadSuggestions() {
  const res = await fetch("http://localhost:3000/users");
  const users = await res.json();

  const suggestions = users.filter(u => u.id != user.id);

  suggestionList.innerHTML = "";
  suggestions.forEach(person => {
    const card = document.createElement("div");
    card.className = "card suggestion-card";

    card.innerHTML = `
      <h4>${person.name}</h4>
      <p>${person.position}</p>
      <p>${person.location}</p>
      <button class="connect-btn" data-id="${person.id}">Connect</button>
    `;

    suggestionList.appendChild(card);
  });

  document.querySelectorAll(".connect-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const toUserId = e.target.getAttribute("data-id");
      sendConnectionRequest(toUserId);
      e.target.textContent = "Requested";
      e.target.disabled = true;
    });
  });
}

function sendConnectionRequest(toUserId) {
  fetch("http://localhost:3000/notifications", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: parseInt(toUserId),
      fromUserId: user.id,
      type: "connection",
      message: `${user.name} sent you a connection request`
    })
  });
}

loadSuggestions();
function goBack() {
  window.history.back();
}
