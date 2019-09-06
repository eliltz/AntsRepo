# AntsRepo

This NodeJs server is the access point to the physical ants.

There are two client.js files that can imitate the actual ants behaviour for most of the required tasks.

The NodeJs is loading a server which listens for both websocket incoming messages and also exposes a Rest API to receive command to be sent to the ants.

The Rest API was initially intended to recieve an array of commands and multiple steps at that, you might see some remains of that but the this is no longer supported since it is not fitting the use case.

In order to test the server and clients do the following:

1. Run command: "node index.js" -> Now the server is running and ready to receive both websocket clients and API requests.
2. cd into WebSocketClient_4testing folder and run command "node client.js"
   at this point, the client will send Hello to the server and and by consequence will be assigned an ID from the server. (AID_X)

Now the client is ready to receive commands, In order to send commands via the API use the following:

To call the API you have to of course replace the "localhost" with the ip of the computer running this server

Use GET with this URl--> http://localhost:3000/api/ants/ - > to get the ants currently connected.

		i.e : Get result when two ants are connected before sending any commands: 

		[
			{
				"id": 1,
				"name": "ant 1",
				"antCommandsArr": [
					"f5",
					"r",
					"f3"
				]
			},
			{
				"id": 2,
				"name": "ant 2",
				"antCommandsArr": [
					"f5",
					"r",
					"f3"
				]
			}
		]
Use PUT with this url  --> http://localhost:3000/api/ants/1 --> to update ant number 1, 2 for ant number two and so on.
Send This JSON body to update the ant command:

		{
			"antCommandsArr":  ["f1"]
		}


List of Commands:

--> "f1"  --> will tell the ant to go 1 step forward

--> "b1"  --> will tell the ant to go 1 step backwards

--> "r"  --> will tell the ant to turn right.

--> "l"  --> will tell the ant to turn left.

--> "s"  --> will tell the ant to stop.


The Ants and the clients which simulates them returns an indication to the server through the websocket. 
This indication is being printed to the console also.

The convention of the received indication is as follows:

The ant will return this message to indicate that the action has started. in this case, going forward.
"Started forward_SF"

and after the action is completed in the real ant or after 3.5 seconds in the simulation clients it will return: 
"Finished forward_FF"


Suffixes and thier meaning:
_SF     --> Started moving forward        
_FF		--> Finished moving forward

_SB     --> Started moving backwards        
_FB     --> Finished moving backwards      

_STR	--> Started Turning right  
_FTR	--> Finished Turning right  

_STL	--> Started Turning left  
_FTL	--> "Faster Than Light" :-) just kidding --> Finished Turning left  

_S	--> Stopped Ant 
 

			
That's it :()