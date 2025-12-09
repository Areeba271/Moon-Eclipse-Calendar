// script.js

// DOM Elements
const yearSelect = document.getElementById("year");
const monthSelect = document.getElementById("month");
const daySelect = document.getElementById("day");
const currentDateBtn = document.getElementById("current-date-btn");
const calendarEl = document.querySelector(".calendar");
const moonPhaseEl = document.getElementById("moon-phase");
const moonTitleEl = document.getElementById("moon-title");
const moonDateEl = document.getElementById("moon-date");
const moonDescEl = document.getElementById("moon-description");
const moonIllumEl = document.getElementById("moon-illumination");
const phaseIndicatorsEl = document.querySelector(".phase-indicators");
const moonEl = document.getElementById("moon");

// Moon phase data
const moonPhases = [
  {
    name: "New Moon",
    desc: "The moon is between Earth and the sun, and the side facing Earth is not illuminated.",
    illumination: 0,
  },
  {
    name: "Waxing Crescent",
    desc: "A thin crescent of the moon is illuminated on the right side.",
    illumination: 25,
  },
  {
    name: "First Quarter",
    desc: "Half of the moon is illuminated on the right side.",
    illumination: 50,
  },
  {
    name: "Waxing Gibbous",
    desc: "More than half of the moon is illuminated on the right side.",
    illumination: 75,
  },
  {
    name: "Full Moon",
    desc: "The moon is fully illuminated as seen from Earth.",
    illumination: 100,
  },
  {
    name: "Waning Gibbous",
    desc: "More than half of the moon is illuminated on the left side.",
    illumination: 75,
  },
  {
    name: "Last Quarter",
    desc: "Half of the moon is illuminated on the left side.",
    illumination: 50,
  },
  {
    name: "Waning Crescent",
    desc: "A thin crescent of the moon is illuminated on the left side.",
    illumination: 25,
  },
];

// Current date
let currentDate = new Date();
let selectedDate = new Date(currentDate);

// Initialize the app
function init() {
  populateYearSelect();
  populateDaySelect();
  setCurrentDate();
  generateCalendar();
  updateMoonDisplay();
  createPhaseIndicators();

  // Add event listeners
  yearSelect.addEventListener("change", handleDateChange);
  monthSelect.addEventListener("change", handleDateChange);
  daySelect.addEventListener("change", handleDateChange);
  currentDateBtn.addEventListener("click", setCurrentDate);
}

// Populate year select with options from 1900 to 2025
function populateYearSelect() {
  // Clear existing options except the first one
  while (yearSelect.options.length > 0) {
    yearSelect.remove(0);
  }

  // Add years from 1900 to 2025
  for (let year = 1900; year <= 2025; year++) {
    const option = document.createElement("option");
    option.value = year;
    option.textContent = year;
    yearSelect.appendChild(option);
  }
}

// Populate day select based on selected month and year
function populateDaySelect() {
  const year = parseInt(yearSelect.value);
  const month = parseInt(monthSelect.value);
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Get current selected day
  const currentDay = parseInt(daySelect.value) || 1;

  // Clear current options
  daySelect.innerHTML = "";

  // Add day options
  for (let day = 1; day <= daysInMonth; day++) {
    const option = document.createElement("option");
    option.value = day;
    option.textContent = day;
    daySelect.appendChild(option);
  }

  // Restore selected day if it exists in the new month
  if (currentDay <= daysInMonth) {
    daySelect.value = currentDay;
  } else {
    daySelect.value = daysInMonth;
  }
}

// Set to current date
function setCurrentDate() {
  currentDate = new Date();
  selectedDate = new Date(currentDate);

  yearSelect.value = currentDate.getFullYear();
  monthSelect.value = currentDate.getMonth();
  populateDaySelect();
  daySelect.value = currentDate.getDate();

  generateCalendar();
  updateMoonDisplay();
}

// Handle date change
function handleDateChange() {
  const year = parseInt(yearSelect.value);
  const month = parseInt(monthSelect.value);
  const day = parseInt(daySelect.value) || 1;

  selectedDate = new Date(year, month, day);
  populateDaySelect();

  // Make sure day is valid for the month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  daySelect.value = Math.min(day, daysInMonth);

  generateCalendar();
  updateMoonDisplay();
}

