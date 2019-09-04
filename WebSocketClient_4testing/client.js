const WebSocket = require('ws')
const url = 'ws://localhost:3000'
console.log('Trying to create a connection');
const connection = new WebSocket(url)

let antId ="";
console.log(antId);
connection.onopen = () => {
<<<<<<< HEAD
  connection.send('Hello Server');
=======
  connection.send('Message From Client ');
>>>>>>> 58a91d6898d21740eadc336e431863337359139e
}
 
connection.onerror = (error) => {
  console.log(`WebSocket error: ${error}`);
}
 
connection.onmessage = (e) => {
  if (e.data.includes("ANTID_")) {
    antId = e.data.substring(6);
    console.log(`Ant id:${antId}`);
  }
  console.log(e.data)
}