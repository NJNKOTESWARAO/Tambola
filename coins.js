const numberGrid = document.getElementById("numberGrid");
const currentNumber = document.getElementById("currentNumber");
const recentNumbers = document.getElementById("recentNumbers");
const startPauseBtn = document.getElementById("startPauseBtn");
const nextBtn = document.getElementById("nextBtn");
const resetBtn = document.getElementById("resetBtn");

let timerInterval = null;
let pickedNumbers = [];
let audio = null;

// Create number grid
for (let i = 1; i <= 90; i++) {
  const cell = document.createElement("div");
  cell.textContent = i;
  cell.id = `cell-${i}`;
  numberGrid.appendChild(cell);
}

function speakNumber(num) {
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
  }
  const padded = String(num).padStart(2, '0');
  audio = new Audio(`audio/${padded}.mp3`);
  audio.play().catch(() => {
    console.warn(`Audio file not found: ${padded}.mp3`);
  });
}

function pickRandomNumber() {
  if (pickedNumbers.length >= 90) return;
  let next;
  do {
    next = Math.floor(Math.random() * 90) + 1;
  } while (pickedNumbers.includes(next));

  pickedNumbers.push(next);
  document.getElementById(`cell-${next}`).classList.add("picked");
  currentNumber.textContent = next;
  speakNumber(next);

  const span = document.createElement("span");
  span.textContent = next;
  recentNumbers.appendChild(span);
  while (recentNumbers.children.length > 10) {
    recentNumbers.removeChild(recentNumbers.firstChild);
  }
}

startPauseBtn.addEventListener("click", () => {
  startPauseBtn.classList.add("clicked");
  setTimeout(() => startPauseBtn.classList.remove("clicked"), 150);

  if (!timerInterval) {
    const selected = document.querySelector("input[name='timer']:checked");
    if (!selected) {
      alert("Please select a timer interval (3s, 5s, or 7s)");
      return;
    }
    const interval = parseInt(selected.value);
    timerInterval = setInterval(pickRandomNumber, interval);
    startPauseBtn.textContent = "Pause";
  } else {
    clearInterval(timerInterval);
    timerInterval = null;
    startPauseBtn.textContent = "Start";
  }
});

document.querySelectorAll("input[name='timer']").forEach(radio => {
  radio.addEventListener("click", (e) => {
    if (radio.dataset.checked === "true") {
      radio.checked = false;
      radio.dataset.checked = "false";
      radio.parentElement.classList.remove("selected");
    } else {
      radio.dataset.checked = "true";
      document.querySelectorAll("input[name='timer']").forEach(r => {
        r.dataset.checked = "false";
        r.parentElement.classList.remove("selected");
      });
      radio.parentElement.classList.add("selected");
    }

    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
      startPauseBtn.textContent = "Start";
    }
  });
});

nextBtn.addEventListener("click", () => {
  nextBtn.classList.add("clicked");
  setTimeout(() => nextBtn.classList.remove("clicked"), 150);

  if (timerInterval) {
    alert("Please pause auto mode before using Next");
    return;
  }
  pickRandomNumber();
});

resetBtn.addEventListener("click", () => {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  pickedNumbers = [];
  currentNumber.textContent = "--";
  recentNumbers.innerHTML = "";
  numberGrid.querySelectorAll("div").forEach(cell => cell.classList.remove("picked"));
  startPauseBtn.textContent = "Start";
});
