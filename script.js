/* ==========================================================================
   STATE MANAGEMENT & DOM ELEMENTS
   ========================================================================== */
const state = {
    gamesCompleted: 0,
    totalGames: 12,
    completedArray: new Array(12).fill(false),
    currentGameId: null,
    bgMode: 'normal',
    finaleStartTime: 0
};

const dom = {
    screens: document.querySelectorAll('.screen'),
    bgCanvas: document.getElementById('bg-canvas'),
    ctx: document.getElementById('bg-canvas').getContext('2d'),
    gameGrid: document.getElementById('game-grid'),
    progressFill: document.getElementById('progress-bar-fill'),
    progressText: document.getElementById('progress-text'),
    btnFinal: document.getElementById('btn-final-surprise'),
    btnBack: document.getElementById('btn-back-hub'),
    activeGameArea: document.getElementById('active-game-area'),
    activeGameTitle: document.getElementById('active-game-title'),
    winOverlay: document.getElementById('game-win-overlay'),
    btnWinCont: document.getElementById('btn-win-continue')
};

// Game Definitions
const gamesList = [
    { id: 1, title: "Catch My Love", icon: "❤️", desc: "Catch 10 falling hearts!" },
    { id: 2, title: "Balloon Blast", icon: "🎈", desc: "Pop 5 balloons." },
    { id: 3, title: "Make A Wish", icon: "🎂", desc: "Blow out the candles." },
    { id: 4, title: "Memory of Love", icon: "🧠", desc: "Match the pairs." },
    { id: 5, title: "Mystery Gifts", icon: "🎁", desc: "Find the secret box." },
    { id: 6, title: "Birthday Wheel", icon: "🎡", desc: "Spin for a prize." },
    { id: 7, title: "Firework Artist", icon: "🎇", desc: "Tap to create art." },
    { id: 8, title: "Save the Heart", icon: "💗", desc: "Catch 5 falling gifts." },
    { id: 9, title: "Build Her Cake", icon: "🧁", desc: "Assemble the cake." },
    { id: 10, title: "Heart Rush", icon: "⚡", desc: "Tap heart 20 times." },
    { id: 11, title: "Balloon Memory", icon: "🎈", desc: "Repeat sequence of 3." },
    { id: 12, title: "Heart Maze", icon: "🧩", desc: "Reach the gift." }
];

/* ==========================================================================
   INITIALIZATION
   ========================================================================== */
window.onload = () => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    initBackgroundCanvas();
    introSequence();
    buildGameGrid();
    setupEventListeners();
};

function setupEventListeners() {
    document.getElementById('btn-enter').addEventListener('click', () => {
        switchScreen('screen-hub');
    });
    
    dom.btnBack.addEventListener('click', () => {
        closeGame();
    });

    dom.btnWinCont.addEventListener('click', () => {
        dom.winOverlay.classList.add('hidden');
        closeGame();
    });

    dom.btnFinal.addEventListener('click', () => {
        if (!dom.btnFinal.classList.contains('locked')) {
            startLetterSequence();
        }
    });

    document.getElementById('btn-continue-finale').addEventListener('click', () => {
        startFinaleSequence(); // This triggers the 30-sec fireworks
    });
}

function switchScreen(screenId) {
    dom.screens.forEach(s => s.classList.remove('active', 'hidden'));
    dom.screens.forEach(s => {
        if (s.id !== screenId) s.classList.add('hidden');
        else s.classList.add('active');
    });
}

/* ==========================================================================
   INTRO SEQUENCE
   ========================================================================== */
function introSequence() {
    setTimeout(() => document.querySelector('.intro-heart').style.opacity = '1', 500);
    const texts = [
        document.getElementById('intro-text-1'),
        document.getElementById('intro-text-2'),
        document.getElementById('intro-text-3'),
        document.getElementById('intro-text-4'),
        document.getElementById('btn-enter')
    ];
    
    texts.forEach((el, index) => {
        setTimeout(() => {
            el.classList.add('visible');
        }, 1500 + (index * 1200));
    });
}

/* ==========================================================================
   HUB & PROGRESS LOGIC
   ========================================================================== */
