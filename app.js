oconst symbols = ["7️⃣", "🍒", "🔔", "💎", "🍋", "⭐"];
let soundOn = true;
let audioContext;

const muteBtn = document.getElementById("mute");

function playTone(frequency, duration, volume = 0.08) {
  if (!soundOn) return;

  audioContext = audioContext || new (window.AudioContext || window.webkitAudioContext)();

  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();

  oscillator.connect(gain);
  gain.connect(audioContext.destination);

  oscillator.frequency.value = frequency;
  oscillator.type = "sine";
  gain.gain.value = volume;

  oscillator.start();
  gain.gain.exponentialRampToValueAtTime(
    0.001,
    audioContext.currentTime + duration
  );
  oscillator.stop(audioContext.currentTime + duration);
}

muteBtn.addEventListener("click", () => {
  soundOn = !soundOn;
  muteBtn.textContent = soundOn ? "🔊 SOUND ON" : "🔇 SOUND OFF";
});

let balance = Number(localStorage.getItem("rizzleBalance")) || 10000;

const balanceEl = document.getElementById("balance");
const statusEl = document.getElementById("status");
const spinBtn = document.getElementById("spin");
const betEl = document.getElementById("bet");

const reels = [
  document.getElementById("r1"),
  document.getElementById("r2"),
  document.getElementById("r3")
];

function updateBalance() {
  balanceEl.textContent = balance.toLocaleString();
  localStorage.setItem("rizzleBalance", balance);
}

function randomSymbol() {
  return symbols[Math.floor(Math.random() * symbols.length)];
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function spinReels() {
  const bet = Number(betEl.value);
  if (!audioContext) {
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
}

if (audioContext.state === "suspended") {
  audioContext.resume();
}

  if (balance < bet) {
    statusEl.textContent = "Not enough Rizzle Coins!";
    return;
  }

  spinBtn.disabled = true;
  betEl.disabled = true;
  reels.forEach(reel => reel.classList.add("spinning"));

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
  });
  reels.forEach(reel => reel.classList.remove("spinning"));

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
    playTone(multiplier === 20 ? 880 : 520, 0.35, 0.12);
    document.querySelector(".machine").classList.add("win");

setTimeout(() => {
  document.querySelector(".machine").classList.remove("win");
}, 1600);

if (multiplier === 20) {
  document.querySelector(".machine").classList.add("jackpot");

  setTimeout(() => {
    document.querySelector(".machine").classList.remove("jackpot");
  }, 2200);
}
    balance += win;
    statusEl.textContent =
      `🎉 RIZZLE WIN! +${win.toLocaleString()} COINS 🎉`;
  } else {
    statusEl.textContent = "No win — give it another Rizzle! 🎰";
    playTone(120, 0.18, 0.05);
  }
  playTone(120, 0.18, 0.05);

  updateBalance();

  spinBtn.disabled = false;
  betEl.disabled = false;
}

spinBtn.addEventListener("click", spinReels);

updateBalance();
