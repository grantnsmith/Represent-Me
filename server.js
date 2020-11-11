const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const app = express();
const session = require("express-session");
// Requiring passport as we've configured it
const passport = require("./config/passport");

const PORT = process.env.PORT || 3001;

// Define middleware here
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

app.use(
  session({
    secret: "super secret 12345",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

require("./routes/api-routes")(app);

//Connect to the Mongo DB
mongoose.connect(process.env.ORMONGO_URL, {
  user: process.env.ORMONGO_USER,
  pass: process.env.ORMONGO_PASS,
});
mongoose.connection.on("connected", function () {
  console.log(
    "Mongoose successfully connected to Db at" + process.env.ORMONGO_URL
  );
});
// mongoose.connect(
//   process.env.MONGODB_URI ||
//     "mongodb://USER:PASS@iad2-c10-1.mongo.objectrocket.com:54383,iad2-c10-0.mongo.objectrocket.com:54383,iad2-c10-2.mongo.objectrocket.com:54383/UserDb?replicaSet=afa24aec04f145afa7cbdcade09eeadb",
//   () => {
//     console.log(`Succcessfully Connected to Db`);
//   }
// );

// mongoose.connect(
//   process.env.MONGODB_URI || "mongodb://localhost/UserDb",
//   () => {
//     console.log(`Succcessfully Connected to Db`);
//   }
// );

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

app.listen(PORT, function () {
  console.log(`🌎 ==> API server now on port ${PORT}!`);
});
