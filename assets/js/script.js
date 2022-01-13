const answerAreaEl = document.getElementById("answerArea");
const timerEl = document.getElementById("timer");
const startEl = document.getElementById("start-button");
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
    questionText: "What is the terminal command to update the main branch on the remote git hub repository from the local machine?",
    answers: ["git remote main", "github push main", "git update main branch", "git push origin main"],
    correctAnswer: 3
    },
    {
    questionType: 1,
    questionText: "What is the Javascript window method that will repeatedly call a function with a fixed time delay between calls?",
    answers: ["intermittent();", "timer();", "setInterval();", "getInterval();"],
    correctAnswer: 2
    },
    {
    questionType: 1,
    questionText: "What type of loop should be used when you want to iterate a specific number of times?",
    answers: ["A 'for' loop", "A 'do' loop", "A 'while' loop", "An 'each' loop"],
    correctAnswer: 0
    },
    {
    questionType: 1,
    questionText: "Which is a proper 'if' conditional statement?",
    answers: ["if(employeeName) { }", "if(user = employeeName) {}", "if user = employeeName then;", "{if user === employeName }"],
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

function startClicked() {

    // Executes when the start button is clicked

    if (gameOver) {
          // Resets the quiz's global variables
          gameOver = false;
          timerValue = 60;
          answeredCorrect = 0;
          answeredWrong = 0;
          score = 0;
          currentQuestion = 0;
          gameTimer = setInterval(decrementTimer, 100);
  
          updateScoreBoard();
          shuffleQuestionBank();
          presentQuestion();
    }
    else {
        // if quiz is running, it will set it to stop
        endQuiz("quit");
    }
}

function presentQuestion() {

    // Displays a new question or blanks the screen if the quiz is over

    const questionEl = document.querySelector(".questionText");
    let questionText = "-- Press Start to begin --";

    if (currentQuestion < questionBank.length) {
        // Display next questions
        questionText = questionBank[currentQuestion].questionText;
        shuffleAnswers();        
    }
    else {
        // Ends the game once the last question in the questionBank is answered
        // then presents blank answers on the web page
        endQuiz("completed");
    }

    // Displays the question from the question bank into it's respectve element
    questionEl.textContent = questionText; 
    
    // Displays each of the answers from the question bank into their respective elements.
    // It also adds an answerID attribute to elements for each answer text and its wrapper div, 
    // so when the user taps it, both targets will have the id to check against the correct answer
    // no matter which target is clicked
    for(let i = 0; i < 4; i++) {
        const answerTextEl = document.getElementById("answer-text-" + i);
        const answerBoxEl = document.getElementById("answer-" + i);
        answerTextEl.setAttribute("answerId", i);
        answerBoxEl.setAttribute("answerId", i);
        answerTextEl.textContent = gameOver ? "" : questionBank[currentQuestion].answers[i];
    }
}

function updateScoreBoard() {

    const scoreBoardEl = document.getElementById("current-score");
    scoreBoardEl.textContent = score;
}

function decrementTimer() {

    if (!gameOver) {
        // Decreases the timer by .1 second and displays on the page as long as timer is >0 and the game is still in play
        timerValue = (timerValue - .1).toFixed(1);

        if(timerValue <= 0) {
            endQuiz("incomplete");
            presentQuestion();
            return false;
        }

        startEl.textContent = (timerValue > 9) ? timerValue.toString() : "0" + timerValue.toString();
    }
    else {
        // This will execute when the player pressed the stop button
        endQuiz("quit");
    }
}

function answerClicked(event) {

    // Handler when a quiz anser is clicked

    // Gets the answerID from the tapped element, that triggered the event
    const answerId = event.target.getAttribute("answerId");
       
    // Ensures that only an answer or its repsective div were clicked and it's the timer is still running
    if(!answerId || gameOver) {
        return false;
    }

    // Gets the div element so the background can be changed to red or green
    const answeredEl = document.getElementById("answer-" + answerId);
    const correctAnswer = questionBank[currentQuestion].correctAnswer;

    // Compares the clicked answer to the correct answer and handles whether the answer is correct or wrong
    if (answerId == correctAnswer) {
        answeredCorrect++;
        score = score + 1000;
        updateScoreBoard();
        answeredEl.className = "correct_answer";
    }
    else {
        answeredWrong++;
        answeredEl.className = "wrong_answer";
        timerValue = timerValue - 10;
    }

    // Keeps the background the result color illuminated intermittently, then resets it back to normal before presenting the next question.
    setTimeout(() => {
        answeredEl.className = "";
        currentQuestion++
        presentQuestion();
    }, 500);
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

function addScoreToBoard() {
    
    // Gets the players initials and protects from more than 3 chars or no characters
    // Also inserts ??? if the user does not enter any chars
    let initials = prompt("Please enter your initials.");
    initials = (!initials) ? "???" : initials.substring(0,3).toUpperCase();

    // Adds the players initials and score to leaderboard array and then sorts it by the highest score
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
    // Removes the last element if the leaderboard is longer than 10
    while (leaderBoard.length > 10) {
        leaderBoard.pop()
    }

    // Stores the lastest scores into local storate and then re-displays the list
    window.localStorage.setItem("scores", JSON.stringify(leaderBoard));
    refreshLeaderBoard();
}

function refreshLeaderBoard() {

    // Creates the td elements with the initial and score for each element in the learder board array
    for (let i = 0; i < leaderBoard.length; i++) {
        if (i < 10) {
            const tableRowEl = document.getElementById("lb-" + i);
            tableRowEl.innerHTML = "<td>" + leaderBoard[i][0] + "</td><td>" + leaderBoard[i][1] + "</td>";
        }
    }
}

function clearLeaderBoard() {
  
    // Ensures the game is not running or user press cancel on the prompt
    if (!gameOver || !confirm("Are you sure you want to clear the score board?")){
        return false;
    }

    // Clears the leaderboard array and stores the empty array to localstorage
    leaderBoard = [];
    window.localStorage.setItem("scores", JSON.stringify(leaderBoard));
    
    // Clears the highscore table by entering an empty string into each of the rows
    for (let i = 0; i < 10; i++) {
        const tableRowEl = document.getElementById("lb-" + i);
        tableRowEl.innerHTML = "";
    }
}

function loadScores() {

    // Loads the store leaderboard array from localstorage and then executes the funtion to display the list
    leaderBoard = JSON.parse(window.localStorage.getItem('scores'));
    refreshLeaderBoard();
}

function endQuiz(cause) {

    // Handles when the game is over based on why the game is ending

    clearInterval(gameTimer);
    gameOver = true;
    startEl.textContent = "Start";

    switch (cause) {
        case "completed":
            score = score + Math.floor(timerValue * 1000);
            updateScoreBoard();

            // Allows for the scoreboard to be updated before the alert is displayed
            setTimeout(() => { 
                alert("Congratulations! You've completed the quiz in the alloted time.\n\nYou've answered " + answeredCorrect + " questions correctly with " + timerValue + " seconds left on the clock!");
                addScoreToBoard()
            }, 250);
            break;
        case "incomplete":
            timerValue = 0;
            score = 0;
            updateScoreBoard();
 
            // Allows for the scoreboard to be updated before the alert is displayed
            setTimeout(() => { 
                alert("You've run out of time, unfortunately you've lost all your points...");
            }, 250);
            break;
        default:
            score = 0;
            updateScoreBoard();

            // Allows for the scoreboard to be updated before the alert is displayed
            setTimeout(() => { 
                alert("You've stopped the game and gave up all your points.");
            }, 250);
    }
}



loadScores();

answerAreaEl.addEventListener("click", answerClicked);
startEl.addEventListener("click", startClicked);
resetEl.addEventListener("click", clearLeaderBoard);
