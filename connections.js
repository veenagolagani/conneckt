const user = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
if (!user.id) {
  window.location.href = "index.html";
}

const connectionList = document.getElementById("connectionList");

async function loadConnections() {
  const res = await fetch("http://localhost:3000/users");
  const users = await res.json();

  const otherUsers = users.filter(u => u.id !== user.id);
  connectionList.innerHTML = "";

  otherUsers.forEach(person => {
    const card = document.createElement("div");
    card.className = "card connection-card";

    card.innerHTML = `
      <div class="conn-info">
        <div class="conn-pic"></div>
        <div>
          <h4>${person.name}</h4>
          <p>${person.position} - ${person.location || "India"}</p>
          <small>${Math.floor(Math.random() * 5) + 1} mutual connections</small>
        </div>
      </div>
      <button data-id="${person.id}" class="msg-btn">Message</button>
    `;

    connectionList.appendChild(card);
  });

  document.querySelectorAll(".msg-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const targetId = btn.dataset.id;
      const targetName = btn.closest(".connection-card").querySelector("h4").textContent;

      localStorage.setItem("chatUserId", targetId);
      localStorage.setItem("chatUserName", targetName);

      showConnectPopup(`Opening chat with ${targetName}...`);
      setTimeout(() => {
        window.location.href = "chat.html";
      }, 1000);
    });
  });
}

function showConnectPopup(message) {
  const popup = document.getElementById("connectPopup");
  popup.textContent = message;
  popup.style.display = "block";
  popup.classList.add("show");

  setTimeout(() => {
    popup.classList.remove("show");
    popup.style.display = "none";
  }, 2000);
}

function goBack() {
  window.history.back();
}

loadConnections();
