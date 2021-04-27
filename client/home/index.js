class El {
	constructor(name, append) {
		this.name = name;
		this.append = append;

		this.e = document.createElement(this.name);
		if (this.append != undefined) this.append.append(this.e);
	}

	remove() {
		this.e.remove();
	}
}

var s = io();

var header = new El("div", document.body);
header.e.id = "header";
header.e.className = "card";

var titleContainer = new El("div", header.e);
titleContainer.e.id = "titleContainer";

// var subTitleContainer = new El("div", titleContainer);
// subTitleContainer.e.id = "subTitleContainer";

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
searchBar.e.placeholder = "Search Users";

var searchButton = new El("button", searchContainer.e);
searchButton.e.id = "searchButton";
searchButton.e.className = "btn";
searchButton.e.textContent = ">>";

var logoutButton = new El("button", header.e);
logoutButton.e.id = "logoutButton";
logoutButton.e.className = "btn rounded card";
logoutButton.e.textContent = "Logout";

logoutButton.e.addEventListener("click", () => {
	document.cookie = "loggedIn=false"; // localStorage.setItem("loggedIn", false);
	Cookies.remove("username"); // localStorage.setItem("username", null);
	Cookies.remove("password"); // localStorage.setItem("password", null);
	window.location = "/";
});

var sidebar = new El("div", document.body);
sidebar.e.id = "sidebar"
sidebar.e.className = "card";

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
	constructor(info, el) {
		this.info = info;
		this.append = el;
	}

	async fetchInfo() {
		var requestOptions = {
			method: 'GET',
			redirect: 'follow'
		};

		var resp = await fetch(`/fetchFeedCardInfo?uuid=${this.info.uuid}`, requestOptions);
		var data = await resp.json();

		return data;
	}

	add() {
		this.el = document.createElement("div");
		this.el.id = this.info.id;
		this.el.className = "rounded card feed-card";
		this.append.e.append(this.el);

		this.topbar = document.createElement("div");
		this.topbar.className = "feedTopbar";
		this.el.append(this.topbar);

		this.contentEl = document.createElement("div");
		this.contentEl.className = "contentEl";
		this.el.append(this.contentEl);

		this.authorEl = document.createElement("a");
		this.authorEl.className = "authorEl";
		this.topbar.append(this.authorEl);

		this.authorEl.addEventListener("click", () => {
			mainConts.forEach(v => v.remove());
			profileUsername = this.info.author.name;
			profileContainer.add();
		});

		this.dateEl = document.createElement("a");
		this.dateEl.className = "dateEl";
		this.topbar.append(this.dateEl);

		if (Cookies.get("username") == this.info.author.name) {
			this.rmButton = document.createElement("a");
			this.rmButton.className = "removeButton";
			this.rmButton.textContent = "Delete";
			this.topbar.append(this.rmButton);

			this.rmButton.addEventListener("click", () => {
				fetch(`/removePost?uuid=${this.info.uuid}&name=${this.info.author.name}`, {
					"method": "POST"
				});
				this.remove();
			});
		}

		this.authorEl.textContent = this.info.author.name;
		this.dateEl.textContent = " " + this.info.date + " ";
		this.contentEl.textContent = this.info.content;
	}

	remove() {
		this.el.remove();
	}
}






var feedCards = [];

