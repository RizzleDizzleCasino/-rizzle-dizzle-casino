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

const blackjackCard = document.getElementById("blackjackCard");
const dealerHandEl = document.getElementById("dealerHand");
const playerHandEl = document.getElementById("playerHand");
const dealerScoreEl = document.getElementById("dealerScore");
const playerScoreEl = document.getElementById("playerScore");
const blackjackStatusEl = document.getElementById("blackjackStatus");

const blackjackBetEl = document.getElementById("blackjackBet");
const dealBlackjackBtn = document.getElementById("dealBlackjack");
const hitBlackjackBtn = document.getElementById("hitBlackjack");
const standBlackjackBtn = document.getElementById("standBlackjack");

let blackjackDeck = [];
let playerCards = [];
let dealerCards = [];
let blackjackBet = 0;
let blackjackActive = false;

function createBlackjackDeck() {
  const suits = ["♠", "♥", "♦", "♣"];
  const ranks = [
    "A", "2", "3", "4", "5", "6", "7",
    "8", "9", "10", "J", "Q", "K"
  ];

  const deck = [];

  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push({ rank, suit });
    }
  }

  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  return deck;
}

function blackjackCardValue(card) {
  if (["J", "Q", "K"].includes(card.rank)) return 10;
  if (card.rank === "A") return 11;
  return Number(card.rank);
}

function blackjackScore(cards) {
  let total = 0;
  let aces = 0;

  for (const card of cards) {
    total += blackjackCardValue(card);

    if (card.rank === "A") {
      aces++;
    }
  }

  while (total > 21 && aces > 0) {
    total -= 10;
    aces--;
  }

  return total;
}

function displayBlackjackCard(card) {
  const red = card.suit === "♥" || card.suit === "♦";

  return `<span style="color:${red ? "#ff4d5a" : "#ffffff"}">
    ${card.rank}${card.suit}
  </span>`;
}

function updateBlackjackDisplay(hideDealer = true) {
  playerHandEl.innerHTML =
    playerCards.map(displayBlackjackCard).join(" ");

  playerScoreEl.textContent =
    `Score: ${blackjackScore(playerCards)}`;

  if (hideDealer && blackjackActive) {
    dealerHandEl.innerHTML =
      displayBlackjackCard(dealerCards[0]) + " 🂠";

    dealerScoreEl.textContent = "Score: ?";
  } else {
    dealerHandEl.innerHTML =
      dealerCards.map(displayBlackjackCard).join(" ");

    dealerScoreEl.textContent =
      `Score: ${blackjackScore(dealerCards)}`;
  }
}

function endBlackjack(message, payout = 0) {
  blackjackActive = false;

  hitBlackjackBtn.disabled = true;
  standBlackjackBtn.disabled = true;
  dealBlackjackBtn.disabled = false;
  blackjackBetEl.disabled = false;

  if (payout > 0) {
    balance += payout;
    updateBalance();
  }

  updateBlackjackDisplay(false);
  blackjackStatusEl.textContent = message;
}

async function dealBlackjack() {
  if (blackjackActive) return;

  blackjackBet = Number(blackjackBetEl.value);

  if (balance < blackjackBet) {
    blackjackStatusEl.textContent =
      "Not enough Rizzle Coins!";
    return;
  }

  await unlockAudio();

  balance -= blackjackBet;
  updateBalance();

  blackjackDeck = createBlackjackDeck();

  playerCards = [
    blackjackDeck.pop(),
    blackjackDeck.pop()
  ];

  dealerCards = [
    blackjackDeck.pop(),
    blackjackDeck.pop()
  ];

  blackjackActive = true;

  dealBlackjackBtn.disabled = true;
  hitBlackjackBtn.disabled = false;
  standBlackjackBtn.disabled = false;
  blackjackBetEl.disabled = true;

  updateBlackjackDisplay(true);

  blackjackStatusEl.textContent =
    "Hit or stand?";

  playTone(300, 0.12, 0.06);

  const playerScore = blackjackScore(playerCards);
  const dealerScore = blackjackScore(dealerCards);

  if (playerScore === 21 && dealerScore === 21) {
    endBlackjack(
      "Push — both have Blackjack.",
      blackjackBet
    );
  } else if (playerScore === 21) {
    endBlackjack(
      `🃏 BLACKJACK! +${Math.floor(blackjackBet * 2.5)} COINS`,
      Math.floor(blackjackBet * 2.5)
    );

    playTone(880, 0.35, 0.1);
  } else if (dealerScore === 21) {
    endBlackjack("Dealer has Blackjack.");
  }
}

async function hitBlackjack() {
  if (!blackjackActive) return;

  playerCards.push(blackjackDeck.pop());

  updateBlackjackDisplay(true);

  playTone(350, 0.1, 0.05);

  const score = blackjackScore(playerCards);

  if (score > 21) {
    endBlackjack("Bust — dealer wins.");
  } else if (score === 21) {
    standBlackjack();
  }
}

async function standBlackjack() {
  if (!blackjackActive) return;

  while (blackjackScore(dealerCards) < 17) {
    dealerCards.push(blackjackDeck.pop());
    updateBlackjackDisplay(false);

    playTone(250, 0.1, 0.05);
    await sleep(350);
  }

  const playerScore = blackjackScore(playerCards);
  const dealerScore = blackjackScore(dealerCards);

  if (dealerScore > 21) {
    endBlackjack(
      `🎉 Dealer busts! +${blackjackBet * 2} COINS`,
      blackjackBet * 2
    );

    playTone(650, 0.3, 0.1);
  } else if (playerScore > dealerScore) {
    endBlackjack(
      `🎉 You win! +${blackjackBet * 2} COINS`,
      blackjackBet * 2
    );

    playTone(650, 0.3, 0.1);
  } else if (playerScore === dealerScore) {
    endBlackjack(
      "Push — your bet is returned.",
      blackjackBet
    );
  } else {
    endBlackjack("Dealer wins.");
  }
}

if (dealBlackjackBtn) {
  dealBlackjackBtn.addEventListener(
    "click",
    dealBlackjack
  );
}

if (hitBlackjackBtn) {
  hitBlackjackBtn.addEventListener(
    "click",
    hitBlackjack
  );
}

if (standBlackjackBtn) {
  standBlackjackBtn.addEventListener(
    "click",
    standBlackjack
  );
}

if (blackjackCard) {
  blackjackCard.addEventListener("click", () => {
    document.getElementById("blackjack")
      .scrollIntoView({
        behavior: "smooth"
      });
  });
}
