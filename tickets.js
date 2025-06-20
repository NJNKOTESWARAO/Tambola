function generateSingleTicket() {
  const ticket = Array.from({ length: 3 }, () => Array(9).fill(""));

  let columnNumbers = Array.from({ length: 9 }, (_, i) => {
    const start = i === 0 ? 1 : i * 10;
    const end = i === 8 ? 90 : start + 9;
    return shuffle(Array.from({ length: end - start + 1 }, (_, x) => x + start));
  });

  for (let row = 0; row < 3; row++) {
    let cols = shuffle([0,1,2,3,4,5,6,7,8]).slice(0,5).sort((a,b) => a-b);
    for (let col of cols) {
      ticket[row][col] = columnNumbers[col].pop();
    }
  }

  return ticket;
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function generateTickets() {
  const count = parseInt(document.getElementById("ticketCount").value);
  if (isNaN(count) || count < 1) {
    alert("Enter a valid number of tickets (1-10)");
    return;
  }

  document.getElementById("animation").style.display = "block";
  document.getElementById("ticketsContainer").innerHTML = "";

  setTimeout(() => {
    const ticketsContainer = document.getElementById("ticketsContainer");
    const generated = new Set();
    const allTickets = [];

    for (let i = 0; i < count; i++) {
      let ticket;
      let ticketStr;
      do {
        ticket = generateSingleTicket();
        ticketStr = JSON.stringify(ticket);
      } while (generated.has(ticketStr));
      generated.add(ticketStr);
      allTickets.push(ticket);

      displayTicket(ticket);
    }

    document.getElementById("animation").style.display = "none";

    // Add share link for the first ticket
    const encoded = btoa(encodeURIComponent(JSON.stringify(allTickets[0])));
    const shareLink = `${window.location.origin}${window.location.pathname}?data=${encoded}`;

    const linkDiv = document.createElement("div");
    linkDiv.innerHTML = `
      <p style="margin-top:20px">Share this ticket:</p>
      <input type="text" value="${shareLink}" readonly onclick="this.select()" style="width:90%;padding:8px">
    `;
    ticketsContainer.appendChild(linkDiv);
  }, 1000);
}

function displayTicket(ticket) {
  const ticketsContainer = document.getElementById("ticketsContainer");
  const div = document.createElement("div");
  div.className = "ticket";

  ticket.forEach(row => {
    row.forEach(cell => {
      const cellDiv = document.createElement("div");
      cellDiv.className = "cell";
      cellDiv.textContent = cell || "";
      div.appendChild(cellDiv);
    });
  });

  ticketsContainer.appendChild(div);
}

function getSharedTicketFromURL() {
  const params = new URLSearchParams(window.location.search);
  const data = params.get("data");
  if (!data) return null;
  try {
    const decoded = decodeURIComponent(atob(data));
    return JSON.parse(decoded);
  } catch (e) {
    console.error("Invalid ticket data");
    return null;
  }
}