// Generate calendar for the selected month
function generateCalendar() {
  const year = parseInt(yearSelect.value);
  const month = parseInt(monthSelect.value);
  const selectedDay = parseInt(daySelect.value);

  // Clear calendar
  calendarEl.innerHTML = "";

  // Add day headers
  const dayHeaders = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  dayHeaders.forEach((header) => {
    const headerEl = document.createElement("div");
    headerEl.className = "calendar-header";
    headerEl.textContent = header;
    calendarEl.appendChild(headerEl);
  });

  // Get first day of month and total days
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Get last day of previous month
  const prevMonthDays = new Date(year, month, 0).getDate();

  // Add empty days for previous month
  for (let i = 0; i < firstDay; i++) {
    const dayEl = document.createElement("div");
    dayEl.className = "day other-month";
    dayEl.textContent = prevMonthDays - firstDay + i + 1;
    calendarEl.appendChild(dayEl);
  }

  // Add days for current month
  for (let day = 1; day <= daysInMonth; day++) {
    const dayEl = document.createElement("div");
    dayEl.className = "day";
    dayEl.textContent = day;

    // Check if this day is selected
    if (day === selectedDay) {
      dayEl.classList.add("selected");
    }

    // Calculate moon phase for this day
    const dateForDay = new Date(year, month, day);
    const phaseIndex = calculateMoonPhase(dateForDay);

    // Add moon phase indicator
    dayEl.classList.add("moon-phase-indicator");
    if (phaseIndex === 0 || phaseIndex === 4) {
      dayEl.classList.add(phaseIndex === 0 ? "new-moon" : "full-moon");
    }

    // Add click event
    dayEl.addEventListener("click", () => {
      // Update selected date
      daySelect.value = day;
      selectedDate = new Date(year, month, day);

      // Update UI
      document
        .querySelectorAll(".day")
        .forEach((d) => d.classList.remove("selected"));
      dayEl.classList.add("selected");

      updateMoonDisplay();
    });

    calendarEl.appendChild(dayEl);
  }

  // Add empty days for next month to complete the grid
  const totalCells = 42; // 6 rows * 7 days
  const cellsUsed = firstDay + daysInMonth;
  const nextMonthDays = totalCells - cellsUsed;

  for (let i = 1; i <= nextMonthDays; i++) {
    const dayEl = document.createElement("div");
    dayEl.className = "day other-month";
    dayEl.textContent = i;
    calendarEl.appendChild(dayEl);
  }
}

// Calculate moon phase for a given date (simplified algorithm)
function calculateMoonPhase(date) {
  // Using a more accurate algorithm based on Julian dates
  // Reference: Astronomical Algorithms by Jean Meeus

  // Convert date to Julian date
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  let a, b;
  if (month <= 2) {
    a = year - 1;
    b =
      Math.floor(a / 4) -
      Math.floor(a / 100) +
      Math.floor(a / 400) +
      Math.floor(365.25 * a) +
      Math.floor(30.6001 * (month + 12 + 1)) +
      day +
      1720994.5;
  } else {
    a = year;
    b =
      Math.floor(a / 4) -
      Math.floor(a / 100) +
      Math.floor(a / 400) +
      Math.floor(365.25 * a) +
      Math.floor(30.6001 * (month + 1)) +
      day +
      1720994.5;
  }

  const jd = b; // Julian date

  // Calculate days since new moon (Jan 6, 2000 18:14 UTC)
  const daysSinceNewMoon = jd - 2451550.1;

  // Calculate lunation number
  const lunation = daysSinceNewMoon / 29.530588853;

  // Get the fractional part (phase of moon)
  const phase = lunation - Math.floor(lunation);
  if (phase < 0) {
    phase += 1;
  }

  // Convert phase to index (0-7)
  let phaseIndex = Math.floor(phase * 8) % 8;

  return phaseIndex;
}

// Update moon display based on selected date
function updateMoonDisplay() {
  const phaseIndex = calculateMoonPhase(selectedDate);
  const phase = moonPhases[phaseIndex];

  // Format date
  const dateStr = selectedDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Update moon visualization
  updateMoonPhaseVisual(phaseIndex);

  // Update text content
  moonTitleEl.textContent = phase.name;
  moonDateEl.textContent = dateStr;
  moonDescEl.textContent = phase.desc;
  moonIllumEl.innerHTML = `Illumination: <span>${phase.illumination}%</span>`;

  // Update active phase indicator
  document.querySelectorAll(".phase-indicator").forEach((indicator, index) => {
    indicator.classList.toggle("active", index === phaseIndex);
  });

  // Add eclipse effect if it's a full moon
  if (phaseIndex === 4) {
    moonEl.classList.add("eclipse-effect");
  } else {
    moonEl.classList.remove("eclipse-effect");
  }
}

