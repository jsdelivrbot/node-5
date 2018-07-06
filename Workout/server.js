var express = require("express");
var app = express();
var bodyParser = require('body-parser')



const { Pool } = require("pg");

const connectionString = process.env.DATABASE_URL || "postgres://admin:password@localhost:5432/workout";
const pool = new Pool({connectionString: connectionString});

app.set("port", (process.env.PORT || 5000));

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('ejs', require('ejs').renderFile);
app.get("/getUsers", getUsers); // getUsers/:id
app.get("/getWorkouts", getWorkouts); 
app.post("/register", register);
app.post("/loginFunc", loginFunc);
app.get("/loginView", loginView);
app.get('/', (req, res) => {
	res.render("index");
});

app.listen(app.get("port"), function() {
	console.log("Now listening for connection on port: ", app.get("port")); 
});

function loginView(req, res, err) {
		var param = {message: ""};
		return res.render("login.ejs", param);
}

function loginFunc(req, res) {
	var values = req.body;
	var username = values.username;
	var password = values.password;
	var sql = "SELECT firstname FROM users WHERE username = $1 and password = $2";
	var param = [username, password];
	
	pool.query(sql, param, function(err, result) {
		if (err) {
			console.log("An error with DB occured: ", err);
		}
		
		if(result != null && result.rowCount > 0)
		{
			console.log(result.rows[0].firstname);
			var param = {firstname: result.rows[0].firstname.toString()};
			return res.render("index.ejs", param);
		}
		
		else {
			var param2 = {message: "* Login Failed. Please check your username/password and try again."};
			return res.render("login.ejs", param2);
		}
	});
	
	
}

function register(req, res, err) {
	if (err) {
		console.log("There was an error: ", err);
	}
	var values = req.body;
	var sql = "INSERT INTO users (firstname, lastname, username, password) VALUES ($1, $2, $3, $4);"
	var params = [values.firstname, values.lastname, values.username, values.password];
	
	pool.query(sql, params, function(err, result) {
		if (err) {
			console.log("An error with DB occured: ", err);
		}
		
	});
	
	console.log('Info: ' + values.firstname + ' ' + values.lastname + ' ' + values.username);
	var params2 = {message: "* Congratulations! You have been registered!"}
	
	res.render('login', params2);
}

function getUsers(req, res) {
	console.log("Getting user info");
	
	var id = req.query.id; //req.params.id; //
	console.log("logging ", id);
	
	getUserFromDb(id, function(error, result) { 
	
		if (error || result == null || result.length != 1)
		{
			res.status(500).json({success:false, data: error});
		}
		else {
			
			console.log("back from getUserFromDb function with results: ", result);
			res.json(result[0]);
		}
		
		
		
	});
	
}

function getWorkouts(req, res) {
	console.log("Getting workout info");
	
	var id = req.query.id; //req.params.id; //
	console.log("logging ", id);
	
	getWorkoutFromDb(id, function(error, result) { 
	
		if (error || result == null || result.length != 1)
		{
			res.status(500).json({success:false, data: error});
		}
		else {
			
			console.log("back from getUserFromDb function with results: ", result);
			res.json(result[0]);
		}
		
		
		
	});
	
}

function getUserFromDb(id, callback) {
	console.log("getUserFromDb function called with id: ", id);
	
	var sql = "SELECT * FROM users WHERE id = $1::int";
	var params = [id];
	
	pool.query(sql, params, function(err, result) {
		if (err) {
			console.log("An error with DB occured: ", err);
			callback(err, null);
		}
		
		console.log("found DB result: " + JSON.stringify(result.rows));
		
		callback(null, result.rows);
	});
	
}

function getWorkoutFromDb(id, callback) {
	console.log("getWorkoutFromDb function called with id: ", id);
	
	var sql = "SELECT * FROM workout WHERE id = $1::int";
	var params = [id];
	
	pool.query(sql, params, function(err, result) {
		if (err) {
			console.log("An error with DB occured: ", err);
			callback(err, null);
		}
		
		console.log("found DB result: " + JSON.stringify(result.rows));
		
		callback(null, result.rows);
	});
}