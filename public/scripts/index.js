const playButton = document.getElementById('playButton');

const audioPlayer = document.getElementById('audioPlayer');

playButton.addEventListener('click', () => {
    audioPlayer.play()
})