function buildGameGrid() {
    dom.gameGrid.innerHTML = '';
    gamesList.forEach((game, index) => {
        const isCompleted = state.completedArray[index];
        const card = document.createElement('div');
        card.className = `game-card ${isCompleted ? 'completed' : ''}`;
        card.innerHTML = `
            <div class="game-icon">${game.icon}</div>
            <div class="game-title">${game.title}</div>
            <div class="game-status">${isCompleted ? 'COMPLETED' : 'PLAY'}</div>
        `;
        card.addEventListener('click', () => openGame(game.id));
        dom.gameGrid.appendChild(card);
    });
    updateProgress();
}

function updateProgress() {
    const percentage = Math.floor((state.gamesCompleted / state.totalGames) * 100);
    dom.progressFill.style.width = `${percentage}%`;
    dom.progressText.innerText = `${percentage}% Complete`;

    if (state.gamesCompleted >= state.totalGames) {
        dom.btnFinal.classList.remove('locked');
        dom.btnFinal.innerText = "OPEN THE SURPRISE ❤️";
    }
}

/* ==========================================================================
   GAME ENGINE LOADER
   ========================================================================== */
function openGame(id) {
    state.currentGameId = id;
    const gameInfo = gamesList.find(g => g.id === id);
    dom.activeGameTitle.innerText = `${gameInfo.title}`;
    dom.activeGameArea.innerHTML = ''; 
    
    switchScreen('screen-game');
    
    setTimeout(() => {
        loadGameLogic(id);
    }, 400);
}

function closeGame() {
    if(state.currentGameId) {
        state.currentGameId = null;
    }
    buildGameGrid();
    switchScreen('screen-hub');
}

function completeGame() {
    if (state.currentGameId) {
        const idx = state.currentGameId - 1;
        if (!state.completedArray[idx]) {
            state.completedArray[idx] = true;
            state.gamesCompleted++;
        }
    }
    // Small success burst on hub return
    for(let i=0; i<30; i++){
        explosions.push(createSimpleParticle(window.innerWidth/2, window.innerHeight/2, '#ec4899'));
    }
    dom.winOverlay.classList.remove('hidden');
}

/* ==========================================================================
   MINI-GAMES LOGIC (Completely Untouched & Fully Functional)
   ========================================================================== */
