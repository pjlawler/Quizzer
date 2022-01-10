const answerAreaEl = document.querySelector("#answerArea");
const timerEl = document.querySelector("#timer");
const startEl = document.querySelector("#start-button");

let gameTimer = null;
let timerValue = null;
let currentQuestion = null;
let answeredCorrect = null;
let answeredWrong = null;
let gameOver = true;

const questionBank = [
    {
    questionType: 1,
    questionText: "Which is NOT true about a 'function'?",
    answers: ["A JavaScript function is a block of code designed to perform a particular task.", "A JavaScript function is executed when 'something' invokes it (calls it).", "Function names can contain letters, digits, underscores, and dollar signs (same rules as variables).", "Functions were created by Bill Gates."],
    correctAnswer: 3
    },
    {
    questionType: 1,
    questionText: "What loop shoud be used when iterating through a specific number of times?",
    answers: ["A 'for' loop", "A 'do' loop", "A 'while' loop", "An 'each' loop"],
    correctAnswer: 0
    }
]

function setQuestionText(questionNumber) {
    // Sets the question on the page through the DOM
    const questionEl = document.querySelector(".questionText");
    questionEl.textContent = questionBank[questionNumber].questionText;
}

function setAnswers(questionNumber) {

    // Sets the multiple choice answers on the page through the DOM.  It also adds and answerID attribute to both the answer text and the div, so when the user taps it, both targets will have the id to check against the correct answer
    for(let i = 0; i < questionBank[questionNumber].answers.length; i++) {
        const answerTextEl = document.querySelector("#answer-text-" + i);
        const answerBoxEl = document.querySelector("#answer-" + i);
        answerTextEl.setAttribute("answerId", i);
        answerBoxEl.setAttribute("answerId", i);
        answerTextEl.textContent = questionBank[questionNumber].answers[i];
    }
}

function answerClicked(event) {

    // Gets the answerID from the tapped element, that triggered the event
    const answerId = event.target.getAttribute("answerId");
       
    // Ensures that only an answer or its repsective div were clicked and it's not the timer is still running
    if(!answerId || gameOver) {
        return false;
    }

    // Gets the div element so the background can be changed to red or green
    const answeredEl = document.querySelector("#answer-" + answerId);

    const correctAnswer = questionBank[currentQuestion].correctAnswer;

    // Compares the clicked answer to the correct answer
    if (answerId == correctAnswer) {
        answeredCorrect++;
        answeredEl.className = "correct_answer";
    }
    else {
        answeredWrong++;
        answeredEl.className = "wrong_answer";
    }

    // Keeps the background the result color intermittently, then resets it back to normal before presenting the next question.
    setTimeout(() => {
        answeredEl.className = "";
        presentQuestion();
    }, 500);
}


function presentQuestion() {

    currentQuestion++

    if (currentQuestion == questionBank.length) {
        gameOver = true;
        return false;
    }
    setQuestionText(currentQuestion);
    setAnswers(currentQuestion);
}

function decrementTimer() {
    if (timerValue > 0 && !gameOver) {
        // Decreases the timer by .1 second and displays on the page as long as timer is >0 and the game is still in play
        timerValue = (timerValue - .1).toFixed(1);
        let strTime = timerValue.toString();
        
        if (timerValue < 10) {
            strTime = "0" + strTime;
        }
        
        timerEl.innerHTML = strTime;
    }
    else if(gameOver) {
        // If anything shuts the game off, then this will end the timer
       startEl.textContent = "Start"
       clearInterval(gameTimer);
       console.log(timerValue);
    }
    else {
        // This runs if the timer has ran down to zero
        gameOver = true;
        startEl.textContent = "Start"
        clearInterval(gameTimer);
        // Add logic for ending the game
    }
}

function buttonClicked() {
    
    if (!gameOver) {
        // if quiz is running, it will set it to stop
        gameOver = true;
    }
    else {
        // Resets the quiz's settings and starts over
        startEl.textContent = "Stop" 
        gameOver = false;
        timerValue = 35;
        answeredCorrect = 0;
        answeredWrong = 0;
        currentQuestion = -1;
        gameTimer = setInterval(decrementTimer, 100);
        presentQuestion();
    }
}

answerAreaEl.addEventListener("click", answerClicked);
startEl.addEventListener("click", buttonClicked)

