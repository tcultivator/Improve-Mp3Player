
const username = document.getElementById('username')
const password = document.getElementById('password')

document.getElementById('register').addEventListener('submit', async (e) => {
    e.preventDefault()
    const register = await fetch('https://improve-mp3player.onrender.com/signup', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: username.value, password: password.value })

    })

    const data = await register.json()
    if (register.ok) {
        console.log(data.message)
        window.location.replace('login.html')
    }
    else {
        console.log(data.message)
    }
})
