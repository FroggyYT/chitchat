var express = require("express");
var app = express();
var server = require("http").Server(app);
server.listen(process.env.PORT || 3000, () => console.log("Server Started!"));

// var io = require("socket.io")(server, { cors: { origins: ["http://lukeddns.ddns.net"] } });
var io = require("socket.io")(server);

var cookieParser = require("cookie-parser");

// var cors = require("cors");
// app.use(cors());


var Datastore = require("nedb");

var uuidv4 = require("uuid").v4;

var db = new Datastore("users.db");
db.loadDatabase();

var feedDB = new Datastore("feed.db");
feedDB.loadDatabase();

var convDB = new Datastore("conversations.db");
convDB.loadDatabase();

app.use("/", express.static(`${__dirname}/client`));
app.use(cookieParser());

// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', "*");
//   res.header("Access-Control-Allow-Credentials", "true")
//   next();
// });

app.get("/", (req, res) => {
  if (req.cookies["loggedIn"] == "true" && req.cookies["username"] != undefined && req.cookies["password"] != undefined) {
    db.find({
      username: req.cookies["username"]
    }, (err, docs) => {
      if (docs.length != 1) return res.send("Username Not Found");
      var doc = docs[0];

      if (doc.password == req.cookies["password"]) return res.sendFile(`${__dirname}/client/home/index.html`);
      return res.send("Incorrect Password!");
    });
  } else {
    res.sendFile(`${__dirname}/client/login/index.html`);
  }
});

app.post("/signup", (req, res) => {
  var params = req.query;

  if (params["username"] != undefined && params["password"] != undefined && params["username"] != "" && params["password"] != "") {
    db.find({
      username: params["username"]
    }, (err, docs) => {
      if (docs.length > 0) {
        res.send("Username Taken")
      } else {
        db.insert({
          username: params["username"],
          password: params["password"],
          feedPosts: [],
          friends: [],
          bio: "User does not have a bio",
          uuid: uuidv4()
        });
        res.send("OK");
      }
    });
  } else {
    res.send("Username/Password left blank");
  }
});

app.get("/testlogin", (req, res) => {
  var params = req.query;

  if (params["username"] != undefined && params["password"] != undefined && params["username"] != "" && params["password"] != "") {
    db.find({
      username: params["username"]
    }, (err, docs) => {
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
    feedDB.find({
      uuid: params["uuid"]
    }, (err, docs) => {
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
    var sDocs = docs.sort((a, b) => b.timestamp - a.timestamp);
    res.send(sDocs);
  });
});

app.use(express.json());

app.post("/newFeedPost", (req, res) => {
  var data = req.body;

  if (data.auth.username != undefined && data.auth.password != undefined) {
    db.find({
      username: data.auth.username
    }, (err, docs) => {
      if (docs.length != 1) return res.end();
      var doc = docs[0];

      if (doc.password != data.auth.password) return res.end();

      var id = uuidv4();

      db.update({
        username: data.auth.username
      }, {
        $push: {
          feedPosts: id
        }
      }, {});
      var insA = {
        author: {
          name: data.name,
          uuid: doc.uuid
        },
        content: req.body.content,
        date: new Date().toLocaleDateString(),
        timestamp: new Date().getTime(),
        uuid: id
      };
      feedDB.insert(insA);

      io.emit("newPost");
      res.end();
    });
  }
});

app.get("/fetchUserUUID", (req, res) => {
  var params = req.query;

  if (params["name"] == undefined) return res.end();

  db.find({
    username: params["name"]
  }, (err, docs) => {
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
        if (new RegExp(params["name"], "i").test(v.username)) users.push({
          username: v.username,
          uuid: v.uuid
        });
      });

      res.send(users);
    });
  } else {
    db.find({}, (err, docs) => {
      if (docs == undefined) return res.end();

      var users = [];

      docs.forEach((v, i) => {
        users.push({
          username: v.username,
          uuid: v.uuid
        });
      });

      res.send(users);
    });
  }
});

app.get("/getFriends", (req, res) => {
  var params = req.query;
  if (params["name"] == undefined) return res.end();

  db.find({
    username: params["name"]
  }, (err, docs) => {
    if (docs.length != 1) return res.end();
    var doc = docs[0];

    res.send(doc.friends);
  });
});