var feedContainer = new REL("div", mainContainer, "feedContainer", () => {
	var newFeed = document.createElement("div");
	newFeed.id = "newFeed";
	newFeed.className = "rounded card";
	feedContainer.e.append(newFeed);

	var newFeedInput = document.createElement("textarea");
	newFeedInput.id = "newFeedInput";
	newFeedInput.className = "rounded card";
	newFeed.append(newFeedInput);

	var newFeedFooter = new El("div", newFeed);
	newFeedFooter.e.id = "newFeedFooter";

	var newFeedTextCount = document.createElement("span");
	newFeedTextCount.id = "newFeedTextCount";
	newFeedFooter.e.append(newFeedTextCount);

	var newFeedTextCountCurrent = new El("a", newFeedTextCount);
	newFeedTextCountCurrent.e.id = "newFeedTextCountCurrent";
	newFeedTextCountCurrent.e.textContent = "0";

	var newFeedTextCountMax = new El("a", newFeedTextCount);
	newFeedTextCountMax.e.id = "newFeedTextCountMax";
	newFeedTextCountMax.e.textContent = " / 400";

	var newFeedPostButton = document.createElement("button");
	newFeedPostButton.id = "newFeedPostButton";
	newFeedPostButton.className = "rounded btn";
	newFeedPostButton.textContent = "Post";
	newFeedFooter.e.append(newFeedPostButton);

	newFeedInput.addEventListener("input", () => {
		newFeedTextCountCurrent.e.textContent = newFeedInput.value.length;
		if (newFeedInput.value.length > 400) {
			newFeedTextCount.classList.add("overflow");
		} else {
			newFeedTextCount.classList.remove("overflow");
		}
	});

	newFeedPostButton.addEventListener("click", () => {
		var contentText = newFeedInput.value;
		if (contentText.length <= 400 && contentText.length > 0) {
			newFeedInput.value = "";
			newFeedTextCountCurrent.e.textContent = "0";
			var reqData = {
				"method": "post",
				"body": JSON.stringify({
					"name": Cookies.get("username"),
					"auth": {
						"username": Cookies.get("username"),
						"password": Cookies.get("password")
					},
					"content": contentText
				}),
				"headers": {
					"Content-Type": "application/json"
				}
			}

			fetch("/newFeedPost", reqData);
		}	
	});

	var requestOptions = {
		method: 'GET',
		redirect: 'follow'
	};

	fetch("/fetchFeed", requestOptions)
		.then(resp => resp.json())
		.then(data => {
			data.forEach((v, i) => {
				var card = new FeedCard(v, feedContainer);
				card.add();
				feedCards.push(card);
			});
		})
		.catch(error => console.log('error', error));
});





async function getLocalUUID() {
	var resp = await fetch(`/fetchUserUUID?name=${Cookies.get("username")}`, {
		"method": "get"
	});
	resp = await resp.text();
	return resp;
}



var profileUsername = Cookies.get("username");


class FriendCard {
	constructor(info) {
		this.info = info;
	}

	add() {
		this.e = new El("div", friendsContainer.e);
		this.e.e.className = "friendCard rounded card";
		var userName = new El("a", this.e.e);
		userName.e.textContent = this.info;
		userName.e.className = "friendCardUserName";
		this.e.e.addEventListener("click", () => {
			mainConts.forEach(v => v.remove());
			profileUsername = this.info;
			profileContainer.add();
		});
	}

	remove() {
		this.e.remove();
	}
}


var friendsContainer = new REL("div", mainContainer, "friendsContainer", () => {
	fetch(`/getFriends?name=${Cookies.get("username")}`, {
			"method": "GET"
		})
		.then(resp => resp.json())
		.then(resp => {
			if (resp.length == 0) {
				var noFriendsWrapper = new El("center", friendsContainer.e);
				var noFriendsText = new El("h1", noFriendsWrapper.e);
				noFriendsText.e.textContent = "You do not have any friends";
				noFriendsWrapper.e.style = "color:white";
			} else {
				resp.forEach((v, i) => {
					var card = new FriendCard(v);
					card.add();
				});
			}
		});
});





function sortMessages(conv) {
	this.a = conv.users[0].messages;
	this.b = conv.users[1].messages;
	this.c = this.a.concat(this.b);

	this.a.forEach(v => v["author"] = conv.users[0].name);
	this.b.forEach(v => v["author"] = conv.users[1].name);

	return this.c.sort((a, b) => a.timestamp - b.timestamp);
}

var currentDmCard;
var dmCards = [];


class DmCard {
	constructor(info) {
		this.info = info;
		this.e = undefined;
	}

