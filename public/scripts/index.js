const playButton = document.getElementById('playButton');

playButton.style.display = 'none'

const audioPlayer = document.getElementById('audioPlayer');

let artistAnswers = document.getElementById('artist-answers');

let visualiser = document.querySelector('.visualiser');
let visLines = document.querySelectorAll('.line');

let count = 1;

let roundNumber = document.getElementById('roundNumber');
let timeCounter = document.getElementById('timerCounter')
roundNumber.innerText = count;

let intervalId;
let timer;

function startCountdown(duration) {

     if (intervalId) return;

    timer = duration;
    const timeCounter = document.getElementById('timeCounter');

    intervalId = setInterval(() => {
        // Update the timer display
        timeCounter.innerText = timer;

        // Check if the timer has reached zero
        if (timer <= 0) {
            clearInterval(intervalId); // Stop the timer
            intervalId = null;
            setTimeout(() => {
                artistAnswers.innerHTML = '';
                    count++;
                    roundNumber.innerText = count;
                    nextQuestion();
            }, 1000);
        }

        timer--; // Decrement the timer
    }, 1000); // 1000 milliseconds = 1 second
}

function stopTimer() {
    clearInterval(intervalId); // Clear the existing interval
    intervalId = null; // Reset the interval ID
}

function resetTimer() {
    clearInterval(intervalId); // Clear the existing interval
    intervalId = null; // Reset the interval ID
    timer = 15; // Reset timer value
    document.getElementById('timeCounter').innerText = timer; // Update display
}

const nextQuestion = async () => {

    if (count <= 3) {
    
    try {

        const response = await fetch('/questions/data');
        const { preview, answers } = await response.json();
        console.log(answers)

        audioPlayer.src = preview;
        createAnswerButtons(answers)
        resetTimer();
        startCountdown(15);

        return answers

    } catch (error) {
        console.error('Error fetching answers:', error);
    }
        
    } else {
        resetTimer();
        endGame();
    }


}

const createAnswerButtons = (answers) => {

    const container = document.getElementById('artist-answers');

    answers.forEach((answer) => {
        const button = document.createElement('button');
        button.classList.add('answer-button');
        button.setAttribute('data-answer', answer.correct)
        button.textContent = answer.name; // Set button text
        container.appendChild(button); // A
    })

    checkAnswer()

}

const checkAnswer = async () => {

    const answerButtons = document.querySelectorAll('.answer-button')

    answerButtons.forEach((button) => {

        button.addEventListener('click', () => {

            stopTimer();

            answerButtons.forEach((btn) => {
                btn.setAttribute('disabled', true)
            })

            const answerData = button.getAttribute('data-answer');

            if (answerData === 'true') {
                button.classList.add('correct');
                
                setTimeout(() => {
                    artistAnswers.innerHTML = '';
                        count++;
                    roundNumber.innerText = count;
                        nextQuestion();
                }, 1000);

            }
            else {
                button.classList.add('incorrect');
                const correctButton = document.querySelector('[data-answer="true"]');
                correctButton.classList.add('correct');
                setTimeout(() => {
                    artistAnswers.innerHTML = '';
                        count++;
                    roundNumber.innerText = count;
                        nextQuestion();
                }, 1000);

            }
        })

    })

}

const startButton = document.getElementById('startGame');

startButton.addEventListener('click', function () {

    startButton.style.display = 'none';
    playButton.style.display = 'block';
    
    setTimeout(() => {
        visLines.forEach((line) => {
            line.classList.add('running')
        })
    }, 1000);

    audioPlayer.addEventListener('pause', () => {

        playButton.addEventListener('click', () => {
            audioPlayer.play();
            visLines.forEach((line) => {
                line.classList.add('running')
            })
            playButton.textContent = 'Pause Song'
        })

    })

    audioPlayer.addEventListener('play', () => {

        playButton.addEventListener('click', () => {
            audioPlayer.pause();
            visLines.forEach((line) => {
                line.classList.remove('running')
            })
            playButton.textContent = 'Play Song'
        })

    })

    nextQuestion()

})

 function endGame() {

    audioPlayer.pause();

    alert('Game Over!')

}



