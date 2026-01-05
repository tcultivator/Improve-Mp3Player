const loginForm = document.getElementById('login');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const errorMessage = document.getElementById('errorMessage');

loginForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    // Reset error message and button state
    errorMessage.textContent = "";
    const submitBtn = loginForm.querySelector('.btn-submit');
    const originalBtnText = submitBtn.textContent;
    submitBtn.textContent = "Checking...";
    submitBtn.disabled = true;

    try {
        const response = await fetch('https://improve-mp3player.onrender.com/login', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: usernameInput.value,
                password: passwordInput.value
            })
        });

        const res = await response.json();

        if (response.ok) {
            // Success: Slide out or redirect
            submitBtn.textContent = "Redirecting...";
            window.location.replace('index.html');
        } else {
            // Failure: Show the error message from server
            errorMessage.textContent = res.message || "Invalid username or password";
            submitBtn.textContent = originalBtnText;
            submitBtn.disabled = false;
        }
    } catch (error) {
        errorMessage.textContent = "Server error. Please try again later.";
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
    }
});