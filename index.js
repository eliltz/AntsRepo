//const antsRouter = require('./antsRouter.js');
var bodyParser = require("body-parser");
const express = require('express'); //express framework to have a higher level of methods
const app = express(); //assign app variable the express class/method
const Joi = require('joi');
var http = require('http');
var path = require("path");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//app.use(expres.json());
const server = http.createServer(app);//create a server

app.use(express.static('pages'));

//require('./app/routes/ants.routes.js')(app);



/**********************websocket setup**************************************************************************************/
//var expressWs = require('express-ws')(app,server);
const WebSocket = require('ws');
const wss = new WebSocket.Server({ server });

//, registrationTime :
var antsClientsArr = [
	{id: 1, name: 'ant1', antCommandsArr: [ 'f5','r','f3']
		},
	{id: 2, name: 'ant2', antCommandsArr: ['f2','l','f4']		
	}
];

var commandsArr = [];

//var commandsArrFrom

app.get('/api/ants/', (req, res) => {
	res.send(antsClientsArr);
});

app.get('/api/ants/:id', (req, res)=>{
	const ant = antsClientsArr.find(a=> a.id === parseInt(req.params.id));
	if (!ant)
		res.status(404).send("The ant with the given ID was not found.")		
	res.send(ant);
});


app.post('/api/ants', (req,res)=> {

	const schema = {
		name: Joi.string().min(3).required(),
		antCommandsArr : Joi.array().items(Joi.string().regex(/([fblr])\w+/))
	};

	const resultOfJoi = Joi.validate(req.body, schema);

	if (resultOfJoi.error) {
		res.status(400).send(resultOfJoi.error.details[0].message);
		return;
	}

	const ant = {
		id: antsClientsArr.length + 1, 
		name: req.body.name,
		antCommandsArr : req.body.antCommandsArr
	};
	antsClientsArr.push(ant);
	res.send(ant);
});


app.put('/api/ants/:id', (req, res) => {

	const schema = {
		//name: Joi.string().min(3).required()
			antCommandsArr : Joi.array().items(Joi.string().regex(/[rf\d]/))
	};
	const ant = antsClientsArr.find(a=> a.id === parseInt(req.params.id));
	if (!ant)
		res.status(404).send("The ant with the given ID was not found.")		
	const resultOfJoi = Joi.validate(req.body, schema);

	if (resultOfJoi.error) {
		res.status(400).send(resultOfJoi.error.details[0].message);
		return;
	}
	
	ant.antCommandsArr = req.body.antCommandsArr;
	res.send(ant);
});


// app.delete('/api/ants/:id', (req, res) => {

// 	const ant = antsClientsArr.find(a=> a.id === parseInt(req.params.id));
// 	if (!ant)
// 		res.status(404).send("The ant with the given ID was not found.")		
	
// 	ant.antCommandsArr = req.body.antCommandsArr;
// 	res.send(ant);
// });



//when browser sends get request, send html file to browser. viewed at http://localhost:30000
app.get('/cmds', function(req, res) {
	
	if (!commandsArr) {
		commandsArr.forEach(element => {
			console.log(element);				
		});
	}
});

app.get("/url", (req, res, next) => {
	res.json(["Tony","Lisa","Michael","Ginger","Food"]);
   });

function noop() {}
function heartbeat() {
  this.isAlive = true;
}



wss.on('connection',function(ws,req){
	//clientsArr.push(ws);
	console.log("Type Command:")
	console.log("f/ b/ r/ l/ tr/ tl/ s--> 0-9")
	var stdin = process.openStdin();
	stdin.addListener("data", function(d) {
		// note:  d is an object, and when converted to a string it will
		// end with a linefeed.  so we (rather crudely) account for that  
		// with toString() and then trim() 
		console.log("you entered: [" + 
			d.toString().trim() + "]");
			var strCmd = d.toString().trim();
			var commandToSend= processCommand(strCmd);
			console.log(commandToSend);
		ws.send(commandToSend);
	  });
	ws.on('message',function(message){
		//const msg = JSON.parse(message); //TODO: what if the message is not a JSON?...
		console.log("this is a message from client: " + message);
		//ws.send('GF');
		
		//ws.send("Server: got message: '" + message + "'"); //send to client where message is from
	});
	

	ws.on('close', function(){
		console.log("lost one client");
	});

	
	ws.send("hi new client!");
	console.log("new client connected");
});

console.log("Starting server on port 3000");
server.listen(3000);
console.log("Type Command:")
console.log("f/ b/ r/ l/ tr/ tl/ s--> 0-9")
var stdin = process.openStdin();
stdin.addListener("data", function(d) {
	console.log("you entered: [" + 
		d.toString().trim() + "]");
		var strCmd = d.toString().trim();
		if	(strCmd == "cmds") 
		{
			console.log("list of commands waiting to be sent:")
			commandsArr.forEach(function(element, index) {
			console.log('%d: %s', index +1, element);
				
			});
		}
		else
		{
			var commandToSend= antsRouter.processCommand(strCmd);
			commandsArr.push(commandToSend);
			console.log(commandToSend);
		}	
  });