(() => {
  const dealerHand = document.getElementById('dealerHand');
  const playerHand = document.getElementById('playerHand');
  const dealerScore = document.getElementById('dealerScore');
  const playerScore = document.getElementById('playerScore');
  const status = document.getElementById('blackjackStatus');
  const betSelect = document.getElementById('blackjackBet');
  const dealBtn = document.getElementById('dealBlackjack');
  const hitBtn = document.getElementById('hitBlackjack');
  const standBtn = document.getElementById('standBlackjack');
  const doubleBtn = document.getElementById('doubleBlackjack');
  const balanceEl = document.getElementById('balance');

  if (!dealerHand || !playerHand || !dealerScore || !playerScore || !status || !betSelect || !dealBtn || !hitBtn || !standBtn || !doubleBtn) return;

  let deck = [];
  let player = [];
  let dealer = [];
  let currentBet = 0;
  let playing = false;

  const getBalance = () => {
    if (window.getRizzleBalance) return window.getRizzleBalance();
    const stored = localStorage.getItem('rizzleBalance');
    const value = stored === null ? 10000 : Number(stored);
    return Number.isFinite(value) ? value : 10000;
  };
  const setBalance = value => {
    if (window.setRizzleBalance) window.setRizzleBalance(value);
    else {
      localStorage.setItem('rizzleBalance', String(value));
      if (balanceEl) balanceEl.textContent = value.toLocaleString(undefined, { maximumFractionDigits: 1 });
    }
  };

  function makeDeck() {
    const suits = ['♠', '♥', '♦', '♣'];
    const ranks = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
    const cards = [];
    for (const suit of suits) for (const rank of ranks) cards.push({ rank, suit });
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    return cards;
  }

  function value(cards) {
    let total = 0;
    let aces = 0;
    for (const card of cards) {
      if (card.rank === 'A') { total += 11; aces++; }
      else if (['K','Q','J'].includes(card.rank)) total += 10;
      else total += Number(card.rank);
    }
    while (total > 21 && aces > 0) { total -= 10; aces--; }
    return total;
  }

  function cardHTML(card) {
    const red = card.suit === '♥' || card.suit === '♦';
    return `<span class="playing-card${red ? ' red' : ''}"><span class="card-rank">${card.rank}</span><span class="card-suit">${card.suit}</span></span>`;
  }

  function hiddenCardHTML() {
    return '<span class="playing-card card-back" aria-label="hidden dealer card"><span>RD</span></span>';
  }

  function render(hideDealer = true) {
    playerHand.innerHTML = player.map(cardHTML).join('');
    playerScore.textContent = `Score: ${value(player)}`;
    if (hideDealer && playing) {
      dealerHand.innerHTML = cardHTML(dealer[0]) + hiddenCardHTML();
      dealerScore.textContent = 'Score: ?';
    } else {
      dealerHand.innerHTML = dealer.map(cardHTML).join('');
      dealerScore.textContent = `Score: ${value(dealer)}`;
    }
  }

  function updateButtons() {
    hitBtn.disabled = !playing;
    standBtn.disabled = !playing;
    const canDouble = playing && player.length === 2 && getBalance() >= currentBet;
    doubleBtn.disabled = !canDouble;
    dealBtn.disabled = playing;
    betSelect.disabled = playing;
  }

  function finish(message, payout = 0) {
    playing = false;
    if (payout > 0) setBalance(getBalance() + payout);
    render(false);
    status.textContent = message;
    dealBtn.textContent = 'NEW HAND 🃏';
    updateButtons();
  }

  function deal() {
    if (playing) return;
    currentBet = Number(betSelect.value);
    const balance = getBalance();
    if (!currentBet || currentBet < 1) {
      status.textContent = 'Choose a valid bet.';
      return;
    }
    if (balance < currentBet) {
      status.textContent = 'Not enough Rizzle Coins!';
      return;
    }

    setBalance(balance - currentBet);
    deck = makeDeck();
    player = [deck.pop(), deck.pop()];
    dealer = [deck.pop(), deck.pop()];
    playing = true;
    dealBtn.textContent = 'DEAL 🃏';
    render(true);
    status.textContent = 'Hit, stand, or double down.';
    updateButtons();

    const p = value(player);
    const d = value(dealer);
    if (p === 21 && d === 21) {
      finish('Push — both have Blackjack.', currentBet);
    } else if (p === 21) {
      const payout = currentBet * 2.5;
      finish(`🃏 BLACKJACK! 3:2 payout — +${payout.toLocaleString()} coins`, payout);
    } else if (d === 21) {
      finish('Dealer has Blackjack.', 0);
    }
  }

  function hit() {
    if (!playing) return;
    player.push(deck.pop());
    render(true);
    doubleBtn.disabled = true;
    const total = value(player);
    if (total > 21) finish('Bust — dealer wins.', 0);
    else if (total === 21) stand();
  }

  function stand() {
    if (!playing) return;
    while (value(dealer) < 17) dealer.push(deck.pop());
    const p = value(player);
    const d = value(dealer);
    if (d > 21) finish('🎉 Dealer busts! You win!', currentBet * 2);
    else if (p > d) finish('🎉 You win!', currentBet * 2);
    else if (p === d) finish('Push — bet returned.', currentBet);
    else finish('Dealer wins.', 0);
  }

  function doubleDown() {
    if (!playing || player.length !== 2) return;
    const balance = getBalance();
    if (balance < currentBet) {
      status.textContent = 'Not enough Rizzle Coins to double.';
      doubleBtn.disabled = true;
      return;
    }
    setBalance(balance - currentBet);
    currentBet *= 2;
    player.push(deck.pop());
    render(true);
    hitBtn.disabled = true;
    doubleBtn.disabled = true;
    const total = value(player);
    if (total > 21) finish('Double down bust — dealer wins.', 0);
    else stand();
  }

  dealBtn.addEventListener('click', e => { e.stopImmediatePropagation(); deal(); }, true);
  hitBtn.addEventListener('click', e => { e.stopImmediatePropagation(); hit(); }, true);
  standBtn.addEventListener('click', e => { e.stopImmediatePropagation(); stand(); }, true);
  doubleBtn.addEventListener('click', e => { e.stopImmediatePropagation(); doubleDown(); }, true);

  dealerHand.innerHTML = hiddenCardHTML() + hiddenCardHTML();
  playerHand.innerHTML = hiddenCardHTML() + hiddenCardHTML();
  status.textContent = 'Choose your bet and deal.';
  updateButtons();
})();
