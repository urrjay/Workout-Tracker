// Workout Schedule Data
const routine = {
  Monday: "Triceps, Chest, Ab Finisher",
  Tuesday: "Back, Biceps",
  Wednesday: "Legs, Ab Finisher",
  Thursday: "Back, Chest",
  Friday: "Arms, Shoulders"
};

let currentDaySelection = "";

// Initialize App
document.addEventListener("DOMContentLoaded", () => {
  checkMonthlyReset();
  
  // Transition from Splash to Home after 2.5 seconds
  setTimeout(() => {
    document.getElementById("splash-screen").classList.remove("active");
    document.getElementById("home-screen").classList.add("active");
  }, 2500);
});

// Navigation Functions
function openDay(day) {
  currentDaySelection = day;
  document.getElementById("home-screen").classList.remove("active");
  document.getElementById("day-screen").classList.add("active");
  
  document.getElementById("current-day-title").innerText = day;
  document.getElementById("current-muscle-groups").innerText = routine[day];
  
  loadSavedData();
}

function goHome() {
  document.getElementById("day-screen").classList.remove("active");
  document.getElementById("home-screen").classList.add("active");
}

// Superset Logic & Local Storage
function toggleSet(setNumber) {
  const btn = document.getElementById(`set-${setNumber}`);
  btn.classList.toggle("completed");
  
  // Save state to local storage based on the day and set number
  const storageKey = `hypertrophy_${currentDaySelection}_set${setNumber}`;
  if (btn.classList.contains("completed")) {
    localStorage.setItem(storageKey, "done");
  } else {
    localStorage.removeItem(storageKey);
  }
}

function loadSavedData() {
  for (let i = 1; i <= 5; i++) {
    const btn = document.getElementById(`set-${i}`);
    const storageKey = `hypertrophy_${currentDaySelection}_set${i}`;
    
    if (localStorage.getItem(storageKey) === "done") {
      btn.classList.add("completed");
    } else {
      btn.classList.remove("completed");
    }
  }
}

// 1st Monday Reset Logic
function checkMonthlyReset() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  
  // Find the 1st Monday of the current month
  let firstMonday = new Date(year, month, 1);
  while (firstMonday.getDay() !== 1) { // 1 = Monday
    firstMonday.setDate(firstMonday.getDate() + 1);
  }
  
  const currentMonthKey = `${year}-${month}`;
  const lastReset = localStorage.getItem("lastResetMonth");
  
  // If today is or is past the 1st Monday, AND we haven't reset this month yet
  if (now >= firstMonday && lastReset !== currentMonthKey) {
    
    // Clear all hypertrophy keys from local storage
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith("hypertrophy_")) {
        localStorage.removeItem(key);
      }
    });
    
    // Log the reset so it doesn't happen again this month
    localStorage.setItem("lastResetMonth", currentMonthKey);
    console.log("Monthly workouts reset triggered.");
  }
}
