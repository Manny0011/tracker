const form = document.querySelector("#signinForm");

form.addEventListener("submit", (e) => {

    e.preventDefault();

    const email = document.querySelector("#signinEmail").value.trim();
    const password = document.querySelector("#signinPassword").value;

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const currentUser = users.find((user) => {
        return user.email === email && user.password === password;
    });

    if (!currentUser) {
        alert("Invalid email or password.");
        return;
    }

    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("currentUser", JSON.stringify(currentUser));

    alert(`Welcome ${currentUser.name}!`);

    window.location.href = "dashboard.html";

});
