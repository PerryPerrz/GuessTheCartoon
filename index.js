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
    timer = document.querySelector(".timer span"),
    cartoonNum = document.querySelector(".cartoon span");

// Initializing game variables
let word, incorrectLetters = [], correctLetters = [], maxGuesses;
let unalphabeticalChar = 0;
let timeoutId = undefined;
let audio = undefined;
let scoreValue = 0;
let countdown = undefined;
let timerInterval = undefined;
let randWord = undefined;
let picture = undefined;
var modalQueue = []; // File d'attente pour les modales
let isModalOpen = false;
let cartoonsGuessedList = [];
let cartoonsListSize = cartoonList.length;

// Function who update the timer
function updateTime() {
    timer.innerText = countdown;

    // Vérification si le timer est écoulé
    if (countdown === 0) {
        clearInterval(timerInterval);

        openModalQueue("Game Over", "The time is up !", false);

        scoreValue = 0;
        score.innerText = scoreValue;

        // Utilisation de l'attente avec async/await
        (async function () {
            await attendreBoolenTrue();

            // Start game
            startGame();
        })();
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

// Fonction pour ouvrir une fenêtre modale et ajouter à la file d'attente
function openModalQueue(title, text, isVictoryModal) {
    isModalOpen = true;
    var modal = document.getElementById("myModal");
    modal.style.display = "block";

    modalQueue.push({
        title: title,
        text: text
    }); // Ajouter à la file d'attente

    openModal(isVictoryModal); // Appeler directement la première modale
}

// Fonction pour passer à la prochaine fenêtre modale dans la file d'attente
function nextModal() {
    // Then we remove the picture
    resetPicture();

    var modal = document.getElementById("myModal");

    // Retirer la première modale de la file d'attente
    modalQueue.shift();

    // Afficher la prochaine modale s'il y en a
    if (modalQueue.length > 0) {
        openModal();
    } else {
        isModalOpen = false;
        closeModal();
    }
}

// Fonction pour ouvrir une fenêtre modale
function openModal(isVictoryModal) {
    // If it's a victory modal, display the picture
    if (isVictoryModal) {
        displayPicture();
    }

    var modalTitle = document.getElementById("modalTitle");
    var modalText = document.getElementById("modalText");

    var currentModal = modalQueue[0];
    modalTitle.textContent = currentModal.title;
    modalText.textContent = currentModal.text;

    // Ajout de l'écouteur d'événements pour la touche "Entrée" ou "Echap"
    document.addEventListener("keydown", handleKeyPress);
}

// Function who close the modal
function closeModal() {
    var modal = document.getElementById("myModal");
    modal.style.display = "none";

    // Suppression de l'écouteur d'événements pour la touche "Entrée" ou "Echap"
    document.removeEventListener("keydown", handleKeyPress);
}

// Function who close the modal when the user click on the enter key
function handleKeyPress(event) {
    // Vérification si la touche appuyée est "Entrée" ou "Echap"
    if (event.keyCode === 13 || event.keyCode === 27) {
        nextModal();
    }
}

// Function who display the cartoon's picture
function displayPicture() {
    // Getting the cartoon's picture
    picture = document.getElementById("picture");

    // Display the picture
    picture.src = randWord.picture;
    picture.alt = randWord.word;
}

function resetPicture() {
    // Getting the cartoon's picture
    picture = document.getElementById("picture");

    // Reset the picture
    picture.src = "";
    picture.alt = "";
}

function attendreBoolenTrue() {
    return new Promise(function (resolve) {
        if (isModalOpen === false) {
            resolve();
        } else {
            var interval = setInterval(function () {
                if (isModalOpen === false) {
                    clearInterval(interval);
                    resolve();
                }
            }, 100); // Vérification toutes les 100 millisecondes
        }
    });
}

function launchGuess() {
    openModalQueue("New Game Started !", "Guess new word !", false);

    scoreValue = 0;
    score.innerText = scoreValue;

    // Utilisation de l'attente avec async/await
    (async function () {
        await attendreBoolenTrue();

        // Start game
        startGame();
    })();
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

    // Lancement du timer toutes les secondes (1000 millisecondes)
    timerInterval = setInterval(updateTime, 1000);

    unalphabeticalChar = 0;
    incorrectLetters = [];
    correctLetters = [];

    // Hide hint element
    hintElement.style.display = "none";
    hintElement.style.opacity = "0";

    // Reset the cartoon's list if it's empty
    if (cartoonList.length === 0) {
        cartoonList = cartoonsGuessedList;
        cartoonsGuessedList = [];
    }

    // Choose random word from word list and set up game
    randWord = cartoonList.splice(Math.floor(Math.random() * cartoonList.length), 1)[0];
    cartoonsGuessedList.push(randWord);

    cartoonNum.innerText = cartoonsGuessedList.length + " / " + cartoonsListSize;

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
        // Stop the timer
        timerInterval = clearInterval(timerInterval);

        openModalQueue("You Win !", `You found the word ! It was ${word.toUpperCase()}`, true);

        openModalQueue("New Game Started !", "Guess new word !", false);

        // Update score
        scoreValue += 1;
        score.innerText = scoreValue;

        // Utilisation de l'attente avec async/await
        (async function () {
            await attendreBoolenTrue();

            // Stop the audio
            stopAudio(audio);

            // Start game
            startGame();
        })();
    } else if (maxGuesses < 1) {
        // Stop the timer
        timerInterval = clearInterval(timerInterval);

        openModalQueue("You Lost !", "You don't have remaining guesses. Try again !", false);

        // Reset score
        scoreValue = 0;
        score.innerText = scoreValue;

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
resetBtn.addEventListener("click", launchGuess);
hintBtn.addEventListener("click", showHintElement);
typeInput.addEventListener("input", handleInput);
slider.addEventListener("input", audioVolume);
inputs.addEventListener("click", () => typeInput.focus());
document.addEventListener("keydown", () => typeInput.focus());

openModalQueue("Welcome !", "Guess the cartoon by pressing the guess button !", false);

openModalQueue("New Game Started !", "Guess new word !", false);

// Utilisation de l'attente avec async/await
(async function () {
    await attendreBoolenTrue();

    // Start game
    startGame();
})();