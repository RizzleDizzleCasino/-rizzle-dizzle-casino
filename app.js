const symbols = ["7️⃣", "🍒", "🔔", "💎", "🍋", "⭐"];

let balance = Number(localStorage.getItem("rizzleBalance")) || 10000;
let soundOn = localStorage.getItem("rizzleSound") !== "off";
let audioContext = null;

const balanceEl = document.getElementById("balance");
const statusEl = document.getElementById("status");
const spinBtn = document.getElementById("spin");
const betEl = document.getElementById("bet");
const muteBtn = document.getElementById("mute");
const machineEl = document.querySelector(".machine");
const dailyBonusBtn = document.getElementById("dailyBonus");
const dailyBonusStatus = document.getElementById("dailyBonusStatus");

const DAILY_BONUS = 1000;
const BONUS_WAIT = 24 * 60 * 60 * 1000;


const reels = [
  document.getElementById("r1"),
  document.getElementById("r2"),
  document.getElementById("r3")
];

function updateBalance() {
  balanceEl.textContent = balance.toLocaleString();
  localStorage.setItem("rizzleBalance", balance);
}

function updateSoundButton() {
  if (!muteBtn) return;

  muteBtn.textContent = soundOn
    ? "🔊 SOUND ON"
    : "🔇 SOUND OFF";
}

async function unlockAudio() {
  if (!soundOn) return;

  try {
    if (!audioContext) {
      audioContext = new (
        window.AudioContext ||
        window.webkitAudioContext
      )();
    }

    if (audioContext.state === "suspended") {
      await audioContext.resume();
    }
  } catch (error) {
    console.log("Audio unavailable:", error);
  }
}

function playTone(frequency, duration, volume = 0.08) {
  if (!soundOn || !audioContext) return;

  try {
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    oscillator.type = "sine";
    oscillator.frequency.value = frequency;

    gain.gain.setValueAtTime(
      volume,
      audioContext.currentTime
    );

    gain.gain.exponentialRampToValueAtTime(
      0.001,
      audioContext.currentTime + duration
    );

    oscillator.start();
    oscillator.stop(
      audioContext.currentTime + duration
    );
  } catch (error) {
    console.log("Sound error:", error);
  }
}

function randomSymbol() {
  return symbols[
    Math.floor(Math.random() * symbols.length)
  ];
}

function sleep(ms) {
  return new Promise(resolve =>
    setTimeout(resolve, ms)
  );
}

async function spinReels() {
  const bet = Number(betEl.value);

  await unlockAudio();

  if (balance < bet) {
    statusEl.textContent =
      "Not enough Rizzle Coins!";
    playTone(100, 0.2, 0.05);
    return;
  }

  spinBtn.disabled = true;
  betEl.disabled = true;

  reels.forEach(reel =>
    reel.classList.add("spinning")
  );

  balance -= bet;
  updateBalance();

  statusEl.textContent = "RIZZLING... 🎰";
  playTone(180, 0.12);

  for (let i = 0; i < 10; i++) {
    reels.forEach(reel => {
      reel.textContent = randomSymbol();
    });

    await sleep(80);
  }

  const result = [
    randomSymbol(),
    randomSymbol(),
    randomSymbol()
  ];

  reels.forEach((reel, index) => {
    reel.textContent = result[index];
    reel.classList.remove("spinning");
  });

  let multiplier = 0;

  if (
    result[0] === "7️⃣" &&
    result[1] === "7️⃣" &&
    result[2] === "7️⃣"
  ) {
    multiplier = 20;
  } else if (
    result[0] === result[1] &&
    result[1] === result[2]
  ) {
    multiplier = 8;
  } else if (
    result[0] === result[1] ||
    result[1] === result[2] ||
    result[0] === result[2]
  ) {
    multiplier = 2;
  }

  const win = bet * multiplier;

  if (win > 0) {
    machineEl.classList.add("win");

    setTimeout(() => {
      machineEl.classList.remove("win");
    }, 1600);

    if (multiplier === 20) {
      machineEl.classList.add("jackpot");

      setTimeout(() => {
        machineEl.classList.remove("jackpot");
      }, 2200);
    }

    balance += win;

    statusEl.textContent =
      `🎉 RIZZLE WIN! +${win.toLocaleString()} COINS 🎉`;

    if (multiplier === 20) {
      playTone(880, 0.45, 0.12);

      setTimeout(() => {
        playTone(1100, 0.35, 0.1);
      }, 180);
    } else {
      playTone(520, 0.35, 0.12);
    }
  } else {
    statusEl.textContent =
      "No win — give it another Rizzle! 🎰";

    playTone(120, 0.18, 0.05);
  }

  updateBalance();

  spinBtn.disabled = false;
  betEl.disabled = false;
}