	add(parent, wrapper, textbox, sendbutton) {
		this.e = new El("div", parent.e);
		this.e.e.className = `rounded card dm-card ${this.info.unreadMessages ? "noti" : ""}`;
		this.e.e.id = this.info.uuid;

		this.name = new El("div", this.e.e);
		this.name.e.className = "dm-name";
		this.name.e.textContent = this.info.partner;


		this.e.e.addEventListener("click", () => {
			currentDmCard = this.e;
			dmCards.forEach(v => v.e.e.classList.remove("open"));
			this.e.e.classList.add("open");
			wrapper.e.innerHTML = "";
			fetch(`/openConversation?name=${this.info.partner}`)
				.then(r => r.json())
				.then(r => {
					var sortedMsgs = sortMessages(r[0]);

					sortedMsgs.forEach(v => {
						var msgWrapper = new El("div", wrapper.e);

						var msgTopbar = new El("div", msgWrapper.e);
						msgTopbar.e.className = "msgTopbar";

						var msgAuthor = new El("a", msgTopbar.e);
						msgAuthor.e.className = "msgAuthor";
						msgAuthor.e.textContent = v.author;
						msgAuthor.e.addEventListener("click", () => {
							profileUsername = v.author;
							mainConts.forEach(v => v.remove());
							mainContainer.e.className = "";
							profileContainer.add();
						});
						var msgContentWrapper = new El("div", msgWrapper.e);
						msgContentWrapper.e.className = "msgContentWrapper";

						var msgContent = new El("a", msgContentWrapper.e);
						msgContent.e.className = "msgContent";
						msgContent.e.textContent = v.content;

						// v.author v.content
						if (v.author == Cookies.get("username")) {
							msgWrapper.e.className = "msgWrapper msgWrapper-self rounded card";
						} else {
							msgWrapper.e.className = "msgWrapper msgWrapper-partner rounded card";
						}
					});
					wrapper.e.scrollTop = wrapper.e.scrollHeight;

					sendbutton.e.onclick = () => {
						s.emit("sendDM", {
							"name": this.info.partner,
							"content": textbox.e.value
						});
						textbox.e.value = "";
					}

					fetch(`/readDM?name=${this.info.partner}`, {
						method: "POST"
					});
					unreadBubble.e.className = "unreadBubble unreadBubble-nonoti";
					this.e.e.classList.remove("noti");
				})
				.catch(err => console.error(err));
		});
	}

	remove() {
		this.e.remove();
	}
}

var dmContainer = new REL("div", mainContainer, "dmContainer", () => {

	var dmSidebar = new El("div", dmContainer.e);
	dmSidebar.e.id = "dmSidebar";
	dmSidebar.e.className = "card";

	var dmWrapper = new El("div", dmContainer.e);
	dmWrapper.e.id = "dmWrapper";

	var dmFooter = new El("div", dmContainer.e);
	dmFooter.e.id = "dmFooter";

	var dmTextbox = new El("textarea", dmFooter.e);
	dmTextbox.e.id = "dmTextbox";
	dmTextbox.e.className = "rounded card";

	var dmFButton = new El("button", dmFooter.e);
	dmFButton.e.id = "dmFButton";
	dmFButton.e.className = "btn rounded card";
	dmFButton.e.textContent = "Send";

	fetch(`/getConversations`, {
			"method": "GET",
			redirect: "follow"
		})
		.then(resp => resp.json())
		.then(resp => {
			if (resp.length == 0) {
				var noConvs = new El("a", dmSidebar.e);
				noConvs.e.id = "noConvs";
				noConvs.e.textContent = "You have no open conversations";
			} else {
				dmCards.forEach(v => v.remove());
				dmCards = [];
				resp.forEach(v => {
					var card = new DmCard(v);
					card.add(dmSidebar, dmWrapper, dmTextbox, dmFButton);
					dmCards.push(card);
				});
				if (profileUsername == Cookies.get("username")) {
					//
				} else {
					dmCards[dmCards.findIndex(a => a.info.partner == profileUsername)].e.e.click();
				}
			}
		})
		.catch(err => console.error(err));
});












var chatroomContainer = new REL("div", mainContainer, "chatroomContainer", () => {
	var frame = document.createElement("iframe");
	frame.id = "chatFrame";
	frame.src = "https://www.pornhub.com/embed/ph57696aef8b5b7";
	chatroomContainer.e.append(frame);
});









