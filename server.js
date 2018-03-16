const express = require("express");
const bodyParser = require("body-parser");
const session = require('client-sessions');

const PORT = process.env.PORT || 3000;
// using sequelize to create tables in the database
const db = require('./models');

// Creating express app and configuring middleware needed for authentication
var app = express();


// Sets up the Express app to handle data parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

app.use(express.static("public"));

// Set Handlebars.
const exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//session handler middleware
app.use(
	session({
  		cookieName: 'mySession', // cookie name dictates the key name added to the request object 
  		secret: 'thisisasecretkept', // should be a large unguessable string 
  		duration: 24 * 60 * 60 * 1000, // how long the session will stay valid in ms 
  		activeDuration: 1000 * 60 * 5 // if expiresIn < activeDuration, the session will be extended by activeDuration milliseconds 
	})
);

require("./routes/api-routes.js")(app);
require("./routes/html-routes.js")(app);

db.sequelize.sync().then(function () {
	app.listen(PORT, function() {
  		console.log("App now listening at localhost:" + PORT);
	});
});


