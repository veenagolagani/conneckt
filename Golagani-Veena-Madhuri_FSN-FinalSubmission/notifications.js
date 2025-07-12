
const user = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
if (!user.id) {
  alert("Please login first.");
  window.location.href = "index.html";
}

const container = document.getElementById("notificationList");

async function loadNotifications() {
  try {
    const res = await fetch(`http://localhost:3000/notifications?userId=${user.id}&_expand=fromUser`);
    const notifications = await res.json();
    renderNotifications(notifications);
  } catch (err) {
    alert("Error loading notifications");
    console.error(err);
  }
}

function renderNotifications(list) {
  container.innerHTML = "";

  list.forEach(note => {
    const card = document.createElement("div");
    card.className = "card notification-card";

    const fromUser = note.fromUser || {};
    const messageHTML = `<p><strong>${note.message}</strong></p>`;
    let buttonHTML = "";

    if (note.type === "connection") {
      buttonHTML = `<button class="connect-btn" data-id="${note.id}">Connect</button>`;
    } else if (note.type === "job" || note.type === "post") {
      buttonHTML = `<button class="view-btn" data-id="${note.id}" data-type="${note.type}">View</button>`;
    }

    card.innerHTML = messageHTML + buttonHTML;
    container.appendChild(card);
  });

  document.querySelectorAll(".connect-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      alert(" Connection request accepted!");
      btn.textContent = "Connected";
      btn.disabled = true;
    });
  });

  document.querySelectorAll(".view-btn").forEach(btn => {
    btn.addEventListener("click", async (e) => {
      const noteId = e.target.getAttribute("data-id");

      try {
        const res = await fetch(`http://localhost:3000/notifications/${noteId}`);
        const note = await res.json();

        if (note.type === "job") {
          const jobTitle = note.message.match(/'(.*?)'/)?.[1];
          if (!jobTitle) {
            alert("Invalid job title format.");
            return;
          }

          const jobRes = await fetch(`http://localhost:3000/jobs`);
          const jobs = await jobRes.json();
          const matchedJob = jobs.find(j => j.title === jobTitle);

          if (matchedJob) {
            localStorage.setItem("viewJobId", matchedJob.id);
            window.location.href = "job-details.html";
          } else {
            alert("Job not found.");
          }
        } else {
          localStorage.setItem("viewUserId", note.fromUserId);
          window.location.href = "view-profile.html";
        }
      } catch (err) {
        alert("Error loading data.");
        console.error(err);
      }
    });
  });
}

loadNotifications();
function goBack() {
  window.history.back();
}

