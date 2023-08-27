
// Create a WebSocket server
const WebSocket = require('ws');

// Create a WebSocket server with CORS enabled
const wss = new WebSocket.Server({
    port: 8080,
    // Enable CORS
    // Note: In a production environment, you should specify only the origins you trust
    // to avoid potential security risks.
    verifyClient: (info, done) => {
        // Allow connections from any origin (for demonstration purposes)
        done(true);
    }
});


// Event listener for when a client connects
wss.on('connection', (ws) => {
    console.log('Client connected');

    // Event listener for messages from clients
    ws.on('message', (message) => {
        console.log(`Received message: ${message}`);
        // You can broadcast this message to other connected clients if needed
    });

    // Event listener for when a client disconnects
    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

console.log('WebSocket server started on port 8080');