function loadGameLogic(id) {
    const area = dom.activeGameArea;
    area.innerHTML = ''; 

    switch(id) {
        case 1:
            let score1 = 0;
            area.innerHTML = `<div class="game-ui-text">Score: <span id="g1-score">0</span>/10</div>`;
            const g1Interval = setInterval(() => {
                if(state.currentGameId !== 1) { clearInterval(g1Interval); return; }
                const heart = document.createElement('div');
                heart.className = 'clickable-obj';
                heart.innerText = '❤️';
                heart.style.left = Math.random() * 80 + 10 + '%';
                heart.style.top = '-10%';
                heart.style.transition = 'top 3s linear';
                area.appendChild(heart);
                
                setTimeout(() => heart.style.top = '110%', 50);
                heart.onclick = () => {
                    score1++;
                    document.getElementById('g1-score').innerText = score1;
                    heart.remove();
                    if(score1 >= 10) { clearInterval(g1Interval); completeGame(); }
                };
                setTimeout(() => { if(heart.parentNode) heart.remove(); }, 3000);
            }, 800);
            break;

        case 2:
            let score2 = 0;
            area.innerHTML = `<div class="game-ui-text">Pop 5 Balloons!</div>`;
            for(let i=0; i<5; i++) {
                setTimeout(() => {
                    if(state.currentGameId !== 2) return;
                    const balloon = document.createElement('div');
                    balloon.className = 'clickable-obj';
                    balloon.innerText = '🎈';
                    balloon.style.left = Math.random() * 80 + 10 + '%';
                    balloon.style.top = Math.random() * 60 + 20 + '%';
                    area.appendChild(balloon);
                    balloon.onclick = () => {
                        balloon.innerText = '💥';
                        score2++;
                        setTimeout(() => balloon.remove(), 200);
                        if(score2 >= 5) completeGame();
                    };
                }, i * 500);
            }
            break;

        case 3:
            area.innerHTML = `
                <div class="game-ui-text">Tap flames to blow out candles</div>
                <div class="premium-cake-container">
                    <div class="candles-container" id="g3-candles">
                        <div class="candle"><div class="flame"></div></div>
                        <div class="candle"><div class="flame"></div></div>
                        <div class="candle"><div class="flame"></div></div>
                        <div class="candle"><div class="flame"></div></div>
                        <div class="candle"><div class="flame"></div></div>
                    </div>
                    <div class="cake-tier-top"><div class="cake-frosting"></div></div>
                    <div class="cake-tier-bottom"><div class="cake-frosting"></div></div>
                </div>
            `;
            let candlesLeft = 5;
            document.querySelectorAll('.candle').forEach(c => {
                c.onclick = () => {
                    const flame = c.querySelector('.flame');
                    if(!flame.classList.contains('extinguished')) {
                        flame.classList.add('extinguished');
                        candlesLeft--;
                        if(candlesLeft === 0) setTimeout(completeGame, 500);
                    }
                }
            });
            break;

        case 4:
            const symbols = ['❤️','🎂','🌸','🎁'];
            const deck = [...symbols, ...symbols].sort(() => Math.random() - 0.5);
            area.innerHTML = `<div class="memory-grid" id="g4-grid"></div>`;
            let firstCard = null;
            let matches = 0;
            deck.forEach(sym => {
                const c = document.createElement('div');
                c.className = 'memory-card hidden-card';
                c.innerText = sym;
                c.onclick = () => {
                    if(!c.classList.contains('hidden-card')) return;
                    c.classList.remove('hidden-card');
                    if(!firstCard) { firstCard = c; }
                    else {
                        if(firstCard.innerText === c.innerText) {
                            matches++;
                            firstCard = null;
                            if(matches === 4) setTimeout(completeGame, 500);
                        } else {
                            const fc = firstCard;
                            firstCard = null;
                            setTimeout(() => { fc.classList.add('hidden-card'); c.classList.add('hidden-card'); }, 600);
                        }
                    }
                };
                document.getElementById('g4-grid').appendChild(c);
            });
            break;

        case 5:
            area.innerHTML = `<div class="game-ui-text">Find the correct box!</div><div style="display:flex"></div>`;
            const container = area.querySelector('div:last-child');
            const correctBox = Math.floor(Math.random() * 3);
            for(let i=0; i<3; i++) {
                const box = document.createElement('div');
                box.className = 'gift-box';
                box.innerText = '🎁';
                box.onclick = () => {
                    if(i === correctBox) { box.innerText = '❤️'; setTimeout(completeGame, 500); }
                    else { box.innerText = '❌'; setTimeout(() => box.innerText = '🎁', 800); }
                };
                container.appendChild(box);
            }
            break;

        case 6:
            area.innerHTML = `
                <div class="wheel-container">
                    <div id="g6-result" style="font-size:3rem; margin-bottom:20px;">🎡</div>
                    <button id="g6-spin" class="premium-btn">SPIN</button>
                </div>
            `;
            document.getElementById('g6-spin').onclick = () => {
                const res = document.getElementById('g6-result');
                res.innerText = '🔄';
                setTimeout(() => {
                    const prizes = ['Unlimited Hugs', 'More Cake', 'Secret Surprise', 'Infinite Love'];
                    res.innerText = `🎁 ${prizes[Math.floor(Math.random()*prizes.length)]}`;
                    setTimeout(completeGame, 1500);
                }, 1000);
            };
            break;

        case 7:
            let clicks = 0;
            area.innerHTML = `<div class="game-ui-text">Tap anywhere 5 times to create fireworks</div><div id="g7-zone" style="width:100%; height:80%; border:2px dashed var(--glass-border); border-radius:10px;"></div>`;
            document.getElementById('g7-zone').onclick = (e) => {
                clicks++;
                for(let i=0; i<20; i++){
                    explosions.push(createSimpleParticle(e.clientX, e.clientY, '#8b5cf6'));
                }
                if(clicks >= 5) setTimeout(completeGame, 500);
            };
            break;

        case 8:
            let caught = 0;
            area.innerHTML = `<div class="game-ui-text">Move mouse/finger to catch 5 🎁! <br>Caught: <span id="g8-score">0</span></div>`;
            const h = document.createElement('div');
            h.innerText = '💗';
            h.style.position = 'absolute'; h.style.fontSize = '2rem'; h.style.bottom = '10%'; h.style.left = '50%';
            area.appendChild(h);
            
            area.onmousemove = (e) => { const rect = area.getBoundingClientRect(); h.style.left = (e.clientX - rect.left - 15) + 'px'; };
            area.ontouchmove = (e) => { const rect = area.getBoundingClientRect(); h.style.left = (e.touches[0].clientX - rect.left - 15) + 'px'; };

            const g8Interval = setInterval(() => {
                if(state.currentGameId !== 8) { clearInterval(g8Interval); return; }
                const g = document.createElement('div');
                g.innerText = '🎁'; g.style.position = 'absolute'; g.style.fontSize = '1.5rem';
                g.style.left = Math.random() * 90 + '%'; g.style.top = '0%'; g.style.transition = 'top 2s linear';
                area.appendChild(g);
                setTimeout(() => g.style.top = '100%', 50);
                
                const checkInterval = setInterval(() => {
                    if(!g.parentNode || state.currentGameId !== 8) { clearInterval(checkInterval); return; }
                    const hr = h.getBoundingClientRect(); const gr = g.getBoundingClientRect();
                    if(gr.bottom > hr.top && gr.top < hr.bottom && gr.right > hr.left && gr.left < hr.right) {
                        caught++; document.getElementById('g8-score').innerText = caught;
                        g.remove(); clearInterval(checkInterval);
                        if(caught >= 5) { clearInterval(g8Interval); completeGame(); }
                    }
                }, 100);
                setTimeout(() => { if(g.parentNode) g.remove(); clearInterval(checkInterval); }, 2000);
            }, 1000);
            break;

        case 9:
            area.innerHTML = `
                <div class="premium-cake-container" style="transform: scale(0.8)">
                    <div id="g9-t" class="cake-tier-top" style="opacity:0"><div id="g9-tf" class="cake-frosting" style="opacity:0"></div></div>
                    <div id="g9-b" class="cake-tier-bottom" style="opacity:0"><div id="g9-bf" class="cake-frosting" style="opacity:0"></div></div>
                </div>
                <div class="cake-builder-btns">
                    <button class="premium-btn small-btn" onclick="document.getElementById('g9-b').style.opacity=1; checkG9()">Base</button>
                    <button class="premium-btn small-btn" onclick="document.getElementById('g9-bf').style.opacity=1; checkG9()">Cream 1</button>
                    <button class="premium-btn small-btn" onclick="document.getElementById('g9-t').style.opacity=1; checkG9()">Top</button>
                    <button class="premium-btn small-btn" onclick="document.getElementById('g9-tf').style.opacity=1; checkG9()">Cream 2</button>
                </div>
            `;
            window.checkG9 = () => {
                if(document.getElementById('g9-b').style.opacity == 1 &&
                   document.getElementById('g9-bf').style.opacity == 1 &&
                   document.getElementById('g9-t').style.opacity == 1 &&
                   document.getElementById('g9-tf').style.opacity == 1) {
                    setTimeout(completeGame, 500);
                }
            };
            break;

        case 10:
            let taps = 0;
            area.innerHTML = `<div class="game-ui-text">Tap 20 times fast!</div><div id="g10-btn" style="font-size:4rem; cursor:pointer; user-select:none; transition:transform 0.1s;">💗</div>`;
            document.getElementById('g10-btn').onclick = function() {
                taps++;
                this.style.transform = `scale(${1 + (taps*0.02)})`;
                setTimeout(() => this.style.transform = 'scale(1)', 50);
                if(taps >= 20) completeGame();
            };
            break;

        case 11:
            const colors = ['🔴', '🟢', '🔵'];
            let seq = [colors[Math.floor(Math.random()*3)], colors[Math.floor(Math.random()*3)], colors[Math.floor(Math.random()*3)]];
            let usrSeq = [];
            area.innerHTML = `
                <div class="game-ui-text" id="g11-msg">Watch...</div>
                <div style="font-size:3rem; margin:20px 0;" id="g11-disp">👀</div>
                <div class="cake-builder-btns" id="g11-btns" style="pointer-events:none; opacity:0.5;">
                    <button class="premium-btn small-btn" onclick="g11Press('🔴')">🔴</button>
                    <button class="premium-btn small-btn" onclick="g11Press('🟢')">🟢</button>
                    <button class="premium-btn small-btn" onclick="g11Press('🔵')">🔵</button>
                </div>
            `;
            const disp = document.getElementById('g11-disp');
            setTimeout(() => { disp.innerText = seq[0]; }, 1000);
            setTimeout(() => { disp.innerText = seq[1]; }, 2000);
            setTimeout(() => { disp.innerText = seq[2]; }, 3000);
            setTimeout(() => { 
                disp.innerText = 'Your Turn!'; 
                document.getElementById('g11-btns').style.pointerEvents = 'auto'; 
                document.getElementById('g11-btns').style.opacity = '1';
                document.getElementById('g11-msg').innerText = 'Repeat sequence';
            }, 4000);
            
            window.g11Press = (c) => {
                usrSeq.push(c);
                disp.innerText = usrSeq.join(' ');
                if(usrSeq[usrSeq.length-1] !== seq[usrSeq.length-1]) {
                    disp.innerText = 'Wrong! Try again.';
                    usrSeq = []; setTimeout(() => openGame(11), 1000);
                } else if(usrSeq.length === 3) {
                    setTimeout(completeGame, 500);
                }
            };
            break;

        case 12:
            const mazeLayout = [
                0,0,1,0,0,
                0,1,1,0,1,
                0,0,0,0,0,
                1,1,1,1,0,
                0,0,0,0,2
            ];
            let pos = 0;
            area.innerHTML = `<div class="game-ui-text">Use arrows/buttons to reach 🎁</div><div class="maze-grid" id="g12-grid"></div>
            <div class="cake-builder-btns" style="margin-top:10px;">
                <button class="premium-btn small-btn" onclick="moveMaze(-5)">↑</button><br>
                <button class="premium-btn small-btn" onclick="moveMaze(-1)">←</button>
                <button class="premium-btn small-btn" onclick="moveMaze(1)">→</button><br>
                <button class="premium-btn small-btn" onclick="moveMaze(5)">↓</button>
            </div>`;
            const renderMaze = () => {
                const grid = document.getElementById('g12-grid');
                if(!grid) return;
                grid.innerHTML = '';
                for(let i=0; i<25; i++) {
                    const c = document.createElement('div');
                    c.className = 'maze-cell ' + (mazeLayout[i]===1 ? 'maze-wall' : '');
                    if(i === pos) c.innerText = '❤️';
                    else if(mazeLayout[i] === 2) c.innerText = '🎁';
                    grid.appendChild(c);
                }
            };
            window.moveMaze = (delta) => {
                const newPos = pos + delta;
                if(newPos >= 0 && newPos < 25 && mazeLayout[newPos] !== 1) {
                    if(delta === 1 && pos % 5 === 4) return;
                    if(delta === -1 && pos % 5 === 0) return;
                    pos = newPos;
                    renderMaze();
                    if(mazeLayout[pos] === 2) setTimeout(completeGame, 500);
                }
            };
            renderMaze();
            break;
    }
}

