import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";

import {
 getAuth,
 GoogleAuthProvider,
 signInWithPopup,
 signOut,
 onAuthStateChanged
}
from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

import {
 getFirestore,
 collection,
 addDoc,
 getDocs,
 query,
 orderBy
}
from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";


const firebaseConfig = {
 apiKey: "AIzaSyAgPjIYyXOIQNlrm2VYFM1-OseYmfFNiic",
  authDomain: "teadetetahvel.firebaseapp.com",
  projectId: "teadetetahvel",
  storageBucket: "teadetetahvel.firebasestorage.app",
  messagingSenderId: "156276179702",
  appId: "1:156276179702:web:a33d916070535f6973e2d7",
  measurementId: "G-4DLXQ58J76"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const provider = new GoogleAuthProvider();

let currentUser = null;

const loginBtn =
document.getElementById("loginBtn");

const logoutBtn =
document.getElementById("logoutBtn");

const addEventCard =
document.getElementById("addEventCard");

loginBtn.onclick = async () => {
    await signInWithPopup(auth, provider);
};

logoutBtn.onclick = async () => {
    await signOut(auth);
};

onAuthStateChanged(auth, (user) => {

    currentUser = user;

    if(user){

        loginBtn.classList.add("hidden");
        logoutBtn.classList.remove("hidden");

        addEventCard.classList.remove("hidden");

        document.getElementById("userInfo").innerText =
            user.displayName;

    } else {

        loginBtn.classList.remove("hidden");
        logoutBtn.classList.add("hidden");

        addEventCard.classList.add("hidden");

        document.getElementById("userInfo").innerText =
            "Külaline";
    }

});

document.getElementById("saveBtn")
.addEventListener("click", saveEvent);

async function saveEvent(){

    if(!currentUser) return;

    const title =
    document.getElementById("title").value;

    const date =
    document.getElementById("date").value;

    const description =
    document.getElementById("description").value;

    await addDoc(collection(db,"events"),{

        title,
        date,
        description,
        createdBy: currentUser.uid

    });

    loadEvents();
}

async function loadEvents(){

    const box =
    document.getElementById("events");

    box.innerHTML = "";

    const q = query(
        collection(db,"events"),
        orderBy("date")
    );

    const snapshot =
    await getDocs(q);

    let firstEvent = null;

    snapshot.forEach((doc)=>{

        const e = doc.data();

        if(!firstEvent){
            firstEvent = e;
        }

        box.innerHTML += `
            <div class="event">
                <h3>${e.title}</h3>
                <p>${e.date}</p>
                <p>${e.description}</p>
            </div>
        `;
    });

    if(firstEvent){

        document.getElementById("nextEvent").innerHTML = `
            <h4>${firstEvent.title}</h4>
            <p>${firstEvent.date}</p>
        `;
    }
}

loadEvents();