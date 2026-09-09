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

spinBtn.addEventListener("click", spinReels);

updateBalance();
updateSoundButton();
