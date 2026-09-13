(() => {
  const wheel = document.getElementById('prizeWheel');
  const button = document.getElementById('spinWheel');
  const status = document.getElementById('wheelStatus');
  if (!wheel || !button || !status) return;

  const WAIT = 24 * 60 * 60 * 1000;
  const prizes = [
    { label: '250 COINS', coins: 250 },
    { label: '5 FREE SPINS', spins: 5 },
    { label: '500 COINS', coins: 500 },
    { label: '8 FREE SPINS', spins: 8 },
    { label: '1,000 COINS', coins: 1000 },
    { label: '10 FREE SPINS', spins: 10 },
    { label: '2,500 COINS', coins: 2500 },
    { label: '15 FREE SPINS', spins: 15 }
  ];
  let rotation = Number(localStorage.getItem('rizzleWheelRotation')) || 0;
  let spinning = false;

  prizes.forEach((prize, index) => {
    const label = document.createElement('span');
    label.className = 'wheel-label';
    label.textContent = prize.label.replace(' COINS','').replace(' FREE SPINS',' SPINS');
    label.style.setProperty('--slice', `${index * 45 + 22.5}deg`);
    label.style.setProperty('--counter-slice', `${-(index * 45 + 22.5)}deg`);
    wheel.insertBefore(label, wheel.firstChild);
  });

  const getBalance = () => window.getRizzleBalance ? window.getRizzleBalance() : Number(localStorage.getItem('rizzleBalance')) || 10000;
  const setBalance = value => window.setRizzleBalance ? window.setRizzleBalance(value) : localStorage.setItem('rizzleBalance', String(value));

  function timeText(ms) {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    return `${hours}h ${minutes}m`;
  }

  function updateAvailability() {
    if (spinning) return;
    const lastSpin = Number(localStorage.getItem('rizzleWheelLastSpin')) || 0;
    const remaining = WAIT - (Date.now() - lastSpin);
    if (remaining <= 0) {
      button.disabled = false;
      button.textContent = 'WHACK THE WHEEL 🎁';
      status.textContent = 'Your daily whack is ready!';
    } else {
      button.disabled = true;
      button.textContent = 'COME BACK TOMORROW';
      status.textContent = `Next whack in ${timeText(remaining)}`;
    }
  }

  function award(prize) {
    if (prize.coins) {
      setBalance(getBalance() + prize.coins);
      return `🎉 You won ${prize.coins.toLocaleString()} Rizzle Coins!`;
    }
    const games = window.getRizzleSlotGames ? window.getRizzleSlotGames() : ['juicy'];
    const game = games[Math.floor(Math.random() * games.length)];
    const result = window.addRizzleFreeSpins ? window.addRizzleFreeSpins(game, prize.spins) : null;
    const name = result ? result.title.replace(/^\S+\s/, '') : 'a modern slot';
    return `🎉 You won ${prize.spins} free spins for ${name}!`;
  }

  button.addEventListener('click', () => {
    const lastSpin = Number(localStorage.getItem('rizzleWheelLastSpin')) || 0;
    if (spinning || Date.now() - lastSpin < WAIT) return updateAvailability();
    spinning = true;
    button.disabled = true;
    status.textContent = 'WHACKING... GOOD LUCK!';

    const index = Math.floor(Math.random() * prizes.length);
    const slice = 360 / prizes.length;
    const target = 360 - (index * slice + slice / 2);
    rotation += 5 * 360 + ((target - rotation % 360 + 360) % 360);
    wheel.style.transform = `rotate(${rotation}deg)`;
    localStorage.setItem('rizzleWheelRotation', String(rotation));

    window.setTimeout(() => {
      localStorage.setItem('rizzleWheelLastSpin', String(Date.now()));
      status.textContent = award(prizes[index]);
      button.textContent = 'PRIZE AWARDED!';
      spinning = false;
      window.setTimeout(updateAvailability, 2500);
    }, 4300);
  });

  wheel.style.transform = `rotate(${rotation}deg)`;
  updateAvailability();
  window.setInterval(updateAvailability, 60000);
})();
