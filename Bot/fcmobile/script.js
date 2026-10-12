/**
 * EA SPORTS FC™ MOBILE ONLINE - GAME LOGIC ENGINE
 */

// ==========================================
// 1. SOUND FX SYNTHESIZER (Web Audio API)
// ==========================================
class FCSoundFX {
  constructor() {
    this.enabled = true;
    this.ctx = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
  }

  // Pack click / button tap
  playTap() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.05);
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.06);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.06);
    } catch (e) {}
  }

  // Walkout tension whoosh
  playTension() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(100, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.8);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.linearRampToValueAtTime(0.5, now + 0.7);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.9);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.95);
    } catch (e) {}
  }

  // Walkout explosion & stadium roar
  playWalkoutBoom() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      // Sub bass boom
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.6);
      gain.gain.setValueAtTime(0.8, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.8);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.85);

      // Fanfare chords
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
        const o = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        o.type = 'sawtooth';
        o.frequency.setValueAtTime(freq, now + 0.1);
        g.gain.setValueAtTime(0.2, now + 0.1);
        g.gain.exponentialRampToValueAtTime(0.01, now + 1.2);
        o.connect(g);
        g.connect(this.ctx.destination);
        o.start(now + 0.1);
        o.stop(now + 1.25);
      });
    } catch (e) {}
  }

  // Goal cheer horn
  playGoal() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      [440, 554, 659].forEach((freq) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.9);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.95);
      });
    } catch (e) {}
  }

  // Miss / Save whistle
  playMiss() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(140, now + 0.3);
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.32);
    } catch (e) {}
  }
}

const fcSfx = new FCSoundFX();

// ==========================================
// 2. APP STATE & INVENTORY
// ==========================================
let gameState = {
  coins: 25400000,
  gems: 850000,
  teamOvr: 98,
  myClub: [], // all opened cards
  squad: {
    LW: null,
    ST: null,
    RW: null,
    CM1: null,
    CAM: null,
    CM2: null,
    LB: null,
    CB1: null,
    CB2: null,
    RB: null,
    GK: null
  },
  currentWalkoutPlayer: null,
  activeSelectingSlot: null
};

// ==========================================
// 3. INITIAL STARTER SQUAD
// ==========================================
function setupStarterSquad() {
  // Give user initial elite players from database
  const starterIds = [
    "messi_toty", "ronaldo_toty", "mbappe_ucl",
    "debruyne_toty", "bellingham_ucl", "rodri_toty",
    "davies_ucl", "vandijk_toty", "saliba_ucl", "hakimi_toty",
    "courtois_ucl"
  ];

  starterIds.forEach(id => {
    const player = PLAYERS_DB.find(p => p.id === id);
    if (player && !gameState.myClub.some(c => c.id === player.id)) {
      gameState.myClub.push(player);
    }
  });

  // Assign to starting 11
  gameState.squad.RW = PLAYERS_DB.find(p => p.id === "messi_toty");
  gameState.squad.ST = PLAYERS_DB.find(p => p.id === "ronaldo_toty");
  gameState.squad.LW = PLAYERS_DB.find(p => p.id === "mbappe_ucl");
  gameState.squad.CAM = PLAYERS_DB.find(p => p.id === "bellingham_ucl");
  gameState.squad.CM1 = PLAYERS_DB.find(p => p.id === "debruyne_toty");
  gameState.squad.CM2 = PLAYERS_DB.find(p => p.id === "rodri_toty");
  gameState.squad.LB = PLAYERS_DB.find(p => p.id === "davies_ucl");
  gameState.squad.CB1 = PLAYERS_DB.find(p => p.id === "vandijk_toty");
  gameState.squad.CB2 = PLAYERS_DB.find(p => p.id === "saliba_ucl");
  gameState.squad.RB = PLAYERS_DB.find(p => p.id === "hakimi_toty");
  gameState.squad.GK = PLAYERS_DB.find(p => p.id === "courtois_ucl");

  // Add all other DB cards to collection for instant enjoyment
  PLAYERS_DB.forEach(p => {
    if (!gameState.myClub.some(c => c.id === p.id)) {
      gameState.myClub.push(p);
    }
  });

  updateTeamOvr();
}

