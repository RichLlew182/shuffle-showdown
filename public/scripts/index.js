const playButton = document.getElementById('playButton');

playButton.style.display = 'none'

const audioPlayer = document.getElementById('audioPlayer');

let artistAnswers = document.getElementById('artist-answers');

let visualiser = document.querySelector('.visualiser');
let visLines = document.querySelectorAll('.line');

let count = 1;

let roundNumber = document.getElementById('roundNumber');

roundNumber.innerText = count

console.log(roundNumber)

console.log(visLines)

const nextQuestion = async () => {

    if (count <=3) {
    
    try {

        const response = await fetch('/questions/data');
        const { preview, answers } = await response.json();
        console.log(answers)

        audioPlayer.src = preview;

        createAnswerButtons(answers)

        return answers

    } catch (error) {
        console.error('Error fetching answers:', error);
    }
        
    } else {
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
                setTimeout(() => {
                    artistAnswers.innerHTML = '';
                        count++;
                        roundNumber.innerText = count;
                        nextQuestion();
                }, 2000);

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
                }, 2000);

            }
        })

    })

}

const startButton = document.getElementById('startGame')

startButton.addEventListener('click', function () {

    startButton.style.display = 'none';
    playButton.style.display = 'block';

    
    setTimeout(() => {
        visLines.forEach((line) => {
            line.classList.add('running')
        })
    }, 1000);

    // audioPlayer.addEventListener('loadeddata', () => {

    //     audioPlayer.play();
    //     playButton.addEventListener('click', () => {
    //         audioPlayer.pause();

    //         playButton.textContent = 'Play Song'
    //     })

    // })

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



