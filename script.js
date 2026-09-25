/* ==========================================================================
   STATE MANAGEMENT & DOM ELEMENTS
   ========================================================================== */
const state = {
    gamesCompleted: 0,
    totalGames: 12,
    completedArray: new Array(12).fill(false),
    currentGameId: null,
    bgMode: 'normal',
    finaleStartTime: 0,
    g7AnimId: null // Specific ID for firework artist loop
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
    { id: 10, title: "Heart Rush", icon: "⚡", desc: "Fast tapping challenge." },
    { id: 11, title: "Balloon Memory", icon: "🎈", desc: "Remember the sequence." },
    { id: 12, title: "Heart Maze", icon: "🧩", desc: "Reach the random gift." }
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
    document.getElementById('btn-enter').addEventListener('click', () => switchScreen('screen-hub'));
    dom.btnBack.addEventListener('click', closeGame);
    dom.btnWinCont.addEventListener('click', () => {
        dom.winOverlay.classList.add('hidden');
        closeGame();
    });
    dom.btnFinal.addEventListener('click', () => {
        if (!dom.btnFinal.classList.contains('locked')) startLetterSequence();
    });
    document.getElementById('btn-continue-finale').addEventListener('click', startFinaleSequence);
}

function switchScreen(screenId) {
    dom.screens.forEach(s => s.classList.remove('active', 'hidden'));
    dom.screens.forEach(s => {
        if (s.id !== screenId) s.classList.add('hidden');
        else s.classList.add('active');
    });
}

function introSequence() {
    setTimeout(() => document.querySelector('.intro-heart').style.opacity = '1', 500);
    const texts = [
        document.getElementById('intro-text-1'), document.getElementById('intro-text-2'),
        document.getElementById('intro-text-3'), document.getElementById('intro-text-4'),
        document.getElementById('btn-enter')
    ];
    texts.forEach((el, index) => setTimeout(() => el.classList.add('visible'), 1500 + (index * 1200)));
}

