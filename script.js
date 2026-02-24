const backendUrl = "https://abivoting-api.lostixd8.workers.dev/"; // Dein Render Backend

// Globale Variablen
let isLoggedIn = false;
let votingFor = null;
let angemeldet = null;

// --- Neue Einträge speichern ---
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
    body: JSON.stringify({ text, titel: subject, votes: 0, votedBy: [] })
  });

  if (res.ok) {
    document.getElementById("text").value = "";
    document.getElementById("betreff").value = "";
    loadEntries();
  } else {
    alert("Fehler beim Speichern");
  }
}

// --- Benutzer Login ---
async function login() {
  const userIn = document.getElementById("userInput").value;
  const passIn = document.getElementById("passInput").value;

  if (!userIn || !passIn) {
    alert("Bitte Benutzername und Passwort eingeben!");
    return;
  }

  const res = await fetch(`${backendUrl}/login`);
  const users = await res.json();

  const user = users.find(u => u.user === userIn && u.password === passIn);

  if (!user) {
    document.getElementById("userInput").classList.add("wrong");
    document.getElementById("passInput").classList.add("wrong");
  } else {
    angemeldet = user.user; // oder user.name, je nach Backend
    isLoggedIn = true;

    document.getElementById("userInput").value = "";
    document.getElementById("passInput").value = "";
    document.getElementById("userInput").setAttribute("hidden", "hidden");
    document.getElementById("passInput").setAttribute("hidden", "hidden");
    document.getElementById("loginBtn").setAttribute("hidden", "hidden");

    document.getElementById("loggedUser").classList.remove("noLogin");
    document.getElementById("logUser").innerText = "Willkommen " + angemeldet;
  }
}

// --- Voting Helper ---
async function vote(type) {
  if (!isLoggedIn) {
    alert("Bitte zuerst einloggen!");
    return;
  }

  if (!votingFor) {
    alert("Bitte zuerst einen Vorschlag auswählen!");
    return;
  }

  const endpoint = type === "good" ? "voteGood" : "voteBad";

  const res = await fetch(`${backendUrl}/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      titel: votingFor,
      user: angemeldet
    })
  });

  const data = await res.json();

  if (res.ok) {
    console.log("Erfolgreich gevotet!");
    loadEntries(); // Optional: Einträge neu laden, um Vote-Counts zu aktualisieren
  } else {
    alert(data.error);
  }
}

async function voteGood() {
  if (!votingFor || !angemeldet) return alert("Bitte erst Eintrag auswählen und einloggen");

  const res = await fetch("https://abistreichevoting.onrender.com/vote", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      titel: votingFor,
      user: angemeldet,
      type: "good"
    })
  });

  const data = await res.json();
  if (res.ok) {
    console.log("Erfolgreich gevotet");
    loadEntries(); // optional, um neue Votes direkt zu sehen
  } else {
    alert(data.error);
  }
}

async function voteBad() {
  if (!votingFor || !angemeldet) return alert("Bitte erst Eintrag auswählen und einloggen");

  const res = await fetch("https://abistreichevoting.onrender.com/vote", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      titel: votingFor,
      user: angemeldet,
      type: "bad"
    })
  });

  const data = await res.json();
  if (res.ok) {
    console.log("Erfolgreich gevotet");
    loadEntries(); // optional
  } else {
    alert(data.error);
  }
}

// --- Alle Einträge laden ---
async function loadEntries() {
  const res = await fetch(`${backendUrl}/entries`);
  const entries = await res.json();

  const container = document.getElementById("entries");
  container.innerHTML = "";

  entries.forEach(entry => {
    const button = document.createElement("button");
    button.innerText = entry.titel;
    button.classList.add("entry2");

    button.addEventListener("click", () => {
      document.getElementById("showDes").value = entry.text;
      votingFor = entry.titel;
    });

    container.appendChild(button);
  });
}

// --- Initiales Laden ---
loadEntries();


