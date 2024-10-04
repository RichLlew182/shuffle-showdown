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

        const response = await fetch('/answers');
        const answers = await response.json();
        console.log(answers)

        createAnswerButtons(answers)

        return answers

    } catch (error) {
        console.error('Error fetching answers:', error);
    }


}

window.addEventListener('load', nextQuestion())

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

            const correctAnswer = button.getAttribute('data-answer');

            if (correctAnswer === 'true') {
                button.classList.add('correct')
                setTimeout(() => {
                    artistAnswers.innerHTML = '';
                    nextQuestion()
                }, 5000);



            }
            else {
                button.classList.add('incorrect')
                setTimeout(() => {
                    artistAnswers.innerHTML = '';
                    nextQuestion()
                }, 5000);

            }
        })

    })

}






