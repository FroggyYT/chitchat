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
// header.e.className = "rounded card";

var titleContainer = new El("div", header.e);
titleContainer.e.id = "titleContainer";

var title1 = new El("a", titleContainer.e);
title1.e.textContent = "Chit";
title1.e.id = "title3";

var title2 = new El("a", titleContainer.e);
title2.e.textContent = "Chat";
title2.e.id = "title4";

var searchContainer = new El("div", header.e);
searchContainer.e.id = "searchContainer";
searchContainer.e.className = "rounded card";

var searchBar = new El("input", searchContainer.e);
searchBar.e.id = "searchBar";
searchBar.e.placeholder = "Search?";

var searchButton = new El("button", searchContainer.e);
searchButton.e.id = "searchButton";
searchButton.e.className = "btn";
searchButton.e.textContent = ">>";

var logoutButton = new El("button", header.e);
logoutButton.e.id = "logoutButton";
logoutButton.e.className = "btn rounded card";
logoutButton.e.textContent = "Logout";

logoutButton.e.addEventListener("click", () => {
    localStorage.setItem("loggedIn", false);
    localStorage.setItem("username", null);
    localStorage.setItem("password", null);
    window.location = "/";
});

var sidebar = new El("div", document.body);
sidebar.e.id = "sidebar"
sidebar.e.className = "rounded card";

class Item {
    constructor(name, append, title, id) {
        this.el = new El(name, append);
        this.e = this.el.e;
        this.e.textContent = title;
        this.e.id = id;
        this.e.className = "sidebar-item";
    }
}

var items = [
    new Item("button", sidebar.e, "Feed", "feedButton"),
    new Item("button", sidebar.e, "Friends", "friendsButton"),
    new Item("button", sidebar.e, "Direct Messages", "dmButton"),
    new Item("button", sidebar.e, "Profile", "profileButton"),
    new Item("button", sidebar.e, "Settings", "settingsButton")
];
