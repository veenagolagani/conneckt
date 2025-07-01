const API_URL = "http://localhost:3000";
const jobTableBody = document.getElementById("job-table-body");
let allJobs = [];

function fetchJobs() {
  fetch(`${API_URL}/jobs`)
    .then(res => res.json())
    .then(jobs => {
      allJobs = jobs;
      displayJobs(jobs);
    })
    .catch(err => {
      console.error("Error fetching jobs:", err);
    });
}

function displayJobs(jobs) {
  jobTableBody.innerHTML = "";
  jobs.forEach(job => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${job.id}</td>
      <td>${job.title || "No Title"}</td>
      <td>${job.company || "No Company"}</td>
      <td>${job.location || "N/A"}</td>
      <td>
        <button onclick="deleteJob('${job.id}')">Delete</button>
      </td>
    `;
    jobTableBody.appendChild(row);
  });
}

function filterJobs(query) {
  const lowerQuery = query.toLowerCase();
  const filtered = allJobs.filter(job =>
    (job.title && job.title.toLowerCase().includes(lowerQuery)) ||
    (job.company && job.company.toLowerCase().includes(lowerQuery)) ||
    (job.location && job.location.toLowerCase().includes(lowerQuery))
  );
  displayJobs(filtered);
}

function deleteJob(id) {
  if (!confirm("Are you sure you want to delete this job?")) return;

  fetch(`${API_URL}/jobs/${id}`, { method: "DELETE" })
    .then(() => fetchJobs())
    .catch(err => {
      console.error("Error deleting job:", err);
    });
}

function addJob() {
  const title = document.getElementById("title").value.trim();
  const company = document.getElementById("company").value.trim();
  const location = document.getElementById("location").value.trim();
  const type = document.getElementById("type").value.trim();

  if (!title || !company || !location || !type) {
    alert("Please fill in all job fields.");
    return;
  }

  const newJob = {
    title,
    company,
    location,
    type
  };

  fetch(`${API_URL}/jobs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(newJob)
  })
    .then(res => res.json())
    .then(() => {

      document.getElementById("title").value = "";
      document.getElementById("company").value = "";
      document.getElementById("location").value = "";
      document.getElementById("type").value = "";

      fetchJobs();
    })
    .catch(err => {
      console.error("Error adding job:", err);
    });
}

fetchJobs();
