const username = 'your-username'; // TODO: Replace with the actual username

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
    document.querySelector('.menu-button.tap-zone-btn').addEventListener('click', function () {
        hideAllViews();
        document.querySelector('.tap-zone').style.display = 'flex';
    });

    // TapZone button click event listener
    document.querySelector('.menu-button.profile').addEventListener('click', function () {
        hideAllViews();

        const profileName = document.querySelector('.profile-name');
        profileName.style.display = 'flex';

        const profileView = document.querySelector('.profile-box');
        profileView.style.display = 'flex';

        // Update span.user-score with the user's score from
        // the API endpoint /api/profile?username={username}
        fetch(`/api/profile?username=${username}`)
            .then((response) => response.json())
            .then((data) => {
                const userScore = document.querySelector('#user-score');
                userScore.textContent = data.score;
            })
            .catch((error) => {
                console.error('Error:', error);
            }
        );

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

    /**
     * Check if the position fits the target
     * @param {HTMLElement} targetElement - The target element to check against.
     * @param {number} centerX - The X coordinate of the center of the icon.
     * @param {number} centerY - The Y coordinate of the center of the icon.
     * @returns {boolean} - Returns true if the position fits within the target element, otherwise false.
     */
    const checkIfPositionFits = (targetElement, centerX, centerY) => {
        // Calculate the center of the targetElement
        const targetCenterX = targetElement.clientWidth / 2;
        const targetCenterY = targetElement.clientHeight / 2;

        // Calculate the radius of the targetElement
        const tapZoneRadius = targetElement.clientWidth / 2; // Assuming the targetElement is a circle

        // Calculate the distance from the center of the icon to the center of the targetElement
        const distance =
            Math.sqrt(Math.pow(centerX - targetCenterX, 2) + Math.pow(centerY - targetCenterY, 2));

        // Check if the icon is within the targetElement
        return distance + 12 <= tapZoneRadius; // 12 is half the width/height of the icon
    }

    /**
     * Get a random position for the icon within the parent target
     * @param {HTMLElement} parentTarget - The parent target element.
     * @param {number} iconWidth - The width of the icon.
     * @returns {[number, number]} - Returns an array with the X and Y coordinates of the icon.
     */
    const getRandomIconPosition = (parentTarget, iconWidth) => {
        const randomX = Math.random() * (parentTarget.clientWidth - iconWidth);
        const randomY = Math.random() * (parentTarget.clientHeight - iconWidth);
        const iconRadius = iconWidth / 2;

        // Check if the position fits the target
        if (!checkIfPositionFits(parentTarget, randomX - iconRadius, randomY - iconRadius)) {
            // Icon outside the target area, recalculating position
            return getRandomIconPosition(parentTarget, iconWidth);
        }

        return [randomX, randomY];
    }

    document.querySelector('div.tap-zone').addEventListener('click', (event) => {
        console.log('Clicked on the tap zone!');

        fetch('/api/click', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username: username})
        })
            .then()
            .catch((error) => {
                console.error('Error:', error);
            });

        /** @type {HTMLElement} */
        const tapZone = event.currentTarget;
        const icon = document.createElement('div');
        icon.classList.add('icon');

        const [randomX, randomY] = getRandomIconPosition(tapZone, 24);

        icon.style.left = `${randomX}px`;
        icon.style.top = `${randomY}px`;

        tapZone.appendChild(icon);

        // Remove the icon after the animation ends
        icon.addEventListener('animationend', () => {
            icon.remove();
        });
    });

});