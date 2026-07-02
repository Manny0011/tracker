const form = document.querySelector("#signupForm");

form.addEventListener("submit", (e) => {

    e.preventDefault();

    const name = document.querySelector("#signupName").value.trim();
    const email = document.querySelector("#signupEmail").value.trim();
    const password = document.querySelector("#signupPassword").value;
    const confirmPassword = document.querySelector("#signupConfirm").value;

    if (name === "" || email === "" || password === "" || confirmPassword === "") {
        alert("Please fill all fields.");
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    const userExists = users.some((user) => user.email === email);

    if (userExists) {
        alert("This email is already registered.");
        return;
    }

    const newUser = {
        name,
        email,
        password
    };

    users.push(newUser);

    localStorage.setItem("users", JSON.stringify(users));

    alert("Registration Successful!");

    form.reset();

    window.location.href = "index.html";

});
