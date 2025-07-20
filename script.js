document.addEventListener('DOMContentLoaded', () => {

    // --- General Scene Management ---
    const scenes = {
        catchButton: document.getElementById('catch-button-game'),
        letter: document.getElementById('letter-modal'),
        constellation: document.getElementById('constellation-game'),
        wishingJar: document.getElementById('wishing-jar-scene'),
        navigation: document.getElementById('project-navigation'),
        ballGame: document.getElementById('ball-game-container'),
        garden: document.getElementById('garden-container'),
    };

    let currentScene = 'catchButton';

    function showScene(sceneName) {
        const oldScene = scenes[currentScene];
        const newScene = scenes[sceneName];

        if (oldScene) {
            oldScene.classList.add('fade-out');
            setTimeout(() => {
                oldScene.classList.add('hidden');
                oldScene.classList.remove('fade-out');
            }, 500);
        }

        if (newScene) {
            setTimeout(() => {
                newScene.classList.remove('hidden');
                currentScene = sceneName;
            }, 500);
        }
    }

    // --- PROJECT 1: GIFT CARD LOGIC ---

    // Scene 1: Catch the Button
    const catchButton = document.getElementById('catch-button');
    let tapCount = 0;
    const tapsNeeded = Math.floor(Math.random() * 3) + 5; // 5 to 7 taps

    catchButton.addEventListener('click', () => {
        tapCount++;
        if (tapCount >= tapsNeeded) {
            showScene('letter');
        } else {
            const gameArea = scenes.catchButton;
            const btnWidth = catchButton.offsetWidth;
            const btnHeight = catchButton.offsetHeight;
            const newTop = Math.random() * (gameArea.clientHeight - btnHeight);
            const newLeft = Math.random() * (gameArea.clientWidth - btnWidth);
            catchButton.style.top = `${newTop}px`;
            catchButton.style.left = `${newLeft}px`;
            catchButton.style.transform = `translate(0, 0)`; // Reset transform for absolute positioning
        }
    });

    // Scene 2: Letter Modal
    document.getElementById('close-letter').addEventListener('click', () => {
        showScene('constellation');
        initConstellationGame();
    });

    // Scene 3: Constellation Puzzle
    const constellationGame = scenes.constellation;
    const drawingCanvas = document.getElementById('drawing-canvas');
    const drawingCtx = drawingCanvas.getContext('2d');
    const bgCanvas = document.getElementById('constellation-bg-canvas');
    const bgCtx = bgCanvas.getContext('2d');
    const messageEl = document.getElementById('constellation-message');
    const nextBtnConstellation = document.getElementById('next-from-constellation');
    let stars = [];
    let clickedStars = [];
    const correctOrder = [2, 0, 3, 1];
    let decorativeStars = [];

    function initConstellationGame() {
        bgCanvas.width = window.innerWidth;
        bgCanvas.height = window.innerHeight;
        drawingCanvas.width = window.innerWidth;
        drawingCanvas.height = window.innerHeight;

        // Create decorative stars for the background
        decorativeStars = [];
        for (let i = 0; i < 150; i++) {
            decorativeStars.push({
                x: Math.random() * bgCanvas.width,
                y: Math.random() * bgCanvas.height,
                radius: Math.random() * 1.5,
                alpha: Math.random()
            });
        }
        
        // Remove old interactive stars if they exist
        constellationGame.querySelectorAll('.star').forEach(el => el.remove());
        stars = [];
        clickedStars = [];
        messageEl.style.opacity = '0';
        nextBtnConstellation.classList.add('hidden');
        drawingCtx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);

        // Define main interactive star positions
        const starPositions = [
            { top: '30%', left: '70%' }, { top: '75%', left: '60%' },
            { top: '25%', left: '20%' }, { top: '60%', left: '30%' },
        ];

        starPositions.forEach((pos, i) => {
            const starEl = document.createElement('div');
            starEl.className = 'star';
            starEl.style.top = pos.top;
            starEl.style.left = pos.left;
            starEl.dataset.id = i;
            constellationGame.appendChild(starEl);
            stars.push(starEl);
            starEl.addEventListener('click', handleStarClick);
        });

        animateConstellationBg();
    }

    function handleStarClick(e) {
        const star = e.target;
        const starId = parseInt(star.dataset.id);
        if (clickedStars.includes(star)) return;

        const lastStar = clickedStars[clickedStars.length - 1];
        clickedStars.push(star);
        star.style.transform = 'scale(1.5)'; // Highlight clicked star

        drawingCtx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
        drawingCtx.lineWidth = 3;
        drawingCtx.shadowBlur = 10;
        drawingCtx.shadowColor = '#fff';

        if (lastStar) {
            drawingCtx.beginPath();
            drawingCtx.moveTo(lastStar.offsetLeft + 10, lastStar.offsetTop + 10);
            drawingCtx.lineTo(star.offsetLeft + 10, star.offsetTop + 10);
            drawingCtx.stroke();
        }

        // Check if the sequence is correct
        const clickedOrder = clickedStars.map(s => parseInt(s.dataset.id));
        for (let i = 0; i < clickedOrder.length; i++) {
            if (clickedOrder[i] !== correctOrder[i]) {
                // Wrong order, reset
                setTimeout(() => {
                    drawingCtx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
                    clickedStars.forEach(s => s.style.transform = 'scale(1)');
                    clickedStars = [];
                }, 800);
                return;
            }
        }

        if (clickedOrder.length === correctOrder.length) {
            messageEl.innerHTML = "You have a kind of beauty that isn’t just in the way you look...";
            messageEl.style.opacity = '1';
            nextBtnConstellation.classList.remove('hidden');
        }
    }

    function animateConstellationBg() {
        bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
        bgCtx.fillStyle = 'white';
        decorativeStars.forEach(star => {
            star.alpha += (Math.random() - 0.5) * 0.1;
            if (star.alpha < 0) star.alpha = 0;
            if (star.alpha > 1) star.alpha = 1;
            bgCtx.globalAlpha = star.alpha;
            bgCtx.beginPath();
            bgCtx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            bgCtx.fill();
        });
        requestAnimationFrame(animateConstellationBg);
    }
    
    nextBtnConstellation.addEventListener('click', () => showScene('wishingJar'));

    // Scene 4: Wishing Jar
    const wishInput = document.getElementById('wish-input');
    const submitWishBtn = document.getElementById('submit-wish');
    const jarContainer = document.getElementById('jar-container');
    const nextFromWishBtn = document.getElementById('next-from-wish');

    submitWishBtn.addEventListener('click', () => {
        if (wishInput.value.trim() === '') return;

        const orb = document.createElement('div');
        orb.className = 'wish-orb';
        orb.style.top = '-30px';
        orb.style.left = `${Math.random() * 80 + 10}%`; // Random horizontal position
        jarContainer.appendChild(orb);

        // Animate orb dropping
        setTimeout(() => {
            orb.style.top = `${Math.random() * 30 + 60}%`; // Settle at a random position in the jar
            orb.style.left = `${Math.random() * 60 + 20}%`;
        }, 100);

        wishInput.value = '';
        nextFromWishBtn.classList.remove('hidden');
    });

    nextFromWishBtn.addEventListener('click', () => showScene('navigation'));


    // --- NAVIGATION LOGIC ---
    document.getElementById('show-game-btn').addEventListener('click', () => {
        showScene('ballGame');
        initBallGame();
    });
    document.getElementById('show-garden-btn').addEventListener('click', () => showScene('garden'));
    document.getElementById('back-to-nav-from-game').addEventListener('click', () => {
        // Stop the game loop before switching
        if(animationFrameId) cancelAnimationFrame(animationFrameId);
        showScene('navigation');
    });
    document.getElementById('back-to-nav-from-garden').addEventListener('click', () => showScene('navigation'));


    // --- PROJECT 2: BOUNCING BALL GAME ---
    const gameCanvas = document.getElementById('game-canvas');
    const gameCtx = gameCanvas.getContext('2d');
    let ball, paddle, score, gameOver, animationFrameId;

    function initBallGame() {
        score = 0;
        gameOver = false;
        document.getElementById('back-to-nav-from-game').classList.add('hidden');

        paddle = {
            x: gameCanvas.width / 2 - 40,
            y: gameCanvas.height - 20,
            width: 80,
            height: 10,
            color: '#2c3e50'
        };

        ball = {
            x: gameCanvas.width / 2,
            y: gameCanvas.height / 2,
            radius: 8,
            speed: 3,
            dx: 2,
            dy: -2,
            color: '#e74c3c'
        };
        
        if(animationFrameId) cancelAnimationFrame(animationFrameId);
        gameLoop();
    }

    function drawBall() {
        gameCtx.beginPath();
        gameCtx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        gameCtx.fillStyle = ball.color;
        gameCtx.fill();
        gameCtx.closePath();
    }

    function drawPaddle() {
        gameCtx.beginPath();
        gameCtx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
        gameCtx.fillStyle = paddle.color;
        gameCtx.fill();
        gameCtx.closePath();
    }
    
    function drawScore() {
        gameCtx.font = '16px Quicksand';
        gameCtx.fillStyle = '#333';
        gameCtx.fillText('Score: ' + score, 8, 20);
    }

    function movePaddle(event) {
        event.preventDefault();
        const rect = gameCanvas.getBoundingClientRect();
        let mouseX = event.clientX || event.touches[0].clientX;
        paddle.x = mouseX - rect.left - paddle.width / 2;
        if (paddle.x < 0) paddle.x = 0;
        if (paddle.x + paddle.width > gameCanvas.width) paddle.x = gameCanvas.width - paddle.width;
    }

    gameCanvas.addEventListener('mousemove', movePaddle);
    gameCanvas.addEventListener('touchmove', movePaddle, { passive: false });

    function gameLoop() {
        if (gameOver) {
            gameCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
            gameCtx.font = '30px Playfair Display';
            gameCtx.fillStyle = '#e74c3c';
            gameCtx.textAlign = 'center';
            gameCtx.fillText('Game Over', gameCanvas.width / 2, gameCanvas.height / 2 - 20);
            gameCtx.font = '20px Quicksand';
            gameCtx.fillText(`Final Score: ${score}`, gameCanvas.width / 2, gameCanvas.height / 2 + 20);
            gameCtx.textAlign = 'start'; // Reset alignment
            document.getElementById('back-to-nav-from-game').classList.remove('hidden');
            return;
        }

        gameCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
        drawBall();
        drawPaddle();
        drawScore();

        ball.x += ball.dx;
        ball.y += ball.dy;

        // Wall collision (left/right)
        if (ball.x + ball.radius > gameCanvas.width || ball.x - ball.radius < 0) {
            ball.dx *= -1;
        }
        // Wall collision (top)
        if (ball.y - ball.radius < 0) {
            ball.dy *= -1;
        }
        // Paddle collision
        if (ball.y + ball.radius > paddle.y && ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
            ball.dy *= -1;
            score++;
            // Increase speed slightly
            if (score % 5 === 0) {
               ball.dy > 0 ? ball.dy += 0.2 : ball.dy -= 0.2;
               ball.dx > 0 ? ball.dx += 0.2 : ball.dx -= 0.2;
            }
        }
        // Ball misses paddle
        if (ball.y + ball.radius > gameCanvas.height) {
            gameOver = true;
        }
        
        animationFrameId = requestAnimationFrame(gameLoop);
    }


    // --- PROJECT 3: GARDEN OF COMPLIMENTS ---
    const flowers = document.querySelectorAll('.flower');
    flowers.forEach(flower => {
        flower.addEventListener('click', () => {
            flower.classList.toggle('bloom');
        });
    });

    // --- Initial Setup ---
    showScene('catchButton'); // Start with the first scene
});