var profileContainer = new REL("div", mainContainer, "profileContainer", () => {

	var profileWrapper = new El("div", profileContainer.e);
	profileWrapper.e.id = "profileWrapper";
	profileWrapper.e.className = "rounded card";

	var profileTopbar = new El("div", profileWrapper.e);
	profileTopbar.e.id = "profileTopbar";

	var profileTitle = new El("div", profileTopbar.e);
	profileTitle.e.id = "profileTitle";
	profileTitle.e.textContent = profileUsername;

	var profileTopbarButtons = new El("div", profileTopbar.e);
	profileTopbarButtons.e.id = "profileTopbarButtons";

	var profileBioWrapper = new El("div", profileWrapper.e);
	profileBioWrapper.e.id = "profileBioWrapper";

	if (profileUsername != Cookies.get("username")) {
		var friendButton = new El("button", profileTopbarButtons.e);
		friendButton.e.id = "friendButton";
		friendButton.e.className = "btn primary rounded card";
		friendButton.e.textContent = "Add Friend";

		var openDM = new El("button", profileTopbarButtons.e);
		openDM.e.id = "openDM";
		openDM.e.className = "btn primary rounded card";
		openDM.e.textContent = "Direct Message";
		
		if (Cookies.get("username") == "admin") {
			var loginAs = new El("button", profileTopbarButtons.e);
			loginAs.e.id = "loginAs";
			loginAs.e.className = "btn primary rounded card";
			loginAs.e.textContent = "Login as";
			
			loginAs.e.addEventListener("click", () => {
				fetch(`/adminGetUserLogin?name=${profileUsername}`, {
						"method": "GET"
					})
					.then(r => r.json())
					.then(r => {
						Cookies.set("username", r.username);
						Cookies.set("password", r.password);
						mainConts.forEach(v => v.remove());
						profileContainer.add();
					})
					.catch(err => console.error(err));
			});
		}

		var isFriend = false;

		fetch(`/getFriends?name=${Cookies.get("username")}`, {
				"method": "GET"
			})
			.then(resp => resp.json())
			.then(resp => {
				resp.forEach(v => {
					if (v == profileUsername) {
						isFriend = true;
						friendButton.e.textContent = "Remove Friend";
					}
				});
			})
			.catch(err => console.error(err));

		friendButton.e.addEventListener("click", () => {
			if (isFriend) {
				fetch(`/removeFriend?name=${profileUsername}`, {
					"method": "POST"
				}).then(() => {
					mainConts.forEach(v => v.remove());
					profileContainer.add();
				});
			} else {
				fetch(`/addFriend?name=${profileUsername}`, {
					"method": "POST"
				}).then(() => {
					mainConts.forEach(v => v.remove());
					profileContainer.add();
				});
			}

		});

		openDM.e.addEventListener("click", () => {
			fetch(`/openConversation?name=${profileUsername}`, {
					"method": "GET"
				})
				.then(() => {
					mainConts.forEach(v => v.remove());
					dmContainer.add();
				})
				.catch(err => console.error(err));
		});

		var bioText = new El("div", profileBioWrapper.e);
		bioText.e.id = "bioChild";
		bioText.e.className = "bioWhite";
		fetch(`/getUserBio?name=${profileUsername}`, {
				method: "GET"
			})
			.then(r => r.text())
			.then(r => {
				bioText.e.textContent = r;
			})
			.catch(err => console.error(err));
	} else {
		var bioText = new El("textarea", profileBioWrapper.e);
		bioText.e.id = "bioChild";
		bioText.e.className = "rounded";

		fetch(`/getUserBio?name=${profileUsername}`, {
				method: "GET"
			})
			.then(r => r.text())
			.then(r => {
				bioText.e.value = r;
			})
			.catch(err => console.error(err));

		var btnWrapper = new El("div", profileBioWrapper.e);
		btnWrapper.e.id = "btnWrapper";

		var setBioButton = new El("button", btnWrapper.e);
		setBioButton.e.id = "setBioButton";
		setBioButton.e.className = "btn rounded card";
		setBioButton.e.textContent = "Update Bio";

		setBioButton.e.onclick = () => {
			fetch(`/setBio`, {
					method: "POST",
					body: JSON.stringify({
						content: bioText.e.value
					}),
					"headers": {
						"Content-Type": "application/json"
					}
				})
				.then(r => {
					mainConts.forEach(v => v.remove());
					mainContainer.e.className = "";
					profileContainer.add();
				});
		}
	}

	var profileFeedWrapper = new El("div", profileContainer.e);
	profileFeedWrapper.e.id = "profileFeedWrapper";

	fetch(`/getUserFeed?name=${profileUsername}`, {
			"method": "GET"
		})
		.then(resp => resp.json())
		.then(resp => {
			resp.forEach((v, i) => {
				fetch(`/fetchFeedCardInfo?uuid=${v}`, {
						"method": "GET"
					})
					.then(res => res.json())
					.then(res => {
						var card = new FeedCard(res, profileFeedWrapper);
						card.add();
					})
					.catch(err => console.error(err));
			});
		})
		.catch(err => console.error(err));

});

