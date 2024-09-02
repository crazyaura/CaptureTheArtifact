const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

let players = {};
let artifact = { x: 400, y: 300 };

io.on('connection', (socket) => {
    console.log('New player connected:', socket.id);

    // Initialize player
    players[socket.id] = {
        x: Math.random() * 800,
        y: Math.random() * 600,
        color: getRandomColor(),
    };

    // Send updated game state to all clients
    io.emit('updateState', { players, artifact });

    // Handle player movement
    socket.on('movePlayer', (move) => {
        const player = players[socket.id];
        if (player) {
            player.x += move.x;
            player.y += move.y;

            // Check if player reached artifact
            if (Math.hypot(player.x - artifact.x, player.y - artifact.y) < 20) {
                artifact = { x: Math.random() * 800, y: Math.random() * 600 }; // Relocate artifact
                io.emit('statusUpdate', `${socket.id} captured the artifact!`);
            }

            // Send updated game state
            io.emit('updateState', { players, artifact });
        }
    });

    // Handle player disconnect
    socket.on('disconnect', () => {
        console.log('Player disconnected:', socket.id);
        delete players[socket.id];
        io.emit('updateState', { players, artifact });
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
