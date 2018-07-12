var express = require("express");
var bodyParser = require('body-parser');
var session = require('express-session');
var app = express();



const { Pool } = require("pg");

const connectionString = process.env.DATABASE_URL || "postgres://admin:password@localhost:5432/workout";
const pool = new Pool({connectionString: connectionString});

app.set("port", (process.env.PORT || 5000));
app.use(session({ secret: 'this-is-a-secret-token', cookie: { maxAge: 60000 }, proxy: true, resave: true, saveUninitialized: true}));
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
app.get("/loginFunc", loginFunc3);
app.get("/loginFunc2", loginFunc2);
app.get("/loginView", loginView);
app.get("/exercise", exercise);
app.get("/logout", logout);
app.post("/addList", addList);
app.get("/todoList", todoList);

app.get('/', (req, res) => {
	res.render("index");
});

app.listen(app.get("port"), function() {
	console.log("Now listening for connection on port: ", app.get("port")); 
});

function logout(req, res, err) {
	req.session.destroy(function(err) {
		res.redirect("index.html");
	});	
}

function loginView(req, res, err) {
		var param = {message: ""};
		return res.render("login.ejs", param);
}

function todoList(req, res, err) {
	if(typeof req.session.username == 'undefined')
	{
		return res.render("login.ejs", {message: ""});
	}

	var sql1 = "SELECT id FROM users WHERE username = $1";
	var param1 = [req.session.username];
	console.log(req.session.username);
	var id;
	
	pool.query(sql1, param1, function(err, result) {
		if (err) {
			console.log("An error with DB occured: ", err);
		}
		
		id = result.rows[0].id;
		
		var sql3 = "SELECT w.title, tdl.listitem FROM todolist tdl INNER JOIN workout w ON w.id = tdl.workoutid WHERE tdl.userid = $1";
		var param3 = [id];
	
		pool.query(sql3, param3, function(err, result) {
			if (err) {
				console.log("An error with DB occured: ", err);
			}
		
			var params = [];
		
			console.log("Result length: ", result.rows.length);
		
			if(result.rows !== undefined && result.rows.length > 0)
			{
				for(var i=0; i < result.rows.length; i++)
				{
					var values = { listItem: result.rows[i].listitem, title: result.rows[i].title };
					params.push(values);
					console.log("listItem: ", values.listItem);
				}
			}
			else {
				var values = { listItem: "Currently, there's no list item.", title: "List Item" };
				params.push(values);
				console.log("Your list is empty: ", values.listItem);
			}
			return res.render("todolist.ejs", { results: params });
		
		});
		
	});
	
}

function addList(req, res, err) {
	if(typeof req.session.firstname == 'undefined')
	{
		return res.render("login.ejs", {message: ""});
	}
	
	var sql1 = "SELECT id FROM users WHERE username = $1";
	var param1 = [req.session.username];
	var id;
	
	pool.query(sql1, param1, function(err, result) {
		if (err) {
			console.log("An error with DB occured: ", err);
		}
		
		id = result.rows[0].id;
		
		var values = req.body;
		var sql2 = "INSERT INTO todolist (userId, workoutId, listItem) VALUES ($1, $2, $3)";
		var param2 = [id, values.workoutId, values.todo];
	
		pool.query(sql2, param2, function(err, result) {
			if (err) {
				console.log("An error with DB occured: ", err);
			}
		
		});
		
	
		todoList(req, res, err);
		
	});
	
	console.log("User ID: ", id);
	
	
}

function exercise(req, res, err) {
	
	if(typeof req.session.firstname == 'undefined')
	{
		return res.render("login.ejs", {message: ""});
	}
	
	console.log("Session name: ", req.session.firstname);
	
	var sql = "SELECT w.id AS ID, wt.type AS Type, bp.part AS BodyPart, w.title AS Title, w.description AS Description FROM workout w INNER JOIN workoutType wt ON w.typeId = wt.id INNER JOIN bodyPart bp ON w.bodyPartId = bp.id;";
	pool.query(sql, function(err, result) {
		if(err) {
			console.log("An error occured while querying Exercises: ", err);
		}
		
		var params = [];
		
		for(var i=0; i < result.rows.length; i++)
		{
			var values = { id: result.rows[i].id, type: result.rows[i].type, title: result.rows[i].title,  bodypart: result.rows[i].bodypart, description: result.rows[i].description};
			params.push(values);
		}
		
		return res.render("exercise.ejs", {results: params});
	});
}

function loginFunc2(req, res) {
	return res.render("index.ejs", {firstname: req.session.firstname, username: req.session.username });
}

function loginFunc3(req, res) {
	if(typeof req.session.firstname == 'undefined')
	{
		return res.render("login.ejs", {message: ""});
	}
}

function loginFunc(req, res) {

	var values = req.body;
	var session = req.session;
	var username = values.username;
	var password = values.password;
	var sql = "SELECT firstname, username FROM users WHERE username = $1 and password = $2";
	var param = [username, password];
	
	pool.query(sql, param, function(err, result) {
		if (err) {
			console.log("An error with DB occured: ", err);
		}
		
		if(result != null && result.rowCount > 0)
		{
			console.log(result.rows[0].firstname);
			var param = {firstname: result.rows[0].firstname.toString()};
			session.username = result.rows[0].username.toString();
			session.firstname = result.rows[0].firstname.toString();
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