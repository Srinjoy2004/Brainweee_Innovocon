function togglePassword(inputId) {
  const input = document.getElementById(inputId);
  const button = input.nextElementSibling;
  const type = input.getAttribute("type") === "password" ? "text" : "password";
  input.setAttribute("type", type);

  // Update the icon based on the type
  if (type === "password") {
    button.innerHTML = `
    <svg id="toggleIcon-${inputId}" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>`;
  } else {
    button.innerHTML = `
    <svg id="toggleIcon-${inputId}" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M17.94 17.94L6.06 6.06"></path>
      <path d="M1 1l22 22"></path>
    </svg>`;
  }
}

function togglePassword(inputId) {
  const input = document.getElementById(inputId);
  const button = input.nextElementSibling;
  const type = input.getAttribute("type") === "password" ? "text" : "password";
  input.setAttribute("type", type);

  // Update the icon based on the type
  if (type === "password") {
    button.innerHTML = `
    <svg id="toggleIcon-${inputId}" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>`;
  } else {
    button.innerHTML = `
    <svg id="toggleIcon-${inputId}" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M17.94 17.94L6.06 6.06"></path>
      <path d="M1 1l22 22"></path>
    </svg>`;
  }
}

// Mobile Menu Toggle
const menuToggle = document.getElementById("menu-toggle");
const mobileMenu = document.getElementById("mobile-menu");

menuToggle.addEventListener("click", () => {
  mobileMenu.classList.toggle("hidden");
  if (mobileMenu.classList.contains("hidden")) {
    menuToggle.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-900 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
  </svg>`;
  } else {
    menuToggle.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-900 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
  </svg>`;
  }
});

// Theme Toggle for Desktop & Mobile
const themeToggle = document.getElementById("theme-toggle");
const themeText = document.getElementById("theme-text");
const themeToggleMobile = document.getElementById("theme-toggle-mobile");
const themeTextMobile = document.getElementById("theme-text-mobile");

function setTheme(isDark) {
  if (isDark) {
    document.documentElement.classList.add("dark");
    themeText.innerText = "Dark Mode";
    themeTextMobile.innerText = "Dark Mode";
  } else {
    document.documentElement.classList.remove("dark");
    themeText.innerText = "Light Mode";
    themeTextMobile.innerText = "Light Mode";
  }
}

themeToggle.addEventListener("click", () => {
  setTheme(!document.documentElement.classList.contains("dark"));
});
themeToggleMobile.addEventListener("click", () => {
  setTheme(!document.documentElement.classList.contains("dark"));
});

// Intersection Observer for triggering animations on scroll
document.addEventListener("DOMContentLoaded", function () {
  const observerOptions = {
    root: null,
    threshold: 0.1,
  };
  const observerCallback = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      }
    });
  };
  const observer = new IntersectionObserver(observerCallback, observerOptions);
  document.querySelectorAll(".section-animate, .text-animate").forEach((el) => {
    observer.observe(el);
  });
});

// Sign In Modal Functionality
const signinModal = document.getElementById("signin-modal");
const openSigninButtons = document.querySelectorAll(".open-signin-modal");
const closeSigninButton = document.getElementById("close-signin-modal");

openSigninButtons.forEach((button) => {
  button.addEventListener("click", () => {
    signinModal.classList.remove("hidden");
    // Close mobile menu if open
    mobileMenu.classList.add("hidden");
    // Update hamburger icon to hamburger
    menuToggle.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-900 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
  </svg>`;
    // Disable background scroll when modal is open
    document.body.classList.add("overflow-hidden");
  });
});

closeSigninButton.addEventListener("click", () => {
  signinModal.classList.add("hidden");
  document.body.classList.remove("overflow-hidden");
});

// Sign Up Modal Functionality
const signupModal = document.getElementById("signup-modal");
const openSignupButtons = document.querySelectorAll(".open-signup-modal");
const closeSignupButton = document.getElementById("close-signup-modal");

openSignupButtons.forEach((button) => {
  button.addEventListener("click", () => {
    signupModal.classList.remove("hidden");
    mobileMenu.classList.add("hidden");
    menuToggle.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-900 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
  </svg>`;
    document.body.classList.add("overflow-hidden");
  });
});

