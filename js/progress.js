function loadCompletedTasks() {
    const progressTable = document.getElementById("completed-tasks");
    const completedTasks = JSON.parse(localStorage.getItem("completedTasks")) || [];

    progressTable.innerHTML = "";
    if (completedTasks.length === 0) {
        progressTable.innerHTML = "<tr><td colspan='3'>No completed tasks yet.</td></tr>";
        return;
    }

    // Sort tasks: latest first
    completedTasks.forEach((task, index) => {
        const row = `
            <tr>
                <td>${index + 1}</td>
                <td>${task.task}</td>
                <td>${task.date}</td>
            </tr>
        `;
        progressTable.insertAdjacentHTML("beforeend", row);
    });
}

// Clear all tasks in Progress Page
function clearAllCompletedTasks() {
    if (!confirm("Are you sure you want to clear all tasks?")) return;

    localStorage.setItem("completedTasks", JSON.stringify([]));
    loadCompletedTasks();
}

document.addEventListener("DOMContentLoaded", () => {
    loadCompletedTasks();
    document
        .getElementById("clear-completed-tasks")
        .addEventListener("click", clearAllCompletedTasks);
});
