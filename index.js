const inputs = document.querySelector(".word"),
    hintTag = document.querySelector(".hint span"),
    guessLeft = document.querySelector(".guess span"),
    mistakes = document.querySelector(".wrong span"),
    score = document.querySelector(".score span"),
    resetBtn = document.querySelector(".reset"),
    hintBtn = document.querySelector(".showhint"),
    hintElement = document.querySelector(".hint"),
    typeInput = document.querySelector(".type-input"),
    slider = document.querySelector(".mySlider"),
    timer = document.querySelector(".timer span");

// Initializing game variables
let word, incorrectLetters = [], correctLetters = [], maxGuesses;
let unalphabeticalChar = 0;
let timeoutId = undefined;
let audio = undefined;
let scoreValue = 0;
let countdown = undefined;
let timerInterval = undefined;

// Function who update the timer
function updateTime() {
    timer.innerText = countdown;

    // Vérification si le timer est écoulé
    if (countdown === 0) {
        clearInterval(timerInterval);

        openModal("Game Over", "The time is up !");

        startGame();
    } else {
        countdown--;
    }
}

// Disable hint button for 10 seconds
function disableButton() {
    hintBtn.disabled = true;

    hintBtn.style.cursor = "not-allowed";
    hintBtn.style.opacity = "0.5";

    // Disable previous timeout
    clearTimeout(timeoutId);

    timeoutId = setTimeout(function () {
        hintBtn.disabled = false;

        hintBtn.style.cursor = "pointer";
        hintBtn.style.opacity = "1";


    }, 10000); // réactive le bouton après 10 secondes
}

// Function who start the audio at the beginning of the game
function startAudio(link) {
    const audio = new Audio(link);
    audio.muted = false;
    audio.play();

    return audio;
}

// Function who stop the audio at the end of the game
function stopAudio(audioPlayed) {
    audioPlayed.muted = true;
    audioPlayed.pause();
}

// Function who change the volume of the audio
function audioVolume() {
    audio.volume = slider.value / 100;
}

// Function who open the modal
function openModal(title, text) {
    var modal = document.getElementById("myModal");
    var modalTitle = document.getElementById("modalTitle");
    var modalText = document.getElementById("modalText");

    modalTitle.textContent = title;
    modalText.textContent = text;
    modal.style.display = "block";

    // Ajout d'un écouteur d'événements pour la touche "Entrée"
    document.addEventListener("keydown", handleKeyPress);
}

// Function who close the modal
function closeModal() {
    var modal = document.getElementById("myModal");
    modal.style.display = "none";

    // Suppression de l'écouteur d'événements pour la touche "Entrée"
    document.removeEventListener("keydown", handleKeyPress);
}

// Function who close the modal when the user click on the enter key
function handleKeyPress(event) {
    // Vérification si la touche appuyée est "Entrée" ou "Echap"
    if (event.keyCode === 13 || event.keyCode === 27) {
        closeModal();
    }
}

// Select random word from word list and setting up the game
function startGame() {
    // Disable hint button for 10 seconds
    disableButton();

    // Reset timer
    timerInterval = clearInterval(timerInterval);
    countdown = 20;

    // Stop the previous audio
    if (audio !== undefined) stopAudio(audio);

    openModal("New Game Started !", "Guess new word !");

    // Lancement du timer toutes les secondes (1000 millisecondes)
    timerInterval = setInterval(updateTime, 1000);

    unalphabeticalChar = 0;
    incorrectLetters = [];
    correctLetters = [];

    // Hide hint element
    hintElement.style.display = "none";
    hintElement.style.opacity = "0";

    // Choose random word from word list and set up game
    const randWord = cartoonList[Math.floor(Math.random() * cartoonList.length)];
    word = randWord.word;

    // Start the audio
    audio = startAudio(randWord.audio);

    // Keep the current audio's volume
    audioVolume();

    maxGuesses = word.length >= 5 ? 8 : 6;

    // Display hint and game stats
    hintTag.innerText = randWord.hint;
    guessLeft.innerText = maxGuesses;
    mistakes.innerText = incorrectLetters;
    score.innerText = scoreValue;

    // Create input for each letter
    inputs.innerHTML = "";
    for (let i = 0; i < word.length; i++) {
        const input = document.createElement("input");
        input.type = "text";
        input.disabled = true;

        // If the letter is a space, comma, period, hyphen, or apostrophe, fill it in immediately
        if (word[i] === "," || word[i] === "." || word[i] === "-" || word[i] === "'") {
            input.value = word[i];
            unalphabeticalChar++;
        }

        // If it's a space, I don't print de border of the input
        if (word[i] === " ") {
            input.style.border = "none";
            unalphabeticalChar++;
        }

        // Add input to DOM
        inputs.appendChild(input);
    }
}

// Handle user input and update game
function handleInput(e) {

    // Ignore non-alphabetical characters and letters that have already been guessed
    const key = e.target.value.toLowerCase();
    if (key.match(/^[a-z]+$/i) && !incorrectLetters.includes(`${key}`) && !correctLetters.includes(`${key}`)) {

        // Update correct guess
        if (word.includes(key)) {
            for (let i = 0; i < word.length; i++) {
                if (word[i] === key) {
                    inputs.querySelectorAll("input")[i].value += key;
                }
            }

            // if the words contain more than one time the letter, I need to add it more than one time in the list
            if (word.split(key).length - 1 > 1) {
                for (let i = 0; i < word.split(key).length - 1; i++) {
                    correctLetters += key;
                }
            } else {
                correctLetters += key;
            }
        } else {
            // Update incorrect guess
            maxGuesses--;
            incorrectLetters.push(`${key}`);
            mistakes.innerText = incorrectLetters;
        }
    }

    // Update remain guess and check for win/lose conditions
    guessLeft.innerText = maxGuesses;
    if (correctLetters.length === word.length - unalphabeticalChar) {
        openModal("You Win !", `You found the word ! It was ${word.toUpperCase()}`);

        // Stop the audio
        stopAudio(audio);

        // Update score
        scoreValue += 1;

        // Start new game
        startGame();
    } else if (maxGuesses < 1) {
        openModal("You Lost !", "You don't have remaining guesses. Try again !");

        // Reset score
        scoreValue = 0;

        for (let i = 0; i < word.length; i++) {
            // Fill inputs with correct words
            inputs.querySelectorAll("input")[i].value = word[i];
        }
    }

    // Clear input field after each guess
    typeInput.value = "";
}

// Show hint element
function showHintElement() {
    hintElement.style.display = "block";
    hintElement.style.opacity = "1";
}

// Setup event listeners
resetBtn.addEventListener("click", startGame);
hintBtn.addEventListener("click", showHintElement);
typeInput.addEventListener("input", handleInput);
slider.addEventListener("input", audioVolume);
inputs.addEventListener("click", () => typeInput.focus());
document.addEventListener("keydown", () => typeInput.focus());

openModal("Welcome !", "Guess the cartoon by pressing the guess button !");

// Start game
startGame();