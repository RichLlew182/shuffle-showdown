const playButton = document.getElementById('playButton');

playButton.style.display = 'none'

const audioPlayer = document.getElementById('audioPlayer');

let artistAnswers = document.getElementById('artist-answers');

let visualiser = document.querySelector('.visualiser');
let visLines = document.querySelectorAll('.line');

let count = 1;

let gameInfo = document.getElementById('gameInfo')

let roundNumber = document.getElementById('roundNumber');
let timeCounter = document.getElementById('timerCounter')
let scoreCounter = document.getElementById('scoreCounter')

roundNumber.innerText = count;

let intervalId;
let timer;

let score = 0;

scoreCounter.innerText = score;

function startCountdown(duration) {

     if (intervalId) return;

    timer = duration;
    const timeCounter = document.getElementById('timeCounter');

    intervalId = setInterval(() => {
        timeCounter.innerText = timer;

        if (timer <= 0) {
            clearInterval(intervalId); 
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

function stopTimer(answer) {
    clearInterval(intervalId); 
    if (timer > 0 && answer === 'correct') {  
        score += timer;
        scoreCounter.innerText = score;
    }
    console.log({score})
    intervalId = null; 
}

function resetTimer() {
    clearInterval(intervalId); 
    intervalId = null; 
    timer = 15;
    document.getElementById('timeCounter').innerText = timer;
}

const nextQuestion = async () => {

    if (count <= 10) {
    
    try {

        const response = await fetch('/questions/data');
        const { preview, answers } = await response.json();

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

            answerButtons.forEach((btn) => {
                btn.setAttribute('disabled', true)
            })

            const answerData = button.getAttribute('data-answer');

            if (answerData === 'true') {
                button.classList.add('correct');
                score += 50;
                stopTimer('correct');
                
                setTimeout(() => {
                    artistAnswers.innerHTML = '';
                        count++;
                    roundNumber.innerText = count;
                        nextQuestion();
                }, 1000);

            }
            else {
                button.classList.add('incorrect');
                stopTimer('incorrect');
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
    gameInfo.style.display = 'flex'
    
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

async function endGame() {

    audioPlayer.pause()
     
    console.log(`Final Score: ${score}`)

    try {
        const response = await fetch('/score', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: score // Ensure `score` is defined and accessible
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // window.location.href = '/score';
    } catch (error) {
        console.error('Error posting score:', error);
    }

}



