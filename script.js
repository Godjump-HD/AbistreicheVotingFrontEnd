const backendUrl = "https://abivoting-api.lostixd8.workers.dev";

// Globale Variablen
let isLoggedIn = false;
let votingFor = null;
let angemeldet = null;

// ---------------- SAVE ENTRY ----------------
async function saveEntry() {
  const text = document.getElementById("text").value;
  const subject = document.getElementById("betreff").value;

  if (!text || !subject) {
    alert("Bitte Titel und Beschreibung ausfüllen!");
    return;
  }

  const res = await fetch(`${backendUrl}/save`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ titel: subject, text })
  });

  const data = await res.json();

  if (res.ok) {
    document.getElementById("text").value = "";
    document.getElementById("betreff").value = "";
    loadEntries();
  } else {
    alert(data.error);
  }
}

// ---------------- LOGIN ----------------
async function login() {
  const username = document.getElementById("userInput").value;
  const password = document.getElementById("passInput").value;

  if (!username || !password) {
    alert("Bitte Benutzername und Passwort eingeben!");
    return;
  }

  const res = await fetch(`${backendUrl}/login`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    username: username,
    password: password
  })
});

  const data = await res.json();

  if (!res.ok) {
    alert(data.error);
    return;
  }

  angemeldet = data.user.username;
  isLoggedIn = true;

  document.getElementById("userInput").value = "";
  document.getElementById("passInput").value = "";
  document.getElementById("userInput").hidden = true;
  document.getElementById("passInput").hidden = true;
  document.getElementById("loginBtn").hidden = true;

  document.getElementById("loggedUser").classList.remove("noLogin");
  document.getElementById("logUser").innerText =
    "Willkommen " + data.user.name;
}

// ---------------- VOTING ----------------
async function vote(type) {
  if (!isLoggedIn) {
    alert("Bitte zuerst einloggen!");
    return;
  }

  if (!votingFor) {
    alert("Bitte zuerst einen Vorschlag auswählen!");
    return;
  }

  const res = await fetch(`${backendUrl}/vote`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      titel: votingFor,
      user: angemeldet,
      type: type
    })
  });

  const data = await res.json();

  if (res.ok) {
    loadEntries();
  } else {
    alert(data.error);
  }
}

function voteGood() {
  vote("good");
}

function voteBad() {
  vote("bad");
}

// ---------------- LOAD ENTRIES ----------------
async function loadEntries() {
  const res = await fetch(`${backendUrl}/entries`);
  const entries = await res.json();

  const container = document.getElementById("entries");
  container.innerHTML = "";

  entries.forEach(entry => {
    const button = document.createElement("button");
    button.innerText =
      `${entry.titel} 👍 ${entry.votes_good} 👎 ${entry.votes_bad}`;
    button.classList.add("entry2");

    button.addEventListener("click", () => {
      document.getElementById("showDes").value = entry.text;
      votingFor = entry.titel;
    });

    container.appendChild(button);
  });
}

// ---------------- INIT ----------------
loadEntries();