function buildGameGrid() {
    dom.gameGrid.innerHTML = '';
    gamesList.forEach((game, index) => {
        const isCompleted = state.completedArray[index];
        const card = document.createElement('div');
        card.className = `game-card ${isCompleted ? 'completed' : ''}`;
        card.innerHTML = `<div class="game-icon">${game.icon}</div><div class="game-title">${game.title}</div><div class="game-status">${isCompleted ? 'COMPLETED' : 'PLAY'}</div>`;
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

function openGame(id) {
    state.currentGameId = id;
    const gameInfo = gamesList.find(g => g.id === id);
    dom.activeGameTitle.innerText = `${gameInfo.title}`;
    dom.activeGameArea.innerHTML = ''; 
    switchScreen('screen-game');
    setTimeout(() => loadGameLogic(id), 400);
}

function closeGame() {
    if(state.g7AnimId) cancelAnimationFrame(state.g7AnimId); // stop G7 canvas loop if active
    state.currentGameId = null;
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
    for(let i=0; i<30; i++) explosions.push(createSimpleParticle(window.innerWidth/2, window.innerHeight/2, '#ec4899'));
    dom.winOverlay.classList.remove('hidden');
}

/* ==========================================================================
   MINI-GAMES LOGIC (Completely Upgraded per requirements)
   ========================================================================== */
function loadGameLogic(id) {
    const area = dom.activeGameArea;
    area.innerHTML = ''; 

    switch(id) {
        case 1: // Catch My Love
            let score1 = 0;
            area.innerHTML = `<div class="game-ui-text">Score: <span id="g1-score">0</span>/10</div>`;
            const g1Interval = setInterval(() => {
                if(state.currentGameId !== 1) { clearInterval(g1Interval); return; }
                const heart = document.createElement('div');
                heart.className = 'clickable-obj'; heart.innerText = '❤️';
                heart.style.left = Math.random() * 80 + 10 + '%'; heart.style.top = '-10%';
                heart.style.transition = 'top 3s linear';
                area.appendChild(heart);
                setTimeout(() => heart.style.top = '110%', 50);
                heart.onclick = () => { score1++; document.getElementById('g1-score').innerText = score1; heart.remove(); if(score1 >= 10) { clearInterval(g1Interval); completeGame(); } };
                setTimeout(() => { if(heart.parentNode) heart.remove(); }, 3000);
            }, 800);
            break;

        case 2: // Balloon Blast
            let score2 = 0;
            area.innerHTML = `<div class="game-ui-text">Pop 5 Balloons!</div>`;
            for(let i=0; i<5; i++) {
                setTimeout(() => {
                    if(state.currentGameId !== 2) return;
                    const balloon = document.createElement('div');
                    balloon.className = 'clickable-obj'; balloon.innerText = '🎈';
                    balloon.style.left = Math.random() * 80 + 10 + '%'; balloon.style.top = Math.random() * 60 + 20 + '%';
                    area.appendChild(balloon);
                    balloon.onclick = () => { balloon.innerText = '💥'; score2++; setTimeout(() => balloon.remove(), 200); if(score2 >= 5) completeGame(); };
                }, i * 500);
            }
            break;

        case 3: // Make A Wish (Fully Fixed Hierarchy)
            area.innerHTML = `
                <div class="game-ui-text">Tap flames to blow out candles</div>
                <div class="premium-cake-container">
                    <div class="cake-tier-top">
                        <div class="cake-frosting"></div>
                        <div class="candles-container" id="g3-candles">
                            <div class="candle"><div class="flame"></div></div>
                            <div class="candle"><div class="flame"></div></div>
                            <div class="candle"><div class="flame"></div></div>
                            <div class="candle"><div class="flame"></div></div>
                            <div class="candle"><div class="flame"></div></div>
                        </div>
                    </div>
                    <div class="cake-tier-bottom"><div class="cake-frosting"></div></div>
                </div>
            `;
            let candlesLeft = 5;
            document.querySelectorAll('.candle').forEach(c => {
                c.onclick = () => {
                    const flame = c.querySelector('.flame');
                    if(!flame.classList.contains('extinguished')) {
                        flame.classList.add('extinguished');
                        // Add smoke effect
                        const smoke = document.createElement('div');
                        smoke.className = 'smoke-spark'; smoke.innerText = '✨';
                        c.appendChild(smoke);
                        candlesLeft--;
                        if(candlesLeft === 0) setTimeout(completeGame, 1000);
                    }
                }
            });
            break;

        case 4: // Memory of Love
            const symbols = ['❤️','🎂','🌸','🎁'];
            const deck = [...symbols, ...symbols].sort(() => Math.random() - 0.5);
            area.innerHTML = `<div class="memory-grid" id="g4-grid"></div>`;
            let firstCard = null, matches = 0;
            deck.forEach(sym => {
                const c = document.createElement('div');
                c.className = 'memory-card hidden-card'; c.innerText = sym;
                c.onclick = () => {
                    if(!c.classList.contains('hidden-card')) return;
                    c.classList.remove('hidden-card');
                    if(!firstCard) { firstCard = c; }
                    else {
                        if(firstCard.innerText === c.innerText) {
                            matches++; firstCard = null;
                            if(matches === 4) setTimeout(completeGame, 500);
                        } else {
                            const fc = firstCard; firstCard = null;
                            setTimeout(() => { fc.classList.add('hidden-card'); c.classList.add('hidden-card'); }, 600);
                        }
                    }
                };
                document.getElementById('g4-grid').appendChild(c);
            });
            break;

        case 5: // Mystery Gifts
            area.innerHTML = `<div class="game-ui-text">Find the correct box!</div><div style="display:flex"></div>`;
            const container = area.querySelector('div:last-child');
            const correctBox = Math.floor(Math.random() * 3);
            for(let i=0; i<3; i++) {
                const box = document.createElement('div');
                box.className = 'gift-box'; box.innerText = '🎁';
                box.onclick = () => {
                    if(i === correctBox) { box.innerText = '❤️'; setTimeout(completeGame, 500); }
                    else { box.innerText = '❌'; setTimeout(() => box.innerText = '🎁', 800); }
                };
                container.appendChild(box);
            }
            break;

        case 6: // Birthday Wheel (REAL 3D UI)
            area.innerHTML = `
                <div class="wheel-wrapper">
                    <div class="wheel-pointer"></div>
                    <div class="wheel-outer">
                        <div class="wheel-inner" id="g6-wheel">
                            <div class="wheel-segments"></div>
                            <div class="wheel-labels">
                                <div class="w-label">❤️</div>
                                <div class="w-label">🎁</div>
                                <div class="w-label">🎂</div>
                                <div class="w-label">🫂</div>
                                <div class="w-label">✨</div>
                                <div class="w-label">🌸</div>
                            </div>
                        </div>
                    </div>
                    <div class="wheel-center"></div>
                </div>
                <button id="g6-spin" class="premium-btn">SPIN WHEEL</button>
            `;
            let currentRot = 0;
            document.getElementById('g6-spin').onclick = function() {
                this.disabled = true;
                const wheel = document.getElementById('g6-wheel');
                const spins = Math.floor(Math.random() * 3) + 4; // 4 to 6 full spins
                const extraAngle = Math.floor(Math.random() * 360);
                currentRot += (spins * 360) + extraAngle;
                wheel.style.transform = `rotate(${currentRot}deg)`;
                
                setTimeout(() => {
                    // Small celebration effect inside game area
                    for(let i=0; i<20; i++) explosions.push(createSimpleParticle(window.innerWidth/2, window.innerHeight/2, '#ec4899'));
                    setTimeout(completeGame, 1000);
                }, 4200); // Wait for CSS transition (4s) + margin
            };
            break;

        case 7: // Firework Artist (Dedicated Canvas Engine)
            area.innerHTML = `
                <div class="g7-container" id="g7-wrap">
                    <div class="g7-instructions">Tap the sky to launch fireworks! (5 remaining)</div>
                    <canvas id="g7-canvas"></canvas>
                </div>
            `;
            const g7c = document.getElementById('g7-canvas');
            const g7ctx = g7c.getContext('2d');
            const g7Wrap = document.getElementById('g7-wrap');
            g7c.width = g7Wrap.clientWidth; g7c.height = g7Wrap.clientHeight;
            
            let g7Rockets = [], g7Explosions = [], g7Stars = [], g7Clicks = 0;
            for(let i=0; i<50; i++) g7Stars.push({x: Math.random()*g7c.width, y: Math.random()*g7c.height, size: Math.random()*1.5});

            g7Wrap.onclick = (e) => {
                if(g7Clicks >= 5) return;
                g7Clicks++;
                document.querySelector('.g7-instructions').innerText = `Tap the sky to launch fireworks! (${5-g7Clicks} remaining)`;
                const rect = g7c.getBoundingClientRect();
                const tx = e.clientX - rect.left; const ty = e.clientY - rect.top;
                g7Rockets.push({
                    x: g7c.width/2, y: g7c.height, tx: tx, ty: ty,
                    vx: (tx - g7c.width/2) * 0.03, vy: -12 - Math.random()*4,
                    color: fwColors[Math.floor(Math.random()*fwColors.length)], trail: []
                });
                if(g7Clicks === 5) setTimeout(completeGame, 3000);
            };

            function g7Loop() {
                if(state.currentGameId !== 7) return; // Exit loop
                g7ctx.clearRect(0, 0, g7c.width, g7c.height);
                g7ctx.fillStyle = '#ffffff';
                g7Stars.forEach(s => { g7ctx.globalAlpha = Math.random()*0.5+0.2; g7ctx.beginPath(); g7ctx.arc(s.x, s.y, s.size, 0, Math.PI*2); g7ctx.fill(); });
                g7ctx.globalAlpha = 1.0;

                // Rockets
                for(let i=g7Rockets.length-1; i>=0; i--) {
                    let r = g7Rockets[i];
                    r.x += r.vx; r.y += r.vy; r.vy += 0.2; // gravity
                    r.trail.push({x: r.x, y: r.y});
                    if(r.trail.length > 10) r.trail.shift();
                    
                    g7ctx.beginPath(); g7ctx.strokeStyle = r.color; g7ctx.lineWidth = 3;
                    for(let j=0; j<r.trail.length; j++) {
                        g7ctx.globalAlpha = j/r.trail.length;
                        if(j===0) g7ctx.moveTo(r.trail[j].x, r.trail[j].y);
                        else g7ctx.lineTo(r.trail[j].x, r.trail[j].y);
                    }
                    g7ctx.stroke(); g7ctx.globalAlpha = 1.0;

                    if(r.vy >= 0 || r.y <= r.ty) { // Explode
                        const type = Math.floor(Math.random()*3); // 0 circle, 1 star/heart shape
                        if(type===0) spawnNormalExplosionLocal(r.x, r.y, r.color);
                        else spawnHeartExplosionLocal(r.x, r.y, r.color);
                        g7Rockets.splice(i, 1);
                    }
                }
                // Particles
                for(let i=g7Explosions.length-1; i>=0; i--) {
                    let p = g7Explosions[i];
                    p.x += p.vx; p.y += p.vy; p.vy += p.gravity; p.alpha -= p.decay;
                    if(p.alpha <= 0) { g7Explosions.splice(i,1); continue; }
                    g7ctx.globalAlpha = p.alpha; g7ctx.fillStyle = p.color;
                    g7ctx.beginPath(); g7ctx.arc(p.x, p.y, p.size, 0, Math.PI*2); g7ctx.fill();
                }
                g7ctx.globalAlpha = 1.0;
                state.g7AnimId = requestAnimationFrame(g7Loop);
            }
            
            function spawnNormalExplosionLocal(x,y,color) {
                for(let i=0; i<40; i++) {
                    let ang=Math.random()*Math.PI*2, spd=Math.random()*5+1;
                    g7Explosions.push({x:x, y:y, vx:Math.cos(ang)*spd, vy:Math.sin(ang)*spd, color:color, alpha:1, decay:0.02, size:2, gravity:0.05});
                }
            }
            function spawnHeartExplosionLocal(x,y,color) {
                for(let i=0; i<50; i++) {
                    let t=(i/50)*Math.PI*2, hx=16*Math.pow(Math.sin(t),3), hy=-(13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t));
                    g7Explosions.push({x:x, y:y, vx:hx*0.2, vy:hy*0.2, color:color, alpha:1, decay:0.015, size:2, gravity:0.02});
                }
            }
            g7Loop();
            break;

        case 8: // Save the Heart
            let caught = 0;
            area.innerHTML = `<div class="game-ui-text">Move mouse/finger to catch 5 🎁! <br>Caught: <span id="g8-score">0</span></div>`;
            const h = document.createElement('div');
            h.innerText = '💗'; h.style.position = 'absolute'; h.style.fontSize = '2.5rem'; h.style.bottom = '10%'; h.style.left = '50%';
            area.appendChild(h);
            
            area.onmousemove = (e) => { const rect = area.getBoundingClientRect(); h.style.left = (e.clientX - rect.left - 20) + 'px'; };
            area.ontouchmove = (e) => { const rect = area.getBoundingClientRect(); h.style.left = (e.touches[0].clientX - rect.left - 20) + 'px'; };

            const g8Interval = setInterval(() => {
                if(state.currentGameId !== 8) { clearInterval(g8Interval); return; }
                const g = document.createElement('div');
                g.innerText = '🎁'; g.style.position = 'absolute'; g.style.fontSize = '1.8rem';
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

        case 9: // Build Her Cake (Interactive sequential)
            let step = 0;
            area.innerHTML = `
                <div class="game-ui-text" id="g9-status">Step 1: Add Cake Base</div>
                <div class="premium-cake-container" style="margin-bottom: 20px;">
                    <div id="g9-topper" class="cake-topper">✨</div>
                    <div id="g9-t" class="cake-tier-top" style="opacity:0; transform: translateY(-20px)">
                        <div id="g9-tf" class="cake-frosting" style="opacity:0"></div>
                        <div id="g9-td" class="cake-decoration">🌸 🌸 🌸</div>
                        <div id="g9-ts" class="cake-sprinkles"></div>
                        <div id="g9-c" class="candles-container" style="opacity:0; transform: translateY(-10px)">
                            <div class="candle"><div class="flame"></div></div>
                            <div class="candle"><div class="flame"></div></div>
                            <div class="candle"><div class="flame"></div></div>
                        </div>
                    </div>
                    <div id="g9-b" class="cake-tier-bottom" style="opacity:0; transform: translateY(-20px)">
                        <div id="g9-bf" class="cake-frosting" style="opacity:0"></div>
                        <div id="g9-bd" class="cake-decoration">🎀 🎀 🎀</div>
                        <div id="g9-bs" class="cake-sprinkles"></div>
                    </div>
                </div>
                <button id="g9-action" class="premium-btn">Add Base</button>
            `;
            const btn9 = document.getElementById('g9-action');
            const status = document.getElementById('g9-status');
            btn9.onclick = () => {
                step++;
                if(step===1) {
                    document.getElementById('g9-b').style.opacity = 1; document.getElementById('g9-b').style.transform = 'translateY(0)';
                    document.getElementById('g9-t').style.opacity = 1; document.getElementById('g9-t').style.transform = 'translateY(0)';
                    btn9.innerText = "Add Frosting"; status.innerText = "Step 2: Add Frosting";
                } else if(step===2) {
                    document.getElementById('g9-bf').style.opacity = 1; document.getElementById('g9-tf').style.opacity = 1;
                    btn9.innerText = "Add Decorations"; status.innerText = "Step 3: Add Decorations";
                } else if(step===3) {
                    document.getElementById('g9-bd').style.opacity = 1; document.getElementById('g9-td').style.opacity = 1;
                    btn9.innerText = "Add Sprinkles"; status.innerText = "Step 4: Add Sprinkles";
                } else if(step===4) {
                    document.getElementById('g9-bs').style.opacity = 1; document.getElementById('g9-ts').style.opacity = 1;
                    btn9.innerText = "Add Candles"; status.innerText = "Step 5: Add Candles";
                } else if(step===5) {
                    document.getElementById('g9-c').style.opacity = 1; document.getElementById('g9-c').style.transform = 'translateY(0)';
                    btn9.innerText = "Add Topper"; status.innerText = "Step 6: Add Topper";
                } else if(step===6) {
                    document.getElementById('g9-topper').style.opacity = 1; document.getElementById('g9-topper').style.transform = 'translateX(-50%) translateY(0)';
                    btn9.style.display = 'none'; status.innerText = "YOUR BIRTHDAY CAKE IS READY! 🎂";
                    setTimeout(completeGame, 1500);
                }
            };
            break;

        case 10: // Heart Rush (Fast Challenge + Cinematic Ending)
            let score10 = 0, target10 = 15;
            area.innerHTML = `<div class="game-ui-text">Catch ${target10} Hearts! <br>Score: <span id="g10-score">0</span></div><div id="g10-zone" style="position:relative; width:100%; height:80%;"></div>`;
            const zone = document.getElementById('g10-zone');
            
            function spawnRushHeart() {
                if(state.currentGameId !== 10 || score10 >= target10) return;
                const h = document.createElement('div');
                h.className = 'flying-heart'; h.innerText = '💗';
                h.style.left = Math.random()*80 + 10 + '%'; h.style.top = Math.random()*80 + 10 + '%';
                
                // Difficulty scales up (disappears faster)
                const lifetime = Math.max(800, 1500 - (score10 * 50)); 
                
                let clicked = false;
                h.onclick = () => {
                    if(clicked) return;
                    clicked = true; h.remove(); score10++; 
                    document.getElementById('g10-score').innerText = score10;
                    
                    if(score10 === target10) {
                        // CINEMATIC ENDING
                        zone.innerHTML = '';
                        area.innerHTML += `
                            <div class="cinematic-pause">
                                <div class="cinematic-text-1">I LOVE YOU, DIDI ❤️</div>
                                <div class="cinematic-text-2">No matter how much we grow, you'll always be my special Didi. 🫂</div>
                            </div>`;
                        // Create massive burst in global canvas
                        for(let i=0; i<100; i++) explosions.push(createSimpleParticle(window.innerWidth/2, window.innerHeight/2, '#ec4899'));
                        setTimeout(completeGame, 4000);
                    } else {
                        spawnRushHeart(); // Spawn next immediately on catch
                    }
                };
                zone.appendChild(h);
                setTimeout(() => { if(!clicked && h.parentNode) { h.remove(); spawnRushHeart(); } }, lifetime);
            }
            spawnRushHeart();
            break;

        case 11: // Balloon Memory (Proper multi-round sequence)
            const balloonColors = ['#ec4899', '#8b5cf6', '#3b82f6', '#10b981'];
            let bRounds = [3, 4, 5, 6, 7]; // Lengths per round
            let currentRound = 0;
            let currentSeq = [], playerSeq = [];
            
            area.innerHTML = `
                <div class="game-ui-text" id="g11-msg">Round 1 - Watch carefully...</div>
                <div style="display:flex; gap:15px; margin-top:30px;" id="g11-btns">
                    <div class="balloon-obj" style="background-color:${balloonColors[0]}" data-id="0"></div>
                    <div class="balloon-obj" style="background-color:${balloonColors[1]}" data-id="1"></div>
                    <div class="balloon-obj" style="background-color:${balloonColors[2]}" data-id="2"></div>
                    <div class="balloon-obj" style="background-color:${balloonColors[3]}" data-id="3"></div>
                </div>
            `;
            const balloons = area.querySelectorAll('.balloon-obj');
            
            function playSeq11() {
                if(state.currentGameId !== 11) return;
                document.getElementById('g11-msg').innerText = `Round ${currentRound+1} - Watch carefully...`;
                document.getElementById('g11-btns').style.pointerEvents = 'none';
                playerSeq = [];
                
                // generate sequence for this round
                currentSeq = [];
                for(let i=0; i<bRounds[currentRound]; i++) currentSeq.push(Math.floor(Math.random()*4));
                
                // Play it back
                currentSeq.forEach((val, idx) => {
                    setTimeout(() => {
                        if(state.currentGameId !== 11) return;
                        const b = balloons[val];
                        b.classList.add('balloon-glow');
                        setTimeout(() => b.classList.remove('balloon-glow'), 400);
                    }, 1000 + (idx * 800));
                });
                
                setTimeout(() => {
                    if(state.currentGameId !== 11) return;
                    document.getElementById('g11-msg').innerText = 'Your Turn!';
                    document.getElementById('g11-btns').style.pointerEvents = 'auto';
                }, 1000 + (currentSeq.length * 800));
            }
            
            balloons.forEach((b, idx) => {
                b.onclick = () => {
                    b.classList.add('balloon-glow');
                    setTimeout(() => b.classList.remove('balloon-glow'), 200);
                    playerSeq.push(idx);
                    
                    // Verify logic
                    const currentIdx = playerSeq.length - 1;
                    if(playerSeq[currentIdx] !== currentSeq[currentIdx]) {
                        // ERROR
                        document.getElementById('g11-msg').innerText = 'Oops! Try again.';
                        b.classList.add('balloon-error');
                        setTimeout(() => b.classList.remove('balloon-error'), 400);
                        document.getElementById('g11-btns').style.pointerEvents = 'none';
                        setTimeout(playSeq11, 1500); // Restart same round
                    } else if(playerSeq.length === currentSeq.length) {
                        // Round Complete
                        currentRound++;
                        if(currentRound >= bRounds.length) {
                            document.getElementById('g11-msg').innerText = 'MEMORY MASTER! 🎈🧠❤️';
                            document.getElementById('g11-btns').style.pointerEvents = 'none';
                            setTimeout(completeGame, 1000);
                        } else {
                            document.getElementById('g11-msg').innerText = 'Good job! Next round...';
                            document.getElementById('g11-btns').style.pointerEvents = 'none';
                            setTimeout(playSeq11, 1500);
                        }
                    }
                };
            });
            setTimeout(playSeq11, 500);
            break;

        case 12: // Heart Maze (Random Targets)
            const targetsList = ['❤️', '🎁', '🌸', '⭐', '🎀', '💎', '🍰', '✨'];
            // Filter logic to prevent same target
            let availableTargets = targetsList.filter(t => t !== window.lastMazeTarget);
            let currentTarget = availableTargets[Math.floor(Math.random() * availableTargets.length)];
            window.lastMazeTarget = currentTarget; // save for next time

            const mazeLayout = [ 0,0,1,0,0, 0,1,1,0,1, 0,0,0,0,0, 1,1,1,1,0, 0,0,0,0,2 ];
            let pos = 0;
            area.innerHTML = `<div class="game-ui-text" id="g12-ui">Find: ${currentTarget}</div><div class="maze-grid" id="g12-grid"></div>
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
                    if(i === pos) c.innerText = '🧍'; // Player icon
                    else if(mazeLayout[i] === 2) c.innerText = currentTarget; // Random target
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
        setTimeout(() => { line.classList.add('visible'); }, 800 + (index * 1200));
    });

    setTimeout(() => {
        document.getElementById('btn-continue-finale').classList.remove('hidden');
    }, 800 + (lines.length * 1200) + 1000);
}

function startFinaleSequence() {
    switchScreen('screen-finale');
    
    // Activate the night sky background
    document.getElementById('night-sky-bg').classList.add('active');
    
    // Set system to finale mode
    state.bgMode = 'finale';
    state.finaleStartTime = Date.now();
    
    // Process the 3D title text for letter-by-letter reveal
    const titleEl = document.getElementById('finale-title');
    titleEl.innerHTML = ''; // clear
    const titleText = "🎂 HAPPY BIRTHDAY SIYU DII! 🎂";
    // Using Array.from properly handles emojis
    Array.from(titleText).forEach((char, i) => {
        if(char === ' ') { titleEl.appendChild(document.createTextNode(' ')); return; }
        const span = document.createElement('span');
        span.innerText = char;
        span.className = 'letter-3d';
        span.style.animationDelay = `${i * 0.15}s`;
        titleEl.appendChild(span);
    });

    const textContainer = document.getElementById('finale-text-container');
    const heart = document.getElementById('finale-heart');
    const sub1 = document.getElementById('finale-sub-1');
    const sub2 = document.getElementById('finale-sub-2');

    // Reveal main container AT 25 SECONDS to avoid blue popup effect
    setTimeout(() => { textContainer.classList.add('visible'); }, 25000);
    // Elements inside start revealing
    setTimeout(() => { heart.classList.add('visible'); titleEl.classList.add('visible'); }, 25500);
    setTimeout(() => { sub1.classList.add('visible'); }, 28000);
    setTimeout(() => { sub2.classList.add('visible'); }, 30000);
}

/* ==========================================================================
   CANVAS SYSTEM & ADVANCED FIREWORKS PHYSICS ENGINE
   ========================================================================== */
let dreamyParticles = [], rockets = [], explosions = [], confettis = [], nightStars = [];
const fwColors = ['#ec4899', '#8b5cf6', '#c084fc', '#fbcfe8', '#ffffff', '#fbbf24', '#f472b6'];

function resizeCanvas() {
    dom.bgCanvas.width = window.innerWidth; dom.bgCanvas.height = window.innerHeight;
}

function initBackgroundCanvas() {
    state.bgMode = 'normal';
    for(let i=0; i<30; i++) dreamyParticles.push(createDreamyParticle());
    for(let i=0; i<150; i++) nightStars.push({x: Math.random()*window.innerWidth, y: Math.random()*window.innerHeight, size: Math.random()*1.5+0.5, alpha: Math.random()});
    requestAnimationFrame(renderCanvas);
}

function createDreamyParticle() {
    return {
        x: Math.random() * dom.bgCanvas.width, y: Math.random() * dom.bgCanvas.height,
        size: Math.random() * 3 + 1, speedY: (Math.random() * 0.5) + 0.1, speedX: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.1, type: Math.random() > 0.8 ? 'heart' : 'circle'
    };
}

function createSimpleParticle(x, y, color) {
    const angle = Math.random() * Math.PI * 2; const speed = Math.random() * 4 + 1;
    return { x: x, y: y, vx: Math.cos(angle)*speed, vy: Math.sin(angle)*speed, color: color, alpha: 1, decay: Math.random()*0.02+0.01, size: Math.random()*2+1.5, gravity: 0.05, isSparkle: false };
}

/* --- MAIN FIREWORKS ENGINE --- */
function launchRocket() {
    const x = Math.random() * (dom.bgCanvas.width * 0.8) + (dom.bgCanvas.width * 0.1);
    const y = dom.bgCanvas.height + 10;
    const targetY = dom.bgCanvas.height * (Math.random() * 0.4 + 0.1);
    const vx = (Math.random() - 0.5) * 2;
    const vy = -(Math.random() * 4 + 8);
    const color = fwColors[Math.floor(Math.random() * fwColors.length)];
    const isHeart = Math.random() > 0.75; 
    rockets.push({ x, y, vx, vy, targetY, color, isHeart, trail: [] });
}

function spawnNormalExplosion(x, y, color) {
    const count = Math.random() * 40 + 40;
    for(let i=0; i<count; i++) explosions.push(createSimpleParticle(x, y, color));
}

function spawnHeartExplosion(x, y, color) {
    for(let i=0; i<70; i++) {
        const t = (i / 70) * Math.PI * 2;
        const hx = 16 * Math.pow(Math.sin(t), 3);
        const hy = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
        explosions.push({ x: x, y: y, vx: hx*0.3, vy: hy*0.3, color: color, alpha: 1, decay: Math.random()*0.015+0.01, size: Math.random()*2+2, gravity: 0.02, isSparkle: true });
    }
}

function spawnConfetti() {
    confettis.push({
        x: Math.random() * dom.bgCanvas.width, y: -20, vx: (Math.random() - 0.5) * 3, vy: Math.random() * 2 + 3,
        size: Math.random() * 10 + 5, color: fwColors[Math.floor(Math.random() * fwColors.length)],
        rot: Math.random() * Math.PI * 2, rotSpeed: (Math.random() - 0.5) * 0.2
    });
}

function renderCanvas() {
    if (document.visibilityState !== 'visible') { requestAnimationFrame(renderCanvas); return; }

    const ctx = dom.ctx;
    ctx.clearRect(0, 0, dom.bgCanvas.width, dom.bgCanvas.height);

    if (state.bgMode === 'finale') {
        const elapsed = (Date.now() - state.finaleStartTime) / 1000;

        ctx.fillStyle = '#ffffff';
        nightStars.forEach(s => {
            s.alpha += (Math.random() - 0.5) * 0.05;
            if(s.alpha < 0.1) s.alpha = 0.1; if(s.alpha > 0.8) s.alpha = 0.8;
            ctx.globalAlpha = s.alpha; ctx.beginPath(); ctx.arc(s.x, s.y, s.size, 0, Math.PI*2); ctx.fill();
        });
        ctx.globalAlpha = 1.0;

        // Fireworks Timeline
        if (elapsed > 3 && elapsed < 35) { 
            let launchChance = 0;
            if (elapsed < 7) launchChance = 0.03;       
            else if (elapsed < 15) launchChance = 0.08; 
            else if (elapsed < 25) launchChance = 0.15; 
            else launchChance = 0.30;                   

            if (Math.random() < launchChance) launchRocket();
            if (elapsed > 15 && Math.random() < 0.4) { spawnConfetti(); spawnConfetti(); }
        }

        // Render Rockets
        for (let i = rockets.length - 1; i >= 0; i--) {
            let r = rockets[i];
            r.x += r.vx; r.y += r.vy; r.vy += 0.04;
            r.trail.push({x: r.x, y: r.y});
            if (r.trail.length > 15) r.trail.shift();

            ctx.beginPath(); ctx.strokeStyle = r.color; ctx.lineWidth = 2.5;
            for(let j=0; j<r.trail.length; j++) {
                ctx.globalAlpha = j / r.trail.length;
                if(j===0) ctx.moveTo(r.trail[j].x, r.trail[j].y); else ctx.lineTo(r.trail[j].x, r.trail[j].y);
            }
            ctx.stroke(); ctx.globalAlpha = 1.0;

            if (r.vy >= -1 || r.y <= r.targetY) {
                if (r.isHeart) spawnHeartExplosion(r.x, r.y, r.color); else spawnNormalExplosion(r.x, r.y, r.color);
                rockets.splice(i, 1);
            }
        }

        // Render Explosions
        for (let i = explosions.length - 1; i >= 0; i--) {
            let p = explosions[i];
            p.x += p.vx; p.y += p.vy; p.vy += p.gravity; p.alpha -= p.decay;
            if (p.alpha <= 0) { explosions.splice(i, 1); continue; }

            ctx.globalAlpha = p.alpha; ctx.fillStyle = p.color;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI*2); ctx.fill();

            if (p.isSparkle && Math.random() > 0.5) {
                ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(p.x, p.y, p.size * 0.6, 0, Math.PI*2); ctx.fill();
            }
        }
        ctx.globalAlpha = 1.0;

        // Render Confetti
        for (let i = confettis.length - 1; i >= 0; i--) {
            let c = confettis[i];
            c.x += c.vx; c.y += c.vy; c.rot += c.rotSpeed;
            if (c.y > dom.bgCanvas.height + 20) { confettis.splice(i, 1); continue; }

            ctx.save(); ctx.translate(c.x, c.y); ctx.rotate(c.rot); ctx.fillStyle = c.color;
            ctx.fillRect(-c.size/2, -c.size/4, c.size, c.size/2); ctx.restore();
        }

    } else {
        // NORMAL / CALM MODE
        const pCount = state.bgMode === 'calm' ? 15 : 30;
        if(dreamyParticles.length > pCount) dreamyParticles.pop();
        if(dreamyParticles.length < pCount) dreamyParticles.push(createDreamyParticle());

        ctx.fillStyle = '#ffffff';
        dreamyParticles.forEach(p => {
            p.y -= p.speedY; p.x += p.speedX;
            if(p.y < -10) { p.y = dom.bgCanvas.height + 10; p.x = Math.random() * dom.bgCanvas.width; }
            
            ctx.globalAlpha = p.opacity;
            if(p.type === 'circle') { ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill(); } 
            else { ctx.font = `${p.size * 4}px Arial`; ctx.fillText('🌸', p.x, p.y); }
        });
        ctx.globalAlpha = 1.0;
    }
    requestAnimationFrame(renderCanvas);
}