if (muteBtn) {
  muteBtn.addEventListener("click", async () => {
    soundOn = !soundOn;

    localStorage.setItem(
      "rizzleSound",
      soundOn ? "on" : "off"
    );

    updateSoundButton();

    if (soundOn) {
      await unlockAudio();
      playTone(440, 0.12, 0.06);
    }
  });
}
function updateDailyBonus() {
  if (!dailyBonusBtn || !dailyBonusStatus) return;

  const lastClaim = Number(
    localStorage.getItem("rizzleDailyBonus")
  ) || 0;

  const timeLeft = BONUS_WAIT - (Date.now() - lastClaim);

  if (timeLeft <= 0) {
    dailyBonusBtn.disabled = false;
    dailyBonusBtn.textContent = "🎁 CLAIM DAILY 1,000 COINS";
    dailyBonusStatus.textContent = "Your daily bonus is ready!";
    return;
  }

  dailyBonusBtn.disabled = true;

  const hours = Math.floor(timeLeft / 3600000);
  const minutes = Math.floor(
    (timeLeft % 3600000) / 60000
  );

  dailyBonusBtn.textContent = "🎁 DAILY BONUS CLAIMED";
  dailyBonusStatus.textContent =
    `Next bonus in ${hours}h ${minutes}m`;
}

if (dailyBonusBtn) {
  dailyBonusBtn.addEventListener("click", async () => {
    const lastClaim = Number(
      localStorage.getItem("rizzleDailyBonus")
    ) || 0;

    if (Date.now() - lastClaim < BONUS_WAIT) {
      updateDailyBonus();
      return;
    }

    balance += DAILY_BONUS;

    localStorage.setItem(
      "rizzleDailyBonus",
      Date.now().toString()
    );

    updateBalance();
    updateDailyBonus();

    statusEl.textContent =
      "🎁 DAILY BONUS! +1,000 RIZZLE COINS 🎉";

    await unlockAudio();
    playTone(660, 0.2, 0.1);

    setTimeout(() => {
      playTone(880, 0.3, 0.1);
    }, 180);
  });
}

updateDailyBonus();

setInterval(updateDailyBonus, 60000);
spinBtn.addEventListener("click", spinReels);

updateBalance();
updateSoundButton();

/* Rizzle Blackjack */

const bjDealerHand = document.getElementById("dealerHand");
const bjPlayerHand = document.getElementById("playerHand");
const bjDealerScore = document.getElementById("dealerScore");
const bjPlayerScore = document.getElementById("playerScore");
const bjStatus = document.getElementById("blackjackStatus");
const bjBet = document.getElementById("blackjackBet");

const bjDeal = document.getElementById("dealBlackjack");
const bjHit = document.getElementById("hitBlackjack");
const bjStand = document.getElementById("standBlackjack");

let bjDeck = [];
let bjPlayer = [];
let bjDealer = [];
let bjCurrentBet = 0;
let bjPlaying = false;

function makeDeck() {
  const suits = ["♠️", "♥️", "♦️", "♣️"];
  const ranks = [
    "A", "2", "3", "4", "5", "6", "7",
    "8", "9", "10", "J", "Q", "K"
  ];

  const deck = [];

  suits.forEach(suit => {
    ranks.forEach(rank => {
      deck.push({
        rank: rank,
        suit: suit
      });
    });
  });

  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    const temp = deck[i];
    deck[i] = deck[j];
    deck[j] = temp;
  }

  return deck;
}

