let songList = JSON.parse(localStorage.getItem("songs")) || [];
let currentSongIndex = 0;

// Navigate to other pages
function navigateTo(page) {
    window.location.href = page;
}

// Add User Music Link
async function addSong() {
    const urlInput = document.getElementById("music-url");
    const url = urlInput.value.trim();
    if (!url) {
        alert("Please enter a valid link!");
        return;
    }

    // Check for duplicates
    if (songList.some(song => song.url === url)) {
        alert("This song is already in the list!");
        return;
    }

    const title = await fetchYouTubeTitle(url);
    if (!title) {
        alert("Invalid YouTube link.");
        return;
    }

    // Add the latest song to the top
    songList.unshift({ name: title, url });
    localStorage.setItem("songs", JSON.stringify(songList));
    renderSongs();
    urlInput.value = "";
}

// Fetch YouTube Video Title
async function fetchYouTubeTitle(url) {
    try {
        const videoId = extractYouTubeId(url);
        if (!videoId) return null;

        const response = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`);
        const data = await response.json();
        return data.title || "Unknown Song";
    } catch {
        return null;
    }
}

// Render Songs in Table
function renderSongs() {
    const tableBody = document.getElementById("song-table");
    tableBody.innerHTML = "";

    songList.forEach((song, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${index + 1}</td>
            <td><a href="#" onclick="playSongFromList(${index})">${song.name}</a></td>
            <td><button onclick="removeSong(${index})">Remove</button></td>
        `;
        tableBody.appendChild(row);
    });
}

// Remove Song
function removeSong(index) {
    songList.splice(index, 1);
    localStorage.setItem("songs", JSON.stringify(songList));
    renderSongs();
}

// Play Song From List
function playSongFromList(index) {
    currentSongIndex = index;
    const song = songList[index];
    playNoise(song.url);
}

// Play Noise Function
function playNoise(link, autoplay = true) {
    const videoId = extractYouTubeId(link);
    const playerDiv = document.getElementById("player");

    if (videoId) {
        playerDiv.innerHTML = `
            <iframe 
                id="music-player"
                width="100%" 
                height="200" 
                src="https://www.youtube.com/embed/${videoId}?autoplay=${autoplay ? 1 : 0}&enablejsapi=1" 
                frameborder="0" 
                allow="autoplay; encrypted-media" 
                allowfullscreen>
            </iframe>`;
    } else {
        alert("Invalid link.");
    }
}

// Extract YouTube Video ID
function extractYouTubeId(url) {
    const match = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})(?:\?|&|$)/);
    return match ? match[1] : null;
}

// Listen for 'Enter' Key Press on Input Field
document.getElementById("music-url").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        addSong();
    }
});

// Initialize Songs on Load
document.addEventListener("DOMContentLoaded", () => {
    renderSongs();
});