/* ==========================================================================
   LETTER & COMPLETELY FIXED FINALE SEQUENCES
   ========================================================================== */
function startLetterSequence() {
    switchScreen('screen-letter');
    state.bgMode = 'calm'; 
    
    const lines = document.querySelectorAll('.letter-line');
    lines.forEach((line, index) => {
        setTimeout(() => {
            line.classList.add('visible');
        }, 800 + (index * 1200));
    });

    setTimeout(() => {
        document.getElementById('btn-continue-finale').classList.remove('hidden');
    }, 800 + (lines.length * 1200) + 1000);
}

function startFinaleSequence() {
    switchScreen('screen-finale');
    
    // Activate the night sky background
    document.getElementById('night-sky-bg').classList.add('active');
    
    // Set system to finale mode and mark exactly when it started
    state.bgMode = 'finale';
    state.finaleStartTime = Date.now();
    
    const title = document.getElementById('finale-title');
    const sub1 = document.getElementById('finale-sub-1');
    const sub2 = document.getElementById('finale-sub-2');

    // Precisely schedule the text reveal during the 25-30 second Grand Finale window
    setTimeout(() => { title.classList.add('visible'); }, 25000);
    setTimeout(() => { sub1.classList.add('visible'); }, 27000);
    setTimeout(() => { sub2.classList.add('visible'); }, 29000);
}

