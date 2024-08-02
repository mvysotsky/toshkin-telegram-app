const app = window.Telegram.WebApp;

const username = app.initDataUnsafe.user ? app.initDataUnsafe.user.username : 'unknown';
let userscore = 0;
let referral_link = '';

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

// Function to update all elements with data-score attribute
function updateAllScores() {
    document.querySelectorAll('[data-score]').forEach(element => {
        element.innerHTML = userscore;
    });
}

const updateProfile = async (username) => {
    try {
        const ref_string = app.initDataUnsafe.start_param ?? '';
        const response = await fetch(`/api/profile?username=${username}&ref_string=${ref_string}`);
        const data = await response.json();
        userscore = data.score;
        referral_link = data.referral_link;
        updateAllScores();
    } catch (e) {
        console.error('Error:', e);
    }
}

const handleSolKeyboardInput = () => {
    const solInputEl = document.querySelector('[data-sol-address-input]');
    const referralButton = document.querySelector('.referral-button');

    solInputEl.addEventListener('focus', () => {
        referralButton.style.display = 'none';
    });

    solInputEl.addEventListener('blur', () => {
        referralButton.style.display = 'flex';
    });
}

document.addEventListener("DOMContentLoaded", async function () {
    // set #username element text to the username
    document.querySelector('#username').textContent = app.initDataUnsafe.user
        ? app.initDataUnsafe.user.first_name
        : username;

    // Fetch profile to set correct user score
    await updateProfile(username);
    handleSolKeyboardInput();

    // Expand Telegram view to fullscreen
    app.ready();
    app.expand();

    const updateCountdown = () => {
        const now = new Date();
        const targetDate = new Date("2024-07-22");
        const difference = targetDate - now;
        const countdownElement = document.querySelector(".launch-button h2");

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

    // Launch to the Moon button click event listener
    document.querySelector(".launch-button").addEventListener("click", function () {
        window.open('https://www.pinksale.finance/solana/launchpad/2Lwyqnu6QiFshC79WdQJc4R7CK3AtVMfHPZCgP4oSH6x', '_blank');
    });

    // Referral button click event listener
    document.querySelector(".referral-button").addEventListener("click", function (e) {
        navigator.clipboard.writeText(referral_link);
        setTimeout(() => {
            e.target.innerHTML = "Copied! Share with Toshkiners!";
        }, 200);

        hideAllViews();

        // Show referral-table and fill with GET api/referred data
        fetch(`/api/referred?username=${username}`)
            .then(response => response.json())
            .then(data => {
                const referralTable = document.querySelector('.referral-table');
                const referralTableBody = document.querySelector('.referral-table-body');
                referralTable.style.display = 'flex';
                referralTableBody.innerHTML = '';

                data.forEach((item, index) => {
                    const newRow = document.createElement('div');
                    newRow.classList.add('table-row');
                    newRow.innerHTML = `
                    <div class="table-cell">${index + 1}</div>
                    <div class="table-cell">${item.username}</div>
                    <div class="table-cell">2500</div>
                `;
                    referralTableBody.appendChild(newRow);
                });
            })
            .catch(error => {
                console.error('Error:', error);
            });
    });

    // TapZone button
    document.querySelector('.menu-button.tap-zone-btn').addEventListener('click', function () {
        hideAllViews();
        document.querySelector('.tap-zone').style.display = 'flex';
        document.querySelector('.tap-score').style.display = 'flex';
        document.querySelector('.launch-button').style.display = 'flex';
        document.querySelector('.referral-button').style.display = 'none';
    });

    // Quests button
    document.querySelector('.menu-button.quests').addEventListener('click', function () {
        window.open('https://www.intract.io/project/toshkin-coin', '_blank');
    });

    // Profile button
    document.querySelector('.menu-button.profile').addEventListener('click', async function () {
        hideAllViews();
        await updateProfile(username);

        // hide username for now
        // const profileName = document.querySelector('.profile-name');
        // profileName.style.display = 'flex';

        const profileView = document.querySelector('.profile-box');
        profileView.style.display = 'flex';

        const launchButton = document.querySelector('.launch-button');
        launchButton.style.display = 'none';

        const referralButton = document.querySelector('.referral-button');
        referralButton.innerHTML = 'Copy referral link';
        referralButton.style.display = 'flex';

        const updateSolAddressButton = document.querySelector('.update-address-button');
        updateSolAddressButton.innerHTML = 'Update Address';
    });

    // Contest button logic (leaderboard)
    document.querySelector('.menu-button.contest').addEventListener('click', function () {
        hideAllViews();

        const ratingTable = document.querySelector('.rating-table');
        const ratingTableBody = document.querySelector('.rating-table-body');
        const launchButton = document.querySelector('.launch-button');
        const referralButton = document.querySelector('.referral-button');

        // Toggle visibility of the referral button
        referralButton.style.display = 'none';

        // Toggle visibility of the launch button
        launchButton.style.display = 'flex';

        // Toggle visibility of the rating table
        ratingTable.style.display = 'flex';

        // Show loading spinner
        ratingTableBody.innerHTML = '<div class="spinner"></div>';

        // Fetch leaderboard data
        fetch('/api/leaderboard')
            .then(response => response.json())
            .then(data => {
                // Remove spinner
                ratingTableBody.innerHTML = '';

                // Add rows with leaderboard data
                data.forEach((item, index) => {
                    const newRow = document.createElement('div');
                    newRow.classList.add('table-row');
                    newRow.innerHTML = `
                    <div class="table-cell">${index + 1}</div>
                    <div class="table-cell">${item.username}</div>
                    <div class="table-cell">${item.score}</div>
                `;
                    ratingTableBody.appendChild(newRow);
                });
            })
            .catch(error => {
                console.error('Error:', error);
                ratingTableBody.innerHTML = '<div class="error">Failed to load leaderboard</div>';
            });
    });

    // Update SOL address
    document.querySelector('.update-address-button').addEventListener('click', function (e) {
        const solInputEl = document.querySelector('[data-sol-address-input]');

        function showError(errorType) {
            const texts = {
                default: 'Update Address',
                invalid: 'Invalid Address!',
                oops: 'Whoopsie, try later',
            }
            e.target.innerHTML = texts[errorType];
            setTimeout(() => {
                e.target.innerHTML = texts['default'];
            }, 2000);
        }

        if (solInputEl.value && solInputEl.value.match(/^[A-Za-z0-9]{32,44}$/)) {
            fetch('/api/wallet', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({username: username, wallet: solInputEl.value})
            })
                .then((response) => {
                    if (response.status === 200) {
                        e.target.innerHTML = 'Saved!';
                    } else if (response.status === 400) {
                        showError('invalid');
                    } else {
                        showError('oops');
                    }
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        } else {
            showError('invalid');
        }
    });

    // Hide keyboard on iOS when tapping outside the input field
    document.addEventListener('click', function(event) {
        const solInputEl = document.querySelector('[data-sol-address-input]');

        // detect if the click event was on the input field
        const isClickInside = solInputEl.contains(event.target);

        if (!isClickInside) {
            solInputEl.blur();
        }
    });

    document.querySelector('div.tap-zone').addEventListener('click', (event) => {
        userscore++;
        updateAllScores();

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
        const tapEffect = document.createElement('div');
        const randomIndex = Math.floor(Math.random() * 4) + 1;

        tapEffect.classList.add('tap-effect');
        tapEffect.style.left = `${event.clientX}px`;
        tapEffect.style.top = `${event.clientY}px`;
        icon.classList.add('icon');
        icon.classList.add(`icon-${randomIndex}`);
        icon.style.transform = `rotate(${Math.floor(Math.random() * (30 + 30) + 1) - 30}deg)`;

        const [randomX, randomY] = getRandomIconPosition(tapZone, 24);

        icon.style.left = `${randomX}px`;
        icon.style.top = `${randomY}px`;

        tapZone.appendChild(icon);
        document.querySelector('body').appendChild(tapEffect);

        // Remove the icon after the animation ends
        icon.addEventListener('animationend', () => {
            icon.remove();
            tapEffect.remove();
        });
    });

});