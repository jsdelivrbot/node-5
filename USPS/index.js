var express = require('express');
var app = express();
var url = require('url');

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/mail', function(req, res) {
	console.log("Calculating...");
	operateMath(req, res);
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

function operateMath(req, res) {
	var reqUrl = url.parse(req.url, true);
	
	console.log("Query Param: " + JSON.stringify(reqUrl.query));
	
	var weight = reqUrl.query.weight;
	var mailClass = reqUrl.query.mailClass;
	
	calculate(res, weight, mailClass);
}

function calculate(res, weight, mailClass)
{
	
	var result = "";
	
	if (mailClass == "Letters (Stamped)") {
		if (weight < 1)
		{
			result = "$0.50";
		}
		else if (weight >= 1 && weight < 2)
		{
			result = "$0.71";
		}
		else if (weight >= 2 && weight < 3)
		{
			result = "$0.92";
		}
		else if (weight >= 3 && weight < 3.5)
		{
			result = "$1.13";
		}
		else
		{
			result = "Error: Invalid Weight!";
		}
	} 
	else if (mailClass == "Letters (Metered)") {
		if (weight < 1)
		{
			result = "$0.47";
		}
		else if (weight >= 1 && weight < 2)
		{
			result = "$0.68";
		}
		else if (weight >= 2 && weight < 3)
		{
			result = "$0.89";
		}
		else if (weight >= 3 && weight < 3.5)
		{
			result = "$1.10";
		}
		else
		{
			result = "Error: Invalid Weight!";
		}		
	} 
	else if (mailClass == "Large Envelopes (Flats)") {
		if (weight < 1)
		{
			result = "$1.00";
		}
		else if (weight >= 1 && weight < 2)
		{
			result = "$1.21";
		}
		else if (weight >= 2 && weight < 3)
		{
			result = "$1.42";
		}
		else if (weight >= 3 && weight < 4)
		{
			result = "$1.63";
		}
		else if (weight >= 4 && weight < 5)
		{
			result = "$1.84";
		}
		else if (weight >= 5 && weight < 6)
		{
			result = "$2.05";
		}
		else if (weight >= 6 && weight < 7)
		{
			result = "$2.26";
		}
		else if (weight >= 7 && weight < 8)
		{
			result = "$2.47";
		}
		else if (weight >= 8 && weight < 9)
		{
			result = "$2.68";
		}
		else if (weight >= 9 && weight < 10)
		{
			result = "$2.89";
		}
		else if (weight >= 10 && weight < 11)
		{
			result = "$3.10";
		}
		else if (weight >= 11 && weight < 12)
		{
			result = "$3.31";
		}
		else if (weight >= 12 && weight < 13)
		{
			result = "$3.52";
		}
		else
		{
			result = "Error: Invalid Weight!";
		}		
	} else if (mailClass == "First-Class Package Service—Retail") {
		if (weight < 1)
		{
			result = "$3.50";
		}
		else if (weight >= 1 && weight < 2)
		{
			result = "$3.50";
		}
		else if (weight >= 2 && weight < 3)
		{
			result = "$3.50";
		}
		else if (weight >= 3 && weight < 4)
		{
			result = "$3.50";
		}
		else if (weight >= 4 && weight < 5)
		{
			result = "$3.75";
		}
		else if (weight >= 5 && weight < 6)
		{
			result = "$3.75";
		}
		else if (weight >= 6 && weight < 7)
		{
			result = "$3.75";
		}
		else if (weight >= 7 && weight < 8)
		{
			result = "$3.75";
		}
		else if (weight >= 8 && weight < 9)
		{
			result = "$4.10";
		}
		else if (weight >= 9 && weight < 10)
		{
			result = "$4.45";
		}
		else if (weight >= 10 && weight < 11)
		{
			result = "$4.80";
		}
		else if (weight >= 11 && weight < 12)
		{
			result = "$5.15";
		}
		else if (weight >= 12 && weight < 13)
		{
			result = "$5.50";
		}
		else
		{
			result = "Error: Invalid Weight!";
		}	
	} else {
		// It would be best here to redirect to an "unknown operation"
		// error page or something similar.
	}
	
	var params = {weight: weight, mailClass: mailClass, result: result};
	
	res.render('pages/result', params);
			
}