app.post("/addFriend", (req, res) => {
  var cookies = req.cookies;
  var params = req.query;
  if (params["name"] == undefined) return res.end();

  db.find({
    username: cookies["username"]
  }, (_err, _docs) => {
    if (_docs.length != 1) return res.end();
    var _doc = _docs[0];
    if (_doc.password != cookies["password"]) return res.end();

    db.find({
      username: params["name"]
    }, (err, docs) => {
      if (docs.length != 1) return res.end();
      var doc = docs[0];
      if (_doc.friends.indexOf(doc.username) == -1) {
        db.update({
          username: cookies["username"]
        }, {
          $push: {
            friends: doc.username
          }
        }, {});
      }
    });
  });

  res.end();
});

app.post("/removeFriend", (req, res) => {
  var cookies = req.cookies;
  var params = req.query;
  if (params["name"] == undefined) return res.end();

  db.find({
    username: cookies["username"]
  }, (_err, _docs) => {
    if (_docs.length != 1) return res.end();
    var _doc = _docs[0];
    if (_doc.password != cookies["password"]) return res.end();

    db.find({
      username: params["name"]
    }, (err, docs) => {
      if (docs.length != 1) return res.end();
      var doc = docs[0];
      db.update({
        username: cookies["username"]
      }, {
        $pull: {
          friends: doc.username
        }
      }, {});
    });
  });

  res.end();
});

app.get("/getUserFeed", (req, res) => {
  var params = req.query;
  if (params["name"] == undefined) return res.end();

  db.find({
    username: params["name"]
  }, (err, docs) => {
    if (docs.length != 1) return res.end();
    var doc = docs[0];

    res.send(doc.feedPosts);
  });
});

app.post("/removePost", (req, res) => {
  var params = req.query;
  var cookies = req.cookies;
  if (params["uuid"] == undefined) return res.end();

  db.find({
    username: cookies["username"]
  }, (_err, _docs) => {
    if (_docs.length != 1) return res.end();
    var _doc = _docs[0];
    if (_doc.password != cookies["password"]) return res.end();

    if (params["name"] == cookies["username"]) {
      feedDB.remove({
        uuid: params["uuid"]
      });
      db.update({
        username: cookies.username
      }, {
        $pull: {
          feedPosts: params["uuid"]
        }
      });
    }
    io.emit("newPost");
  });
});

app.get("/openConversation", (req, res) => {
  var params = req.query;
  var cookies = req.cookies;
  if (params["name"] == undefined) return res.end();

  db.findOne({
    username: cookies["username"]
  }, (err2, doc2) => {
    if (err2 || doc2 == undefined) return res.end();
    if (doc2.password != cookies["password"]) return res.end();

    function cNewDoc() {
      var id = uuidv4();
      var newDoc = {
        "uuid": id,
        "users": [{
          "name": cookies["username"],
          "messages": [],
          "unreadMessages": false
        }, {
          "name": params["name"],
          "messages": [],
          "unreadMessages": false
        }]
      };
      convDB.insert(newDoc);
      return newDoc;
    }

    convDB.find({
      "users.name": {
        $in: [params["name"]]
      }
    }, (err, docs) => {
      if (docs.length < 1) return res.send(cNewDoc());

      var newDocs = docs.filter(a => {
        return a.users.some(b => b.name == cookies["username"])
      });
      if (newDocs.length > 0) {
        return res.send(newDocs);
      } else {
        return res.send(cNewDoc());
      }
    });
  });
});

app.get("/getConversations", (req, res) => {
  var cookies = req.cookies;

  db.findOne({
    username: cookies["username"]
  }, (err2, doc2) => {
    if (err2 || doc2 == undefined) return res.end();

    if (doc2.password != cookies["password"]) return res.end();

    convDB.find({
      "users.name": {
        $in: [cookies["username"]]
      }
    }, (err, docs) => {
      if (docs.length < 1 || err) return res.send([]);
      var convs = docs.map(doc => {
        return {
          "uuid": doc.uuid,
          "partner": doc.users.filter(a => a.name != cookies["username"])[0].name,
          "unreadMessages": doc.users.filter(a => a.name == cookies["username"])[0].unreadMessages
        }
      });
      if (convs.length < 1) return res.end();
      return res.send(convs);
    });
  });
});