/* ==========================================================================
   CANVAS SYSTEM & ADVANCED FIREWORKS PHYSICS ENGINE
   ========================================================================== */
let dreamyParticles = [];
let rockets = [];
let explosions = [];
let confettis = [];
let nightStars = [];
const fwColors = ['#ec4899', '#8b5cf6', '#c084fc', '#fbcfe8', '#ffffff', '#fbbf24', '#f472b6'];

function resizeCanvas() {
    dom.bgCanvas.width = window.innerWidth;
    dom.bgCanvas.height = window.innerHeight;
}

function initBackgroundCanvas() {
    state.bgMode = 'normal';
    // Setup initial calm particles
    for(let i=0; i<30; i++) dreamyParticles.push(createDreamyParticle());
    // Setup stars for finale background
    for(let i=0; i<150; i++) {
        nightStars.push({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            size: Math.random() * 1.5 + 0.5,
            alpha: Math.random()
        });
    }
    requestAnimationFrame(renderCanvas);
}

function createDreamyParticle() {
    return {
        x: Math.random() * dom.bgCanvas.width,
        y: Math.random() * dom.bgCanvas.height,
        size: Math.random() * 3 + 1,
        speedY: (Math.random() * 0.5) + 0.1,
        speedX: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.1,
        type: Math.random() > 0.8 ? 'heart' : 'circle'
    };
}

