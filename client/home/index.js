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
    constructor(name, append, id, fun) {
        this.name = name;
        this.append = append;
        this.id = id;
        this.fun = fun;
    }
    
    add() {
        this.el = new El(this.name, this.append.e);
        this.e = this.el.e;
        this.e.id = this.id;  
        this.fun();
    }
    
    remove() {
        if (!this.e) return;
        this.e.remove();   
    }
}



class FeedCard {
    constructor(author, content, info) {
        this.author = author;
        this.content = content;
        this.info = info;
    }

    async fetchInfo() {
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };
          
        var resp = await fetch(`/fetchFeedCardInfo?uuid=${this.info.uuid}`, requestOptions);
        var data = await response.json();
        
        return data;
    }

    add() {
        this.el = document.createElement("div");
        this.el.id = this.info.id;
        this.el.className = "rounded card feed-card";
        feedContainer.e.append(this.el);
    }

    remove() {
        this.el.remove();
    }
}



var feedContainer = new REL("div", mainContainer, "feedContainer", () => {
    var newFeed = document.createElement("div");
    newFeed.id = "newFeed";
    newFeed.className = "rounded card";
    feedContainer.e.append(newFeed);
});

var friendsContainer = new REL("div", mainContainer, "friendsContainer", () => {
    var title = new El("h1", friendsContainer.e);
    title.e.id = "feedTitle";
    title.e.textContent = "Friends";
});

var dmContainer = new REL("div", mainContainer, "dmContainer", () => {
    var title = new El("h1", dmContainer.e);
    title.e.id = "feedTitle";
    title.e.textContent = "Direct Messages";
});

var chatroomContainer = new REL("div", mainContainer, "chatroomContainer", () => {
    var title = new El("h1", chatroomContainer.e);
    title.e.id = "feedTitle";
    title.e.textContent = "Chatroom";
});

var profileContainer = new REL("div", mainContainer, "profileContainer", () => {
    var title = new El("h1", profileContainer.e);
    title.e.id = "feedTitle";
    title.e.textContent = "Profile";
});

var settingsContainer = new REL("div", mainContainer, "settingsContainer", () => {
    var title = new El("h1", settingsContainer.e);
    title.e.id = "feedTitle";
    title.e.textContent = "Settings";
});



feedContainer.add();



var mainConts = [ feedContainer, friendsContainer, dmContainer, chatroomContainer, profileContainer, settingsContainer ];

var items = [
    new Item("button", sidebar.e, "Feed", "feedButton", () => { mainConts.forEach(v => v.remove()); feedContainer.add(); }),
    new Item("button", sidebar.e, "Friends", "friendsButton", () => { mainConts.forEach(v => v.remove()); friendsContainer.add(); }),
    new Item("button", sidebar.e, "Direct Messages", "dmButton", () => { mainConts.forEach(v => v.remove()); dmContainer.add(); }),
    new Item("button", sidebar.e, "Chatroom", "chatroomButton", () => { mainConts.forEach(v => v.remove()); chatroomContainer.add(); }),
    new Item("button", sidebar.e, "Profile", "profileButton", () => { mainConts.forEach(v => v.remove()); profileContainer.add(); }),
    new Item("button", sidebar.e, "Settings", "settingsButton", () => { mainConts.forEach(v => v.remove()); settingsContainer.add(); })
];
