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






