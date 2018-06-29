var express = require("express");
var app = express();

const { Pool } = require("pg");

const connectionString = process.env.DATABASE_URL || "postgres://admin:password@localhost:5432/workout";
const pool = new Pool({connectionString: connectionString});

app.set("port", (process.env.PORT || 5000));

app.get("/getUsers", getUsers); // getUsers/:id

app.listen(app.get("port"), function() {
	console.log("Now listening for connection on port: ", app.get("port")); 
});

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