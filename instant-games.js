(() => {
  const getBalance = () => window.getRizzleBalance ? window.getRizzleBalance() : Number(localStorage.getItem('rizzleBalance')) || 10000;
  const setBalance = value => window.setRizzleBalance ? window.setRizzleBalance(value) : localStorage.setItem('rizzleBalance', String(value));
  const random = values => values[Math.floor(Math.random() * values.length)];

  const scratchGrid = document.getElementById('scratchGrid');
  const scratchStatus = document.getElementById('scratchStatus');
  const scratchBet = document.getElementById('scratchBet');
  const newScratch = document.getElementById('newScratch');
  const scratchSymbols = ['💎','👑','7️⃣','🍒','⭐'];
  let scratchValues = [];
  let scratched = 0;
  let scratchWager = 0;

  function buildScratch() {
    const wager = Number(scratchBet.value);
    if (getBalance() < wager) return void (scratchStatus.textContent = 'Not enough Rizzle Coins!');
    setBalance(getBalance() - wager);
    scratchWager = wager;
    scratched = 0;
    scratchValues = Array.from({length:6}, () => random(scratchSymbols));
    scratchGrid.innerHTML = '';
    scratchValues.forEach((value, index) => {
      const tile = document.createElement('button');
      tile.type = 'button';
      tile.className = 'scratch-tile';
      tile.textContent = 'RD';
      tile.setAttribute('aria-label', `Reveal panel ${index + 1}`);
      tile.addEventListener('click', () => revealScratch(tile, value));
      scratchGrid.appendChild(tile);
    });
    scratchStatus.textContent = 'Tap each RD panel to reveal your symbols.';
    newScratch.textContent = 'CARD ACTIVE';
    newScratch.disabled = true;
  }

  function revealScratch(tile, value) {
    if (tile.classList.contains('revealed')) return;
    tile.classList.add('revealed');
    tile.textContent = value;
    scratched++;
    if (scratched < 6) return;
    const counts = scratchValues.reduce((all, symbol) => ({...all,[symbol]:(all[symbol] || 0)+1}), {});
    const match = Object.entries(counts).find(([, count]) => count >= 3);
    if (match) {
      const payout = scratchWager * 5;
      setBalance(getBalance() + payout);
      scratchStatus.textContent = `🎉 ${match[0]} MATCH! +${payout.toLocaleString()} Rizzle Coins`;
    } else scratchStatus.textContent = 'No triple this time — try a new card!';
    newScratch.textContent = 'NEW CARD ✨';
    newScratch.disabled = false;
  }

  newScratch?.addEventListener('click', buildScratch);

  const kenoGrid = document.getElementById('kenoGrid');
  const kenoStatus = document.getElementById('kenoStatus');
  const kenoBet = document.getElementById('kenoBet');
  const drawKeno = document.getElementById('drawKeno');
  const selected = new Set();
  const numberButtons = [];
  for (let number=1; number<=20; number++) {
    const button = document.createElement('button');
    button.type = 'button'; button.textContent = number; button.dataset.number = number;
    button.addEventListener('click', () => {
      if (selected.has(number)) selected.delete(number);
      else if (selected.size < 5) selected.add(number);
      else return void (kenoStatus.textContent = 'You already picked 5 numbers.');
      button.classList.toggle('selected', selected.has(number));
      kenoStatus.textContent = selected.size === 5 ? 'Ready to draw!' : `Pick ${5-selected.size} more.`;
    });
    numberButtons.push(button); kenoGrid?.appendChild(button);
  }

  drawKeno?.addEventListener('click', async () => {
    if (selected.size !== 5) return void (kenoStatus.textContent = 'Pick exactly 5 numbers first.');
    const wager = Number(kenoBet.value);
    if (getBalance() < wager) return void (kenoStatus.textContent = 'Not enough Rizzle Coins!');
    setBalance(getBalance() - wager);
    drawKeno.disabled = true;
    const pool = Array.from({length:20}, (_,i) => i+1);
    const drawn = [];
    for (let i=0;i<5;i++) {
      const index = Math.floor(Math.random()*pool.length);
      drawn.push(pool.splice(index,1)[0]);
      kenoStatus.textContent = `Drawing: ${drawn.join(' • ')}`;
      await new Promise(resolve => setTimeout(resolve,260));
    }
    numberButtons.forEach(button => button.classList.toggle('drawn', drawn.includes(Number(button.dataset.number))));
    const matches = drawn.filter(number => selected.has(number)).length;
    const multipliers = [0,0,1,3,10,50];
    const payout = wager * multipliers[matches];
    if (payout) setBalance(getBalance() + payout);
    kenoStatus.textContent = payout ? `🎉 ${matches} matches! +${payout.toLocaleString()} coins` : `${matches} match${matches===1?'':'es'} — try again!`;
    drawKeno.disabled = false;
  });
})();
