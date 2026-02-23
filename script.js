async function saveEntry() {
  const text = document.getElementById("text").value;
  const subject = document.getElementById("betreff").value;

  const res = await fetch("https://abistreichevoting.onrender.com/save", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      text: text,
      titel: subject
    })
  });

  if (res.ok) {
    document.getElementById("text").value = "";
    document.getElementById("betreff").value = "";
    loadEntries();
  } else {
    alert("Fehler beim Speichern");
  }
}

const saveBtn = document.getElementById("saveBTN");

var isLoggedIn = false;
var votingFor = null;
var angemeldet;

async function login() {
  const userIn = document.getElementById("userInput").value;
  const passIn = document.getElementById("passInput").value;

  const res = await fetch("https://abistreichevoting.onrender.com/login");
  const entries = await res.json();

  const user = entries.find(e => e.user === userIn && e.password === passIn);

if (!user) {
  // Login fehlgeschlagen
  document.getElementById("userInput").classList.add("wrong");
  document.getElementById("passInput").classList.add("wrong");
} else {
  angemeldet = user.name;
  isLoggedIn = true;
  document.getElementById("userInput").value = "";
  document.getElementById("passInput").value = "";
  document.getElementById("passInput").setAttribute("hidden", "hidden");
  document.getElementById("userInput").setAttribute("hidden", "hidden");
  document.getElementById("loginBtn").setAttribute("hidden", "hidden");
  document.getElementById("loggedUser").classList.toggle("noLogin");
  document.getElementById("logUser").innerText = "Willkommen " + angemeldet;
}
}

async function voteGood() {
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
  } else {
    alert(data.error);
  }
}

async function voteBad() {
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
  } else {
    alert(data.error);
  }
}



async function loadEntries() {
  const res = await fetch("https://abistreichevoting.onrender.com/entries");
  const entries = await res.json();

  const entries2 = document.getElementById("entries");
  entries2.innerHTML = "";

  entries.forEach((entry) => {
    const button = document.createElement("button");
    button.innerText = entry.titel;
    button.classList.add("entry2");

    button.addEventListener("click", () => {
      document.getElementById("showDes").value = entry.text;
      votingFor = entry.titel;
    });

    entries2.appendChild(button);
  });
}


loadEntries();

/*
          To-Do:
- User Log In
- Count Votes


*/