function bjValue(cards) {
  let total = 0;
  let aces = 0;

  cards.forEach(card => {
    if (card.rank === "A") {
      total += 11;
      aces++;
    } else if (
      card.rank === "K" ||
      card.rank === "Q" ||
      card.rank === "J"
    ) {
      total += 10;
    } else {
      total += Number(card.rank);
    }
  });

  while (total > 21 && aces > 0) {
    total -= 10;
    aces--;
  }

  return total;
}

function showCard(card) {
  return card.rank + card.suit;
}

function showBlackjack(hideDealer) {
  bjPlayerHand.textContent =
    bjPlayer.map(showCard).join("  ");

  bjPlayerScore.textContent =
    "Score: " + bjValue(bjPlayer);

  if (hideDealer && bjPlaying) {
    bjDealerHand.textContent =
      showCard(bjDealer[0]) + "  🂠";

    bjDealerScore.textContent = "Score: ?";
  } else {
    bjDealerHand.textContent =
      bjDealer.map(showCard).join("  ");

    bjDealerScore.textContent =
      "Score: " + bjValue(bjDealer);
  }
}

function finishBlackjack(message, payout) {
  bjPlaying = false;

  bjHit.disabled = true;
  bjStand.disabled = true;
  bjDeal.disabled = false;
  bjBet.disabled = false;

  if (payout > 0) {
    balance += payout;
    updateBalance();
  }

  showBlackjack(false);
  bjStatus.textContent = message;
}

function dealBJ() {
  if (bjPlaying) return;

  bjCurrentBet = Number(bjBet.value);

  if (balance < bjCurrentBet) {
    bjStatus.textContent =
      "Not enough Rizzle Coins!";
    return;
  }

  balance -= bjCurrentBet;
  updateBalance();

  bjDeck = makeDeck();

const p1 = bjDeck.pop();
const p2 = bjDeck.pop();
const d1 = bjDeck.pop();
const d2 = bjDeck.pop();

bjPlayer = [p1, p2];
bjDealer = [d1, d2];

  showBlackjack(true);

  bjStatus.textContent = "Hit or stand?";

  const playerTotal = bjValue(bjPlayer);
  const dealerTotal = bjValue(bjDealer);

  if (playerTotal === 21 && dealerTotal === 21) {
    finishBlackjack(
      "Push — both have Blackjack.",
      bjCurrentBet
    );
  } else if (playerTotal === 21) {
    const payout =
      Math.floor(bjCurrentBet * 2.5);

    finishBlackjack(
      "🃏 BLACKJACK! +" +
      payout +
      " COINS",
      payout
    );
  } else if (dealerTotal === 21) {
    finishBlackjack(
      "Dealer has Blackjack.",
      0
    );
  }
}

function hitBJ() {
  if (!bjPlaying) return;

  bjPlayer.push(bjDeck.pop());

  showBlackjack(true);

  const total = bjValue(bjPlayer);

  if (total > 21) {
    finishBlackjack(
      "Bust — dealer wins.",
      0
    );
  } else if (total === 21) {
    standBJ();
  }
}

function standBJ() {
  if (!bjPlaying) return;

  while (bjValue(bjDealer) < 17) {
    bjDealer.push(bjDeck.pop());
  }

  const playerTotal = bjValue(bjPlayer);
  const dealerTotal = bjValue(bjDealer);

  if (dealerTotal > 21) {
    finishBlackjack(
      "🎉 Dealer busts! You win!",
      bjCurrentBet * 2
    );
  } else if (playerTotal > dealerTotal) {
    finishBlackjack(
      "🎉 You win!",
      bjCurrentBet * 2
    );
  } else if (playerTotal === dealerTotal) {
    finishBlackjack(
      "Push — bet returned.",
      bjCurrentBet
    );
  } else {
    finishBlackjack(
      "Dealer wins.",
      0
    );
  }
}

if (bjDeal) {
  bjDeal.addEventListener("click", dealBJ);
}

if (bjHit) {
  bjHit.addEventListener("click", hitBJ);
}

if (bjStand) {
  bjStand.addEventListener("click", standBJ);
}

const bjGameCard =
  document.getElementById("blackjackCard");

if (bjGameCard) {
  bjGameCard.addEventListener("click", function () {
    document.getElementById("blackjack")
      .scrollIntoView({
        behavior: "smooth"
      });
  });
}

