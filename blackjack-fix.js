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
  const balanceEl = document.getElementById('balance');

  if (!dealerHand || !playerHand || !dealerScore || !playerScore || !status || !betSelect || !dealBtn || !hitBtn || !standBtn) return;

  let deck = [];
  let player = [];
  let dealer = [];
  let currentBet = 0;
  let playing = false;

  const getBalance = () => Number(localStorage.getItem('rizzleBalance')) || 10000;
  const setBalance = value => {
    localStorage.setItem('rizzleBalance', String(value));
    if (balanceEl) balanceEl.textContent = value.toLocaleString();
  };

  function makeDeck() {
    const suits = ['♠️', '♥️', '♦️', '♣️'];
    const ranks = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
    const cards = [];
    for (const suit of suits) {
      for (const rank of ranks) cards.push({ rank, suit });
    }
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

  const cardText = card => `${card.rank}${card.suit}`;

  function render(hideDealer = true) {
    playerHand.textContent = player.map(cardText).join('   ');
    playerScore.textContent = `Score: ${value(player)}`;
    if (hideDealer && playing) {
      dealerHand.textContent = `${cardText(dealer[0])}   🂠`;
      dealerScore.textContent = 'Score: ?';
    } else {
      dealerHand.textContent = dealer.map(cardText).join('   ');
      dealerScore.textContent = `Score: ${value(dealer)}`;
    }
  }

  function finish(message, payout = 0) {
    playing = false;
    hitBtn.disabled = true;
    standBtn.disabled = true;
    dealBtn.disabled = false;
    betSelect.disabled = false;
    if (payout > 0) setBalance(getBalance() + payout);
    render(false);
    status.textContent = message;
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

    dealBtn.disabled = true;
    hitBtn.disabled = false;
    standBtn.disabled = false;
    betSelect.disabled = true;
    render(true);
    status.textContent = 'Hit or stand?';

    const p = value(player);
    const d = value(dealer);
    if (p === 21 && d === 21) finish('Push — both have Blackjack.', currentBet);
    else if (p === 21) finish('🃏 BLACKJACK! You win!', Math.floor(currentBet * 2.5));
    else if (d === 21) finish('Dealer has Blackjack.', 0);
  }

  function hit() {
    if (!playing) return;
    player.push(deck.pop());
    render(true);
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

  dealBtn.addEventListener('click', e => { e.stopImmediatePropagation(); deal(); }, true);
  hitBtn.addEventListener('click', e => { e.stopImmediatePropagation(); hit(); }, true);
  standBtn.addEventListener('click', e => { e.stopImmediatePropagation(); stand(); }, true);

  status.textContent = 'Choose your bet and deal.';
})();
