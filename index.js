const inputs = document.querySelector(".word"),
    hintTag = document.querySelector(".hint span"),
    guessLeft = document.querySelector(".guess span"),
    mistakes = document.querySelector(".wrong span"),
    resetBtn = document.querySelector(".reset"),
    hintBtn = document.querySelector(".showhint"),
    hintElement = document.querySelector(".hint"),
    typeInput = document.querySelector(".type-input");

// Initializing game variables
let word, incorrectLetters = [], correctLetters = [], maxGuesses;
let unalphabeticalChar = 0;

// Disable hint button for 10 seconds
function disableButton() {
    hintBtn.disabled = true;

    hintBtn.style.cursor = "not-allowed";
    hintBtn.style.opacity = "0.5";

    setTimeout(function () {
        hintBtn.disabled = false;

        hintBtn.style.cursor = "pointer";
        hintBtn.style.opacity = "1";


    }, 10000); // réactive le bouton après 10 secondes
}

// Select random word from word list and setting up the game
function startGame() {

    // Disable hint button for 10 seconds
    disableButton();

    alert("New Game Started ! Guess new word");

    unalphabeticalChar = 0;
    incorrectLetters = [];
    correctLetters = [];

    // Hide hint element
    hintElement.style.display = "none";
    hintElement.style.opacity = "0";

    // Choose random word from word list and set up game
    const randWord = cartoonList[Math.floor(Math.random() * cartoonList.length)];
    word = randWord.word;

    maxGuesses = word.length >= 5 ? 8 : 6;

    // Display hint and game stats
    hintTag.innerText = randWord.hint;
    guessLeft.innerText = maxGuesses;
    mistakes.innerText = incorrectLetters;

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
    console.log(correctLetters.length, word.length);
    console.log(unalphabeticalChar);
    if (correctLetters.length === word.length - unalphabeticalChar) {
        alert(`You found the word ! It was ${word.toUpperCase()}`);
        startGame();
    } else if (maxGuesses < 1) {
        alert("You lost ! You don't have remaining guesses");

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
inputs.addEventListener("click", () => typeInput.focus());
document.addEventListener("keydown", () => typeInput.focus());

// Start game
startGame();