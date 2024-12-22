// Load uncompleted tasks from localStorage
function getUncompletedTasks() {
    const todayTasks = JSON.parse(localStorage.getItem("todayTasks")) || [];
    const soonTasks = JSON.parse(localStorage.getItem("soonTasks")) || [];
    return [...todayTasks, ...soonTasks];
}

// Shuffle an array using Fisher-Yates Algorithm
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Render the shuffled tasks in the table
function renderShuffledTasks() {
    const tableBody = document.getElementById("random-task-table");
    const tasks = getUncompletedTasks();
    const shuffledTasks = shuffleArray([...tasks]);

    tableBody.innerHTML = ""; // Clear the previous table rows

    shuffledTasks.forEach((task, index) => {
        const row = `
            <tr>
                <td>${index + 1}</td>
                <td>${task}</td>
            </tr>
        `;
        tableBody.insertAdjacentHTML("beforeend", row);
    });
}

// Shuffle tasks and render when the page loads or button is clicked
function shuffleTasks() {
    renderShuffledTasks();
}

document.addEventListener("DOMContentLoaded", () => {
    renderShuffledTasks();
});