// Update moon phase visualization
function updateMoonPhaseVisual(phaseIndex) {
  // Clear current style
  moonPhaseEl.style = "";

  // Set background color
  moonPhaseEl.style.backgroundColor = "#0a0e2a";

  // Calculate clip-path based on phase
  let clipPath = "";

  switch (phaseIndex) {
    case 0: // New Moon
      clipPath = "inset(0 0 0 100%)";
      break;
    case 1: // Waxing Crescent
      clipPath = "inset(5% 75% 5% 0)";
      break;
    case 2: // First Quarter
      clipPath = "inset(0 50% 0 0)";
      break;
    case 3: // Waxing Gibbous
      clipPath = "inset(0 25% 0 0)";
      break;
    case 4: // Full Moon
      clipPath = "inset(0 0 0 0)";
      break;
    case 5: // Waning Gibbous
      clipPath = "inset(0 0 0 25%)";
      break;
    case 6: // Last Quarter
      clipPath = "inset(0 0 0 50%)";
      break;
    case 7: // Waning Crescent
      clipPath = "inset(5% 0 5% 75%)";
      break;
  }

  moonPhaseEl.style.clipPath = clipPath;
  moonPhaseEl.style.WebkitClipPath = clipPath;
}

// Create phase indicators
function createPhaseIndicators() {
  phaseIndicatorsEl.innerHTML = "";

  moonPhases.forEach((phase, index) => {
    const indicator = document.createElement("div");
    indicator.className = "phase-indicator";
    indicator.innerHTML = `
            <div class="phase-moon" id="phase-moon-${index}"></div>
            <div class="phase-name">${phase.name}</div>
        `;

    // Set up phase moon visualization
    const phaseMoon = indicator.querySelector(`#phase-moon-${index}`);
    setPhaseMoonVisual(phaseMoon, index);

    // Add click event
    indicator.addEventListener("click", () => {
      // Find a date with this moon phase in the current month
      const year = parseInt(yearSelect.value);
      const month = parseInt(monthSelect.value);
      const daysInMonth = new Date(year, month + 1, 0).getDate();

      for (let day = 1; day <= daysInMonth; day++) {
        const dateForDay = new Date(year, month, day);
        if (calculateMoonPhase(dateForDay) === index) {
          // Update selected date
          selectedDate = dateForDay;
          daySelect.value = day;
          generateCalendar();
          updateMoonDisplay();
          break;
        }
      }
    });

    phaseIndicatorsEl.appendChild(indicator);
  });
}

// Set up phase moon visualization
function setPhaseMoonVisual(phaseMoon, index) {
  // Set background
  phaseMoon.style.background =
    "radial-gradient(circle at 30% 30%, #f9f7fe 0%, #d9d7fe 30%, #a8c0ff 70%, #6a89ff 100%)";

  // Calculate clip-path based on phase
  let clipPath = "";

  switch (index) {
    case 0: // New Moon
      clipPath = "inset(0 0 0 100%)";
      break;
    case 1: // Waxing Crescent
      clipPath = "inset(5% 75% 5% 0)";
      break;
    case 2: // First Quarter
      clipPath = "inset(0 50% 0 0)";
      break;
    case 3: // Waxing Gibbous
      clipPath = "inset(0 25% 0 0)";
      break;
    case 4: // Full Moon
      clipPath = "inset(0 0 0 0)";
      break;
    case 5: // Waning Gibbous
      clipPath = "inset(0 0 0 25%)";
      break;
    case 6: // Last Quarter
      clipPath = "inset(0 0 0 50%)";
      break;
    case 7: // Waning Crescent
      clipPath = "inset(5% 0 5% 75%)";
      break;
  }

  phaseMoon.style.clipPath = clipPath;
  phaseMoon.style.WebkitClipPath = clipPath;

  // Add dark overlay for the shadow part
  const overlay = document.createElement("div");
  overlay.style.position = "absolute";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.borderRadius = "50%";
  overlay.style.backgroundColor = "#0a0e2a";
  overlay.style.clipPath = clipPath;
  overlay.style.WebkitClipPath = clipPath;
  phaseMoon.appendChild(overlay);
}

// Initialize the app when page loads
window.addEventListener("DOMContentLoaded", init);
