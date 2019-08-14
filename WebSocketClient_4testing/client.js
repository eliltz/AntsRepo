const WebSocket = require('ws')
const url = 'ws://localhost:3000'
console.log('Trying to create a connection');
const connection = new WebSocket(url)
 
connection.onopen = () => {
  connection.send('Finished movement')
}
 
connection.onerror = (error) => {
  console.log(`WebSocket error: ${error}`)
}
 
connection.onmessage = (e) => {
  console.log(e.data)
}