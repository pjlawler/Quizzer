const answerButtonsEl = document.querySelector("#answerButtons");
const questionBank = [
    {
    questionType: 1,
    questionText: "Which is NOT true about a 'function'?",
    answers: ["A JavaScript function is a block of code designed to perform a particular task.", "A JavaScript function is executed when 'something' invokes it (calls it).", "Function names can contain letters, digits, underscores, and dollar signs (same rules as variables).", "Functions were created by Bill Gates."],
    correctAnswer: 3},
    {
    questionType: 2,
    questionText: "'Let' and 'Const' are exactly the same.",
    correctAnswer: 1,
    }
]

function setQuestionText(questionNumber) {
    const questionEl = document.querySelector("#questionText");
    questionEl.innerHTML = questionBank[questionNumber].questionText;
}

function setAnswers(questionNumber) {

    switch (questionBank[questionNumber].questionType) {
        case 1:
            // Multiple Choice Question
            for(let i = 0; i < questionBank[questionNumber].answers.length; i++) {
                const buttonEl = document.createElement("button")
                buttonEl.setAttribute("buttonId", i);
                buttonEl.innerHTML = questionBank[questionNumber].answers[i];
                answerButtonsEl.appendChild(buttonEl);
            }
            break;
        case 2:
            // True or False Question
            for(let i = 0; i < 2; i++) {
                const buttonEl = document.createElement("button")
                buttonEl.setAttribute("buttonId", i);
                
                if (i == 0) { 
                    answer = "True"
                 } 
                 else { 
                     answer = "False"
                }
                
                buttonEl.innerHTML = answer;
                answerButtonsEl.appendChild(buttonEl);
            }
            break;
        default:
    }
}

function createAnswers(questionNumber) {

    
}


function answerClicked(event) {
    const buttonId = event.target.getAttribute("buttonId");
    console.log(buttonId);
    // var taskId = event.target.getAttribute("data-task-id");
}

answerButtonsEl.addEventListener("click", answerClicked);

setQuestionText(1);
setAnswers(1);

