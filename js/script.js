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

recognition.continuous = false;
recognition.interimResults = true;

const startRecognition = () => {
    textbox.value = "";
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
    startBtn.style.display = "block";
};

recognition.onerror = () => {
    instructions.textContent = "Error Occured";
    stopRecognition();
};

recognition.onresult = (event) => {
    const current = event.resultIndex;
    const transcript = event.results[current][0].transcript;
    content += transcript;
    textbox.value = content;
};

startBtn.addEventListener("click", startRecognition);
stopBtn.addEventListener("click", stopRecognition);
textbox.addEventListener("input", updateContent);
