const antsCmdRouter = require('./antsCmdRouter.js');
var bodyParser = require("body-parser");
const express = require('express'); 
const app = express(); 
const Joi = require('joi');
var http = require('http');
var path = require("path");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//app.use(expres.json());
const server = http.createServer(app);//create a server

app.use(express.static('pages'));

//require('./app/routes/ants.routes.js')(app);



//var expressWs = require('express-ws')(app,server);
const WebSocket = require('ws');
const wss = new WebSocket.Server({ server });

var clientsArr=[];
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

try {
	const schema = {
		//name: Joi.string().min(3).required()
			antCommandsArr : Joi.array().items(Joi.string().regex(/[rsf<>\d]/))
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
	 
	//************* For demo purposes 06.08.19 *******************************/
	let antCmdToSend = ant.antCommandsArr[0];
	var commandToSendToPhysicalAnt = antsCmdRouter.processCommand(ant.antCommandsArr[0]);
	console.log(`Will send ${antCmdToSend} to the ant`,)
	
	//wss.clients[0].
	let idOfAntToSend = req.params.id;
	try {
		if (clientsArr.length >= idOfAntToSend)
		{
			console.log(`Command To Send To Physical Ant: ${commandToSendToPhysicalAnt} to the ant`,)
			clientsArr[idOfAntToSend-1].send(commandToSendToPhysicalAnt);	
		}
	} catch (error) {
		console.log(error);
	}

	
	//   wss.clients.forEach(function each(client) {
	// 	  console.log(`Client -> ${client}`);
	//   });
	//************************************************************************/
		
} catch (error) {
		res.status(500).send(error);
		console.log(`Error! -> ${error} `,)
}

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


function noop() {}
function heartbeat() {
  this.isAlive = true;
}



wss.on('connection',function(ws,req){
	clientsArr.push(ws);
	console.log("")
	console.log(`Number of connected clients: ${wss.clients.size}`);
	console.log("Either Type Command or get it by the API:")
	//console.log("f/ b/ r/ l/ </ >/ s--> 0-9")
	var stdin = process.openStdin();
	stdin.addListener("data", function(d) {
		// note:  d is an object, and when converted to a string it will
		// end with a linefeed.  so we (rather crudely) account for that  
		// with toString() and then trim() 
		console.log("you entered: [" + 
			d.toString().trim() + "]");
			var strCmd = d.toString().trim();
			var commandToSend= antsCmdRouter.processCommand(strCmd);
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
		//clientsArr.pop(ws);
		console.log(`lost one client ${getCurrentDate()}`);
	});

	
	const ant = {
		id: antsClientsArr.length + 1, 
		connection: ws,
		//antCommandsArr : req.body.antCommandsArr
	};
	
	ws.send(`Hi new client!, you are client number ${wss.clients.size}`);
	console.log("");
	console.log(`New client connected ${getCurrentDate()}`);
});


console.log(`Starting server on port 3000 --> ${getCurrentDate()}`);
server.listen(3000);
//console.log("Type Command:")
//console.log("f/ b/ r/ l/ tr/ tl/ s--> 0-9")
var stdin = process.openStdin();
stdin.addListener("data", function(d) {
	console.log("you entered: [" + 
		d.toString().trim() + "]");
		var strCmd = d.toString().trim();
		if	(strCmd == "cmds") 
		{
			console.log("list of commands awaiting to be sent:")
			commandsArr.forEach(function(element, index) {
			console.log('%d: %s', index +1, element);
				
			});
		}
		else
		{
			var commandToSend= antsCmdRouter.processCommand(strCmd);
			commandsArr.push(commandToSend);
			console.log(commandToSend);
		}	
  });


function getCurrentDate(){
var today = new Date();
var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
var dateTime = date+' '+time;
return dateTime
  }