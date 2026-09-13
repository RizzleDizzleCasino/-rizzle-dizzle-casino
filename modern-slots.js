(() => {
  const configs = {
    juicy: {
      title: '🥭 JUICY JUNGLE',
      feature: 'Expanding wilds • 3 scatters award 8 free spins',
      symbols: ['🥭','🍉','🍍','🍌','🐒','🦁','🌿','⭐'],
      wild: '🌿', scatter: '⭐', className: 'theme-juicy',
      payouts: { '🥭':[3,6,14], '🍉':[3,7,16], '🍍':[4,9,20], '🍌':[4,10,22], '🐒':[6,14,32], '🦁':[8,18,45] }
    },
    neon: {
      title: '🌃 NEON NIGHTS',
      feature: '2× neon wilds • 3 scatters award 8 free spins',
      symbols: ['💋','🕶️','🚘','🍸','💎','🌙','⚡','🎟️'],
      wild: '⚡', scatter: '🎟️', className: 'theme-neon',
      payouts: { '💋':[3,7,16], '🕶️':[3,8,18], '🚘':[4,10,24], '🍸':[4,12,28], '💎':[7,18,48], '🌙':[9,22,60] }
    },
    diamond: {
      title: '💎 DIAMOND RUSH',
      feature: 'Stacked gems • 3 scatters award 8 free spins',
      symbols: ['💠','💎','👑','💍','🔷','🔶','🃏','✨'],
      wild: '🃏', scatter: '✨', className: 'theme-diamond',
      payouts: { '💠':[3,7,16], '🔷':[3,8,20], '🔶':[4,10,24], '💍':[5,14,35], '👑':[7,20,50], '💎':[10,28,75] }
    },
    pirate: {
      title: '🏴‍☠️ PIRATE GOLD', feature: 'Treasure wilds • 3 maps award 8 free spins',
      symbols: ['🪙','⚓','🦜','🏴‍☠️','💰','👑','💎','🗺️'], wild: '💎', scatter: '🗺️',
      accent: '#ffd44f', glow: '#6b2400',
      payouts: { '🪙':[3,7,16], '⚓':[3,8,19], '🦜':[4,10,24], '🏴‍☠️':[5,14,34], '💰':[8,22,55], '👑':[10,30,80] }
    },
    dragon: {
      title: '🐉 DRAGON FORTUNE', feature: 'Lucky dragon wilds • 3 lanterns award 10 free spins',
      symbols: ['🪭','🪙','🏮','🐼','🐲','👑','🐉','✨'], wild: '🐉', scatter: '✨',
      accent: '#ffcf3f', glow: '#8f001d', freeAward: 10,
      payouts: { '🪭':[3,6,15], '🪙':[3,8,20], '🏮':[4,10,25], '🐼':[6,16,38], '🐲':[8,24,60], '👑':[12,35,90] }
    },
    cosmic: {
      title: '🚀 COSMIC CASH', feature: 'Orbiting wilds • 3 rockets award 8 galaxy spins',
      symbols: ['🪐','🌎','👾','🌟','☄️','🛸','🌌','🚀'], wild: '🌌', scatter: '🚀',
      accent: '#45f3ff', glow: '#30106f',
      payouts: { '🪐':[3,7,18], '🌎':[4,9,22], '👾':[5,12,28], '🌟':[6,16,40], '☄️':[8,24,60], '🛸':[12,38,100] }
    },
    candy: {
      title: '🍭 CANDY CRAZE', feature: 'Sticky sweet wilds • 3 gifts award 8 free spins',
      symbols: ['🍬','🍭','🧁','🍩','🍫','🍓','🌈','🎁'], wild: '🌈', scatter: '🎁',
      accent: '#ff7ce5', glow: '#6d145f',
      payouts: { '🍬':[3,6,14], '🍭':[3,8,18], '🧁':[4,10,24], '🍩':[5,14,32], '🍫':[7,20,48], '🍓':[10,30,75] }
    },
    outback: {
      title: '🦘 OUTBACK RICHES', feature: 'Golden wilds • 3 boots award 8 bonus spins',
      symbols: ['🪃','🐨','🦘','🐊','☀️','💰','🥇','🥾'], wild: '🥇', scatter: '🥾',
      accent: '#ffb23f', glow: '#66320b',
      payouts: { '🪃':[3,6,15], '🐨':[4,9,21], '🦘':[5,12,30], '🐊':[6,16,38], '☀️':[8,22,55], '💰':[12,35,90] }
    },
    pharaoh: {
      title: '𓂀 PHARAOH’S FORTUNE', feature: 'Royal wilds • 3 pyramids open 8 tomb spins',
      symbols: ['🏺','🐈','🐍','☀️','👑','💰','𓂀','🔺'], wild: '𓂀', scatter: '🔺',
      accent: '#ffe068', glow: '#6d4500',
      payouts: { '🏺':[3,7,17], '🐈':[4,9,22], '🐍':[5,12,29], '☀️':[6,17,42], '👑':[9,25,65], '💰':[13,40,110] }
    },
    volcano: {
      title: '🌋 VOLCANO VAULT', feature: 'Eruption wilds • 3 volcanoes award 8 hot spins',
      symbols: ['🪨','🔥','🌴','💎','🗿','👑','🌟','🌋'], wild: '🌟', scatter: '🌋',
      accent: '#ff6b35', glow: '#7c1300',
      payouts: { '🪨':[3,6,15], '🔥':[4,9,22], '🌴':[5,12,28], '💎':[6,17,40], '🗿':[9,26,64], '👑':[14,42,115] }
    },
    ocean: {
      title: '🧜 OCEAN TREASURES', feature: 'Pearl wilds • 3 mermaids award 8 ocean spins',
      symbols: ['🐚','🐠','🐬','🔱','💎','🐙','🫧','🧜'], wild: '🫧', scatter: '🧜',
      accent: '#54f4df', glow: '#004d78',
      payouts: { '🐚':[3,6,14], '🐠':[4,9,20], '🐬':[5,12,28], '🔱':[6,16,38], '💎':[9,25,62], '🐙':[13,38,100] }
    },
    disco: {
      title: '🪩 DISCO DIAMONDS', feature: '2× disco wilds • 3 tickets award 8 free spins',
      symbols: ['🎵','🕺','💃','⭐','💎','👑','🪩','🎟️'], wild: '🪩', scatter: '🎟️',
      accent: '#ff65f2', glow: '#401078', wildMultiplier: 2,
      payouts: { '🎵':[3,7,16], '🕺':[4,9,21], '💃':[5,12,28], '⭐':[6,17,42], '💎':[9,26,66], '👑':[14,44,120] }
    }
  };

  const paylines = [
    [0,0,0,0,0],[1,1,1,1,1],[2,2,2,2,2],
    [0,1,2,1,0],[2,1,0,1,2],[0,0,1,2,2],
    [2,2,1,0,0],[1,0,0,0,1],[1,2,2,2,1],[0,1,1,1,0]
  ];

  const machine = document.getElementById('modernMachine');
  const reelsEl = document.getElementById('modernReels');
  const titleEl = document.getElementById('modernSlotTitle');
  const featureEl = document.getElementById('modernSlotFeature');
  const statusEl = document.getElementById('modernStatus');
  const paytableEl = document.getElementById('modernPaytable');
  const betEl = document.getElementById('modernBet');
  const spinBtn = document.getElementById('modernSpin');
  const freeEl = document.getElementById('freeSpinsCount');
  if (!machine || !reelsEl || !spinBtn) return;

  let gameKey = localStorage.getItem('rizzleModernGame') || 'juicy';
  if (!configs[gameKey]) gameKey = 'juicy';
  let savedFreeSpins = {};
  try { savedFreeSpins = JSON.parse(localStorage.getItem('rizzleFreeSpins') || '{}'); } catch (_) { savedFreeSpins = {}; }
  const freeSpinsByGame = Object.fromEntries(Object.keys(configs).map(key => [key, Number(savedFreeSpins[key]) || 0]));
  let spinning = false;
  let grid = [];

  const getBalance = () => {
    if (window.getRizzleBalance) return window.getRizzleBalance();
    const stored = localStorage.getItem('rizzleBalance');
    const value = stored === null ? 10000 : Number(stored);
    return Number.isFinite(value) ? value : 10000;
  };
  const setBalance = value => window.setRizzleBalance ? window.setRizzleBalance(value) : localStorage.setItem('rizzleBalance', String(value));
  const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
  const random = values => values[Math.floor(Math.random() * values.length)];
  const saveFreeSpins = () => localStorage.setItem('rizzleFreeSpins', JSON.stringify(freeSpinsByGame));

  function makeGrid(config) {
    const output = Array.from({length:5}, () => Array.from({length:3}, () => random(config.symbols)));
    if (gameKey === 'diamond') {
      for (let col = 0; col < 5; col++) if (Math.random() < .28) output[col][1] = output[col][0];
    }
    if (gameKey === 'juicy') {
      for (let col = 0; col < 5; col++) if (output[col][1] === config.wild) output[col] = [config.wild,config.wild,config.wild];
    }
    return output;
  }

  function render(winningCells = new Set()) {
    reelsEl.innerHTML = '';
    grid.forEach((reel, col) => {
      const reelEl = document.createElement('div');
      reelEl.className = 'modern-reel';
      reel.forEach((symbol, row) => {
        const symbolEl = document.createElement('div');
        symbolEl.className = 'modern-symbol' + (winningCells.has(`${col}-${row}`) ? ' winning' : '');
        symbolEl.textContent = symbol;
        reelEl.appendChild(symbolEl);
      });
      reelsEl.appendChild(reelEl);
    });
  }

  function evaluate(config, bet) {
    let win = 0;
    let wildUsed = false;
    const cells = new Set();
    const lineBet = bet / paylines.length;
    paylines.forEach(line => {
      const symbols = line.map((row,col) => grid[col][row]);
      const base = symbols.find(s => s !== config.wild) || config.wild;
      if (base === config.scatter) return;
      let count = 0;
      for (const symbol of symbols) {
        if (symbol === base || symbol === config.wild) { if (symbol === config.wild) wildUsed = true; count++; }
        else break;
      }
      if (count >= 3 && config.payouts[base]) {
        win += lineBet * config.payouts[base][count - 3];
        for (let col = 0; col < count; col++) cells.add(`${col}-${line[col]}`);
      }
    });
    if ((gameKey === 'neon' || config.wildMultiplier === 2) && wildUsed && win > 0) win *= 2;
    return { win: Math.floor(win), cells };
  }

  function scatterCount(config) {
    return grid.flat().filter(symbol => symbol === config.scatter).length;
  }

  function updateGame(nextKey) {
    if (!configs[nextKey] || spinning) return;
    gameKey = nextKey;
    localStorage.setItem('rizzleModernGame', gameKey);
    const config = configs[gameKey];
    titleEl.textContent = config.title;
    featureEl.textContent = config.feature;
    machine.className = `modern-machine ${config.className || 'theme-feature'}`;
    machine.style.setProperty('--slot-accent', config.accent || '#ffd54a');
    machine.style.setProperty('--slot-glow', config.glow || '#53135f');
    document.querySelectorAll('.slot-tab').forEach(tab => tab.classList.toggle('active', tab.dataset.slotGame === gameKey));
    grid = makeGrid(config);
    render();
    paytableEl.innerHTML = Object.entries(config.payouts).slice(-4).map(([symbol,pays]) => `<span>${symbol} 3/4/5 = ${pays.join('×/')}×</span>`).join('');
    freeEl.textContent = freeSpinsByGame[gameKey];
    spinBtn.textContent = freeSpinsByGame[gameKey] > 0 ? 'FREE SPIN ✨' : 'SPIN ✨';
    statusEl.textContent = 'Choose your bet and spin.';
  }

  async function spin() {
    if (spinning) return;
    const config = configs[gameKey];
    const bet = Number(betEl.value);
    const usingFreeSpin = freeSpinsByGame[gameKey] > 0;
    const balance = getBalance();
    if (!usingFreeSpin && balance < bet) {
      statusEl.textContent = 'Not enough Rizzle Coins!';
      return;
    }
    if (!usingFreeSpin) setBalance(balance - bet);
    else { freeSpinsByGame[gameKey]--; saveFreeSpins(); }
    freeEl.textContent = freeSpinsByGame[gameKey];
    spinning = true;
    spinBtn.disabled = true;
    betEl.disabled = true;
    statusEl.textContent = usingFreeSpin ? 'FREE SPIN! ✨' : 'RIZZLING... ✨';
    reelsEl.querySelectorAll('.modern-reel').forEach(el => el.classList.add('spinning'));
    for (let i=0;i<8;i++) { grid = makeGrid(config); render(); await wait(75); }
    grid = makeGrid(config);
    const result = evaluate(config, bet);
    const scatters = scatterCount(config);
    if (result.win > 0) setBalance(getBalance() + result.win);
    if (scatters >= 3) {
      const award = freeSpinsByGame[gameKey] > 0 || usingFreeSpin ? 5 : (config.freeAward || 8);
      freeSpinsByGame[gameKey] += award;
      saveFreeSpins();
      const lineWin = result.win > 0 ? ` + ${result.win.toLocaleString()} COINS` : '';
      statusEl.textContent = `🎉 ${scatters} SCATTERS! +${award} FREE SPINS${lineWin}`;
    } else if (result.win > 0) {
      statusEl.textContent = `🎉 WIN! +${result.win.toLocaleString()} RIZZLE COINS`;
    } else {
      statusEl.textContent = usingFreeSpin ? 'Free spin complete.' : 'No win — try another Rizzle!';
    }
    render(result.cells);
    freeEl.textContent = freeSpinsByGame[gameKey];
    spinBtn.textContent = freeSpinsByGame[gameKey] > 0 ? 'FREE SPIN ✨' : 'SPIN ✨';
    spinning = false;
    spinBtn.disabled = false;
    betEl.disabled = false;
  }

  document.querySelectorAll('[data-slot-game]').forEach(el => el.addEventListener('click', () => {
    updateGame(el.dataset.slotGame);
    document.getElementById('modernSlots')?.scrollIntoView({behavior:'smooth'});
  }));
  spinBtn.addEventListener('click', spin);
  window.addRizzleFreeSpins = (key, count) => {
    const target = configs[key] ? key : gameKey;
    freeSpinsByGame[target] += Math.max(0, Number(count) || 0);
    saveFreeSpins();
    if (target === gameKey) {
      freeEl.textContent = freeSpinsByGame[target];
      spinBtn.textContent = 'FREE SPIN ✨';
    }
    return { game: target, total: freeSpinsByGame[target], title: configs[target].title };
  };
  window.getRizzleSlotGames = () => Object.keys(configs);
  updateGame(gameKey);
})();
