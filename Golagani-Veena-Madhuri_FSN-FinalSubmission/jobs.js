const API_URL = "http://localhost:3000";
let currentJobId = null;


document.querySelectorAll(".close-btn").forEach(btn => {
  btn.onclick = () => document.getElementById("applyModal").style.display = "none";
});

function goBack() {
  window.history.back();
}

function openModal(jobId) {
  currentJobId = jobId;
  document.getElementById("applyModal").style.display = "block";
}

function fetchJobs() {
  fetch(`${API_URL}/jobs`)
    .then(res => res.json())
    .then(jobs => {
      renderJobs(jobs);
    })
    .catch(err => {
      console.error("Error fetching jobs:", err);
    });
}

function renderJobs(jobs) {
  const jobList = document.getElementById("jobList");
  jobList.innerHTML = "";

  jobs.forEach(job => {
    const jobCard = document.createElement("div");
    jobCard.className = "job-card";

    jobCard.innerHTML = `
      <h4>${job.title}</h4>
      <p><strong>Company:</strong> ${job.company}</p>
      <p><strong>Location:</strong> ${job.location}</p>
      <p><strong>Type:</strong> ${job.type}</p>
      <button onclick="openModal('${job.id}')">Apply Now</button>
    `;

    jobList.appendChild(jobCard);
  });
}


document.getElementById("jobApplicationForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const name = document.getElementById("applicantName").value;
  const email = document.getElementById("applicantEmail").value;
  const phone = document.getElementById("applicantPhone").value;
  const reason = document.getElementById("reason").value;
  const resumeFile = document.getElementById("resume").files[0];
  const relocate = document.getElementById("relocate").value;
  const user = JSON.parse(localStorage.getItem("loggedInUser"));

  const resumeBase64 = resumeFile ? await fileToBase64(resumeFile) : "";

  const application = {
    id: crypto.randomUUID(),
    userId: user?.id || "anonymous",
    jobId: currentJobId,
    name,
    email,
    phone,
    reason,
    resume: resumeBase64,
    relocate,
    status: "submitted"
  };

  fetch(`${API_URL}/applications`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(application)
  })
    .then(() => {
      document.getElementById("applyModal").style.display = "none";
      document.getElementById("successPopup").style.display = "block";
      setTimeout(() => document.getElementById("successPopup").style.display = "none", 3000);
      document.getElementById("jobApplicationForm").reset();
    });
});


function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
}

document.getElementById("locationFilter").addEventListener("change", applyFilters);
document.getElementById("typeFilter").addEventListener("change", applyFilters);

function applyFilters() {
  const location = document.getElementById("locationFilter").value;
  const type = document.getElementById("typeFilter").value;

  fetch(`${API_URL}/jobs`)
    .then(res => res.json())
    .then(jobs => {
      const filtered = jobs.filter(job => {
        return (!location || job.location === location) &&
               (!type || job.type === type);
      });
      renderJobs(filtered);
    });
}


fetchJobs();
