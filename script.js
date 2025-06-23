let load = 0;
const loadingBar = document.getElementById('loadingBar')
const logoutModal = document.getElementById('logutDelay')
let loader;
function logoutDelay() {
    logoutModal.style = `display:flex;`
    loader = setInterval(() => {
        load = load + 0.2
        loadingBar.value = load
        if (loadingBar.value >= 10) {
            logout()
            clearInterval(loader)
            logoutModal.style = `display:none;`
        }
    }, 100);
}
function cancelLogout() {
    clearInterval(loader)
    logoutModal.style = `display:none;`
    load = 0
    loadingBar.value = load
}
(async () => {
    const authenticate = await fetch('https://improve-mp3player.onrender.com/authenticate', {
        method: 'POST',
        credentials: 'include'
    })
    const data = await authenticate.json()
    if (authenticate.ok) {
        document.getElementById('account').style = `display:none`
        document.getElementById('logout').style = `display:flex`
    }
    else {
        document.getElementById('account').style = `display:flex`
        document.getElementById('logout').style = `display:none`
    }
})();
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
const duration = document.getElementById('duration');
let statuses;
let interval;
let index = 0;
let audio = document.getElementById('audio');
let playing = false;
let file;
let rep = false;
let songDuration;
function playPaused() {
    if (!file) {
        console.log('no music yet')
    }
    else {
        playing = !playing
        playing ? (statuses = 'playing',
            document.getElementById('playBtn').innerHTML = `<i class="fa-regular fa-circle-pause"></i>`
        ) :
            (statuses = 'paused',
                document.getElementById('playBtn').innerHTML = `<i class="fa-regular fa-circle-play"></i>`
            )
        playBtn()
        diskControl(playing)
    }
}
function playBtn() {
    switch (statuses) {
        case 'newSong':
            document.getElementById('playingSong').textContent = listOfSongs[currentlyPlayingSong].name
            document.getElementById('playBtn').innerHTML = `<i class="fa-regular fa-circle-pause"></i>`
            audio.addEventListener('loadedmetadata', () => {
                clearInterval(interval)
                songDuration = audio.duration;
                duration.max = Math.floor(songDuration);
                audio.play();
                diskControl(playing)
                index = 0;
                duration.addEventListener('change', () => {
                    audio.currentTime = duration.value
                    index = audio.currentTime
                })
                interval = setInterval(() => {
                    index++
                    duration.value = index;
                    if (duration.value >= Math.floor(songDuration) && audio.loop == false) {
                        index = 0
                        duration.value = index;
                        if (currentlyPlayingSong < listOfSongs.length - 1) {
                            nextSong()
                            clearInterval(interval)
                        }
                        else {
                            document.getElementById('playBtn').innerHTML = `<i class="fa-regular fa-circle-play"></i>`
                            playing = false
                            diskControl(playing)
                            clearInterval(interval)
                        }
                    }
                    else if (duration.value >= Math.floor(songDuration) && audio.loop == true) {
                        index = 0
                        duration.value = index;
                    }
                }, 1000);
            });
            break;
        case 'playing':
            audio.play();
            interval = setInterval(() => {
                index++
                duration.value = index;
                if (duration.value >= Math.floor(songDuration) && audio.loop == false) {
                    index = 0
                    duration.value = index;
                    clearInterval(interval)
                    playing = false
                    diskControl(playing)
                }
                else if (duration.value >= Math.floor(songDuration) && audio.loop == true) {
                    index = 0
                    duration.value = index;
                    console.log(index)
                }
            }, 1000);
            break;
        case 'paused':
            audio.pause();
            clearInterval(interval)
            break;
        default:
            break;
    }
}
let currentlyPlayingSong=0;
const listOfSongs = []
let songPosition = 0;
document.getElementById('inputFile').addEventListener('change', () => {
    file = document.getElementById('inputFile').files[0]
    const filename = file.name;
    const audioUrl = URL.createObjectURL(file)
    listOfSongs.push(file);
    audio.src = URL.createObjectURL(listOfSongs[songPosition])
    statuses = 'newSong'
    playBtn()
    playing = true;
    document.getElementById('songName').innerHTML += `
         <button onclick="selectSong(${songPosition})">${listOfSongs[songPosition].name}</button>`
    currentlyPlayingSong = songPosition
    songPosition++
})
function selectSong(songPosition) {
    currentlyPlayingSong = songPosition
    audio.src = URL.createObjectURL(listOfSongs[songPosition])
    statuses = 'newSong'
    playBtn()
    playing = true;
}
function nextSong() {
    if (listOfSongs.length > currentlyPlayingSong) {
        currentlyPlayingSong++
        audio.src = URL.createObjectURL(listOfSongs[currentlyPlayingSong])
        statuses = 'newSong'
        playBtn()
        playing = true;
    }
}
function prevSong() {
    if (currentlyPlayingSong >= 0) {
        currentlyPlayingSong--
        audio.src = URL.createObjectURL(listOfSongs[currentlyPlayingSong])
        statuses = 'newSong'
        playBtn()
        playing = true;
    }
}
let songlistDisplay = false;
function displaySongList() {
    songlistDisplay = !songlistDisplay
    songlistDisplay ?
        document.getElementById('songList').style = `left:0` :
        document.getElementById('songList').style = `left:-40%`
}
// reusable // stop/play the disk from spinning
function diskControl(playing) {
    playing ?
        document.getElementById('cdicon').style = `animation-play-state: running;` :
        document.getElementById('cdicon').style = `animation-play-state: paused;`
}
function repeat() {
    rep = !rep
    rep ? (audio.loop = true,
        document.getElementById('rep').style = `color:#00458E`
    ) :
        (audio.loop = false,
            document.getElementById('rep').style = `color:white`
        );
}


