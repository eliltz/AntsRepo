const path = require('path');
const os = require('os');
const fs = require('fs');

// console.log(path.parse(__filename));
// console.log(`total uptime of this machine: ${os.uptime}` );


// fs.readdir('./',function(err,files){
// 	if(err) console.log(`Error while reading dir: ${err}`)
// 	else console.log('Result',files);
// });



function processCommand(input)
{
	var commandToSend ="";
	if (input.toUpperCase().startsWith("CF")) {
		var factor = input.substring(2);
		console.log(`Got factor: ${factor}`)
		commandToSend= `AF_CF_${factor}`;//"AC_CF_1.20"
		console.log(`Sending command to change factor: ${commandToSend}`);
		return commandToSend;
	}
	else
	{
			var strCmd = input;//d.toString().trim();
			var numOfSteps =strCmd.substring(1);
			console.log(`*number of steps from user: ${numOfSteps} *`)
			if (numOfSteps == "")
				{	
					numOfSteps="0"
				}
				console.log("numOfSteps: " +numOfSteps);
			switch(strCmd.substring(0,1))
			{
				case 'f':
							commandToSend ="AC_0_GF"
					break;		
					
				case 'b':
						commandToSend="AC_0_GB"
						break;

				case 'r':
						commandToSend="AC_0_TR"
						break;

				case 'l':
						commandToSend="AC_0_TL"
						break;
				case '<':
						commandToSend="AC_0_BTL"
						break;
				case '>':
						commandToSend="AC_0_BTR"
						break;

				case 's':
						commandToSend="AC_0_S"
						break;


			}
		}

			commandToSend = commandToSend.replace('0',numOfSteps);
			console.log("Sending " + commandToSend + " To the antBot");
			return commandToSend;

}



module.exports.processCommand = processCommand;