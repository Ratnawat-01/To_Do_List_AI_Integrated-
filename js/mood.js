async function fetchAndRenderMoods() {
    const todayTasks = JSON.parse(localStorage.getItem("todayTasks")) || [];
    const soonTasks = JSON.parse(localStorage.getItem("soonTasks")) || [];
    const tasks = [...todayTasks, ...soonTasks];

    if (tasks.length === 0) {
        renderMessage("No tasks available to group by mood.");
        return;
    }

    renderMessage("Loading tasks...");

    try {
        const response = await fetch("http://localhost:3000/generate-moods", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tasks }),
        });

        if (!response.ok) {
            throw new Error("Failed to fetch moods from server.");
        }

        const moods = await response.json();
        renderMoods(moods);
    } catch (error) {
        console.error("Error generating moods:", error.message);
        renderMessage("Failed to generate mood groups. Please try again.");
    }
}

function renderMoods(moods) {
    const container = document.getElementById("mood-container");
    container.innerHTML = "";

    Object.entries(moods).forEach(([moodName, tasks]) => {
        const moodDiv = document.createElement("div");
        moodDiv.classList.add("group");

        const title = document.createElement("h2");
        title.textContent = moodName;

        const taskList = document.createElement("ul");
        tasks.forEach((task) => {
            const listItem = document.createElement("li");
            listItem.textContent = task;
            taskList.appendChild(listItem);
        });

        moodDiv.appendChild(title);
        moodDiv.appendChild(taskList);
        container.appendChild(moodDiv);
    });
}

function renderMessage(message) {
    const container = document.getElementById("mood-container");
    container.innerHTML = `<p>${message}</p>`;
}

document.addEventListener("DOMContentLoaded", fetchAndRenderMoods);
