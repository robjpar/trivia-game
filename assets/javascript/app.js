var questionIndex = 0;
var correctAnswers = 0;
const TIMEOUT_QUESTION = 6; // seconds
const TIMEOUT_ANSWER = 3; // seconds
var time = 0;
var timerOn = false;
var timerMessage = "";
var userAnswer = -10;

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
    {
        question: "Who vetoes bills?",
        answers: [
            "Congress",
            "The President",
            "The Vice President",
            "Senators"
        ],
        correctAnswer: 1,
    },
    {
        question: "What are the two major political parties in the United States?",
        answers: [
            "Liberty and Justice",
            "Law and Order",
            "Democratic and Republican",
            "Checks and Balances"
        ],
        correctAnswer: 2,
    },
    {
        question: "When was the Declaration of Independence adopted?",
        answers: [
            "December 7, 1941",
            "January 1, 1800",
            "May 25, 1787",
            "July 4, 1776"
        ],
        correctAnswer: 3,
    },
    {
        question: "Why does the flag have 50 stars?",
        answers: [
            "One for each state",
            "One for each Senator",
            "One for each amendment",
            "One for each original colony"
        ],
        correctAnswer: 0,
    },
    {
        question: "The idea of self-government is in the first three words of the Constitution. What are these words?",
        answers: [
            "Life, Liberty, Happiness",
            "Be it Resolved",
            "We the People",
            "Make no law"
        ],
        correctAnswer: 2,
    },
    {
        question: "If both the President and the Vice President can no longer serve, who becomes President?",
        answers: [
            "The Chief Justice",
            "Secretary of the Treasury",
            "Postmaster General",
            "The Speaker of the House"
        ],
        correctAnswer: 3,
    },
    {
        question: "How many justices are on the Supreme Court?",
        answers: [
            "5",
            "7",
            "9",
            "11"
        ],
        correctAnswer: 2,
    },
];

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
            } else if (timerMessage === "answer") {
                $("#instruction-timer").text(`Next question in ${time} seconds`);
            } else { // timerMessage === "last answer";
                $("#instruction-timer").text(`Summary in ${time} seconds`);
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
    } else if (userAnswer === -2) {
        $("#instruction-box").text(`Question ${questionIndex + 1}. Timeout!`);
    } else {
        $("#instruction-box").text(`Question ${questionIndex + 1}. Incorrect!`);
    }
    time = TIMEOUT_ANSWER;
    if (questionIndex === QUESTIONS.length - 1) {
        timerMessage = "last answer";
    } else {
        timerMessage = "answer";
    }
    timerOn = true;
}

function restartGame() {
    $("#question-box").text("Play again?");
    var button = $("<button>").attr({ class: "btn btn-outline-primary btn-lg m-1", "button-value": -1 }).text("New Quiz");
    $("#buttons-box").empty().append(button);
    $("#instruction-box").text(`You answered ${correctAnswers} of ${QUESTIONS.length} questions correctly!`);
    questionIndex = 0;
    correctAnswers = 0;
    timerOn = false;
}

startGame();

$(document).on("click", "button", function () {
    userAnswer = parseInt($(this).attr("button-value"));
});

// State of the game
// -----------------
// userAnswer =
// -10 - no action
// -1 - display the first question after restart or next question after timeout
// -2 - waiting for the user answer or timeout
// -3 - restart
// 0 | 1 | 2 | 3 - actual user answers
setInterval(function () {
    if (userAnswer === -1 && time <= 0) {
        displayQuestion(questionIndex);
        userAnswer = -2;
    }
    if (userAnswer === -2 && time <= 0) {
        displayAnswer(questionIndex, userAnswer);
        questionIndex++;
        if (questionIndex === QUESTIONS.length) { // no more questions
            userAnswer = -3;
        } else {
            userAnswer = -1;
        }
    }
    if (userAnswer === -3 && time <= 0) {
        restartGame();
        userAnswer = -10;
    }
    if (userAnswer > -1) {
        displayAnswer(questionIndex, userAnswer);
        questionIndex++;
        if (questionIndex === QUESTIONS.length) { // no more questions
            userAnswer = -3;
        } else {
            userAnswer = -1;
        }
    }
}, 300);