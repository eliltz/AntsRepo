const antsCmdRouter = require('./antsCmdRouter.js');
const fontColor = require('./consoleFontColors');
var bodyParser = require("body-parser");
const express = require('express'); 
const app = express(); 
const Joi = require('joi');
var http = require('http');
var path = require("path");
var util = require('util');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//app.use(expres.json());
const server = http.createServer(app);//create a server

app.use(express.static('pages'));


const WebSocket = require('ws');
const wss = new WebSocket.Server({ server });


let connectedClientsCounter = 0;
let antsIdsIndicator = 0;
//var clientsArr=[];
//, registrationTime :
var antsClientsArr = [
	{id: 1, name: 'ant1', antCommandsArr: ['f5','r','f3']
		},
	{id: 2, name: 'ant2', antCommandsArr: ['f2','l','f4']		
	}
];

let antsRobotsArr =[];


var AntRobot = {    
    init: function (id, name, wsc, wscIp, wscPort,antCommandsArr) {
        this.id = id;
		this.name = name;
		this.wsc = wsc;
		this.wscIp = wscIp;
		this.wscPort = wscPort;
		this.antCommandsArr = antCommandsArr;
    },
    
    describe: function () {
        var description = `Description <-*****-> Ant Id: ${this.id}, Ant Name: ${this.name}, Ant IP: ${this.wscIp}, Ant Port: ${this.wscPort}. Ant commands:${this.antCommandsArr}`;
        return description;
    }
};

//var commandsArr = [];