closeSignupButton.addEventListener("click", () => {
  signupModal.classList.add("hidden");
  document.body.classList.remove("overflow-hidden");
});

// -------------------------------
// Password Strength and Matching Logic for Sign Up Modal
// -------------------------------
const signupPasswordInput = document.getElementById("signup-password");
const signupConfirmPasswordInput = document.getElementById(
  "signup-confirm-password"
);
const strengthMeter = document.querySelector(".strength-meter");
const requirementItems = document.querySelectorAll(".requirement-item");
const matchMessage = document.querySelector(".match-message");

const passwordRequirements = {
  length: { regex: /.{8,}/, index: 0 },
  uppercase: { regex: /[A-Z]/, index: 1 },
  lowercase: { regex: /[a-z]/, index: 2 },
  number: { regex: /[0-9]/, index: 3 },
  special: { regex: /[^A-Za-z0-9]/, index: 4 },
};

function togglePassword(inputId) {
  const input = document.getElementById(inputId);
  const button = input.nextElementSibling;
  const type = input.getAttribute("type") === "password" ? "text" : "password";
  input.setAttribute("type", type);

  if (type === "password") {
    button.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
      <circle cx="12" cy="12" r="3"></circle>
  </svg>`;
  } else {
    button.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0="1-4.24-4.24"></path>
      <line x1="1" y1="1" x2="23" y2="23"></line>
  </svg>`;
  }
}

function updatePasswordStrength(password) {
  let strength = 0;
  Object.keys(passwordRequirements).forEach((req) => {
    const isValid = passwordRequirements[req].regex.test(password);
    const item = requirementItems[passwordRequirements[req].index];
    if (isValid) {
      strength++;
      item.classList.add("text-green-600");
      item.classList.remove("text-red-600");
    } else {
      item.classList.add("text-red-600");
      item.classList.remove("text-green-600");
    }
  });
  strengthMeter.className = "strength-meter bg-gray-300 h-1 rounded";
  if (strength > 3) {
    strengthMeter.classList.add("bg-green-500");
  } else if (strength > 2) {
    strengthMeter.classList.add("bg-yellow-500");
  } else if (strength > 0) {
    strengthMeter.classList.add("bg-red-500");
  }
}

function checkPasswordMatch() {
  const password = signupPasswordInput.value;
  const confirmPassword = signupConfirmPasswordInput.value;
  if (confirmPassword) {
    if (password === confirmPassword) {
      matchMessage.textContent = "Passwords match";
      matchMessage.classList.add("text-green-600");
      matchMessage.classList.remove("text-red-600");
      signupConfirmPasswordInput.classList.remove("border-red-500");
      signupConfirmPasswordInput.classList.add("border-green-500");
    } else {
      matchMessage.textContent = "Passwords do not match";
      matchMessage.classList.add("text-red-600");
      matchMessage.classList.remove("text-green-600");
      signupConfirmPasswordInput.classList.add("border-red-500");
      signupConfirmPasswordInput.classList.remove("border-green-500");
    }
  } else {
    matchMessage.textContent = "";
  }
}

signupPasswordInput.addEventListener("input", () => {
  // Show meter and requirements when user starts typing
  if (signupPasswordInput.value.trim() === "") {
    document.getElementById("strength-container").classList.add("hidden");
    document.getElementById("requirements-container").classList.add("hidden");
  } else {
    document.getElementById("strength-container").classList.remove("hidden");
    document
      .getElementById("requirements-container")
      .classList.remove("hidden");
  }
  updatePasswordStrength(signupPasswordInput.value);
  checkPasswordMatch();
});

signupConfirmPasswordInput.addEventListener("input", checkPasswordMatch);
