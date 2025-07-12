let currentSlide = 0;
const slides = document.querySelectorAll(".form-slide");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const submitBtn = document.getElementById("submitBtn");

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.toggle("active", i === index);
  });

  prevBtn.style.display = index === 0 ? "none" : "inline-block";
  nextBtn.style.display = index === slides.length - 1 ? "none" : "inline-block";
  submitBtn.style.display = index === slides.length - 1 ? "inline-block" : "none";
}

nextBtn.addEventListener("click", () => {
  if (currentSlide < slides.length - 1) {
    currentSlide++;
    showSlide(currentSlide);
  }
});

prevBtn.addEventListener("click", () => {
  if (currentSlide > 0) {
    currentSlide--;
    showSlide(currentSlide);
  }
});

showSlide(currentSlide);

// Form Submission
document.getElementById("signupform").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const phone = document.getElementById("phone").value.trim();
  const dob = document.getElementById("dob").value;
  const gender = document.getElementById("gender").value;
  const jobtitle = document.getElementById("jobtitle").value;
  const company = document.getElementById("company").value;
  const experience = document.getElementById("experience").value;
  const location = document.getElementById("location").value;
  const industry = document.getElementById("industry").value;
  const skills = document.getElementById("skills").value;
  const git = document.getElementById("git").value;
  const qualification = document.getElementById("qualification").value;
  const institution = document.getElementById("institution").value;
  const field = document.getElementById("field").value;
  const gradYear = document.getElementById("gradYear").value;
  const languages = document.getElementById("languages").value;
  const interests = document.getElementById("interests").value;
  const relocate = document.getElementById("relocate").value;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[6-9]\d{9}$/;

  if (!emailRegex.test(email)) {
    alert("Invalid email format.");
    return;
  }

  if (!phoneRegex.test(phone)) {
    alert("Invalid phone number. Use 10 digits.");
    return;
  }

  if (password.length < 6) {
    alert("Password should be at least 6 characters.");
    return;
  }

  const newUser = {
    name,
    email,
    password,
    phone,
    dob,
    gender,
    jobtitle,
    company,
    experience,
    location,
    industry,
    skills: skills.split(",").map(s => s.trim()),
    git,
    qualification,
    institution,
    field,
    gradYear,
    languages,
    interests,
    relocate,
    createdAt: new Date().toISOString()
  };

  const res = await fetch("http://localhost:3000/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newUser)
  });

  if (res.ok) {
    const user = await res.json();
    localStorage.setItem("loggedInUser", JSON.stringify(user));
    alert("Signup successful!");
    window.location.href = "feed.html";
  } else {
    alert("Signup failed. Try again.");
  }
});
