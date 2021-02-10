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
searchBar.e.placeholder = "Search";

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
    constructor(name, append, title, id, fun) {
        this.el = new El(name, append);
        this.e = this.el.e;
        this.e.textContent = title;
        this.e.id = id;
        this.e.className = "sidebar-item";
        this.e.addEventListener("click", fun);
    }
}




var mainContainer = new El("div", document.body);
mainContainer.e.id = "mainContainer";


class REL {
    constructor(name, append, id) {
        this.name = name;
        this.append = append;
        this.id = id;
    }
    
    add() {
        this.el = new El(this.name, this.append.e);
        this.e = this.el.e;
        this.e.id = this.id;  
    }
    
    remove() {
        if (!this.e) return;
        this.e.remove();   
    }
}


var feedContainer = new REL("div", mainContainer, "feedContainer");
var friendsContainer = new REL("div", mainContainer, "friendsContainer");
var dmContainer = new REL("div", mainContainer, "dmContainer");
var chatroomContainer = new REL("div", mainContainer, "chatroomContainer");
var profileContainer = new REL("div", mainContainer, "profileContainer");
var settingsContainer = new REL("div", mainContainer, "settingsContainer");


var mainConts = [ feedContainer, friendsContainer, dmContainer, chatroomContainer, profileContainer, settingsContainer ];

var items = [
    new Item("button", sidebar.e, "Feed", "feedButton", () => {}),
    new Item("button", sidebar.e, "Friends", "friendsButton", () => {}),
    new Item("button", sidebar.e, "Direct Messages", "dmButton", () => {}),
    new Item("button", sidebar.e, "Chatroom", "chatroomButton", () => { mainConts.forEach(v => v.remove()); chatroomContainer.add(); }),
    new Item("button", sidebar.e, "Profile", "profileButton", () => { mainConts.forEach(v => v.remove()); profileContainer.add(); }),
    new Item("button", sidebar.e, "Settings", "settingsButton", () => {})
];
