class Question {
  constructor(questionText, choices, correctAnswer) {
      this.questionText = questionText; // Stores the question text
      this.choices = choices;           // Stores an array of possible answer choices
      this.correctAnswer = correctAnswer; // Stores the correct answer
  }

  isCorrect(answer) {
      return answer === this.correctAnswer; // Checks if the given answer is correct
  }
}

class Quiz {
  constructor(questions) {
      this.questions = questions;          // Array of question objects for the quiz
      this.currentQuestionIndex = 0;       // Tracks the index of the current question
      this.score = 0;                      // Initializes score to 0
      this.timeLeft = 15;                  // Time limit per question in seconds
      this.timer = null;                   // Timer variable to track countdown
  }

  getCurrentQuestion() {
      return this.questions[this.currentQuestionIndex]; // Retrieves the current question object
  }

  submitAnswer(answer) {
      clearInterval(this.timer);                 // Stops the timer for the current question
      const currentQuestion = this.getCurrentQuestion();
      if (currentQuestion.isCorrect(answer)) {   // Checks if answer is correct
          this.score++;                          // Increases score if answer is correct
      }
      this.moveToNextQuestion();                 // Moves to the next question
  }

  moveToNextQuestion() {
      this.currentQuestionIndex++;               // Moves to the next question index
      if (this.currentQuestionIndex < this.questions.length) { // Checks if there are more questions
          this.timeLeft = 15;                    // Resets the timer for the next question
          this.startTimer();                     // Starts the timer for the next question
      } else {
          this.endQuiz();                        // Ends the quiz if no more questions
      }
  }

  startTimer() {
      this.timer = setInterval(() => {           // Starts a 1-second interval timer
          this.timeLeft--;                       // Decrements the time left
          this.updateTimerDisplay();             // Updates the timer display
          if (this.timeLeft === 0) {             // If time runs out
              clearInterval(this.timer);         // Stops the timer
              this.moveToNextQuestion();         // Moves to the next question
          }
      }, 1000);                                  // Timer runs every 1000 ms (1 second)
  }

  updateTimerDisplay() {
      const timerElement = document.getElementById('timer'); // Gets timer HTML element
      timerElement.textContent = `Time left: ${this.timeLeft} seconds`; // Updates the displayed time
  }

  endQuiz() {
      const quizContainer = document.getElementById('quiz-container'); // Gets quiz container element
      const resultsContainer = document.getElementById('results');      // Gets results container element
      const scoreElement = document.getElementById('score');            // Gets score display element
      const highScoreElement = document.getElementById('high-score');   // Gets high score display element

      quizContainer.style.display = 'none';    // Hides the quiz container
      resultsContainer.style.display = 'block';// Shows the results container
      scoreElement.textContent = `${this.score} / ${this.questions.length}`; // Displays the final score

      const highScore = localStorage.getItem('highScore') || 0; // Retrieves high score from local storage
      if (this.score > highScore) {                             // If current score is higher than high score
          localStorage.setItem('highScore', this.score);        // Updates the high score in local storage
      }
      highScoreElement.textContent = Math.max(this.score, highScore); // Displays the highest score
  }
}

const questions = [
  new Question('What is the capital of France?', ['London', 'Berlin', 'Paris', 'Madrid'], 'Paris'),
  new Question('Which planet is known as the Red Planet?', ['Mars', 'Jupiter', 'Venus', 'Saturn'], 'Mars'),
  new Question('What is the largest mammal in the world?', ['Elephant', 'Blue Whale', 'Giraffe', 'Hippopotamus'], 'Blue Whale'),
  new Question('Who painted the Mona Lisa?', ['Vincent van Gogh', 'Pablo Picasso', 'Leonardo da Vinci', 'Michelangelo'], 'Leonardo da Vinci'),
  new Question('What is the chemical symbol for gold?', ['Ag', 'Au', 'Fe', 'Cu'], 'Au')
];

const quiz = new Quiz(questions);

function displayQuestion() {
  const currentQuestion = quiz.getCurrentQuestion();          // Gets the current question
  const questionElement = document.getElementById('question'); // Gets the question display element
  const choicesElement = document.getElementById('choices');   // Gets the choices container element

  questionElement.textContent = currentQuestion.questionText;  // Displays the current question text
  choicesElement.innerHTML = '';                               // Clears previous choices

  currentQuestion.choices.forEach((choice, index) => {         // For each choice, creates a button
      const button = document.createElement('button');         // Creates a button for each choice
      button.textContent = choice;                             // Sets button text to the choice
      button.addEventListener('click', () => selectAnswer(choice)); // Adds event to select the answer
      choicesElement.appendChild(button);                      // Adds the button to the choices container
  });

  quiz.startTimer();                                           // Starts the question timer
  quiz.updateTimerDisplay();                                   // Displays the countdown
}

function selectAnswer(answer) {
  const buttons = document.querySelectorAll('#choices button'); // Gets all choice buttons
  buttons.forEach(button => {
      button.disabled = true;                                   // Disables all buttons after one is clicked
      if (button.textContent === answer) {
          button.style.backgroundColor = '#FFA500';             // Highlights the selected answer
      }
  });

  setTimeout(() => {
      quiz.submitAnswer(answer);                                // Submits the answer
      if (quiz.currentQuestionIndex < quiz.questions.length) {
          displayQuestion();                                    // Displays the next question if any left
      }
  }, 1000);                                                    // Delays transition to next question by 1 second
}

document.getElementById('restart-btn').addEventListener('click', () => {
  location.reload(); // Reloads the page to reset the quiz
});

displayQuestion(); // Calls displayQuestion to start the quiz
