function generateTicket() {
  const ticket = [];

  for (let i = 0; i < 9; i++) {
    const min = i * 10 + 1;
    const max = i === 8 ? 90 : (i + 1) * 10;
    const colNumbers = [];
    while (colNumbers.length < 3) {
      const num = Math.floor(Math.random() * (max - min + 1)) + min;
      if (!colNumbers.includes(num)) colNumbers.push(num);
    }
    colNumbers.sort((a, b) => a - b);
    ticket.push(colNumbers);
  }

  // transpose and add 4 empty cells per row
  const final = Array.from({ length: 3 }, () => Array(9).fill(""));

  for (let col = 0; col < 9; col++) {
    const nums = ticket[col];
    for (let row = 0; row < 3; row++) {
      final[row][col] = nums[row];
    }
  }

  for (let row = 0; row < 3; row++) {
    const empty = new Set();
    while (empty.size < 4) {
      empty.add(Math.floor(Math.random() * 9));
    }
    empty.forEach(col => final[row][col] = "");
  }

  return final;
}

function renderTicket(ticket) {
  const wrapper = document.createElement("div");
  wrapper.className = "ticket"; // this is what applies the borders via CSS

  const table = document.createElement("table");

  ticket.forEach(row => {
    const tr = document.createElement("tr");
    row.forEach(cell => {
      const td = document.createElement("td");
      td.textContent = cell || ""; // avoid showing "undefined"
      tr.appendChild(td);
    });
    table.appendChild(tr);
  });

  wrapper.appendChild(table);
  return wrapper;
}

function generateUniqueTickets(count) {
  const tickets = [];
  const seen = new Set();

  while (tickets.length < count) {
    const t = generateTicket();
    const key = JSON.stringify(t);
    if (!seen.has(key)) {
      seen.add(key);
      tickets.push(t);
    }
  }

  return tickets;
}

document.getElementById("generateBtn").addEventListener("click", () => {
  const count = parseInt(document.getElementById("ticketCount").value);
  if (!count || count < 1 || count > 10) {
    return alert("Enter ticket count between 1 and 10");
  }

  const anim = document.getElementById("animation");
  anim.classList.remove("hidden");

  setTimeout(() => {
    anim.classList.add("hidden");

    const container = document.getElementById("ticketContainer");
    container.innerHTML = "";

    const tickets = generateUniqueTickets(count);
    tickets.forEach(ticket => {
      const ticketElement = renderTicket(ticket);
      container.appendChild(ticketElement);
    });
  }, 1000);
});
