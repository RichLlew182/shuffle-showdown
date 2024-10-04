const playButton = document.getElementById('playButton');

const audioPlayer = document.getElementById('audioPlayer');

audioPlayer.addEventListener('loadeddata', () => {

    audioPlayer.play();
    playButton.addEventListener('click', () => {
        audioPlayer.pause();
        playButton.textContent = 'Play Song'
    })

})

audioPlayer.addEventListener('pause', () => {

    playButton.addEventListener('click', () => {
        audioPlayer.play();
        playButton.textContent = 'Pause Song'
    })

})

audioPlayer.addEventListener('play', () => {

    playButton.addEventListener('click', () => {
        audioPlayer.pause();
        playButton.textContent = 'Play Song'
    })

})

let artistAnswers = document.getElementById('artist-answers');

const nextQuestion = async () => {

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
                    nextQuestion()
                }, 2000);

            }
            else {
                button.classList.add('incorrect');
                const correctButton = document.querySelector('[data-answer="true"]');
                correctButton.classList.add('correct');
                setTimeout(() => {
                    artistAnswers.innerHTML = '';
                    nextQuestion();
                }, 2000);

            }
        })

    })

}

window.addEventListener('load', nextQuestion())



