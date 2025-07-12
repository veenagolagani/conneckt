const user = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
user.id = Number(user.id);  // Ensure number

const targetId = Number(localStorage.getItem("chatUserId"));

if (!user.id || !targetId) {
  alert("Invalid chat. Please go to connections page.");
  window.location.href = "connections.html";
}

const chatBox = document.getElementById("chatBox");
const chatInput = document.getElementById("chatMsg");
const sendBtn = document.getElementById("sendBtn");

let targetUser = {};

async function loadTargetUser() {
  try {
    const res = await fetch(`http://localhost:3000/users/${targetId}`);
    targetUser = await res.json();
    document.getElementById("chatHeader").innerHTML = `<h3>Chat with ${targetUser.name}</h3>`;
  } catch (err) {
    console.error("Failed to load user", err);
  }
}

async function loadMessages() {
  try {
    const res = await fetch("http://localhost:3000/messages");
    const messages = await res.json();

    chatBox.innerHTML = "";

    messages.forEach(msg => {
      const fromId = Number(msg.fromUserId);
      const toId = Number(msg.toUserId);

      // Only show messages between current user and chat target
      if (
        (fromId === user.id && toId === targetId) ||
        (fromId === targetId && toId === user.id)
      ) {
        const messageDiv = document.createElement("div");
        const isSent = fromId === user.id;
        messageDiv.className = `chat-message ${isSent ? "sent" : "received"}`;
        messageDiv.textContent = msg.message;
        chatBox.appendChild(messageDiv);
      }
    });

    chatBox.scrollTop = chatBox.scrollHeight;
  } catch (err) {
    console.error("Failed to load messages", err);
  }
}

sendBtn.addEventListener("click", async () => {
  const message = chatInput.value.trim();
  if (!message) return;

  const newMsg = {
    id: Math.random().toString(36).slice(2, 6),
    fromUserId: user.id,
    toUserId: targetId,
    message
  };

  try {
    await fetch("http://localhost:3000/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newMsg)
    });

    chatInput.value = "";
    await loadMessages();
  } catch (err) {
    console.error("Error sending message", err);
    alert("Network error.");
  }
});

(async () => {
  await loadTargetUser();
  await loadMessages();
})();

setInterval(loadMessages, 3000);

function goBack() {
  window.history.back();
}
