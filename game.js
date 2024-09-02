const socket = io();

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

let players = {};
let artifact = { x: 400, y: 300 };

socket.on('updateState', (gameState) => {
    players = gameState.players;
    artifact = gameState.artifact;
    drawGame();
});

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Artifact
    ctx.fillStyle = 'gold';
    ctx.beginPath();
    ctx.arc(artifact.x, artifact.y, 10, 0, 2 * Math.PI);
    ctx.fill();

    // Draw Players
    for (let id in players) {
        const player = players[id];
        ctx.fillStyle = player.color;
        ctx.beginPath();
        ctx.arc(player.x, player.y, 15, 0, 2 * Math.PI);
        ctx.fill();
    }
}

document.addEventListener('keydown', (event) => {
    let move;
    switch (event.key) {
        case 'ArrowUp': move = { x: 0, y: -5 }; break;
        case 'ArrowDown': move = { x: 0, y: 5 }; break;
        case 'ArrowLeft': move = { x: -5, y: 0 }; break;
        case 'ArrowRight': move = { x: 5, y: 0 }; break;
    }
    if (move) {
        socket.emit('movePlayer', move);
    }
});

socket.on('statusUpdate', (status) => {
    document.getElementById('status').textContent = status;
});
