const completedTasks = JSON.parse(localStorage.getItem("completedTasks")) || [];
const todayTasks = JSON.parse(localStorage.getItem("todayTasks")) || [];
const soonTasks = JSON.parse(localStorage.getItem("soonTasks")) || [];

// Load motivational thought from Gemini API
async function loadMotivationalThought() {
    const quoteElement = document.getElementById("motivational-thought");
    try {
        const response = await fetch("http://localhost:3000/generate-thought");
        const data = await response.json();
        quoteElement.textContent = `"${data.thought}"`;
    } catch (error) {
        console.error("Failed to fetch motivational thought:", error.message);
        quoteElement.textContent = `"Stay positive and keep moving forward."`;
    }
}

// Save unified tasks to localStorage
function saveTasks() {
    localStorage.setItem("todayTasks", JSON.stringify(todayTasks));
    localStorage.setItem("soonTasks", JSON.stringify(soonTasks));
    localStorage.setItem("completedTasks", JSON.stringify(completedTasks));
}

// Add a task
function addTask(section) {
    const input = document.getElementById(`${section}-task-input`);
    const taskList = document.getElementById(`${section}-tasks`);

    if (input.value.trim() === "") return;

    const newTask = input.value.trim();
    if (section === "today") todayTasks.push(newTask);
    else if (section === "soon") soonTasks.push(newTask);

    saveTasks();
    renderTasks();
    input.value = "";
}

// Render tasks dynamically
function renderTasks() {
    const todayTaskList = document.getElementById("today-tasks");
    const soonTaskList = document.getElementById("soon-tasks");

    todayTaskList.innerHTML = "";
    soonTaskList.innerHTML = "";

    todayTasks.forEach((task) => createTaskItem(task, "today", todayTaskList));
    soonTasks.forEach((task) => createTaskItem(task, "soon", soonTaskList));
}

function createTaskItem(task, section, taskList) {
    const listItem = document.createElement("li");

    const taskText = document.createElement("span");
    taskText.textContent = task;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.style.marginLeft = "10px";

    checkbox.addEventListener("change", () => {
        moveToProgress(task, section);
    });

    listItem.appendChild(taskText);
    listItem.appendChild(checkbox);
    taskList.appendChild(listItem);
}

// Move task to Progress Page
function moveToProgress(task, section) {
    if (section === "today") todayTasks.splice(todayTasks.indexOf(task), 1);
    if (section === "soon") soonTasks.splice(soonTasks.indexOf(task), 1);

    completedTasks.unshift({
        task,
        date: new Date().toLocaleString(),
    });

    saveTasks();
    renderTasks();
}

// Initialize UI
document.addEventListener("DOMContentLoaded", () => {
    loadMotivationalThought();
    renderTasks();
});
