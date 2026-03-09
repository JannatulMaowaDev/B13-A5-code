document.getElementById("sign-in-btn").addEventListener("click", function () {
  // 1. get user name input
  const inputUsername = document.getElementById("input-username");
  const username = inputUsername.value;
  console.log(username);
  // 2. get password input
  const inputPassword = document.getElementById("input-password");
  const password = inputPassword.value;
  console.log(password);
  // 3. match password & username 
  if (username == "admin" && password == "admin123") {
    // 3-1 true:::>> alert > homepage
    alert("login success");

    // window.location.replace("home.html");
    window.location.assign("home.html");
  }
  else {
    // 3-2 false:::>> alert > return 
    alert("login failed");
    return;
  };
});