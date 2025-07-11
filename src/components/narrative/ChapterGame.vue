<template>
    <div class="snake-game-container">
      <div class="game-info">
        <div class="status-bar">
          <div class="status-item">File Recovery v1.0</div>
          <div class="status-item">Score: {{ score }}/{{ targetScore }}</div>
          <div class="status-item">Level: {{ currentLevel }}</div>
        </div>
        <div class="message-box" v-if="!gameStarted && !gameOver">
          <p>RecoverySoft Data Recovery</p>
          <p>Un virus a fragmenté vos données.</p>
          <p>Collectez {{ targetScore }} fragments pour récupérer le fichier.</p>
          <button @click="startGame" class="windows-button">Démarrer</button>
        </div>
      </div>
      
      <canvas v-show="gameStarted" ref="gameCanvas" width="300" height="300" class="snake-canvas"></canvas>
      
      <div v-if="gamePaused && !gameOver" class="pause-overlay">
        <div class="pause-menu">
          <h3>PAUSE</h3>
          <button @click="resumeGame" class="windows-button">Continuer</button>
        </div>
      </div>
      
      <div v-if="gameOver" class="game-over">
        <p>{{ gameWon ? 'Récupération réussie!' : 'Échec de récupération' }}</p>
        <p v-if="!gameWon">{{ score }}/{{ targetScore }} fragments</p>
        <button @click="resetGame" class="windows-button">{{ gameWon ? 'Continuer' : 'Réessayer' }}</button>
      </div>
      
      <div class="game-controls">
        <div class="controls-row">
          <button class="control-key" @click="handleDirectionClick('UP')">↑</button>
        </div>
        <div class="controls-row">
          <button class="control-key" @click="handleDirectionClick('LEFT')">←</button>
          <button class="control-key" @click="handleDirectionClick('DOWN')">↓</button>
          <button class="control-key" @click="handleDirectionClick('RIGHT')">→</button>
        </div>
        <button v-if="gameStarted && !gameOver" @click="togglePause" class="windows-button pause-button">
          {{ gamePaused ? 'Reprendre' : 'Pause' }}
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onBeforeUnmount } from 'vue';
  
  const emit = defineEmits(['success', 'failure']);
  
  const box = 15;
  const targetScore = 1;
  const speedByLevel = {
    1: 150,
    2: 130,
    3: 110,
    4: 90,
    5: 70
  };
  const colors = {
    background: "#333",
    snakeHead: "#32CD32",
    snakeBody: "#228B22",
    food: "#FF4500",
    obstacle: "#4682B4",
    border: "#000"
  };
  
  const gameCanvas = ref(null);
  let ctx = null;
  const snake = ref([{ x: 10 * box, y: 10 * box }]);
  const food = ref({
    x: Math.floor(Math.random() * 19 + 1) * box,
    y: Math.floor(Math.random() * 19 + 1) * box
  });
  const obstacles = ref([]);
  const score = ref(0);
  const currentLevel = ref(1);
  const direction = ref('');
  let gameInterval = null;
  const gameStarted = ref(false);
  const gamePaused = ref(false);
  const gameOver = ref(false);
  const gameWon = ref(false);
  
  onMounted(() => {
    ctx = gameCanvas.value.getContext('2d');
    window.addEventListener('keydown', handleKeyDown);
  });
  
  onBeforeUnmount(() => {
    if (gameInterval) {
      clearInterval(gameInterval);
    }
    window.removeEventListener('keydown', handleKeyDown);
  });
  
  function handleKeyDown(event) {
    if (gamePaused.value || gameOver.value) return;
    
    if([32, 37, 38, 39, 40].indexOf(event.keyCode) > -1) {
      event.preventDefault();
    }
    
    if (event.keyCode === 32) {
      togglePause();
      return;
    }
    
    if (!gameStarted.value) {
      startGame();
      return;
    }
    
    if (event.keyCode === 37 && direction.value !== "RIGHT") direction.value = "LEFT";
    else if (event.keyCode === 38 && direction.value !== "DOWN") direction.value = "UP";
    else if (event.keyCode === 39 && direction.value !== "LEFT") direction.value = "RIGHT";
    else if (event.keyCode === 40 && direction.value !== "UP") direction.value = "DOWN";
  }
  
  function handleDirectionClick(dir) {
    if (gamePaused.value || gameOver.value) return;
    
    if (!gameStarted.value) {
      startGame();
    }
    
    if (dir === "LEFT" && direction.value !== "RIGHT") direction.value = "LEFT";
    else if (dir === "UP" && direction.value !== "DOWN") direction.value = "UP";
    else if (dir === "RIGHT" && direction.value !== "LEFT") direction.value = "RIGHT";
    else if (dir === "DOWN" && direction.value !== "UP") direction.value = "DOWN";
  }
  
  function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
      if (head.x === array[i].x && head.y === array[i].y) {
        return true;
      }
    }
    return false;
  }
  
  function generateObstacles() {
    const obstacleCount = Math.min(currentLevel.value * 2, 8);
    obstacles.value = [];
    
    for (let i = 0; i < obstacleCount; i++) {
      let position;
      let valid = false;
      
      while (!valid) {
        position = {
          x: Math.floor(Math.random() * 19 + 1) * box,
          y: Math.floor(Math.random() * 19 + 1) * box
        };
        
        valid = !collision(position, snake.value) && 
               !(position.x === food.value.x && position.y === food.value.y);
      }
      
      obstacles.value.push(position);
    }
  }
  
  function draw() {
    if (!ctx) return;
    
    ctx.fillStyle = colors.background;
    ctx.fillRect(0, 0, gameCanvas.value.width, gameCanvas.value.height);
    
    for (let i = 0; i < obstacles.value.length; i++) {
      ctx.fillStyle = colors.obstacle;
      ctx.fillRect(obstacles.value[i].x, obstacles.value[i].y, box, box);
      
      ctx.strokeStyle = colors.border;
      ctx.strokeRect(obstacles.value[i].x, obstacles.value[i].y, box, box);
    }
    
    for (let i = 0; i < snake.value.length; i++) {
      ctx.fillStyle = (i === 0) ? colors.snakeHead : colors.snakeBody;
      ctx.fillRect(snake.value[i].x, snake.value[i].y, box, box);
      
      ctx.strokeStyle = colors.border;
      ctx.strokeRect(snake.value[i].x, snake.value[i].y, box, box);
    }
    
    ctx.fillStyle = colors.food;
    ctx.fillRect(food.value.x, food.value.y, box, box);
    
    ctx.strokeStyle = "#FFF";
    ctx.strokeRect(food.value.x, food.value.y, box, box);
    
    let snakeX = snake.value[0].x;
    let snakeY = snake.value[0].y;
    
    if (direction.value === "LEFT") snakeX -= box;
    if (direction.value === "UP") snakeY -= box;
    if (direction.value === "RIGHT") snakeX += box;
    if (direction.value === "DOWN") snakeY += box;
    
    if (snakeX === food.value.x && snakeY === food.value.y) {
      score.value++;
      
      let newFoodPosition;
      let valid = false;
      
      while (!valid) {
        newFoodPosition = {
          x: Math.floor(Math.random() * 19 + 1) * box,
          y: Math.floor(Math.random() * 19 + 1) * box
        };
        
        valid = !collision(newFoodPosition, snake.value) && 
               !collision(newFoodPosition, obstacles.value);
      }
      
      food.value = newFoodPosition;
      
      if (score.value % 5 === 0 && currentLevel.value < 5) {
        currentLevel.value++;
        generateObstacles();
        
        clearInterval(gameInterval);
        gameInterval = setInterval(draw, speedByLevel[currentLevel.value]);
      }
      
      if (score.value >= targetScore) {
        clearInterval(gameInterval);
        gameOver.value = true;
        gameWon.value = true;
        
        setTimeout(() => {
          emit('success');
        }, 1000);
        return;
      }
    } else {
      snake.value.pop();
    }
    
    const newHead = {
      x: snakeX,
      y: snakeY
    };
    
    if (
      snakeX < 0 || 
      snakeX >= gameCanvas.value.width || 
      snakeY < 0 || 
      snakeY >= gameCanvas.value.height || 
      collision(newHead, snake.value) ||
      collision(newHead, obstacles.value)
    ) {
      clearInterval(gameInterval);
      gameOver.value = true;
      
      setTimeout(() => {
        emit('failure');
      }, 1000);
      return;
    }
    
    snake.value.unshift(newHead);
  }
  
  function startGame() {
    gameStarted.value = true;
    gamePaused.value = false;
    gameOver.value = false;
    snake.value = [{ x: 10 * box, y: 10 * box }];
    score.value = 0;
    currentLevel.value = 1;
    direction.value = 'RIGHT';
    
    generateObstacles();
    
    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(draw, speedByLevel[currentLevel.value]);
  }
  
  function togglePause() {
    if (!gameStarted.value || gameOver.value) return;
    
    gamePaused.value = !gamePaused.value;
    
    if (gamePaused.value) {
      clearInterval(gameInterval);
    } else {
      gameInterval = setInterval(draw, speedByLevel[currentLevel.value]);
    }
  }
  
  function resumeGame() {
    if (gamePaused.value) {
      togglePause();
    }
  }
  
  function resetGame() {
    if (gameWon.value) {
      emit('success');
    } else {
      startGame();
    }
  }
  </script>
  
  <style scoped>
  .snake-game-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #f0f0f0;
    width: 100%;
    margin: 0 auto;
  }
  
  .game-header {
    display: none; 
  }
  
  .game-info {
    width: 100%;
    margin-bottom: 8px;
  }
  
  .status-bar {
    display: flex;
    justify-content: space-between;
    padding: 2px 4px;
    background-color: #c0c0c0;
    border: 1px solid #808080;
    box-shadow: inset 1px 1px 0px #fff, inset -1px -1px 0px #000;
    font-size: 11px;
  }
  
  .status-item {
    padding: 0 4px;
  }
  
  .message-box {
    background-color: #fff;
    border: 1px solid #000;
    padding: 8px;
    margin-top: 8px;
    margin-bottom: 8px;
    text-align: center;
    font-size: 12px;
  }
  
  .snake-canvas {
    border: 1px solid #000;
    background: #3d3d3d;
  }
  
  .game-over {
    margin-top: 12px;
    text-align: center;
    background-color: #fff;
    border: 1px solid #000;
    padding: 8px;
    width: 90%;
    font-size: 12px;
  }
  
  .pause-overlay {
    position: absolute;
    width: 300px;
    height: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.7);
    z-index: 10;
  }
  
  .pause-menu {
    background-color: #c0c0c0;
    padding: 12px;
    border: 2px solid #fff;
    text-align: center;
  }
  
  .game-controls {
    margin-top: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .controls-row {
    display: flex;
    margin-bottom: 2px;
  }
  
  .control-key {
    width: 24px;
    height: 24px;
    margin: 0 3px;
    background-color: #c0c0c0;
    border: 1px solid #808080;
    box-shadow: inset 1px 1px 0px #fff, inset -1px -1px 0px #000;
    font-weight: bold;
    cursor: pointer;
    font-size: 10px;
  }
  
  .control-key:active {
    box-shadow: inset -1px -1px 0px #fff, inset 1px 1px 0px #000;
  }
  
  .pause-button {
    margin-top: 6px;
    font-size: 11px;
  }
  
  .windows-button {
    padding: 2px 6px;
    background-color: #c0c0c0;
    border: 1px solid #808080;
    box-shadow: inset 1px 1px 0px #fff, inset -1px -1px 0px #000;
    cursor: pointer;
    font-size: 11px;
  }
  
  .windows-button:active {
    box-shadow: inset -1px -1px 0px #fff, inset 1px 1px 0px #000;
  }
  </style>