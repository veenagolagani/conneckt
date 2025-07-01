document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  if (!email || !password) {
    alert("Please fill in both fields.");
    return;
  }

  const res = await fetch(`http://localhost:3000/users?email=${email}&password=${password}`);
  const users = await res.json();

  if (users.length === 0) {
    alert("Invalid email or password.");
    return;
  }

  const user = users[0];
  localStorage.setItem("loggedInUser", JSON.stringify(user));
  window.location.href = "feed.html";
});