// ==========================================
// 4. CARD HTML GENERATOR
// ==========================================
function renderFutCardHTML(player, customClass = '') {
  return `
    <div class="fut-card ${player.type} ${customClass}" data-player-id="${player.id}">
      <div class="card-top-row">
        <div class="card-ovr-pos">
          <div class="card-ovr">${player.ovr}</div>
          <div class="card-pos">${player.pos}</div>
        </div>
        <div class="card-flags">
          <span class="card-flag-icon">${player.flag}</span>
        </div>
      </div>
      <div class="card-avatar-hero">${player.avatar}</div>
      <div class="card-name-bar">${player.shortName}</div>
      <div class="card-stats-grid">
        <div class="stat-item">PAC <b>${player.pac}</b></div>
        <div class="stat-item">SHO <b>${player.sho}</b></div>
        <div class="stat-item">PAS <b>${player.pas}</b></div>
        <div class="stat-item">DRI <b>${player.dri}</b></div>
        <div class="stat-item">DEF <b>${player.def}</b></div>
        <div class="stat-item">PHY <b>${player.phy}</b></div>
      </div>
    </div>
  `;
}

// ==========================================
// 5. PACK STORE RENDERING & WALKOUT ANIMATION
// ==========================================
function renderPackStore() {
  const grid = document.getElementById('packsGrid');
  if (!grid) return;
  grid.innerHTML = '';

  PACK_TYPES.forEach(pack => {
    const card = document.createElement('div');
    card.className = 'pack-card';
    card.innerHTML = `
      <span class="pack-card-badge">${pack.badge}</span>
      <div class="pack-card-visual" style="background: ${pack.bgGradient}">
        <span class="pack-icon-hero">📦</span>
      </div>
      <h3 class="pack-title">${pack.name}</h3>
      <p class="pack-desc">${pack.desc}</p>
      <button class="pack-open-btn" data-pack-id="${pack.id}">
        OCHISH (TEKIN) ⚡
      </button>
    `;
    grid.appendChild(card);
  });

  // Attach open pack events
  grid.querySelectorAll('.pack-open-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const packId = e.currentTarget.getAttribute('data-pack-id');
      triggerPackOpening(packId);
    });
  });
}

function triggerPackOpening(packId) {
  const pack = PACK_TYPES.find(p => p.id === packId);
  if (!pack) return;

  // Filter pool
  const eligible = PLAYERS_DB.filter(pack.filter);
  const randomPlayer = eligible[Math.floor(Math.random() * eligible.length)];
  gameState.currentWalkoutPlayer = randomPlayer;

  // Add to club collection if not present
  if (!gameState.myClub.some(p => p.id === randomPlayer.id)) {
    gameState.myClub.push(randomPlayer);
  }

  // Launch Fullscreen Walkout Cinematic Sequence
  startWalkoutSequence(randomPlayer);
}

function startWalkoutSequence(player) {
  const modal = document.getElementById('walkoutModal');
  const flagBox = document.getElementById('revealFlagBox');
  const posBox = document.getElementById('revealPosBox');
  const clubBox = document.getElementById('revealClubBox');
  const finalCardBox = document.getElementById('revealFinalCardBox');

  // Reset steps
  modal.style.display = 'flex';
  flagBox.className = 'reveal-step reveal-flag';
  posBox.className = 'reveal-step reveal-pos';
  clubBox.className = 'reveal-step reveal-club';
  finalCardBox.className = 'reveal-final-card';

  // Fill data
  document.getElementById('walkoutFlag').textContent = player.flag;
  document.getElementById('walkoutNationLabel').textContent = player.nation.toUpperCase();
  document.getElementById('walkoutPos').textContent = player.pos;
  document.getElementById('walkoutClub').textContent = player.club.toUpperCase();
  document.getElementById('walkoutOvrAnnounce').textContent = player.ovr;
  document.getElementById('walkoutNameAnnounce').textContent = player.name.toUpperCase();

  // Render final card
  document.getElementById('walkoutCardRender').innerHTML = renderFutCardHTML(player);

  // Sound: start tension build
  fcSfx.playTension();

  // Step 1: Reveal Flag (after 400ms)
  setTimeout(() => {
    flagBox.classList.add('show');
    fcSfx.playTap();
  }, 400);

  // Step 2: Reveal Position (after 1500ms)
  setTimeout(() => {
    flagBox.classList.remove('show');
    posBox.classList.add('show');
    fcSfx.playTap();
  }, 1600);

  // Step 3: Reveal Club (after 2800ms)
  setTimeout(() => {
    posBox.classList.remove('show');
    clubBox.classList.add('show');
    fcSfx.playTap();
  }, 2800);

  // Step 4: THE GRAND WALKOUT EXPLOSION! (after 4000ms)
  setTimeout(() => {
    clubBox.classList.remove('show');
    finalCardBox.classList.add('show');
    fcSfx.playWalkoutBoom();
    showToast(`🌟 ${player.name} (${player.ovr} OVR) ochildi!`);
    updateClubBadgeCount();
  }, 4100);
}

