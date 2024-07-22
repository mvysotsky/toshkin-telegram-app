document.addEventListener("DOMContentLoaded", function () {
    const targetDate = new Date("2024-07-22");
    const countdownElement = document.querySelector(".launch-button h2");

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

        // Update the text content
        countdownElement.textContent = `Launch to the Moon in ${hours}:${minutes}:${seconds}`;
    };

    const intervalId = setInterval(updateCountdown, 1000);

    // Update the countdown every second
    updateCountdown();

    function hideAllViews() {
        const views = document.querySelectorAll('.view');
        views.forEach(view => {
            view.style.display = 'none';
        });
    }

    // Add a click event listener to the button
    document.querySelector(".launch-button").addEventListener("click", function () {
        window.location.href = "https://www.pinksale.finance/solana/launchpad/2Lwyqnu6QiFshC79WdQJc4R7CK3AtVMfHPZCgP4oSH6x";
    });

    // TapZone button click event listener
    document.querySelector('.menu-button.tap-zone').addEventListener('click', function () {
        hideAllViews();
    });

    // TapZone button click event listener
    document.querySelector('.menu-button.profile').addEventListener('click', function () {
        hideAllViews();

        const profileName = document.querySelector('.profile-name');
        profileName.style.display = 'flex';

        const profileView = document.querySelector('.profile-box');
        profileView.style.display = 'flex';

    });

    // Contest button logic
    document.querySelector('.menu-button.contest').addEventListener('click', function () {
        hideAllViews();

        const ratingTable = document.querySelector('.rating-table');
        const ratingTableBody = document.querySelector('.rating-table-body');

        // Toggle visibility of the rating table
        ratingTable.style.display = 'flex';

        // Show loading spinner
        ratingTableBody.innerHTML = '<div class="spinner"></div>';

        setTimeout(() => {
            // Remove spinner after 2 seconds
            ratingTableBody.innerHTML = '';

            // Add 10 new rows with random data
            for (let i = 0; i < 10; i++) {
                const player = `Player ${Math.floor(Math.random() * 100)}`; // Example player name
                const score = Math.floor(Math.random() * 1000); // Example score

                const newRow = document.createElement('div');
                newRow.classList.add('rating-table-row');
                newRow.innerHTML = `
                <div class="rating-table-cell">${i + 1}</div>
                <div class="rating-table-cell">${player}</div>
                <div class="rating-table-cell">${score}</div>
            `;

                ratingTableBody.appendChild(newRow);
            }
        }, 1000);
    });
});