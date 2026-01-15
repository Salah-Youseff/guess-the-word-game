'use strict';
// Setting Game Name
const gameName = "Guess The Word";
document.title = gameName;
document.querySelector("h1").innerText = gameName;
document.querySelector("footer").innerText = `© ${new Date().getFullYear()} ${gameName} Game`;

// Setting Game Options
const numberOfTries = 6;
let currentTry = 1;
let threeHints = 3;
let helpTimes = 2;
// Manage Words
const messageArea = document.querySelector(".message");
const hint = document.querySelector(".hint");
const hintsMessage = document.querySelector(".hints-message");
// Object Of Words And Their Hints
const objedtOfWords = {
    PYTHON: "A high-level programming language known for its readability.",
    JAVASCRIPT: "A versatile scripting language primarily used for web development.",
    HTML: "The standard markup language for creating web pages.",
    CSS: "A stylesheet language used to describe the presentation of a document.",
    JAVA: "A high-level, class-based, object-oriented programming language.",
    RUBY: "A dynamic, open-source programming language with a focus on simplicity.",
    SWIFT: "A powerful programming language for iOS and macOS app development.",
    KOTLIN: "A modern programming language that runs on the Java Virtual Machine (JVM).",
    TYPESCRIPT: "A superset of JavaScript that adds static typing.",
    PHP: "A popular general-purpose scripting language especially suited to web development."
};
// Select Random Word
let randomWord = Object.keys(objedtOfWords)[Math.floor(Math.random() * Object.keys(objedtOfWords).length)].toUpperCase();
// Get Number Of Letters In The Random Word
let numberOflettres = randomWord.length;
// Display Number Of Hints Available
hint.innerHTML = `Hint: <span>${threeHints}</span>`;

// Generate Input Fields and Handle Input Events and Hints and Guesses
function generateInput() {
    const inputcontainer = document.querySelector(".inputs");
    // Create Rows Of Tries
    for (let i = 1; i <= numberOfTries; i++) {
        const tryDiv = document.createElement("div");
        tryDiv.classList.add(`try-${i}`);
        tryDiv.innerHTML = `<span>Try ${i}</span>`;
        inputcontainer.appendChild(tryDiv);
        if (i !== 1) tryDiv.classList.add("disabled-input");
        // Create Letters Inputs
        for (let j = 1; j <= randomWord.length; j++) {
            const input = document.createElement("input");
            input.type = "text";
            input.id = `guess-${i}-letter-${j}`;
            input.maxLength = 1;
            tryDiv.appendChild(input);
        }
    }
    // Focus First Input on Load
    inputcontainer.children[0].children[1].focus();
    // Disable All Inputs Except First Try
    const inputsInDisabledDiv = document.querySelectorAll(".disabled-input input");
    inputsInDisabledDiv.forEach((input) => (input.disabled = true));
    // Handle Input Events
    const allInputs = document.querySelectorAll(".inputs input");
    // Looping On All Inputs
    allInputs.forEach((input, index) => {
        // Convert to Uppercase
        input.addEventListener("input", function() {
            this.value = this.value.toUpperCase();
            // Move to Next Input And Focus It And Cheek If The Input Is Already Filled And The Next Input Is Available
            const nextInput = allInputs[index + 1];
            if (nextInput && this.value !== "") {
                nextInput.focus();
            }
        });

        // Handle Backspace Key
        input.addEventListener("keydown", function(event) {
            // Getting All Inputs As Array
            const currentIndex = Array.from(allInputs).indexOf(event.target); // ot this
            // Movning To Next Input Using ArrowRight
            if (event.key === "ArrowRight") {
                const nextInput = currentIndex + 1;
                if (nextInput < allInputs.length) allInputs[nextInput].focus();
                // Movning To Previous Input Using ArrowLeft
            } else if (event.key === "ArrowLeft") {
                const prevInput = currentIndex - 1;
                if (prevInput >= 0) allInputs[prevInput].focus();
            }
        });
    });    
}
    // Handle Hint Click
    // Generator Function To Yield Hints One By One
function* hintsGenerator(word) {
    yield `Hint 1: The word means: "${objedtOfWords[word]}"`;
    yield `Hint 2: The first letter is " ${word[0]} ".`;
    yield `Hint 3: The last letter is " ${word[word.length - 1]} ".`;
}
// Using The Generator Function
const nextHint = hintsGenerator(randomWord);
// Handle Hint Click Event
hint.addEventListener("click", () => {
    hintsMessage.style.display = "block";
    const { value, done } = nextHint.next();
    if (!done && threeHints > 0) {
        threeHints--;
        let listOfHints = document.createElement("span");
        let textOfHints = document.createTextNode(value);
        listOfHints.appendChild(textOfHints);
        hintsMessage.appendChild(listOfHints);
        listOfHints.style.display = "block";
        hint.innerHTML = `Hint: <span>${threeHints}</span>`;
        if (threeHints === 0) {
            hint.disabled = true;
            let noMoreHints = document.createTextNode("No More Hints Available");
            hintsMessage.appendChild(noMoreHints);
        }
    }
});