function createSimpleParticle(x, y, color) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 4 + 1;
    return {
        x: x, y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: color,
        alpha: 1,
        decay: Math.random() * 0.02 + 0.01,
        size: Math.random() * 2 + 1.5,
        gravity: 0.05,
        isSparkle: false
    };
}

/* --- THE FIREWORKS ENGINE --- */
function launchRocket() {
    const x = Math.random() * (dom.bgCanvas.width * 0.8) + (dom.bgCanvas.width * 0.1);
    const y = dom.bgCanvas.height + 10;
    const targetY = dom.bgCanvas.height * (Math.random() * 0.4 + 0.1);
    const vx = (Math.random() - 0.5) * 2;
    const vy = -(Math.random() * 4 + 8);
    const color = fwColors[Math.floor(Math.random() * fwColors.length)];
    // 25% chance for a heart-shaped firework
    const isHeart = Math.random() > 0.75; 
    rockets.push({ x, y, vx, vy, targetY, color, isHeart, trail: [] });
}

function spawnNormalExplosion(x, y, color) {
    const count = Math.random() * 40 + 40;
    for(let i=0; i<count; i++) {
        explosions.push(createSimpleParticle(x, y, color));
    }
}

function spawnHeartExplosion(x, y, color) {
    // Mathematical heart curve explosion
    for(let i=0; i<70; i++) {
        const t = (i / 70) * Math.PI * 2;
        const hx = 16 * Math.pow(Math.sin(t), 3);
        const hy = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
        
        explosions.push({
            x: x, y: y,
            vx: hx * 0.3, // Scale velocity mapping to shape
            vy: hy * 0.3,
            color: color,
            alpha: 1,
            decay: Math.random() * 0.015 + 0.01,
            size: Math.random() * 2 + 2,
            gravity: 0.02,
            isSparkle: true // Make hearts sparkle
        });
    }
}

function spawnConfetti() {
    confettis.push({
        x: Math.random() * dom.bgCanvas.width,
        y: -20,
        vx: (Math.random() - 0.5) * 3,
        vy: Math.random() * 2 + 3,
        size: Math.random() * 10 + 5,
        color: fwColors[Math.floor(Math.random() * fwColors.length)],
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.2
    });
}

