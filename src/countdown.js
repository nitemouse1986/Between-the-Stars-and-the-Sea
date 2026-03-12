// countdown.js
// Countdown timer functionality

function startCountdown(duration) {
    let timer = duration, minutes, seconds;
    const countdownElement = document.getElementById('countdown');

    const interval = setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        countdownElement.textContent = minutes + ':' + seconds;

        if (--timer < 0) {
            clearInterval(interval);
            countdownElement.textContent = "Time's up!";
        }
    }, 1000);
}

// Example usage: start countdown from 5 minutes
window.onload = function () {
    const countdownDuration = 60 * 5; // 5 minutes in seconds
    startCountdown(countdownDuration);
};