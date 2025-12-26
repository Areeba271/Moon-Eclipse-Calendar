const yearSelect = document.getElementById("year");
const monthSelect = document.getElementById("month");
const daySelect = document.getElementById("day");
const moonPhaseEl = document.getElementById("moon-phase");
const moonTitle = document.getElementById("moon-title");

const phases = [
    { name: "New Moon", class: "phase-new", desc: "The moon is completely in shadow." },
    { name: "Waxing Crescent", class: "phase-waxing-crescent", desc: "A silver sliver appears on the right." },
    { name: "First Quarter", class: "phase-first-quarter", desc: "Exactly half of the moon is visible on the right." },
    { name: "Waxing Gibbous", class: "phase-waxing-gibbous", desc: "Almost full, showing on the right." },
    { name: "Full Moon", class: "phase-full", desc: "The moon is fully illuminated." },
    { name: "Waning Gibbous", class: "phase-waning-gibbous", desc: "Almost full, fading from the right." },
    { name: "Last Quarter", class: "phase-last-quarter", desc: "Exactly half visible on the left side." },
    { name: "Waning Crescent", class: "phase-waning-crescent", desc: "A thin sliver remains on the left." }
];

function init() {
    for (let i = 1900; i <= 2025; i++) {
        let opt = document.createElement("option");
        opt.value = i; opt.innerHTML = i;
        yearSelect.appendChild(opt);
    }
    updateDays();
    setCurrentDate();
    
    [yearSelect, monthSelect, daySelect].forEach(el => 
        el.addEventListener("change", updateMoon)
    );
}

function updateDays() {
    const year = yearSelect.value;
    const month = monthSelect.value;
    const daysInMonth = new Date(year, parseInt(month) + 1, 0).getDate();
    daySelect.innerHTML = "";
    for (let i = 1; i <= daysInMonth; i++) {
        let opt = document.createElement("option");
        opt.value = i; opt.innerHTML = i;
        daySelect.appendChild(opt);
    }
}

function setCurrentDate() {
    const now = new Date();
    yearSelect.value = now.getFullYear();
    monthSelect.value = now.getMonth();
    updateDays();
    daySelect.value = now.getDate();
    updateMoon();
}

function updateMoon() {
    const date = new Date(yearSelect.value, monthSelect.value, daySelect.value);
    const jd = date.getTime() / 86400000 + 2440587.5;
    const lastNewMoon = 2451550.1;
    const cycle = 29.530588853;
    const phase = ((jd - lastNewMoon) / cycle) % 1;
    const index = Math.floor((phase < 0 ? phase + 1 : phase) * 8);

    // Update UI
    moonPhaseEl.className = "moon-phase " + phases[index].class;
    moonTitle.innerText = phases[index].name;
    document.getElementById("moon-description").innerText = phases[index].desc;
    document.getElementById("moon-illumination").querySelector("span").innerText = 
        (index === 0 ? "0%" : index === 4 ? "100%" : "Variable");
}

document.getElementById("current-date-btn").onclick = setCurrentDate;
init();