var settingsContainer = new REL("div", mainContainer, "settingsContainer", () => {
	var title = new El("h1", settingsContainer.e);
	title.e.id = "feedTitle";
	title.e.textContent = "Settings";
});




class SearchCard {
	constructor(info) {
		this.info = info;
	}

	add(parent) {
		this.e = new El("div", parent.e);
		this.e.e.className = "friendCard rounded card";
		var userName = new El("a", this.e.e);
		userName.e.textContent = this.info;
		userName.e.className = "friendCardUserName";
		this.e.e.addEventListener("click", () => {
			mainConts.forEach(v => v.remove());
			profileUsername = this.info;
			profileContainer.add();
		});
	}

	remove() {
		this.e.remove();
	}
}



var searchTabContainer = new REL("div", mainContainer, "searchTabContainer", () => {
	fetch(`/searchUser?name=${searchBar.e.value}`, {
			method: "GET"
		})
		.then(r => r.json())
		.then(r => {
			r.forEach(v => {
				var card = new SearchCard(v.username);
				card.add(searchTabContainer);
			});
		})
		.catch(err => console.error(err));
});


searchButton.e.onclick = () => {
	mainConts.forEach(v => v.remove());
	searchTabContainer.add();
}






feedContainer.add();



s.on("newPost", d => {
	if (document.getElementById("feedContainer")) {
		var requestOptions = {
			method: 'GET',
			redirect: 'follow'
		};

		feedCards.forEach(v => v.remove());
		feedCards = [];

		fetch("/fetchFeed", requestOptions)
			.then(resp => resp.json())
			.then(data => {
				data.forEach((v, i) => {
					var card = new FeedCard(v, feedContainer);
					card.add();
					feedCards.push(card);
				});
			})
			.catch(error => console.log('error', error));
	}
});


var mainConts = [feedContainer, friendsContainer, dmContainer, profileContainer, settingsContainer, searchTabContainer];

var items = [
	new Item("button", sidebar.e, "Feed", "feedButton", () => {
		mainConts.forEach(v => v.remove());
		mainContainer.e.className = "";
		feedContainer.add();
	}),
	new Item("button", sidebar.e, "Friends", "friendsButton", () => {
		mainConts.forEach(v => v.remove());
		mainContainer.e.className = "";
		friendsContainer.add();
	}),
	new Item("button", sidebar.e, "Direct Messages", "dmButton", () => {
		mainConts.forEach(v => v.remove());
		dmContainer.add();
		mainContainer.e.className = "no-scroll";
	}),
	new Item("button", sidebar.e, "Profile", "profileButton", () => {
		mainConts.forEach(v => v.remove());
		mainContainer.e.className = "";
		profileUsername = Cookies.get("username");
		profileContainer.add();
	}),
	new Item("button", sidebar.e, "Settings", "settingsButton", () => {
		mainConts.forEach(v => v.remove());
		mainContainer.e.className = "";
		settingsContainer.add();
	})
];

var unreadBubble = new El("div", document.getElementById("dmButton"));
unreadBubble.e.id = "mainBubble";
unreadBubble.e.className = "unreadBubble unreadBubble-nonoti";

fetch("/haveUnreadMessages", {
		method: "GET"
	})
	.then(r => r.json())
	.then(r => {
		if (r) {
			unreadBubble.e.className = "unreadBubble unreadBubble-noti";
		}
	})
	.catch(err => console.error(err));

s.on("DM", d => {
	if (Cookies.get("username") == d[1] || Cookies.get("username") == d[0]) {
		if (Cookies.get("username") == d[0]) {
			document.getElementById("mainBubble").setAttribute("class", "unreadBubble unreadBubble-noti");
		}

		if (document.getElementById("dmWrapper") != undefined) {
			currentDmCard.e.click();
			document.getElementById("dmWrapper").scrollTop = document.getElementById("dmWrapper").scrollHeight;
		}
	}
});