const guessButton = document.querySelector(".check");
guessButton.addEventListener("click", handleGuesses);

function handleGuesses() {
    let successGeuss = true;
    for (let i = 1; i <= numberOflettres; i++) {
        const inputField = document.querySelector(`#guess-${currentTry}-letter-${i}`);
        const inputValue = inputField.value.toUpperCase();
        const actualLetter = randomWord[i - 1];
        // Check if Letter is Correct
        if (inputValue === actualLetter) {
            // Correct Letter in Correct Place
            inputField.classList.add("in-place");
        } else if (randomWord.includes(inputValue) && inputValue !== "") {
            // Correct Letter in Wrong Place
            inputField.classList.add("not-in-place");
            successGeuss = false;
        } else {
            // Wrong Letter
            inputField.classList.add("wrong-letter");
            successGeuss = false;
        }
    }
    // Check if User Win or Lose
    if (successGeuss) {
        // disable the Check button
        guessButton.disabled = true;
        // Show Success Message and close it on click
        messageArea.style.display = "block";
        messageArea.innerHTML = `Congratulations! You've guessed the word <span>${randomWord}</span>`;
        messageArea.addEventListener("click", function() {
            messageArea.style.display = "none";
            window.location.reload();
        });
        // Disable All Inputs
        const allTries = document.querySelectorAll(".inputs > div");
        allTries.forEach((tridiv) => tridiv.classList.add("disabled-input:not(.try-1)"));
    } else {
        // Disable Current Try Inputs
        if (currentTry === numberOfTries && !successGeuss) {
            // disable the Check button
            guessButton.disabled = true;
            hint.disabled = true;
            helpButton.disabled = true;
            // Show Failure Message and close it on click
            messageArea.style.display = "block";
            messageArea.style.color = "red";
            messageArea.innerHTML = `Game Over! The correct word was <span>${randomWord}</span>`;
            messageArea.addEventListener("click", function() {
                messageArea.style.display = "none";
                window.location.reload();
            });
            return;
        }
        const currentTryDiv = document.querySelector(`.try-${currentTry}`);
        console.log(currentTryDiv);
        currentTryDiv.classList.add("disabled-input");
        const currentTryInputs = document.querySelectorAll(`.try-${currentTry} input`);
        currentTryInputs.forEach((input) => (input.disabled = true));
        currentTry++;
        // Check if User Has More Tries Left
        // Move to Next Try
        const nextTryDiv = document.querySelector(`.try-${currentTry}`);
        nextTryDiv.classList.remove("disabled-input");
        const nextTryInputs = document.querySelectorAll(`.try-${currentTry} input`);
        nextTryInputs.forEach((input) => (input.disabled = false));
        // Move to Next Try First Input and Focus It
        let getFocusNextTryInput = document.querySelector(`#guess-${currentTry}-letter-1`);
        if (getFocusNextTryInput) getFocusNextTryInput.focus();
    }
}


// Handle Help Button
const helpButton = document.querySelector(".help");
function helpHandler() {
    helpButton.innerText = `Help: ${helpTimes} Left`;
    helpButton.addEventListener("click", () => {
        if (helpTimes > 0) {
            helpTimes--;
            helpButton.innerText = `Help: ${helpTimes} Left`;
        }
        if (helpTimes === 0) {
            helpButton.disabled = true;
            helpButton.innerText = "No More Help Available";
            helpButton.style.cursor = "not-allowed";
            helpButton.classList.add("disabled-help");
        }
        const enabledInputs = document.querySelectorAll(".inputs input:not([disabled])");
        const emptyenabledInputs = Array.from(enabledInputs).filter(input => input.value === "");
        if (emptyenabledInputs.length > 0) {
            const randomIndex = Math.floor(Math.random() * emptyenabledInputs.length);
            const randomInput = emptyenabledInputs[randomIndex];
            const indexToFill = Array.from(enabledInputs).indexOf(randomInput);
            if (indexToFill !== -1) {
                randomInput.value = randomWord[indexToFill];
                randomInput.classList.add("helped-letter");
                // Trigger input event to move focus
                randomInput.dispatchEvent(new Event('input', { bubbles: true }));
            }
        }
    });
}
helpHandler();

// Handle Backspace
function handleBackspace(event) {
    if (event.key === "Backspace") {
        const allenabledInput = document.querySelectorAll(".inputs input:not([disabled])");
        const currentIndexOfInput = Array.from(allenabledInput).indexOf(document.activeElement);
        allenabledInput[currentIndexOfInput].value = "";
        if (currentIndexOfInput > 0) {
            const prevInput = allenabledInput[currentIndexOfInput - 1];
            prevInput.focus();
        }
    }
}
document.addEventListener("keydown", handleBackspace)
// Initialize Game on Window Load
window.onload = function() {
    generateInput();
};