function renderCanvas() {
    if (document.visibilityState !== 'visible') {
        requestAnimationFrame(renderCanvas);
        return;
    }

    const ctx = dom.ctx;
    ctx.clearRect(0, 0, dom.bgCanvas.width, dom.bgCanvas.height);

    if (state.bgMode === 'finale') {
        const elapsed = (Date.now() - state.finaleStartTime) / 1000;

        // 1. Draw Twinkling Stars
        ctx.fillStyle = '#ffffff';
        nightStars.forEach(s => {
            s.alpha += (Math.random() - 0.5) * 0.05;
            if(s.alpha < 0.1) s.alpha = 0.1;
            if(s.alpha > 0.8) s.alpha = 0.8;
            ctx.globalAlpha = s.alpha;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.size, 0, Math.PI*2);
            ctx.fill();
        });
        ctx.globalAlpha = 1.0;

        // 2. Timeline Launch Logic (0 to 30+ seconds)
        if (elapsed > 3 && elapsed < 35) { 
            let launchChance = 0;
            if (elapsed < 7) launchChance = 0.03;         // 3-7s: few fireworks
            else if (elapsed < 15) launchChance = 0.08;   // 7-15s: increasing
            else if (elapsed < 25) launchChance = 0.15;   // 15-25s: massive barrage
            else launchChance = 0.30;                     // 25-30s: Grand Finale intensity

            if (Math.random() < launchChance) launchRocket();

            // Start confetti continuously from 15 seconds onward
            if (elapsed > 15 && Math.random() < 0.4) {
                spawnConfetti();
                spawnConfetti();
            }
        }

        // 3. Render Rockets & Trails
        for (let i = rockets.length - 1; i >= 0; i--) {
            let r = rockets[i];
            r.x += r.vx;
            r.y += r.vy;
            r.vy += 0.04; // Rocket gravity

            r.trail.push({x: r.x, y: r.y});
            if (r.trail.length > 15) r.trail.shift();

            // Draw Trail
            ctx.beginPath();
            ctx.strokeStyle = r.color;
            ctx.lineWidth = 2.5;
            for(let j=0; j<r.trail.length; j++) {
                ctx.globalAlpha = j / r.trail.length;
                if(j===0) ctx.moveTo(r.trail[j].x, r.trail[j].y);
                else ctx.lineTo(r.trail[j].x, r.trail[j].y);
            }
            ctx.stroke();
            ctx.globalAlpha = 1.0;

            // Explode if reached apex or target height
            if (r.vy >= -1 || r.y <= r.targetY) {
                if (r.isHeart) spawnHeartExplosion(r.x, r.y, r.color);
                else spawnNormalExplosion(r.x, r.y, r.color);
                rockets.splice(i, 1);
            }
        }

        // 4. Render Explosions (Particles)
        for (let i = explosions.length - 1; i >= 0; i--) {
            let p = explosions[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += p.gravity;
            p.alpha -= p.decay;

            if (p.alpha <= 0) {
                explosions.splice(i, 1);
                continue;
            }

            ctx.globalAlpha = p.alpha;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
            ctx.fill();

            // Make hearts and special particles sparkle with a white center
            if (p.isSparkle && Math.random() > 0.5) {
                ctx.fillStyle = '#ffffff';
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size * 0.6, 0, Math.PI*2);
                ctx.fill();
            }
        }
        ctx.globalAlpha = 1.0;

        // 5. Render Confetti
        for (let i = confettis.length - 1; i >= 0; i--) {
            let c = confettis[i];
            c.x += c.vx;
            c.y += c.vy;
            c.rot += c.rotSpeed;

            if (c.y > dom.bgCanvas.height + 20) {
                confettis.splice(i, 1);
                continue;
            }

            ctx.save();
            ctx.translate(c.x, c.y);
            ctx.rotate(c.rot);
            ctx.fillStyle = c.color;
            ctx.fillRect(-c.size/2, -c.size/4, c.size, c.size/2);
            ctx.restore();
        }

    } else {
        // ==========================================
        // NORMAL / CALM MODE (Dreamy BG Elements)
        // ==========================================
        const pCount = state.bgMode === 'calm' ? 15 : 30;
        if(dreamyParticles.length > pCount) dreamyParticles.pop();
        if(dreamyParticles.length < pCount) dreamyParticles.push(createDreamyParticle());

        ctx.fillStyle = '#ffffff';
        dreamyParticles.forEach(p => {
            p.y -= p.speedY;
            p.x += p.speedX;
            if(p.y < -10) { p.y = dom.bgCanvas.height + 10; p.x = Math.random() * dom.bgCanvas.width; }
            
            ctx.globalAlpha = p.opacity;
            if(p.type === 'circle') {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            } else {
                ctx.font = `${p.size * 4}px Arial`;
                ctx.fillText('🌸', p.x, p.y); 
            }
        });
        ctx.globalAlpha = 1.0;
    }

    requestAnimationFrame(renderCanvas);
}