// ==========================================
// 6. SQUAD BUILDER (PITCH)
// ==========================================
function renderPitch() {
  const slots = ['LW', 'ST', 'RW', 'CM1', 'CAM', 'CM2', 'LB', 'CB1', 'CB2', 'RB', 'GK'];

  slots.forEach(slotKey => {
    const slotEl = document.getElementById(`slot-${slotKey}`);
    if (!slotEl) return;

    const player = gameState.squad[slotKey];
    if (player) {
      slotEl.innerHTML = renderFutCardHTML(player);
    } else {
      slotEl.innerHTML = `
        <div class="slot-empty">
          <span class="slot-pos-tag">${slotKey.replace(/[0-9]/g, '')}</span>
          <span class="slot-plus">+</span>
        </div>
      `;
    }

    slotEl.onclick = () => openSlotSelectModal(slotKey);
  });

  renderBench();
  updateTeamOvr();
}

function renderBench() {
  const benchStrip = document.getElementById('benchCardsStrip');
  if (!benchStrip) return;
  benchStrip.innerHTML = '';

  const assignedIds = Object.values(gameState.squad).filter(Boolean).map(p => p.id);
  const benchPlayers = gameState.myClub.filter(p => !assignedIds.includes(p.id));

  benchPlayers.slice(0, 15).forEach(p => {
    const cardWrapper = document.createElement('div');
    cardWrapper.innerHTML = renderFutCardHTML(p);
    cardWrapper.style.cursor = 'pointer';
    cardWrapper.onclick = () => {
      // Put in best fitting slot
      autoPlacePlayer(p);
    };
    benchStrip.appendChild(cardWrapper.firstElementChild);
  });
}

function autoPlacePlayer(player) {
  const matchSlot = Object.keys(gameState.squad).find(k => k.startsWith(player.pos));
  if (matchSlot) {
    gameState.squad[matchSlot] = player;
    fcSfx.playTap();
    renderPitch();
    showToast(`${player.name} asosiy tarkibga kiritildi!`);
  } else {
    showToast(`${player.name} uchun mos bo'sh pozitsiya topilmadi!`);
  }
}

function autoBuildBestSquad() {
  fcSfx.playWalkoutBoom();

  // Find best for each position
  const pickBest = (pos) => {
    const match = gameState.myClub
      .filter(p => p.pos === pos)
      .sort((a, b) => b.ovr - a.ovr)[0];
    return match || gameState.myClub.sort((a, b) => b.ovr - a.ovr)[0];
  };

  gameState.squad.RW = pickBest('RW');
  gameState.squad.ST = pickBest('ST');
  gameState.squad.LW = pickBest('LW');
  gameState.squad.CAM = pickBest('CAM');
  gameState.squad.CM1 = pickBest('CM');
  gameState.squad.CM2 = pickBest('CM');
  gameState.squad.LB = pickBest('LB');
  gameState.squad.CB1 = pickBest('CB');
  gameState.squad.CB2 = pickBest('CB');
  gameState.squad.RB = pickBest('RB');
  gameState.squad.GK = pickBest('GK');

  renderPitch();
  showToast("⚡ Eng kuchli tarkib (Maximum OVR) tuzildi!");
}

function updateTeamOvr() {
  const activePlayers = Object.values(gameState.squad).filter(Boolean);
  if (activePlayers.length === 0) {
    gameState.teamOvr = 0;
  } else {
    const avg = Math.round(activePlayers.reduce((a, b) => a + b.ovr, 0) / activePlayers.length);
    gameState.teamOvr = avg;
  }

  const el = document.getElementById('headerTeamOvr');
  if (el) el.textContent = gameState.teamOvr;
}

