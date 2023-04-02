import MainApp from "./Main.js";

const root = document.getElementById("MainApp");
const app = new MainApp(root);

const speechRecognition = window.webkitSpeechRecognition;
const recognition = new speechRecognition();
const textbox = document.querySelector(".note_body");
const instructions = document.querySelector(".speech_instructions");
const startBtn = document.querySelector(".speech-start");
const stopBtn = document.querySelector(".speech-stop");

let content = "";

recognition.continuous = true;
recognition.interimResults = true;

const startRecognition = () => {
    // textbox.value = "";
    content = " ";
    recognition.start();
    startBtn.style.display = "none";
    stopBtn.style.display = "inline";
};

const stopRecognition = () => {
    recognition.stop();
    stopBtn.style.display = "none";
    startBtn.style.display = "inline";
    instructions.textContent = "Press Start";
};

const updateContent = () => (content = textbox.value);

recognition.onstart = () => (instructions.textContent = "Listening");

recognition.onspeechend = () => {
    instructions.textContent = "No Activity";
    stopBtn.style.display = "none";
    startBtn.style.display = "inline";
};

recognition.onerror = () => {
    instructions.textContent = "Error Occured";
    stopRecognition();
};

recognition.onresult = (event) => {
    const current = event.resultIndex;
    const transcript = event.results[current][0].transcript;
    const isFinal = event.results[current].isFinal;

    if (isFinal) {
        content += transcript;
        textbox.value = content;
    }
};

startBtn.addEventListener("click", startRecognition);
stopBtn.addEventListener("click", stopRecognition);
textbox.addEventListener("input", updateContent);

const sidebarBtn = document.getElementById("sidebarBtn");
const sideBar = document.querySelector(".sidebar");

function openNav() {
    sideBar.classList.add("sidebar_visible");
}

function closeNav() {
    sideBar.classList.remove("sidebar_visible");
}

sidebarBtn.addEventListener("click", () => {
    console.log("Clicked");
    if(sideBar.classList.contains("sidebar_visible")){
        closeNav();
    } else {
        openNav();
    }
});
