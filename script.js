const audio = document.getElementById('audio');
const duration = document.getElementById('duration');
const playIcon = document.getElementById('playIcon');
const cdIcon = document.getElementById('cdicon');
const playingSongTxt = document.getElementById('playingSong');
const songListPanel = document.getElementById('songList');
const songNameContainer = document.getElementById('songName');

let listOfSongs = [];
let currentlyPlayingIndex = 0;
let isLooping = false;

// 1. Play/Pause Functionality
function playPaused() {
    if (!audio.src) return alert("Please add a song first!");

    if (audio.paused) {
        audio.play();
        updateUI(true);
    } else {
        audio.pause();
        updateUI(false);
    }
}

function updateUI(isPlaying) {
    playIcon.className = isPlaying ? "fa-solid fa-pause" : "fa-solid fa-play";
    cdIcon.style.animationPlayState = isPlaying ? "running" : "paused";
}

function updatePlaylistUI() {
    const songNameContainer = document.getElementById('songName');
    const emptyState = document.getElementById('emptyState');

    if (listOfSongs.length > 0) {
        emptyState.style.display = 'none';
    }

    songNameContainer.innerHTML = ''; // Clear current list

    listOfSongs.forEach((file, index) => {
        const isActive = index === currentlyPlayingIndex ? 'active-song' : '';

        // Use FontAwesome or Bootstrap Icons as per your setup
        songNameContainer.innerHTML += `
            <button class="song-item ${isActive}" onclick="selectSong(${index})">
                <i class="fa-solid fa-play-circle"></i>
                <div class="song-details">
                    <div class="song-title">${file.name.replace('.mp3', '')}</div>
                </div>
            </button>`;
    });
}

// 2. Add New Songs
document.getElementById('inputFile').addEventListener('change', (e) => {
    const files = e.target.files;
    for (let file of files) {
        listOfSongs.push(file);
    }

    updatePlaylistUI(); // Refresh the list

    if (audio.paused && listOfSongs.length === 1) {
        selectSong(0);
    }
});

// 3. Select & Load Song
function selectSong(index) {
    currentlyPlayingIndex = index;
    const file = listOfSongs[index];
    audio.src = URL.createObjectURL(file);
    playingSongTxt.textContent = file.name;

    audio.play();
    updateUI(true);

    // This highlights the current song in the sidebar
    updatePlaylistUI();

    // Optional: Close panel on mobile after selection
    if (window.innerWidth < 768) {
        displaySongList();
    }
}

// 4. Progress Bar Logic (Native & Smooth)
audio.addEventListener('timeupdate', () => {
    const progress = (audio.currentTime / audio.duration) * 100;
    duration.value = progress || 0;

    // Update timestamps
    document.getElementById('currentTime').textContent = formatTime(audio.currentTime);
    if (audio.duration) {
        document.getElementById('totalDuration').textContent = formatTime(audio.duration);
    }
});

// Seek Functionality
duration.addEventListener('input', () => {
    const time = (duration.value / 100) * audio.duration;
    audio.currentTime = time;
});

// Auto Next Song
audio.addEventListener('ended', () => {
    if (!isLooping) nextSong();
});

function nextSong() {
    if (currentlyPlayingIndex < listOfSongs.length - 1) {
        selectSong(currentlyPlayingIndex + 1);
    }
}

function prevSong() {
    if (currentlyPlayingIndex > 0) {
        selectSong(currentlyPlayingIndex - 1);
    }
}

function repeat() {
    isLooping = !isLooping;
    audio.loop = isLooping;
    document.getElementById('rep').style.color = isLooping ? "#8a8aff" : "white";
}

function displaySongList() {
    songListPanel.classList.toggle('active');
}

function formatTime(seconds) {
    let min = Math.floor(seconds / 60);
    let sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

// 5. Logout Logic
let logoutLoad = 0;
let logoutInterval;

function logoutDelay() {
    document.getElementById('logutDelay').style.display = 'flex';
    const fill = document.getElementById('loadingBarFill');
    logoutLoad = 0;

    logoutInterval = setInterval(() => {
        logoutLoad += 2;
        fill.style.width = logoutLoad + "%";
        if (logoutLoad >= 100) {
            clearInterval(logoutInterval);
            logout();
        }
    }, 50);
}

function cancelLogout() {
    clearInterval(logoutInterval);
    document.getElementById('logutDelay').style.display = 'none';
}



async function logout() {
    logoutModal.style = `display:none;`
    clearInterval(loader)
    const out = await fetch('https://improve-mp3player.onrender.com/logout', {
        method: 'POST',
        credentials: 'include'
    })
    const data = await out.json()
    if (out.ok) {
        document.getElementById('account').style = `display:flex`
        document.getElementById('logout').style = `display:none`
    }
    else {
        document.getElementById('account').style = `display:none`
        document.getElementById('logout').style = `display:flex`
    }
}