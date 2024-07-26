const TEXTS = [
    "There once was a man from nantucket.",
    "The quick brown fox jumped over the lazy dog.",
    "lksjd foisjfsnadfsodifmweoif wehfisdfjosdkfj asudfh d78w:",
    "My sister's cat is very fat",
    "I hope all is going well. I look forward to improving my writing skills in this class. My writing abilities have certainly grown vastly over the years.",
    "The AI-powered code completion tool GitHub Copilot generated over 82 billion lines of code within its first year.",
    "Artificial Intelligence has profoundly influenced our everyday lives, and this influence continues to expand.",
    "I like trweash",
    "What is the difference between right and wrong? Good and evil? Do these concepts exist on a spectrum? A powerful tool that can help guide these questions is ethics. At its core, ethics encompasses all facets of society, dictating what humans ought to do. For example, ethics provide the standards that impose reasonable obligations from common vices such as rape, stealing, murder, assault, slander, and fraud. These standards also include those that enjoin common virtues such as honesty, compassion, and loyalty",
    "While ethics has countless philosophical systems and implications that affect everyday life, its practical influence within the professional field cannot be understated.",
    "CAPS 097DFHILSD.SDFU 89UWKJ D,MF 09U3IHF.  KDJFL",
    "You can suggest a new statistic by reaching out to the WCA Software Team. If it's widely interesting and feasible to implement, we might add it!"   
];

let container = document.getElementById("container");
let accuracyDisplay = document.getElementById("accuracy");
let avgAccuracyDisplay = document.getElementById("avg_accuracy");
let wpmDisplay = document.getElementById("wpm");
let avgWpmDisplay = document.getElementById("avg_wpm");
let button = document.querySelector("button");

const charAccuracies = new Map();
const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()~,.?:;' ";
for (let char of characters) {
    if (char == ' ') char = "space";
    charAccuracies.set(char, {correct: 0, total: 0, displayed: false});
}

let TEXT = TEXTS[Math.floor(Math.random() * TEXTS.length)];

let currWpm = 0;
let avgWpm = 0;
let currAccuracy = 0;
let avgAccuracy = 0;
let wrong = 0;
let pointer = 0;
let correct = false;
let rounds = 0;
let startTime = null; 
let endTime = null;
let sessionId;

function startGame() {
    document.addEventListener('keydown', handleKeyDown, true);
    button.removeEventListener("click", startGame, true);
    button.setAttribute("hidden", true);
    wpmDisplay.textContent = `WPM: --`;
    accuracyDisplay.textContent = `Accuracy: --`;
    avgAccuracyDisplay.textContent = "";
    avgWpmDisplay.textContent = "";
}

function createElements(text) {
    container.innerHTML = '';

    for (let i=0; i < text.length; i++) {
        let char = document.createElement("span");
        char.id = i.toString();
        char.className = "";
        char.textContent = text[i];
        container.appendChild(char);
    }
}

function calculateWPM(start, end, text) {
    const elapsedTimeInMinutes = (end - start) / 1000 / 60; // Convert milliseconds to minutes
    const totalCharacters = text.length;
    const totalWords = totalCharacters / 5; // No integer division
    const wpm = totalWords / elapsedTimeInMinutes;
    return wpm;
}

function updateWPM() {
    const currentTime = new Date();
    currWpm = calculateWPM(startTime, currentTime, TEXT.substring(0, pointer));
    wpmDisplay.textContent = `WPM: ${Math.round(currWpm)}`;
    console.log("Playing");
}

function reset() {

    rounds++;
    avgAccuracy += currAccuracy;
    avgWpm += currWpm;

    avgAccuracyDisplay.textContent = `Average Accuracy: ${(avgAccuracy/rounds).toFixed(2)}%`;
    avgWpmDisplay.textContent = `Average WPM: ${Math.round(avgWpm/rounds)}`;
    pointer = 0;
    wrong = 0;
    correct = false;
    currAccuracy = 0;
    startTime = null;
    endTime = null;

    let list = document.querySelector("ul");
    for (const [key, value] of charAccuracies) {
        // CREATE
        if (value.total !== 0 && !value.displayed) {
            const accuracy = ((value.correct / value.total)*100).toFixed(2);
            let charItem = document.createElement("li");
            charItem.id = key;
            charItem.textContent = `'${key}' : ${accuracy}%`;
            value.displayed = true;
            list.appendChild(charItem);
        } 
        // UPDATE
        else if (value.displayed) {
            let charItem = document.getElementById(key);
            const accuracy = ((value.correct / value.total)*100).toFixed(2);
            charItem.textContent = `'${key}' : ${accuracy}%`;
        }
    }

    TEXT = TEXTS[Math.floor(Math.random() * TEXTS.length)];
    createElements(TEXT);
    document.removeEventListener('keydown', handleKeyDown, true);
    button.removeAttribute("hidden"); 
    button.addEventListener("click", startGame, true); 
}

function handleKeyDown(event) {
    event.preventDefault(); // Make sure you don't scroll down with a space
    const key = event.key;
    const shiftPressed = event.shiftKey;

    // Start time as soon as user inputs
    if (!startTime) {
        startTime = new Date();
        sessionId = setInterval(updateWPM, 1000);
    }

    let char = document.getElementById(pointer.toString());
    if (key === TEXT[pointer]) {
        char.className = "correct";
        pointer++;
        
        if (charAccuracies.has(key)) {
            let charData = charAccuracies.get(key);
            charData.total += 1;
            if (!correct) charData.correct += 1;
        }

        correct = false;
        currAccuracy = (((pointer-wrong) / pointer) * 100);
        accuracyDisplay.textContent = `Accuracy: ${currAccuracy.toFixed(2)}%`;

        if (pointer !== TEXT.length) {
            char = document.getElementById(pointer.toString());
            char.className = "current";
        }
        else {
            clearInterval(sessionId);
            endTime = new Date();
            currWpm = calculateWPM(startTime, endTime, TEXT);
            wpmDisplay.textContent = `WPM: ${Math.round(currWpm)}`;
            reset();
        }
    }
    else if (!shiftPressed) {
        if (!correct) {
            wrong++;
            correct = true;
        }
        char.className = "incorrect";
    }

}

createElements(TEXT);
button.addEventListener("click", startGame, true);