const registerForm = document.getElementById('register');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const errorMessage = document.getElementById('errorMessage');
const submitBtn = document.getElementById('submitBtn');

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Clear previous errors & Disable button
    errorMessage.textContent = "";
    submitBtn.textContent = "Creating Account...";
    submitBtn.disabled = true;

    try {
        const response = await fetch('https://improve-mp3player.onrender.com/signup', {
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

        const data = await response.json();

        if (response.ok) {
            // Success
            submitBtn.textContent = "Success! Redirecting...";
            setTimeout(() => {
                window.location.replace('login.html');
            }, 1500);
        } else {
            // Server Error (e.g., Username taken)
            errorMessage.textContent = data.message || "Signup failed. Try another username.";
            submitBtn.textContent = "Create Account";
            submitBtn.disabled = false;
        }
    } catch (error) {
        errorMessage.textContent = "Connection error. Please try again.";
        submitBtn.textContent = "Create Account";
        submitBtn.disabled = false;
    }
});