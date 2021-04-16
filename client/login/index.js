class El {
    constructor(name, append) {
        this.name = name;
        this.append = append;

        this.e = document.createElement(this.name);
        if (this.append != undefined) this.append.append(this.e);
    }
}

var header = new El("div", document.body);
header.e.id = "header";
header.e.className = "rounded card";

var title1 = new El("a", header.e);
title1.e.textContent = "Chit";
title1.e.id = "title1";
var title2 = new El("a", header.e);
title2.e.textContent = "Chat";
title2.e.id = "title2";

var logSignDialog = document.createElement("div");
logSignDialog.id = "logSignDialog";
logSignDialog.className = "rounded card dialog";
document.body.append(logSignDialog);

var loginDialog = document.createElement("div");
loginDialog.id = "loginDialog";
loginDialog.className = "rounded card dialog";

var signupDialog = document.createElement("div");
signupDialog.id = "signupDialog";
signupDialog.className = "rounded card dialog";


(function() {

    var loginButton = document.createElement("button");
    var signupButton = document.createElement("button");

    loginButton.id = "loginButton";
    signupButton.id = "signupButton";

    loginButton.textContent = "Login";
    signupButton.textContent = "Signup";

    loginButton.className = "btn primary rounded card";
    signupButton.className = "btn primary rounded card";

    var logSignContainer = document.createElement("div");
    logSignContainer.id = "logSignContainer";
    logSignDialog.append(logSignContainer);

    logSignContainer.append(loginButton);
    logSignContainer.append(signupButton);


    loginButton.addEventListener("click", () => {
        logSignDialog.remove();
        document.body.append(loginDialog);
    });

    signupButton.addEventListener("click", () => {
        logSignDialog.remove();
        document.body.append(signupDialog);
    });

})(); // Login/Signup Dialog

(function() {

    var inputContainer = new El("div", loginDialog);
    inputContainer.e.id = "inputContainer";

    var loginButton = new El("button", loginDialog);
    loginButton.e.id = "loginSubmit";
    loginButton.e.className = "btn primary rounded card";
    loginButton.e.textContent = "Login";

    var usernameBox = new El("input", inputContainer.e);
    usernameBox.e.id = "usernameBox";
    usernameBox.e.className = "rounded card";
    usernameBox.e.placeholder = "Username";

    var passwordBox = new El("input", inputContainer.e);
    passwordBox.e.id = "passwordBox";
    passwordBox.e.className = "rounded card";
    passwordBox.e.placeholder = "Password";
    passwordBox.e.type = "password";

    loginButton.e.addEventListener("click", () => {
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
          };
          
        fetch(`/testlogin?username=${usernameBox.e.value}&password=${passwordBox.e.value}`, requestOptions)
        .then(response => response.text())
        .then(result => {
            if (result == "OK") {
                localStorage.setItem("loggedIn", true);
                localStorage.setItem("username", usernameBox.e.value);
                localStorage.setItem("password", passwordBox.e.value);

                window.location = "/";
            } else {
                alert(result);
            }
        })
        .catch(error => console.log('error', error));
    });

})(); // Login Dialog

(function() {

    var inputContainer = new El("div", signupDialog);
    inputContainer.e.id = "inputContainer";

    var signupButton = new El("button", signupDialog);
    signupButton.e.id = "signupSubmit";
    signupButton.e.className = "btn primary rounded card";
    signupButton.e.textContent = "Signup";

    var usernameBox = new El("input", inputContainer.e);
    usernameBox.e.id = "usernameBox";
    usernameBox.e.className = "rounded card";
    usernameBox.e.placeholder = "Username";

    var passwordBox = new El("input", inputContainer.e);
    passwordBox.e.id = "passwordBox";
    passwordBox.e.className = "rounded card";
    passwordBox.e.placeholder = "Password";
    passwordBox.e.type = "password";

    signupButton.e.addEventListener("click", () => {
        var requestOptions = {
            method: 'POST',
            redirect: 'follow'
          };
          
          fetch(`/signup?username=${usernameBox.e.value}&password=${passwordBox.e.value}`, requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result == "OK") {
                    localStorage.setItem("loggedIn", true);
                    localStorage.setItem("username", usernameBox.e.value);
                    localStorage.setItem("password", passwordBox.e.value);

                    window.location = "/";
                } else {
                    alert(result);
                }
            })
            .catch(error => console.log('error', error));
    });

})(); // Signup Dialog