// Slot picker modal
function openSlotSelectModal(slotKey) {
  gameState.activeSelectingSlot = slotKey;
  const modal = document.getElementById('slotSelectModal');
  const title = document.getElementById('slotSelectPosTitle');
  const list = document.getElementById('slotSelectPlayersList');

  const basePos = slotKey.replace(/[0-9]/g, '');
  title.textContent = basePos;
  list.innerHTML = '';

  const candidates = gameState.myClub.sort((a, b) => b.ovr - a.ovr);

  candidates.forEach(player => {
    const cardEl = document.createElement('div');
    cardEl.innerHTML = renderFutCardHTML(player);
    cardEl.style.cursor = 'pointer';
    cardEl.onclick = () => {
      gameState.squad[slotKey] = player;
      fcSfx.playTap();
      modal.style.display = 'none';
      renderPitch();
      showToast(`${player.name} tanlandi!`);
    };
    list.appendChild(cardEl.firstElementChild);
  });

  modal.style.display = 'flex';
}

// ==========================================
// 7. PENALTY SHOOTOUT CANVAS GAME
// ==========================================
class PenaltyShootoutGame {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = canvas.width;
    this.height = canvas.height;

    this.userScore = 0;
    this.aiScore = 0;
    this.round = 1;
    this.maxRounds = 5;

    // Ball state
    this.ballX = this.width / 2;
    this.ballY = this.height - 70;
    this.ballRadius = 14;
    this.targetX = this.ballX;
    this.targetY = this.ballY;
    this.isKicking = false;

    // Goalkeeper state
    this.gkX = this.width / 2;
    this.gkY = 190;
    this.gkTargetX = this.gkX;
    this.gkDiveDir = 0; // -1 left, 1 right, 0 center

