let timerInterval;
let stopwatchInterval;
let stopwatchRunning = false;
let stopwatchTime = 0;
const timerSound = document.getElementById("timer-sound"); // Reference to timer sound
const muteButton = document.getElementById("mute-button"); // Mute/Stop Button

// Navigate to other pages
function navigateTo(page) {
    window.location.href = page;
}

// Load Tasks into Dropdown
function loadTasks() {
    const dropdown = document.getElementById("task-dropdown");
    const todayTasks = JSON.parse(localStorage.getItem("todayTasks")) || [];
    const soonTasks = JSON.parse(localStorage.getItem("soonTasks")) || [];
    const tasks = [...todayTasks, ...soonTasks];

    // Clear existing options
    dropdown.innerHTML = `<option value="" disabled selected>View Tasks</option>`;

    tasks.forEach((task) => {
        const option = document.createElement("option");
        option.value = task;
        option.textContent = task;
        dropdown.appendChild(option);
    });
}

// Start Task Timer
function startTaskTimer() {
    const timeInput = document.getElementById("time-input").value;
    const timerDisplay = document.getElementById("timer-display");

    if (!timeInput) {
        alert("Please enter a time to complete the task!");
        return;
    }

    // Parse time input
    const [hours, minutes] = timeInput.split(":").map(Number);
    let totalSeconds = hours * 3600 + minutes * 60;

    clearInterval(timerInterval); // Clear previous intervals
    muteButton.style.display = "none"; // Hide mute button initially

    timerInterval = setInterval(() => {
        const hrs = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
        const mins = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
        const secs = String(totalSeconds % 60).padStart(2, "0");
        timerDisplay.textContent = `${hrs} : ${mins} : ${secs}`;

        if (totalSeconds === 0) {
            clearInterval(timerInterval);
            playSound();
        }
        totalSeconds--;
    }, 1000);
}

// Play Sound when Timer Ends
function playSound() {
    timerSound.play();
    muteButton.style.display = "inline-block"; // Show Mute Button
}

// Stop/Mute Sound
function stopSound() {
    timerSound.pause();
    timerSound.currentTime = 0; // Reset to start
    muteButton.style.display = "none"; // Hide Mute Button
}

// Simple Stopwatch: Start/Stop
function startStopStopwatch() {
    const stopwatchDisplay = document.getElementById("stopwatch-display");

    if (!stopwatchRunning) {
        stopwatchInterval = setInterval(() => {
            stopwatchTime++;
            const hrs = String(Math.floor(stopwatchTime / 3600)).padStart(2, "0");
            const mins = String(Math.floor((stopwatchTime % 3600) / 60)).padStart(2, "0");
            const secs = String(stopwatchTime % 60).padStart(2, "0");
            stopwatchDisplay.textContent = `${hrs} : ${mins} : ${secs}`;
        }, 1000);
        stopwatchRunning = true;
    } else {
        clearInterval(stopwatchInterval);
        stopwatchRunning = false;
    }
}

// Simple Stopwatch: Reset
function resetStopwatch() {
    clearInterval(stopwatchInterval);
    stopwatchRunning = false;
    stopwatchTime = 0;
    document.getElementById("stopwatch-display").textContent = "00 : 00 : 00";
}

// Initialize on Load
document.addEventListener("DOMContentLoaded", () => {
    loadTasks(); // Load tasks into dropdown
});
