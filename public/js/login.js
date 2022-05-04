const username = document.getElementById('username');
const usernameError = document.getElementById('usernameError');
const password = document.getElementById('password');
const passwordError = document.getElementById('passwordError');
const email = document.getElementById('email');
const emailError = document.getElementById('emailError');

let usernameInterval = () => {
    setInterval(async () => {
        const usernameInput = username.value;
        if (usernameInput.length == 0) {
            usernameError.innerHTML = "Username cannot be emtpy";
        }
        else {
            usernameError.innerHTML = "";
        }

    }, 10);
}

let passwordInterval = () => {
    setInterval(() => {
        const passwordInput = password.value;
        if (passwordInput.length == 0) {
            passwordError.innerHTML = "Password cannot be emtpy";
        }
        else {
            passwordError.innerHTML = "";
        }

    }, 10);
}

let emailInterval = () => {
    setInterval(() => {
        const emailInput = email.value;
        if (emailInput.length == 0) {
            emailError.innerHTML = "Email cannot be emtpy";
        }
        else {
            emailError.innerHTML = "";
        }

    }, 10);
}

username.addEventListener('input', () => {
    usernameInterval();
})
// username.addEventListener('focusout', () => {
//     clearInterval(usernameInterval);
//     usernameError.innerHTML = "";
// })

password.addEventListener('input', () => {
    passwordInterval();
})
// password.addEventListener('focusout', () => {
//     clearInterval(passwordInterval);
//     passwordError.innerHTML = "";
// })


const disableSubmit2 = () => {
    setInterval(() => {
        if (usernameError.innerHTML.length > 0 || passwordError.innerHTML.length > 0) {
            document.getElementById("submit").disabled = true;
        }
        else {
            document.getElementById("submit").disabled = false;
        }
    }, 10);
}

disableSubmit2();

