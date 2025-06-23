const username = document.getElementById('username')
const password = document.getElementById('password')
document.getElementById('login').addEventListener('submit', async function (e) {
    e.preventDefault()
    const login = await fetch('https://improve-mp3player.onrender.com/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: username.value, password: password.value })
    })
    const res = await login.json()
    if (login.ok) {
        console.log(res.message)
        window.location.replace('index.html')
    }
    else {
        console.log(res.message)
    }
})
