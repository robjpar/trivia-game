const QUESTIONS = [
    {
        question: "Who is in charge of the executive branch?",
        answers: [
            "The President",
            "Speaker of the House",
            "Chief Justice",
            "Majority Whip"
        ],
        correctAnswer: 0,
    },
    {
        question: "How many U.S. Senators are there?",
        answers: [
            "50",
            "100",
            "200",
            "425"
        ],
        correctAnswer: 1,
    },
    {
        question: "What are the two parts of the U.S. Congress?",
        answers: [
            "The State Department and the Executive Branch",
            "The Senate and the Supreme Court",
            "The Senate and House of Representatives",
            "The West Wing and the East Wing"
        ],
        correctAnswer: 2,
    },
];

var questionIndex = 0;
var correctAnswers = 0;
const TIMEOUT_QUESTION = 5; // seconds
const TIMEOUT_ANSWER = 2; // seconds
var time = 0;
var timerOn = false;
var timerMessage = "";

function startGame() {
    $("#question-box").text("Are you ready to start?");
    var button = $("<button>").attr({ class: "btn btn-outline-primary btn-lg m-1", "button-value": -1 }).text("New Quiz");
    $("#buttons-box").empty().append(button);
    $("#instruction-box").text(`There are ${QUESTIONS.length} questions. You have ${TIMEOUT_QUESTION} seconds to pick an answer.`);
    setInterval(function () {
        time--;
        if (timerOn) {
            if (timerMessage === "question") {
                $("#instruction-timer").text(`Time remaining ${time} seconds`);
            } else { // timerMessage === "answer"
                $("#instruction-timer").text(`Next question in ${time} seconds`);
            }
        } else {
            $("#instruction-timer").empty();
        }
    }, 1000);
}

function displayQuestion(questionIndex) {
    $("#question-box").text(QUESTIONS[questionIndex].question);
    $("#buttons-box").empty();
    QUESTIONS[questionIndex].answers.forEach(function (answer, index) {
        var button = $("<button>").attr({ class: "btn btn-outline-primary btn-lg m-1", "button-value": index }).text("New Quiz").text(answer);
        $("#buttons-box").append(button);
    });
    $("#instruction-box").text(`Question ${questionIndex + 1}. Pick the correct answer.`);
    time = TIMEOUT_QUESTION;
    timerMessage = "question";
    timerOn = true;
}

// userAnswer = -1 (if first question or timeout) | 0 | 1 | 2 | 3
function displayAnswer(questionIndex, userAnswer) {
    var correctAnswer = QUESTIONS[questionIndex].correctAnswer;
    $("button").each(function () {
        var buttonValue = parseInt($(this).attr("button-value"));
        if (buttonValue === correctAnswer) {
            $(this).attr("class", "btn btn-success btn-lg m-1").prop("disabled", true);
        } else if (buttonValue === userAnswer && userAnswer !== correctAnswer) {
            $(this).attr("class", "btn btn-danger btn-lg m-1").prop("disabled", true);
        } else {
            $(this).attr("class", "btn btn-outline-info btn-lg m-1").prop("disabled", true);
        }
    });
    if (userAnswer === correctAnswer) {
        correctAnswers++;
        $("#instruction-box").text(`Question ${questionIndex + 1}. Correct!`);
    } else {
        $("#instruction-box").text(`Question ${questionIndex + 1}. Incorrect!`);
    }
    time = TIMEOUT_ANSWER;
    timerMessage = "answer";
    timerOn = true;
}

function restartGame() {
    $("#question-box").text("Play again?");
    var button = $("<button>").attr({ class: "btn btn-outline-primary btn-lg m-1", "button-value": -1 }).text("New Quiz");
    $("#buttons-box").empty().append(button);
    $("#instruction-box").text(`You answered ${correctAnswers} of ${QUESTIONS.length} questions correctly!`);
    this.questionIndex = 0;
    this.correctAnswers = 0;
    timerOn = false;
}

startGame();

$(document).on("click", "button", function () {
    var userAnswer = parseInt($(this).attr("button-value"));

    if (userAnswer === -1) {
        displayQuestion(questionIndex);

    } else { // userAnswer === 0 | 1 | 2
        displayAnswer(questionIndex, userAnswer);

    }

    restartGame();

});