    this.bindButtons();
    this.render();
  }

  bindButtons() {
    document.querySelectorAll('.target-zone').forEach(btn => {
      btn.addEventListener('click', (e) => {
        if (this.isKicking) return;
        const targetType = e.currentTarget.getAttribute('data-target');
        this.shoot(targetType);
      });
    });

    document.getElementById('resetShootoutBtn').addEventListener('click', () => {
      this.resetMatch();
    });
  }

  shoot(targetType) {
    if (this.isKicking) return;
    this.isKicking = true;
    fcSfx.playTap();

    // Map targets to coordinates
    const targets = {
      'top-left': { x: 260, y: 150 },
      'top-right': { x: 540, y: 150 },
      'bottom-left': { x: 270, y: 220 },
      'bottom-center': { x: 400, y: 220 },
      'bottom-right': { x: 530, y: 220 }
    };

    const target = targets[targetType] || { x: 400, y: 180 };
    this.targetX = target.x;
    this.targetY = target.y;

    // AI Keeper decides dive
    const diveChoices = ['top-left', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right'];
    const aiChoice = diveChoices[Math.floor(Math.random() * diveChoices.length)];

    if (aiChoice === 'top-left' || aiChoice === 'bottom-left') {
      this.gkTargetX = 280;
    } else if (aiChoice === 'top-right' || aiChoice === 'bottom-right') {
      this.gkTargetX = 520;
    } else {
      this.gkTargetX = 400;
    }

    // Is Goal or Saved?
    const isSaved = aiChoice === targetType;

    // Animate
    let progress = 0;
    const animateShot = () => {
      progress += 0.05;
      this.ballX = (this.width / 2) + (this.targetX - (this.width / 2)) * progress;
      this.ballY = (this.height - 70) + (this.targetY - (this.height - 70)) * progress;
      this.ballRadius = 14 - (progress * 5); // shrinks in distance

      this.gkX = (this.width / 2) + (this.gkTargetX - (this.width / 2)) * progress;

      this.render();

      if (progress < 1) {
        requestAnimationFrame(animateShot);
      } else {
        // Result
        this.handleResult(isSaved);
      }
    };

    requestAnimationFrame(animateShot);
  }

  handleResult(isSaved) {
    const banner = document.getElementById('shotResultBanner');
    const text = document.getElementById('shotResultText');

    if (!isSaved) {
      this.userScore++;
      text.textContent = "⚽ GOOOOL!";
      text.style.color = "#00ff87";
      fcSfx.playGoal();
    } else {
      this.aiScore++;
      text.textContent = "🧤 SEYV! DARVOZABON QAYTARDI!";
      text.style.color = "#ef4444";
      fcSfx.playMiss();
    }

    banner.classList.add('show');
    document.getElementById('userGoalsCount').textContent = this.userScore;
    document.getElementById('aiSavesCount').textContent = this.aiScore;

    setTimeout(() => {
      banner.classList.remove('show');
      this.round++;
      if (this.round > this.maxRounds) {
        showToast(this.userScore > this.aiScore ? "🏆 TABRIKLAYMIZ! PENALTILAR SERIYASIDA G'ALABA!" : "O'yin durang yoki raqib ustun keldi!");
      } else {
        document.getElementById('shootoutRoundLabel').textContent = `ZARBA №${this.round} / 5`;
      }
      this.resetBall();
    }, 1500);
  }

  resetBall() {
    this.ballX = this.width / 2;
    this.ballY = this.height - 70;
    this.ballRadius = 14;
    this.gkX = this.width / 2;
    this.isKicking = false;
    this.render();
  }

  resetMatch() {
    this.userScore = 0;
    this.aiScore = 0;
    this.round = 1;
    document.getElementById('userGoalsCount').textContent = '0';
    document.getElementById('aiSavesCount').textContent = '0';
    document.getElementById('shootoutRoundLabel').textContent = 'ZARBA №1 / 5';
    this.resetBall();
  }

  render() {
    const ctx = this.ctx;

    // Stadium & pitch background
    const bgGrad = ctx.createLinearGradient(0, 0, 0, this.height);
    bgGrad.addColorStop(0, '#041c13');
    bgGrad.addColorStop(0.5, '#0a3625');
    bgGrad.addColorStop(1, '#0e4a33');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, this.width, this.height);

    // Goal Frame
    const goalX = 220;
    const goalY = 110;
    const goalW = 360;
    const goalH = 140;

    // Goal Net Mesh
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    for (let x = goalX; x <= goalX + goalW; x += 15) {
      ctx.beginPath();
      ctx.moveTo(x, goalY);
      ctx.lineTo(x, goalY + goalH);
      ctx.stroke();
    }
    for (let y = goalY; y <= goalY + goalH; y += 15) {
      ctx.beginPath();
      ctx.moveTo(goalX, y);
      ctx.lineTo(goalX + goalW, y);
      ctx.stroke();
    }

    // Goal Posts (White 3D)
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 8;
    ctx.strokeRect(goalX, goalY, goalW, goalH);

    // Goalkeeper
    ctx.save();
    ctx.fillStyle = '#f5c518'; // Yellow GK shirt
    ctx.beginPath();
    ctx.arc(this.gkX, this.gkY - 20, 16, 0, Math.PI * 2); // Head
    ctx.fill();

    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(this.gkX - 16, this.gkY - 5, 32, 38); // Body & Arms
    ctx.restore();

    // Penalty Spot
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(this.width / 2, this.height - 70, 4, 0, Math.PI * 2);
    ctx.fill();

    // Soccer Ball
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 10;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(this.ballX, this.ballY, this.ballRadius, 0, Math.PI * 2);
    ctx.fill();

    // Ball pentagons
    ctx.fillStyle = '#111827';
    ctx.beginPath();
    ctx.arc(this.ballX, this.ballY, this.ballRadius * 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

// ==========================================
// 8. VSA MATCH ENGINE
// ==========================================
let vsaMatchTimer = null;
let vsaTimeLeft = 90;
let vsaUserGoals = 0;
let vsaRivalGoals = 0;
let selectedRival = { name: "Real Madrid", ovr: 97 };

function initVsa() {
  document.querySelectorAll('.rival-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.rival-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      selectedRival.name = card.getAttribute('data-rival');
      selectedRival.ovr = parseInt(card.getAttribute('data-ovr'));
      fcSfx.playTap();
    });
  });

  document.getElementById('startVsaMatchBtn').addEventListener('click', startVsaMatch);

  document.querySelectorAll('.vsa-choice-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const action = e.currentTarget.getAttribute('data-action');
      handleVsaAction(action);
    });
  });
}

