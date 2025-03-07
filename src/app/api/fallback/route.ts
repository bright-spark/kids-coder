
import { NextResponse } from 'next/server';

const FALLBACK_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Simple Game - Kids Coder</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body {
            font-family: 'Comic Sans MS', cursive, sans-serif;
            background-color: #f0f8ff;
            padding: 20px;
        }
        .game-container {
            max-width: 800px;
            margin: 0 auto;
            background-color: white;
            padding: 20px;
            border-radius: 15px;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
        }
        h1 {
            color: #ff6b6b;
            text-align: center;
            margin-bottom: 30px;
        }
        .btn-primary {
            background-color: #5f27cd;
            border: none;
        }
        .btn-primary:hover {
            background-color: #4834d4;
        }
        #game-area {
            height: 400px;
            background-color: #f9f9f9;
            border-radius: 10px;
            margin-bottom: 20px;
            position: relative;
            overflow: hidden;
        }
        .character {
            position: absolute;
            width: 50px;
            height: 50px;
            background-color: #ff6b6b;
            border-radius: 50%;
            bottom: 20px;
            left: 375px;
            transition: left 0.2s;
        }
        .target {
            position: absolute;
            width: 30px;
            height: 30px;
            background-color: #5f27cd;
            border-radius: 5px;
            top: -30px;
        }
        #score {
            font-size: 24px;
            font-weight: bold;
            color: #5f27cd;
        }
        .instructions {
            margin-top: 20px;
            padding: 15px;
            background-color: #e3f2fd;
            border-radius: 10px;
        }
    </style>
</head>
<body>
    <div class="container game-container">
        <h1>📱 Catch the Blocks Game 📱</h1>
        
        <div id="game-area">
            <div class="character" id="player"></div>
        </div>
        
        <div class="row mb-4">
            <div class="col-6">
                <button id="start-btn" class="btn btn-primary w-100">Start Game</button>
            </div>
            <div class="col-6 text-end">
                <div>Score: <span id="score">0</span></div>
            </div>
        </div>
        
        <div class="instructions">
            <h4>How to Play:</h4>
            <p>1. Press the Start button to begin the game</p>
            <p>2. Use the LEFT and RIGHT arrow keys to move the character</p>
            <p>3. Catch the falling blocks to earn points</p>
            <p>4. If you miss 3 blocks, the game is over!</p>
        </div>
    </div>

    <script>
        // Game variables
        let player;
        let gameArea;
        let score = 0;
        let isGameRunning = false;
        let misses = 0;
        let targets = [];
        let gameLoop;

        // Initialize the game
        window.onload = function() {
            player = document.getElementById('player');
            gameArea = document.getElementById('game-area');
            document.getElementById('start-btn').addEventListener('click', startGame);
            document.addEventListener('keydown', movePlayer);
        };

        // Start the game
        function startGame() {
            if (isGameRunning) return;
            
            // Reset game state
            score = 0;
            misses = 0;
            targets.forEach(target => target.remove());
            targets = [];
            document.getElementById('score').textContent = score;
            
            isGameRunning = true;
            document.getElementById('start-btn').textContent = 'Game Running...';
            
            // Start creating targets
            gameLoop = setInterval(createTarget, 1000);
        }

        // Create a new falling target
        function createTarget() {
            const target = document.createElement('div');
            target.className = 'target';
            
            // Random position
            const randomX = Math.floor(Math.random() * (gameArea.offsetWidth - 30));
            target.style.left = randomX + 'px';
            
            gameArea.appendChild(target);
            targets.push(target);
            
            // Animate the target falling
            let posY = -30;
            const targetFall = setInterval(() => {
                posY += 5;
                target.style.top = posY + 'px';
                
                // Check for collision with player
                if (isColliding(player, target)) {
                    clearInterval(targetFall);
                    target.remove();
                    targets = targets.filter(t => t !== target);
                    score += 10;
                    document.getElementById('score').textContent = score;
                }
                
                // Check if target reached bottom
                if (posY > gameArea.offsetHeight) {
                    clearInterval(targetFall);
                    target.remove();
                    targets = targets.filter(t => t !== target);
                    misses++;
                    
                    if (misses >= 3) {
                        endGame();
                    }
                }
            }, 50);
        }

        // Move the player
        function movePlayer(event) {
            if (!isGameRunning) return;
            
            const playerPos = parseInt(player.style.left || '375');
            const step = 20;
            
            if (event.key === 'ArrowLeft' && playerPos > 0) {
                player.style.left = (playerPos - step) + 'px';
            } else if (event.key === 'ArrowRight' && playerPos < gameArea.offsetWidth - player.offsetWidth) {
                player.style.left = (playerPos + step) + 'px';
            }
        }

        // Check collision between two elements
        function isColliding(element1, element2) {
            const rect1 = element1.getBoundingClientRect();
            const rect2 = element2.getBoundingClientRect();
            
            return !(rect1.right < rect2.left || 
                     rect1.left > rect2.right || 
                     rect1.bottom < rect2.top || 
                     rect1.top > rect2.bottom);
        }

        // End the game
        function endGame() {
            isGameRunning = false;
            clearInterval(gameLoop);
            document.getElementById('start-btn').textContent = 'Start New Game';
            alert(`Game Over! Your score: ${score}`);
        }
    </script>
</body>
</html>`;

export async function GET() {
  return NextResponse.json({
    code: FALLBACK_HTML
  });
}