app.get('/api/ants/', (req, res) => {	
	console.log(antsRobotsArr);
	let custResponse =[];
	antsRobotsArr.forEach(e => { 
		custResponse.push({id :e.id, name: e.name, antCommandsArr: e.antCommandsArr});
	});		
	console.log(custResponse);		
	res.send(custResponse);
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
	// const schema = {
	// 	//name: Joi.string().min(3).required()
	// 		antCommandsArr : Joi.array().items(Joi.string().regex(/[rsf<>\d]/))
	// };
	// const ant = antsClientsArr.find(a=> a.id === parseInt(req.params.id));
	// if (!ant)
	// 	res.status(404).send("The ant with the given ID was not found.")		
	// const resultOfJoi = Joi.validate(req.body, schema);

	// if (resultOfJoi.error) {
	// 	res.status(400).send(resultOfJoi.error.details[0].message);
	// 	return;
	// }
	
	//ant.antCommandsArr = req.body.antCommandsArr;

	let antCommandArrayFromRequest =req.body.antCommandsArr;
	console.log(`antCommandArrayFromRequest=${antCommandArrayFromRequest}`);
	let idOfAntToSend = parseInt(req.params.id);//req.params.id;
	console.log(`idOfAntToSend=${idOfAntToSend}`);
	//res.send(ant);
	 
	//************* For demo purposes 06.08.19 *******************************/
	//let antCmdToSend = ant.antCommandsArr[0];
	//let antCmdToSend = antCommandArrayFromRequest;
//	var commandToSendToPhysicalAnt = antsCmdRouter.processCommand(ant.antCommandsArr[0]);
	// var commandToSendToPhysicalAnt = antsCmdRouter.processCommand(antCommandArrayFromRequest);
	// console.log(`Will send ${commandToSendToPhysicalAnt} to the ant`,)
	
	console.log("--->about to try to send the command: ")

	try {
		printConnectedAnts();
		const antRobotToSendCommandTo = antsRobotsArr.find(a=> a.id == idOfAntToSend);
		if (!antRobotToSendCommandTo) {
			console.warn(`Ant with the given ID (${idOfAntToSend}) was not found and cannot send command to it`);
			res.status(404).send("The ant with the given ID was not found.");	
		}
		else{
			//console.info(antRobotToSendCommandTo);
			antRobotToSendCommandTo.antCommandsArr = req.body.antCommandsArr;
			console.log("--->about to proccess command");
			var commandToSendToPhysicalAnt = antsCmdRouter.processCommand(antRobotToSendCommandTo.antCommandsArr[0]);
			console.log(`-->> returned from process command ${commandToSendToPhysicalAnt}`);
			//res.status(200).send(antRobotToSendCommandTo.antCommandsArr);
			console.info(`Sending ${commandToSendToPhysicalAnt} command To the physical Ant with the requested id (${idOfAntToSend}) -> ${antRobotToSendCommandTo.describe()}`);
			antRobotToSendCommandTo.wsc.send(commandToSendToPhysicalAnt);
		}	
	} catch (error) {
		console.error(error);
	}

		
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


function noop() {}
class heartbeat {
	constructor() {
		this.isAlive = true;
	}
}

function getIpv4Adress(address){

	template = /^:(ffff)?:(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|$)){4}$/;
	has_ipv4_version = template.test(address);
	if (has_ipv4_version)
		return address;
	else
		return address.replace(/^.*:/, '');

	
}

wss.on('connection',function(ws,req){	
	//clientsArr.push(ws);
	console.log(fontColor.getfontColor("Green"),"");
	connectedClientsCounter++;
	antsIdsIndicator++;
	var tempAnt = Object.create(AntRobot);	
	tempAnt.init(antsIdsIndicator, `ant ${antsIdsIndicator}`, ws, getIpv4Adress(req.connection.remoteAddress), req.connection._peername.port,['f5','r','f3']);
	console.log("")
	console.log(tempAnt.describe());
	//Send id to the ant.
	
	let connectionObj = req.connection;
	//console.log(connectionObj);
	antsRobotsArr.push(tempAnt);
	//console.log(`Number of connected clients: ${wss.clients.size}`);
	console.log("New Client is connected.")
	
	console.log(`Number of currently connected clients: ${connectedClientsCounter}`);
	
	printConnectedAnts();
	console.log(fontColor.getfontColor('Reset'));
	console.log("Either Type Command or get it by the API:")
	var stdin = process.openStdin();
	stdin.addListener("data", function(d) {
		
		console.log("you entered: [" + 
			d.toString().trim() + "]");
			var strCmd = d.toString().trim();
			if (strCmd=="i") {
				
			console.log(`---->Sending this ant id to the ant, on connection ${tempAnt.id}`);
			console.log(`---->AID_${tempAnt.id}`);
			ws.send(`AID_${tempAnt.id}`);
			}
			else
			{
			var commandToSend= antsCmdRouter.processCommand(strCmd);
			console.log(commandToSend);
		ws.send(commandToSend);
	}
		//ws.send(`AID_${tempAnt.id}`);
	  });

	//   console.log(`---->Sending this ant id to the ant, on connection ${tempAnt.id}`);
	// console.log(`---->AID_${tempAnt.id}`);
	// ws.send(`AID_${tempAnt.id}`);
	  
	ws.on('message',function(message){
		//const msg = JSON.parse(message); //TODO: what if the message is not a JSON?...
		console.log("this is a message from client: " + message);

		if (message.includes("Hello Server")) { //send the id on the first message from the client
			console.log(`---->Sending this ant id to the ant, on connection ${tempAnt.id}`);
			console.log(`---->AID_${tempAnt.id}`);
			ws.send(`AID_${tempAnt.id}`);
		}
	
		  
		if(message.toLowerCase().includes('finish')) {
			console.log('sending to server: ' + message);
			reportFinish(message);
		}
	
	});

const dgram = require('dgram');
function reportFinish(message) {
	let arr = message.split('_');
	let ant = 1;
	if((arr[arr.length-1] + '').includes('2')) ant = 2;
	if((arr[arr.length-1] + '').includes('3')) ant = 3;
    const client = dgram.createSocket('udp4');
    client.send('ANTS:FINISH_' + ant, 1337, 'localhost', (err) => {
        if (err != null) console.log('Err: ' + err);
            client.close();
    });
};
	

	ws.on('close', function(data,reasonCode, description){	
		console.log(fontColor.getfontColor("Magenta"),"");
		connectedClientsCounter--;	
		console.log(`-----------------------Lost one client -> ${getIpv4Adress(connectionObj.remoteAddress)}::${connectionObj._peername.port}-----------------------${getCurrentDate()}`);
		//(a.wscIp === connectionObj.remoteAddress &&
		const antRobotToRemove = antsRobotsArr.find(a=>  a.wscPort === connectionObj._peername.port );
		if (antRobotToRemove) {
			console.log("About to remove this ant:");
			console.log(antRobotToRemove.describe());
			antsRobotsArr.splice(antsRobotsArr.indexOf(antRobotToRemove),1);
		}
		else {
			console.log("AntRobot to remove not found");
		}
		console.log(fontColor.getfontColor('Reset'));		
		printConnectedAnts();
		
	});

	
	const ant = {
		id: antsClientsArr.length + 1, 
		connection: ws,
		//antCommandsArr : req.body.antCommandsArr
	};
	
	ws.send(`Hi new client!, you are client number ${connectedClientsCounter}`);
	console.log("");
	console.log(`New client connected ${getCurrentDate()}`);
	console.log(fontColor.getfontColor('Reset'));
});


console.log(`Starting server on port 3000 --> ${getCurrentDate()}`);
server.listen(3000);

function printConnectedAnts() {
	if (antsRobotsArr.length == 0) {
		console.log("There are no connected ants at this moment.")
	}
	else {
		console.log("These are the currently connected Ants:");
		for (let index = 0; index < antsRobotsArr.length; index++) {
			console.log(`${index + 1}. ${antsRobotsArr[index].describe()}`);
		}
	}
	console.log("");
}

function getCurrentDate(){
var today = new Date();
var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
var dateTime = date+' '+time;
return dateTime
  }