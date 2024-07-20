document.addEventListener("DOMContentLoaded", function() {
    const targetDate = new Date("2024-07-22");
    const countdownElement = document.querySelector(".launch-button span");

    const updateCountdown = () => {
        const now = new Date();
        const difference = targetDate - now;

        if (difference < 0) {
            clearInterval(intervalId);
            countdownElement.textContent = "Launch to the Moon!";
            return;
        }

        // Convert difference from milliseconds to hours, minutes, and seconds
        let hours = Math.floor(difference / (1000 * 60 * 60));
        let minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((difference % (1000 * 60)) / 1000);

        // Ensure minutes and seconds are always two digits
        minutes = minutes < 10 ? '0' + minutes : minutes;
        seconds = seconds < 10 ? '0' + seconds : seconds;

        // Update the span content
        countdownElement.textContent = `Launch to the Moon in ${hours}:${minutes}:${seconds}`;
    };

    // Update the countdown every second
    updateCountdown();
    const intervalId = setInterval(updateCountdown, 1000);

    // Add a click event listener to the button
    document.querySelector(".launch-button").addEventListener("click", function() {
        window.location.href = "https://www.pinksale.finance/solana/launchpad/2Lwyqnu6QiFshC79WdQJc4R7CK3AtVMfHPZCgP4oSH6x";
    });
});