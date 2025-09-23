// ==========================
// Navigation Between Screens
// ==========================
function showLogin() {
  document.getElementById("welcome").style.display = "none";
  document.getElementById("signup").style.display = "none";
  document.getElementById("login").style.display = "block";
}

function showSignup() {
  document.getElementById("welcome").style.display = "none";
  document.getElementById("login").style.display = "none";
  document.getElementById("signup").style.display = "block";
}

function goBack() {
  document.getElementById("login").style.display = "none";
  document.getElementById("signup").style.display = "none";
  document.getElementById("welcome").style.display = "block";
}

// ==========================
// Validation Functions
// ==========================
function validatePassword(password) {
  const lower = /[a-z]/.test(password);
  const upper = /[A-Z]/.test(password);
  const digit = /\d/.test(password);
  const special = /[^a-zA-Z0-9]/.test(password);
  const length = password.length >= 8; // require at least 8 chars
  return lower && upper && digit && special && length;
}

function validateGmail(email) {
  return /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email);
}

// ==========================
// Login
// ==========================
function login() {
  const username = document.getElementById("login-username").value.trim();
  const password = document.getElementById("login-password").value;
  const error = document.getElementById("login-error");

  if (username === "" || password === "") {
    alert("Please fill out all fields! ⚠️");
    error.textContent = "⚠️ Please fill out all fields.";
    return;
  }

  if (!validateGmail(username)) {
    alert("Username must be a valid Gmail address (example@gmail.com). ⚠️");
    error.textContent = "⚠️ Username must be a valid Gmail address.";
    return;
  }

  if (!validatePassword(password)) {
    alert("Password must be at least 8 characters and include lowercase, uppercase, digit, and symbol. ⚠️");
    error.textContent = "⚠️ Password must contain: Lowercase, Uppercase, Digit, Symbol.";
    return;
  }

  // Success → go to calculator
  error.textContent = "";
  document.getElementById("login").style.display = "none";
  document.getElementById("calculator").style.display = "block";
}

// ==========================
// Sign Up
// ==========================
function signup() {
  const username = document.getElementById("signup-username").value.trim();
  const password = document.getElementById("signup-password").value;
  const confirm = document.getElementById("signup-confirm").value;
  const error = document.getElementById("signup-error");

  if (username === "" || password === "" || confirm === "") {
    alert("Please fill out all fields! ⚠️");
    error.textContent = "⚠️ Please fill out all fields.";
    return;
  }

  if (!validateGmail(username)) {
    alert("Username must be a valid Gmail address (example@gmail.com). ⚠️");
    error.textContent = "⚠️ Username must be a valid Gmail address.";
    return;
  }

  if (!validatePassword(password)) {
    alert("Password must be at least 8 characters and include lowercase, uppercase, digit, and symbol. ⚠️");
    error.textContent = "⚠️ Password must contain: Lowercase, Uppercase, Digit, Symbol.";
    return;
  }

  if (password !== confirm) {
    alert("Passwords do not match! ⚠️");
    error.textContent = "⚠️ Passwords do not match.";
    return;
  }

  // Success → go to calculator
  error.textContent = "";
  document.getElementById("signup").style.display = "none";
  document.getElementById("calculator").style.display = "block";
}

// ==========================
// Calculator Logic
// ==========================
function press(value) {
  document.getElementById("display").value += value;
}

function calculate() {
  try {
    document.getElementById("display").value = eval(document.getElementById("display").value);
  } catch {
    document.getElementById("display").value = "Error";
  }
}

function clearDisplay() {
  document.getElementById("display").value = "";
}

function togglePassword(id, el) {
  const input = document.getElementById(id);
  if (input.type === "password") {
    input.type = "text";
    el.textContent = "🙈";
  } else {
    input.type = "password";
    el.textContent = "👁️";
  }
}
