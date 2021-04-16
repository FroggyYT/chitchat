var express = require("express");
var app = express();
var server = require("http").Server(app);
server.listen(process.env.PORT || 3000);

var Datastore = require("nedb");

var uuidv4 = require("uuid").v4;

var db = new Datastore("users.db");
db.loadDatabase();

var feedDB = new Datastore("feed.db");
feedDB.loadDatabase();

app.use("/", express.static(`${__dirname}/client`));

app.get("/", (req, res) => {
    var params = req.query;
    if (params["loggedIn"] == "true" && params["username"] != undefined && params["password"] != undefined) {
        db.find({ username:params["username"] }, (err, docs) => {
            if (docs.length != 1) return res.send("Username Not Found");
            var doc = docs[0];

            if (doc.password == params["password"]) return res.sendFile(`${__dirname}/client/home/index.html`);
            return res.send("Incorrect Password!");
        });
    } else if (params["loggedIn"] == "false") {
        res.sendFile(`${__dirname}/client/login/index.html`);
    } else {
        res.sendFile(`${__dirname}/client/login/redirect.html`);
    }
});

app.post("/signup", (req, res) => {
    var params = req.query;

    if (params["username"] != undefined && params["password"] != undefined && params["username"] != "" && params["password"] != ""){
        db.find({ username:params["username"] }, (err, docs) => {
            if (docs.length > 0) {
                res.send("Username Taken")
            } else {
                db.insert({username:params["username"], password:params["password"], uuid: uuidv4()});
                res.send("OK");
            }
        });
    } else {
        res.send("Username/Password left blank");
    }
});

app.get("/testlogin", (req, res) => {
    var params = req.query;

    if (params["username"] != undefined && params["password"] != undefined && params["username"] != "" && params["password"] != ""){
        db.find({ username:params["username"] }, (err, docs) => {
            if (docs.length != 1) return res.send("Username Not Found");
            var doc = docs[0];

            if (doc.password == params["password"]) return res.send("OK");
            return res.send("Incorrect Password!");
        });
    } else {
        res.send("Username/Password left blank");
    }
});

app.get("/fetchFeedCardInfo", (req, res) => {
    var params = req.query;

    if (params["uuid"] != undefined) {
        feedDB.find({ uuid:params["uuid"] }, (err, docs) => {
            if (docs.length != 1) return res.send("NO FEED CARD FOUND");
            var doc = docs[0];
            
            return res.send(doc);
        });
    } else {
        res.send("NO UUID");
    }
});

app.get("/fetchFeed", (req, res) => {
    feedDB.find({}, (err, docs) => {
        res.send(docs);
    });
});

app.use(express.json());

app.post("/newFeedPost", (req, res) => {
    var data = req.body;

    if (data.auth.username != undefined && data.auth.password != undefined) {
        db.find({ username: data.auth.username }, (err, docs) => {
            if (docs.length != 1) return res.end();
            var doc = docs[0];

            if (doc.password != data.auth.password) return res.end();

            feedDB.insert({ author: { name: data.name, uuid: doc.uuid }, content: req.body.content, date: new Date().toLocaleDateString(), uuid: uuidv4() });
            res.end();
        });
    }
});

app.get("/fetchUserUUID", (req, res) => {
    var params = req.query;

    if (params["name"] == undefined) return res.end();

    db.find({ username: params["name"] }, (err, docs) => {
        if (docs.length != 1) return res.end();
        var doc = docs[0];

        res.send(doc.uuid);
    });
});

app.get("/searchUser", (req, res) => {
    var params = req.query;

    if (params["name"] != undefined) {
        db.find({}, (err, docs) => {
            if (docs == undefined) return res.end();

            var users = [];

            docs.forEach((v, i) => {
                if (new RegExp(params["name"]).test(v.username)) users.push({ username: v.username, uuid: v.uuid });
            });

            res.send(users);
        });
    } else {
        db.find({}, (err, docs) => {
            if (docs == undefined) return res.end();

            var users = [];

            docs.forEach((v, i) => {
                users.push({ username: v.username, uuid: v.uuid });
            });

            res.send(users);
        });
    }
});

app.get("/getFriends", (req, res) => {
    var params = req.query;
    if (params["name"] == undefined) return res.end();

    db.find({ username: params["name"] }, (err, docs) => {
        if (docs.length != 1) return res.end();
        var doc = docs[0];

        res.send(doc.friends);
    });
});