(() => {
  const diceFaces = ['⚀','⚁','⚂','⚃','⚄','⚅'];
  const redNumbers = new Set([1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36]);
  const getBalance = () => window.getRizzleBalance ? window.getRizzleBalance() : Number(localStorage.getItem('rizzleBalance')) || 10000;
  const setBalance = value => window.setRizzleBalance ? window.setRizzleBalance(value) : localStorage.setItem('rizzleBalance', String(value));

  function selectorGame(containerId, choiceSelector, actionId, betId, statusId, play) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const choices = [...container.querySelectorAll(choiceSelector)];
    const action = document.getElementById(actionId);
    const bet = document.getElementById(betId);
    const status = document.getElementById(statusId);
    let choice = null;
    choices.forEach(button => button.addEventListener('click', () => {
      choice = button.dataset.choice;
      choices.forEach(item => item.classList.toggle('selected', item === button));
    }));
    action.addEventListener('click', async () => {
      const wager = Number(bet.value);
      const balance = getBalance();
      if (!choice) return void (status.textContent = 'Choose an option first.');
      if (balance < wager) return void (status.textContent = 'Not enough Rizzle Coins!');
      setBalance(balance - wager);
      action.disabled = true;
      choices.forEach(item => item.disabled = true);
      await play(choice, wager, status);
      action.disabled = false;
      choices.forEach(item => item.disabled = false);
    });
  }

  selectorGame('rouletteGame','[data-choice]','spinRoulette','rouletteBet','rouletteStatus', async (choice, wager, status) => {
    const numberEl = document.getElementById('rouletteNumber');
    const ball = document.getElementById('rouletteBall');
    status.textContent = 'RIZZLING THE WHEEL...';
    ball.classList.add('rolling');
    for (let i=0;i<16;i++) { numberEl.textContent = Math.floor(Math.random()*37); await new Promise(r => setTimeout(r,65+i*5)); }
    const number = Math.floor(Math.random()*37);
    const colour = number === 0 ? 'green' : redNumbers.has(number) ? 'red' : 'black';
    numberEl.textContent = number;
    numberEl.dataset.colour = colour;
    ball.classList.remove('rolling');
    const won = choice === colour;
    const payout = won ? wager * (colour === 'green' ? 36 : 2) : 0;
    if (payout) setBalance(getBalance() + payout);
    status.textContent = won ? `🎉 ${number} ${colour.toUpperCase()} — +${payout.toLocaleString()} coins!` : `${number} ${colour.toUpperCase()} — try again!`;
  });

  selectorGame('highLowGame','[data-choice]','rollDice','highLowBet','highLowStatus', async (choice, wager, status) => {
    const display = document.getElementById('diceDisplay');
    status.textContent = 'ROLLING...';
    for (let i=0;i<10;i++) { display.textContent = `${diceFaces[Math.floor(Math.random()*6)]} ${diceFaces[Math.floor(Math.random()*6)]}`; await new Promise(r => setTimeout(r,70)); }
    const a = Math.floor(Math.random()*6)+1, b = Math.floor(Math.random()*6)+1, total = a+b;
    display.textContent = `${diceFaces[a-1]} ${diceFaces[b-1]}`;
    const result = total === 7 ? 'seven' : total < 7 ? 'low' : 'high';
    const won = result === choice;
    const payout = won ? wager * (result === 'seven' ? 5 : 2) : 0;
    if (payout) setBalance(getBalance() + payout);
    status.textContent = won ? `🎉 Total ${total} — +${payout.toLocaleString()} coins!` : `Total ${total} — try again!`;
  });

  document.getElementById('rouletteCard')?.addEventListener('click', () => document.getElementById('rouletteGame')?.scrollIntoView({behavior:'smooth'}));
  document.getElementById('highLowCard')?.addEventListener('click', () => document.getElementById('highLowGame')?.scrollIntoView({behavior:'smooth'}));
})();