function startVsaMatch() {
  document.getElementById('vsaSetupBox').style.display = 'none';
  document.getElementById('vsaLiveScreen').style.display = 'block';

  vsaTimeLeft = 90;
  vsaUserGoals = 0;
  vsaRivalGoals = 0;

  document.getElementById('vsaUserScore').textContent = '0';
  document.getElementById('vsaRivalScore').textContent = '0';
  document.getElementById('vsaRivalName').textContent = `${selectedRival.name} (${selectedRival.ovr} OVR)`;

  fcSfx.playTap();
  generateNextVsaChance();

  vsaMatchTimer = setInterval(() => {
    vsaTimeLeft--;
    const mins = Math.floor(vsaTimeLeft / 60);
    const secs = vsaTimeLeft % 60;
    document.getElementById('vsaTimer').textContent = `${mins}:${secs < 10 ? '0' : ''}${secs}`;

    // Rival AI chance score progression
    if (vsaTimeLeft % 18 === 0 && Math.random() > 0.4) {
      vsaRivalGoals++;
      document.getElementById('vsaRivalScore').textContent = vsaRivalGoals;
      addVsaFeed(`⚠️ ${selectedRival.name} gol urdi! Hisob: ${vsaUserGoals} - ${vsaRivalGoals}`);
    }

    if (vsaTimeLeft <= 0) {
      endVsaMatch();
    }
  }, 1000);
}

const vsaScenarios = [
  {
    type: "GREAT CHANCE",
    desc: "Mbappé darvozabon bilan birga-bir vaziyatga chiqdi!",
    successRate: 0.85
  },
  {
    type: "GOOD CHANCE",
    desc: "Messi qanotdan jarima maydoniga yorib kirdi va zarba berishga tayyor!",
    successRate: 0.70
  },
  {
    type: "BASIC CHANCE",
    desc: "Ronaldo 25 metrdan to'pni qabul qildi, himoyachilar bosim o'tkazmoqda.",
    successRate: 0.55
  }
];

let currentChance = null;

function generateNextVsaChance() {
  const chance = vsaScenarios[Math.floor(Math.random() * vsaScenarios.length)];
  currentChance = chance;
  document.getElementById('chanceQuality').textContent = `🔥 ${chance.type}`;
  document.getElementById('chanceDesc').textContent = chance.desc;
}

function handleVsaAction(action) {
  if (vsaTimeLeft <= 0) return;
  const isGoal = Math.random() < currentChance.successRate;

  if (isGoal) {
    vsaUserGoals++;
    document.getElementById('vsaUserScore').textContent = vsaUserGoals;
    fcSfx.playGoal();
    addVsaFeed(`⚽ GOOOL! Sizning aniq ${action.toUpperCase()} zarbangiz to'rni silkidi!`);
    showToast("⚽ GOOOL!");
  } else {
    fcSfx.playMiss();
    addVsaFeed(`❌ Zarba noaniq yoki darvozabon to'pni qaytardi.`);
  }

  generateNextVsaChance();
}

function addVsaFeed(msg) {
  const feed = document.getElementById('vsaEventFeed');
  const div = document.createElement('div');
  div.className = 'feed-msg';
  div.textContent = msg;
  feed.prepend(div);
}

function endVsaMatch() {
  clearInterval(vsaMatchTimer);
  fcSfx.playWalkoutBoom();

  let resultMsg = "";
  if (vsaUserGoals > vsaRivalGoals) {
    resultMsg = `🏆 G'ALABA! Siz ${selectedRival.name}ni ${vsaUserGoals} - ${vsaRivalGoals} hisobida mag'lub etdingiz! Mukofot: +500,000 Coins!`;
    gameState.coins += 500000;
  } else if (vsaUserGoals === vsaRivalGoals) {
    resultMsg = `🤝 DURANG! ${vsaUserGoals} - ${vsaRivalGoals}. Yaxshi o'yin!`;
  } else {
    resultMsg = `Mag'lubiyat: ${vsaUserGoals} - ${vsaRivalGoals}. Yangi paklar ochib tarkibingizni kuchaytiring!`;
  }

  showToast(resultMsg);
  setTimeout(() => {
    document.getElementById('vsaSetupBox').style.display = 'block';
    document.getElementById('vsaLiveScreen').style.display = 'none';
  }, 4000);
}