/*
app.post("/closeConversation", (req, res) => {
    var params = req.query;
    var cookies = req.cookies;
    if (params["name"] == undefined) return res.end();

    db.findOne({ username: cookies["username"] }, (err, doc) => {
        if (err || doc == undefined) return res.end();
        if (doc.password != cookies["password"]) return res.end();
    });

    convDB.find({ "users.name": { $in: [ params["name"] ] } }, (err, docs) => {
        if (docs.length < 1) return res.end();
        docs.forEach(doc => {
            var newDocs = docs.filter(a => { return a.users.some(b => b.name == cookies["username"]) });
            if (newDocs.length > 0) {
                return res.send(newDocs);
            } else {
                return res.send(cNewDoc());
            }
        });
    });
});
*/

var sCookie = require("cookie");

io.on("connection", s => {
  s.on("sendDM", d => {
    var cookies = sCookie.parse(s.request.headers.cookie || "");
    db.findOne({
      username: cookies["username"]
    }, (err2, doc2) => {
      if (doc2 == undefined || err2) return;
      if (cookies["password"] != doc2.password) return;

      io.emit("DM", [d.name, cookies.username]);
      convDB.find({
        "users.name": {
          $in: [d["name"]]
        }
      }, (err, docs) => {
        if (docs.length < 1) return;
        var newDocs = docs.filter(a => {
          return a.users.some(b => b.name == cookies["username"])
        });
        if (newDocs.length > 0) {
          var newDoc = newDocs[0];
          var index = newDoc.users.findIndex(a => a.name == cookies["username"]);
          var partnerIndex = newDoc.users.findIndex(a => a.name == d.name);
          var newMsg = {
            content: d.content,
            timestamp: new Date().getTime()
          };
          convDB.update({
            uuid: newDoc.uuid
          }, {
            $push: {
              [`users.${index}.messages`]: newMsg
            }
          });
          convDB.update({
            uuid: newDoc.uuid
          }, {
            $set: {
              [`users.${partnerIndex}.unreadMessages`]: true
            }
          });
        }
      });
    });
  });
});

app.post("/readDM", (req, res) => {
  var d = req.query;
  var cookies = req.cookies;
  convDB.find({
    "users.name": {
      $in: [d["name"]]
    }
  }, (err, docs) => {
    if (docs.length < 1) return;
    var newDocs = docs.filter(a => {
      return a.users.some(b => b.name == cookies["username"])
    });
    if (newDocs.length > 0) {
      var newDoc = newDocs[0];
      var index = newDoc.users.findIndex(a => a.name == cookies["username"]);
      convDB.update({
        uuid: newDoc.uuid
      }, {
        $set: {
          [`users.${index}.unreadMessages`]: false
        }
      });
    }
  });
});

app.get("/haveUnreadMessages", (req, res) => {
  var params = req.query;
  var cookies = req.cookies;

  convDB.find({
    "users.name": {
      $in: [cookies["username"]]
    }
  }, (err, docs) => {
    if (docs.length < 1 || err) return res.send(false);
    var boolCheck = false;
    docs.forEach(v => {
      var userIndex = v.users.findIndex(a => a.name == cookies["username"]);
      if (v.users[userIndex].unreadMessages) boolCheck = true;
    });
    return res.send(boolCheck);
  });
});

app.get("/getUserBio", (req, res) => {
  var params = req.query;
  if (params.name == undefined) return res.end();
  
  db.findOne({ username: params.name }, (err, doc) => {
    if (doc == undefined || err) return res.end();
    res.send(doc.bio);
  });
});

app.use(express.json());

app.post("/setBio", (req, res) => {
  var cookies = req.cookies;
  var body = req.body;
  console.log(req.body);
  
  db.findOne({ username: cookies.username }, (err, doc) => {
    if (err || doc == undefined) return res.end();
    if (doc.password != cookies.password) res.end();
    
    db.update({ username: cookies.username }, { $set: { bio: req.body.content } });
    res.end();
  });
});

app.get("/adminGetUserLogin", (req, res) => {
  var params = req.query;
  var cookies = req.cookies;
  if (params.name == undefined || cookies.username != "admin") return res.end();
  db.findOne({ username: "admin" }, (err, doc) => {
    if (doc == undefined || err) return res.end();
    if (cookies.password != doc.password) return res.end();
    db.findOne({ username: params.name }, (err2, doc2) => {
      if (doc2 == undefined || err2) return res.end();
      res.send({username: doc2.username, password: doc2.password});
    });
  });
})