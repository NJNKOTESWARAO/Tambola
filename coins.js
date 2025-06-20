let picked = [];
let autoInterval = null;
let currentVoice = null;

function generateNumberGrid() {
  const grid = document.getElementById("numberGrid");
  grid.innerHTML = "";
  for (let i = 1; i <= 90; i++) {
    const cell = document.createElement("div");
    cell.className = "gridNumber";
    cell.id = `num-${i}`;
    cell.textContent = i;
    grid.appendChild(cell);
  }
}

function pickCoin() {
  if (picked.length >= 90) return;

  let num;
  do {
    num = Math.floor(Math.random() * 90) + 1;
  } while (picked.includes(num));

  picked.push(num);

  document.getElementById("currentNumber").textContent = num;

  const cell = document.getElementById(`num-${num}`);
  if (cell) cell.classList.add("picked");

  updateRecent();

  // Stop previous voice
  if (currentVoice && !currentVoice.paused) {
    currentVoice.pause();
    currentVoice.currentTime = 0;
  }

  const voiceFile = num < 10 ? `0${num}.mp3` : `${num}.mp3`;
  currentVoice = new Audio(voiceFile);
  currentVoice.play();
}

function manualPick() {
  if (autoInterval !== null) return; // Prevent if auto is active
  pickCoin();
}

function toggleAutoPick() {
  const button = document.getElementById("startPauseBtn");
  const nextBtn = document.getElementById("nextBtn");
  const selected = document.querySelector('input[name="timer"].toggled');

  if (!selected) {
    alert("Please select a timer before starting.");
    return;
  }

  const ms = parseInt(selected.value);

  if (autoInterval === null) {
    button.textContent = "Pause";
    autoInterval = setInterval(pickCoin, ms);
    nextBtn.disabled = true;
  } else {
    clearInterval(autoInterval);
    autoInterval = null;
    button.textContent = "Start Auto Pick";
    nextBtn.disabled = false;
  }
}

function updateTimerBehavior() {
  document.querySelectorAll('input[name="timer"]').forEach(input => {
    input.addEventListener("click", function () {
      if (this.classList.contains("toggled")) {
        this.checked = false;
        this.classList.remove("toggled");

        if (autoInterval !== null) toggleAutoPick(); // Pause auto if timer removed
      } else {
        document.querySelectorAll('input[name="timer"]').forEach(i => i.classList.remove("toggled"));
        this.classList.add("toggled");

        if (autoInterval !== null) {
          clearInterval(autoInterval);
          autoInterval = setInterval(pickCoin, parseInt(this.value));
        }
      }
    });
  });
}

function updateRecent() {
  const recent = picked.slice(-10);
  const container = document.getElementById("recentNumbers");
  container.innerHTML = "";
  recent.forEach(num => {
    const span = document.createElement("span");
    span.textContent = num;
    container.appendChild(span);
  });
}

function resetGame() {
  picked = [];
  document.getElementById("currentNumber").textContent = "";
  document.getElementById("recentNumbers").innerHTML = "";
  generateNumberGrid();

  if (autoInterval !== null) {
    clearInterval(autoInterval);
    autoInterval = null;
  }

  document.getElementById("startPauseBtn").textContent = "Start Auto Pick";
  document.getElementById("nextBtn").disabled = false;

  document.querySelectorAll('input[name="timer"]').forEach(input => {
    input.checked = false;
    input.classList.remove("toggled");
  });

  if (currentVoice && !currentVoice.paused) {
    currentVoice.pause();
    currentVoice.currentTime = 0;
  }
}

// Initialize
generateNumberGrid();
updateTimerBehavior();
