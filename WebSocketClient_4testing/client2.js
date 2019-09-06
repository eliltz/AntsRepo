const WebSocket = require('ws')
const url = 'ws://localhost:3000'
console.log('Trying to create a connection');
const connection = new WebSocket(url)

let antId ="";
console.log(antId);
connection.onopen = () => {
  connection.send('Hello Server');
}
 
connection.onerror = (error) => {
  console.log(`WebSocket error: ${error}`);
}
 
connection.onmessage = (e) => {
  if (e.data.includes("ANTID_")) {
    antId = e.data.substring(6);
    console.log(`Ant id:${antId}`);
  }

  
  if (e.data.includes("AC_")) {
    console.log("received command to move somewhere, trying to determine what command");
    let commandToGo = e.data.substring(5,7);
    console.log(`command to process:${commandToGo}`);
    switch(commandToGo)
    {
      case 'GF':
          sendFeedbackToServer("Started forward_SF", "Finished forward_FF");          
        break;		
        
      case 'GB':
          sendFeedbackToServer("Started backwards_SB", "Finished backwards_FB");        
          break;

      case 'TR':
          sendFeedbackToServer("Started turning right_STR", "Finished turning right_FTR");
          break;

      case 'TL':
          sendFeedbackToServer("Started turning left_STL","Finished turning left_FTL");
          break;    
      case 'S':
          connection.send("Stopped ant_SA");
          break;


    }
  }

  
  console.log(e.data)
}

function sendFeedbackToServer(initialMessage, endMessage){
  try {
    connection.send(initialMessage);
    setTimeout(function(){connection.send(endMessage)},3500);
  } catch (error) {
    console.log(error);
  }
 
}