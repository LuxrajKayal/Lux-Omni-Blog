/*
 * Lux Omni Blog — 404 brick-breaker game
 * The original 480 × 320 playfield and brick-breaker rules are retained.
 * Pointer coordinates are translated to the canvas's internal coordinate
 * space so mouse and touch controls remain accurate at responsive sizes.
 */
export function initBrickBreaker() {
  if (document.body.dataset.pageType !== "404") return;

  const canvas = document.querySelector("#gameCanvas");
  const currentScoreEl = document.querySelector("#current-score");
  const gameOverScreen = document.querySelector("#game-over");
  const finalScoreEl = document.querySelector("#final-score");
  const restartButton = document.querySelector("#restart-game");

  if (!canvas || !currentScoreEl || !gameOverScreen || !finalScoreEl || !restartButton) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const ballRadius = 6;
  const paddleHeight = 10;
  const paddleWidth = 75;
  const brickRowCount = 5;
  const brickColumnCount = 7;
  const brickWidth = 55;
  const brickHeight = 15;
  const brickPadding = 10;
  const brickOffsetTop = 40;
  const brickOffsetLeft = 15;
  const totalBricks = brickRowCount * brickColumnCount;

  let x = canvas.width / 2;
  let y = canvas.height - 30;
  let dx = 3;
  let dy = -3;
  let paddleX = (canvas.width - paddleWidth) / 2;
  let rightPressed = false;
  let leftPressed = false;
  let bricks = [];
  let score = 0;
  let bricksClearedThisRound = 0;
  let animationId = null;
  let isGameOver = false;

  let colors = {
    ball: "#FCA5A5",
    paddle: "#D97706",
    brickStroke: "rgba(252, 165, 165, 0.46)"
  };

  function readThemeColors() {
    const styles = window.getComputedStyle(canvas);
    colors = {
      ball: styles.getPropertyValue("--game-ball-color").trim() || colors.ball,
      paddle: styles.getPropertyValue("--game-paddle-color").trim() || colors.paddle,
      brickStroke: styles.getPropertyValue("--game-brick-stroke").trim() || colors.brickStroke
    };
  }

  // Read the active theme initially and whenever the shared theme switcher changes it.
  readThemeColors();
  const themeObserver = new MutationObserver(readThemeColors);
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"]
  });

  function clampPaddle() {
    paddleX = Math.max(0, Math.min(canvas.width - paddleWidth, paddleX));
  }

  function initBricks() {
    bricks = [];
    for (let column = 0; column < brickColumnCount; column += 1) {
      bricks[column] = [];
      for (let row = 0; row < brickRowCount; row += 1) {
        const brickX = brickOffsetLeft + column * (brickWidth + brickPadding);
        const brickY = brickOffsetTop + row * (brickHeight + brickPadding);
        bricks[column][row] = { x: brickX, y: brickY, status: 1 };
      }
    }
  }

  function updateScore() {
    currentScoreEl.textContent = String(score);
  }

  function endGame() {
    isGameOver = true;
    if (animationId !== null) cancelAnimationFrame(animationId);
    animationId = null;
    finalScoreEl.textContent = `Score: ${score}`;
    gameOverScreen.classList.add("visible");
    gameOverScreen.setAttribute("aria-hidden", "false");
    restartButton.focus({ preventScroll: true });
  }

  function initGame() {
    if (animationId !== null) cancelAnimationFrame(animationId);
    animationId = null;
    isGameOver = false;
    rightPressed = false;
    leftPressed = false;
    bricksClearedThisRound = 0;
    x = canvas.width / 2;
    y = canvas.height - 30;
    dx = 3;
    dy = -3;
    paddleX = (canvas.width - paddleWidth) / 2;
    score = 0;
    updateScore();
    gameOverScreen.classList.remove("visible");
    gameOverScreen.setAttribute("aria-hidden", "true");
    initBricks();
    if (document.activeElement === restartButton) {
      canvas.focus({ preventScroll: true });
    }
    draw();
  }

  function movePaddleTo(clientX) {
    const rect = canvas.getBoundingClientRect();
    if (rect.width <= 0) return;

    const canvasX = (clientX - rect.left) * (canvas.width / rect.width);
    paddleX = canvasX - paddleWidth / 2;
    clampPaddle();
  }

  function keyDownHandler(event) {
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
    }
    if (event.key === "ArrowRight") rightPressed = true;
    if (event.key === "ArrowLeft") leftPressed = true;
  }

  function keyUpHandler(event) {
    if (event.key === "ArrowRight") rightPressed = false;
    if (event.key === "ArrowLeft") leftPressed = false;
  }

  function pointerMoveHandler(event) {
    if (event.pointerType !== "mouse") event.preventDefault();
    movePaddleTo(event.clientX);
  }

  function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = colors.ball;
    ctx.shadowBlur = 10;
    ctx.shadowColor = colors.ball;
    ctx.fill();
    ctx.closePath();
    ctx.shadowBlur = 0;
  }

  function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = colors.paddle;
    ctx.shadowBlur = 15;
    ctx.shadowColor = colors.paddle;
    ctx.fill();
    ctx.closePath();
    ctx.shadowBlur = 0;
  }

  function drawBricks() {
    for (let column = 0; column < brickColumnCount; column += 1) {
      for (let row = 0; row < brickRowCount; row += 1) {
        const brick = bricks[column][row];
        if (brick.status !== 1) continue;

        ctx.beginPath();
        ctx.rect(brick.x, brick.y, brickWidth, brickHeight);
        const gradient = ctx.createLinearGradient(brick.x, brick.y, brick.x, brick.y + brickHeight);
        gradient.addColorStop(0, "rgba(255, 255, 255, 0.20)");
        gradient.addColorStop(1, "rgba(255, 255, 255, 0.05)");
        ctx.fillStyle = gradient;
        ctx.strokeStyle = colors.brickStroke;
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
      }
    }
  }

  function collisionDetection() {
    for (let column = 0; column < brickColumnCount; column += 1) {
      for (let row = 0; row < brickRowCount; row += 1) {
        const brick = bricks[column][row];
        if (brick.status !== 1) continue;

        if (
          x > brick.x && x < brick.x + brickWidth &&
          y > brick.y && y < brick.y + brickHeight
        ) {
          dy = -dy;
          brick.status = 0;
          score += 1;
          bricksClearedThisRound += 1;
          updateScore();

          // Keep the endless-round behaviour: reset the bricks and increase speed.
          if (bricksClearedThisRound === totalBricks) {
            initBricks();
            bricksClearedThisRound = 0;
            dx = Math.sign(dx) * (Math.abs(dx) + 0.5);
            dy = Math.sign(dy) * (Math.abs(dy) + 0.5);
          }
          return;
        }
      }
    }
  }

  function draw() {
    if (isGameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    collisionDetection();

    // Side walls and ceiling.
    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
      dx = -dx;
    }
    if (y + dy < ballRadius) {
      dy = -dy;
    } else if (y + dy > canvas.height - ballRadius) {
      if (x >= paddleX - ballRadius && x <= paddleX + paddleWidth + ballRadius) {
        const hitPoint = x - (paddleX + paddleWidth / 2);
        dx = hitPoint * 0.1;
        dy = -Math.abs(dy);
      } else {
        endGame();
        return;
      }
    }

    if (rightPressed) paddleX += 7;
    if (leftPressed) paddleX -= 7;
    clampPaddle();

    x += dx;
    y += dy;
    animationId = requestAnimationFrame(draw);
  }

  canvas.addEventListener("keydown", keyDownHandler);
  window.addEventListener("keyup", keyUpHandler);
  window.addEventListener("blur", () => {
    rightPressed = false;
    leftPressed = false;
  });

  canvas.addEventListener("pointerdown", event => {
    canvas.focus({ preventScroll: true });
    movePaddleTo(event.clientX);
    if (event.pointerType !== "mouse") {
      event.preventDefault();
      canvas.setPointerCapture?.(event.pointerId);
    }
  });
  canvas.addEventListener("pointermove", pointerMoveHandler, { passive: false });
  canvas.addEventListener("contextmenu", event => event.preventDefault());
  restartButton.addEventListener("click", initGame);

  initGame();
}