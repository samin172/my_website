// ==========================
// Navigation
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
// Validation
// ==========================
function validatePassword(password) {
  const checks = {
    lower: /[a-z]/.test(password),
    upper: /[A-Z]/.test(password),
    digit: /\d/.test(password),
    special: /[^a-zA-Z0-9]/.test(password),
    length: password.length >= 8
  };
  return checks;
}

function validateGmail(email) {
  return /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email);
}

// ==========================
// Password Strength Bar
// ==========================
function checkPasswordStrength() {
  const password = document.getElementById("signup-password").value;
  const strengthBar = document.getElementById("strength-bar");
  const strengthText = document.getElementById("strength-text");

  const checks = validatePassword(password);
  const total = Object.keys(checks).length;
  const passed = Object.values(checks).filter(v => v).length;

  // Fill bar by percentage
  const percent = (passed / total) * 100;
  strengthBar.style.width = percent + "%";

  // Bar color
  if (percent === 100) strengthBar.style.background = "#4caf50";
  else if (percent >= 60) strengthBar.style.background = "#ffd700"; // yellow
  else strengthBar.style.background = "#ff4d6d"; // red

  // Text hint
  const missing = [];
  if (!checks.length) missing.push("8 chars");
  if (!checks.upper) missing.push("uppercase");
  if (!checks.lower) missing.push("lowercase");
  if (!checks.digit) missing.push("digit");
  if (!checks.special) missing.push("symbol");

  if (missing.length === 0) {
    strengthText.textContent = "✅ Password meets all requirements!";
  } else {
    strengthText.textContent = "⚠️ Missing: " + missing.join(", ");
  }
}

// ==========================
// Toggle Password Visibility
// ==========================
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

// ==========================
// Login & Signup
// ==========================
function login() {
  const username = document.getElementById("login-username").value.trim();
  const password = document.getElementById("login-password").value;
  const error = document.getElementById("login-error");

  if (username === "" || password === "") {
    error.textContent = "⚠️ Please fill out all fields.";
    return;
  }

  if (!validateGmail(username)) {
    error.textContent = "⚠️ Username must be a valid Gmail address.";
    return;
  }

  const checks = validatePassword(password);
  if (Object.values(checks).includes(false)) {
    error.textContent = "⚠️ Password must contain: Lowercase, Uppercase, Digit, Symbol, 8 chars.";
    return;
  }

  error.textContent = "";
  document.getElementById("login").style.display = "none";
  document.getElementById("calculator").style.display = "block";
}

function signup() {
  const username = document.getElementById("signup-username").value.trim();
  const password = document.getElementById("signup-password").value;
  const confirm = document.getElementById("signup-confirm").value;
  const error = document.getElementById("signup-error");

  if (username === "" || password === "" || confirm === "") {
    error.textContent = "⚠️ Please fill out all fields.";
    return;
  }

  if (!validateGmail(username)) {
    error.textContent = "⚠️ Username must be a valid Gmail address.";
    return;
  }

  const checks = validatePassword(password);
  if (Object.values(checks).includes(false)) {
    error.textContent = "⚠️ Password must contain: Lowercase, Uppercase, Digit, Symbol, 8 chars.";
    return;
  }

  if (password !== confirm) {
    error.textContent = "⚠️ Passwords do not match.";
    return;
  }

  error.textContent = "";
  document.getElementById("signup").style.display = "none";
  document.getElementById("calculator").style.display = "block";
}

// ==========================
// Calculator
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
