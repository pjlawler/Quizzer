const answerAreaEl = document.querySelector("#answerArea");
const timerEl = document.querySelector("#timer");
const startEl = document.querySelector("#start-button");
const resetEl = document.getElementById("reset-button");

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
    },
    {
    questionType: 1,
    questionText: "Which is NOT a viable expression in Javascript?",
    answers: ["const pi = 3.1456;", "let lightIsOn = !switchIsDown;", "let z = x === y;", "dim var = 1000;"],
    correctAnswer: 3
    }]
let gameTimer = null;
let timerValue = null;
let currentQuestion = null;
let answeredCorrect = null;
let answeredWrong = null;
let gameOver = true;
let score = null;
let leaderBoard = [];

function presentQuestion() {

    const questionEl = document.querySelector(".questionText");
    let questionText = "-- Press Start to begin --";
    let answerText = "";

    if (currentQuestion == questionBank.length) {
        // Ends the game once the last question in the questionBank is answered
        clearInterval(gameTimer);
        gameOver = true;
        startEl.textContent = "Start";
        score = score + Math.floor(timerValue * 100);
        updateScoreBoard();
        leaderBoardHandler();
    }
    else {
        questionText = questionBank[currentQuestion].questionText;
        shuffleAnswers();
    }

    // Displays the question from the question bank into it's respectve element
    questionEl.textContent = questionText; 
    
    // Displays each of the answers from the question bank into their respective elements.
    // It also adds an answerID attribute to elements for each answer text and its wrapper div, 
    // so when the user taps it, both targets will have the id to check against the correct answer
    // no matter which target is clicked
    for(let i = 0; i < 4; i++) {
        
        const answerTextEl = document.querySelector("#answer-text-" + i);
        const answerBoxEl = document.querySelector("#answer-" + i);
        answerTextEl.setAttribute("answerId", i);
        answerBoxEl.setAttribute("answerId", i);
    
        if (gameOver != true) {
            answerText = questionBank[currentQuestion].answers[i];           
        }
        else {
            answerText = "";
        }    
        answerTextEl.textContent = answerText;
    }
}

function updateScoreBoard() {
    const scoreBoardEl = document.querySelector("#current-score");
    scoreBoardEl.textContent = score;
}

function decrementTimer() {

      if (!gameOver) {
        // Decreases the timer by .1 second and displays on the page as long as timer is >0 and the game is still in play
        timerValue = (timerValue - .1).toFixed(1);

        if(timerValue<=0) {
            gameOver = true;
            timerValue = 0;
            score = 0;
            startEl.textContent = "Start";
            clearInterval(gameTimer);
            alert("You've run out of time, unfortunately you've lost all your points...");
            updateScoreBoard();
            presentQuestion();
            return false;
        }

        let strTime = timerValue.toString();
        
        if (timerValue < 10) {
            strTime = "0" + strTime;
        }
        
        startEl.textContent = strTime;
    }
    else {
        // This will execute when the player pressed the stop button
        score = 0;
        startEl.textContent = "Start";
        clearInterval(gameTimer);
        alert("You've stopped the game and gave up all your points.");
        updateScoreBoard();
        presentQuestion();
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
        score = score + 10;
        updateScoreBoard();
        answeredEl.className = "correct_answer";
    }
    else {
        answeredWrong++;
        answeredEl.className = "wrong_answer";
        timerValue = timerValue - 20;
        
    }

    // Keeps the background the result color intermittently, then resets it back to normal before presenting the next question.
    setTimeout(() => {
        answeredEl.className = "";
        currentQuestion++
        presentQuestion();
    }, 500);
}

function buttonClicked() {
    
    if (!gameOver) {
        // if quiz is running, it will set it to stop
        gameOver = true;
    }
    else {
        
        // Resets the quiz's global variables
        gameOver = false;
        timerValue = 35;
        answeredCorrect = 0;
        answeredWrong = 0;
        score = 0;
        currentQuestion = 0;
        gameTimer = setInterval(decrementTimer, 100);

        // Creates the td elements with the initial and score for each element in the learder board array
        shuffleQuestionBank();
        presentQuestion();
    }
}

function shuffleQuestionBank() {
    // Shuffles the questions in the array so they are presented in random order
    for (let i = 0; i < questionBank.length; i++) {
        const swapIndex = Math.floor(Math.random() * questionBank.length);
        [questionBank[i], questionBank[swapIndex]] = [questionBank[swapIndex], questionBank[i]];
    }
}

function shuffleAnswers() {
    // Shuffles the answers so they are presented in different positions during the quiz
    for (let i = 0; i < 4; i++) {
        const swapIndex = Math.floor(Math.random() * 4);
        if (swapIndex == questionBank[currentQuestion].correctAnswer) {
            questionBank[currentQuestion].correctAnswer = i;
        }
        else if (i == questionBank[currentQuestion].correctAnswer) {
            questionBank[currentQuestion].correctAnswer = swapIndex
        }
        [questionBank[currentQuestion].answers[i], questionBank[currentQuestion].answers[swapIndex]] = [questionBank[currentQuestion].answers[swapIndex], questionBank[currentQuestion].answers[i]];
    }
}



function leaderBoardHandler() {
    
    // Gets the players initials and protects from more than 3 chars or no characters
    let initials = "";
    initials = prompt("Please enter your initials.").toUpperCase();
    initials = (!initials) ? "???" : initials.substring(0,3);

    // Adds the players initials and score to leaderboard array and then sorts it by the highest score
    console.log(leaderBoard);
    leaderBoard.push([initials, score]);
    leaderBoard.sort(sortByScores);
    
    // Code to sort the array by the second element and in reverse order
    function sortByScores(a, b) {
        if (a[1] === b[1]) {
            return 0;
        }
        else {
            return (a[1] > b[1]) ? -1 : 1;
        }
    }

    // Ensures there is no more than 10 scores listed in the array
    while (leaderBoard.length > 10) {
        leaderBoard.pop()
    }

    window.localStorage.setItem("scores", JSON.stringify(leaderBoard));

    // Creates the td elements with the initial and score for each element in the learder board array
    for (let i = 0; i < leaderBoard.length; i++) {
        if (i < 10) {
            const tableRowEl = document.getElementById("lb-" + i);
            tableRowEl.innerHTML = "<td>" + leaderBoard[i][0] + "</td><td>" + leaderBoard[i][1] + "</td>";
        }
    }
}

function loadHighScores() {
    // Resets the quiz's settings and starts over for a new game
    console.log(leaderBoard);

    // Clears any previous scores
    for (let i = 0; i < 10; i++) {
        const tableRowEl = document.getElementById("lb-" + i);
        tableRowEl.innerHTML = "";
    }

    leaderBoard = window.localStorage.getItem("scores");
    if (!leaderBoard) {
        leaderBoard = JSON.parse(leaderBoard);
        return false;
    }
 
    // Updates the board witht the stored scores if any
    for (let i = 0; i < leaderBoard.length; i++) {
        if (i < 10) {
            const tableRowEl = document.getElementById("lb-" + i);
            tableRowEl.innerHTML = "<td>" + leaderBoard[i][0] + "</td><td>" + leaderBoard[i][1] + "</td>";
        }
    }
}

answerAreaEl.addEventListener("click", answerClicked);
startEl.addEventListener("click", buttonClicked)


// Things to do
// Update UI
// Refactor the code
// Update leader board