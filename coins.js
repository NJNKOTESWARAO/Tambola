// coins.js
const numberGrid = document.getElementById("numberGrid");
const currentNumber = document.getElementById("currentNumber");
const recentNumbers = document.getElementById("recentNumbers");
const startPauseBtn = document.getElementById("startPauseBtn");
const nextBtn = document.getElementById("nextBtn");
const resetBtn = document.getElementById("resetBtn");

let timer = null;
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
  const audioName = num < 10 ? `s${num}` : `d${String(num).padStart(2, '0')}`;
  audio = new Audio(`audio/${audioName}.mp3`);
  audio.play();
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

  // Limit to last 10 picks
  while (recentNumbers.children.length > 10) {
    recentNumbers.removeChild(recentNumbers.firstChild);
  }
}

startPauseBtn.addEventListener("click", () => {
  if (!timerInterval) {
    const selected = document.querySelector("input[name='timer']:checked");
    if (!selected) {
      alert("Please select a timer interval (3s, 5s, or 7s)");
      return;
    }
    timer = parseInt(selected.value);
    timerInterval = setInterval(pickRandomNumber, timer);
    startPauseBtn.textContent = "Pause";
  } else {
    clearInterval(timerInterval);
    timerInterval = null;
    startPauseBtn.textContent = "Start";
  }
});

document.querySelectorAll("input[name='timer']").forEach(radio => {
  radio.addEventListener("click", (e) => {
    if (radio === e.target && radio.checked) {
      if (radio.dataset.checked === "true") {
        radio.checked = false;
        radio.dataset.checked = "false";
      } else {
        radio.dataset.checked = "true";
        document.querySelectorAll("input[name='timer']").forEach(r => {
          if (r !== radio) r.dataset.checked = "false";
        });
      }
    }

    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
      startPauseBtn.textContent = "Start";
    }
  });
});

nextBtn.addEventListener("click", () => {
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