// ==========================================
// 9. CLUB COLLECTION BINDER
// ==========================================
function renderClubCollection(filter = 'all') {
  const grid = document.getElementById('clubCardsGrid');
  if (!grid) return;
  grid.innerHTML = '';

  const filtered = filter === 'all'
    ? gameState.myClub
    : gameState.myClub.filter(p => p.type === filter);

  filtered.forEach(p => {
    const cardEl = document.createElement('div');
    cardEl.innerHTML = renderFutCardHTML(p);
    grid.appendChild(cardEl.firstElementChild);
  });

  updateClubBadgeCount();
}

function updateClubBadgeCount() {
  const count = gameState.myClub.length;
  document.getElementById('clubCardsCount').textContent = count;
  document.getElementById('clubTotalBadge').textContent = count;
}

// ==========================================
// 10. TOAST & NOTIFICATIONS
// ==========================================
function showToast(msg) {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>⚽</span> <span>${msg}</span>`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3200);
}

// ==========================================
// 11. INITIALIZATION & DOM EVENTS
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  setupStarterSquad();
  renderPackStore();
  renderPitch();
  renderClubCollection('all');
  initVsa();

  // Penalty canvas
  const canvas = document.getElementById('penaltyCanvas');
  const penaltyGame = new PenaltyShootoutGame(canvas);

  // Tab switching
  document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
      const targetTab = e.currentTarget.getAttribute('data-tab');
      document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-view').forEach(v => v.classList.remove('active'));

      e.currentTarget.classList.add('active');
      document.getElementById(`view-${targetTab}`).classList.add('active');
      fcSfx.playTap();

      if (targetTab === 'shootout') {
        penaltyGame.render();
      }
    });
  });

  // Sound toggle
  const soundBtn = document.getElementById('soundToggleBtn');
  const sOn = document.getElementById('soundIconOn');
  const sOff = document.getElementById('soundIconOff');
  soundBtn.addEventListener('click', () => {
    fcSfx.enabled = !fcSfx.enabled;
    sOn.style.display = fcSfx.enabled ? 'inline' : 'none';
    sOff.style.display = fcSfx.enabled ? 'none' : 'inline';
    showToast(fcSfx.enabled ? "Ovozlar yoqildi 🔊" : "Ovozlar o'chirildi 🔇");
  });

  // Add Free Funds
  document.getElementById('addCoinsBtn').addEventListener('click', () => {
    gameState.coins += 10000000;
    document.getElementById('userCoins').textContent = gameState.coins.toLocaleString();
    fcSfx.playGoal();
    showToast("💰 +10,000,000 Tekin Coins qo'shildi!");
  });

  document.getElementById('addGemsBtn').addEventListener('click', () => {
    gameState.gems += 250000;
    document.getElementById('userGems').textContent = gameState.gems.toLocaleString();
    fcSfx.playGoal();
    showToast("💎 +250,000 Tekin Gems qo'shildi!");
  });

  // Squad auto build
  document.getElementById('autoBuildSquadBtn').addEventListener('click', autoBuildBestSquad);
  document.getElementById('resetSquadBtn').addEventListener('click', () => {
    Object.keys(gameState.squad).forEach(k => gameState.squad[k] = null);
    renderPitch();
    showToast("Tarkib tozalandi");
  });

  // Walkout modal actions
  const walkoutModal = document.getElementById('walkoutModal');
  document.getElementById('walkoutCloseBtn').addEventListener('click', () => {
    walkoutModal.style.display = 'none';
  });

  document.getElementById('walkoutAnotherBtn').addEventListener('click', () => {
    walkoutModal.style.display = 'none';
    triggerPackOpening('goat_pack');
  });

  document.getElementById('walkoutEquipBtn').addEventListener('click', () => {
    if (gameState.currentWalkoutPlayer) {
      autoPlacePlayer(gameState.currentWalkoutPlayer);
    }
    walkoutModal.style.display = 'none';
  });

  // Slot modal close
  document.getElementById('closeSlotSelectModal').addEventListener('click', () => {
    document.getElementById('slotSelectModal').style.display = 'none';
  });

  // Club filters
  document.querySelectorAll('.filter-chip').forEach(chip => {
    chip.addEventListener('click', (e) => {
      document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
      e.currentTarget.classList.add('active');
      const f = e.currentTarget.getAttribute('data-filter');
      renderClubCollection(f);
      fcSfx.playTap();
    });
  });
});
