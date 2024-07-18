function copyReferralLink() {
    navigator.clipboard.writeText('http://referral.link').then(() => {
        showMessage('Реферальная ссылка скопирована!');
    }, () => {
        showMessage('Не удалось скопировать ссылку.');
    });
}

function showMessage(message) {
    const messageBox = document.getElementById('message');
    messageBox.innerText = message;
    messageBox.style.display = 'block';
    setTimeout(() => {
        messageBox.style.display = 'none';
    }, 3000);
}

function showPage(page) {
    document.querySelectorAll('.content').forEach(content => {
        content.style.display = 'none';
    });
    document.getElementById(page).style.display = 'block';
    if (page === 'shop' || page === 'character') {
        showMessage('Coming soon!');
    }
}


/** Response example:
 * {
 *    "users": [
 *        {
 *            "_id": "657811cff36d2cf071c2cf3d",
 *            "username": "tijar_1990",
 *            "avatar": "https://cdn.discordapp.com/avatars/1131649379854458942/1628fc11e7961d85181295493426b775.png",
 *            "rank": 1,
 *            "totalXp": 100
 *        },
 *        {
 *            "_id": "6663e5b3d318e6ec33698b23",
 *            "username": "innovaterealm_",
 *            "avatar": "https://cdn.discordapp.com/avatars/1004061794047889430/f3359cf1674cf502d713d923e23bb0e2.png",
 *            "rank": 2,
 *            "totalXp": 100
 *        }
 *    ],
 *    "count": 45,
 *    "currentPage": 1
 * }
 */
function fetchLeaderboard() {
    const data = JSON.stringify({
        "enterpriseId": "6687d18115b36743574d90a3",
        "limit": 8,
        "page": 1
    });

    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === this.DONE) {
            const response = JSON.parse(this.responseText);
            const table = document.getElementById('rating').getElementsByTagName('tbody')[0];
            // Clear existing rows, except for the header
            while(table.rows.length > 1) {
                table.deleteRow(1);
            }
            // Populate table with new data
            response.users.forEach(user => {
                const row = table.insertRow();
                const cell1 = row.insertCell(0);
                const cell2 = row.insertCell(1);
                cell1.textContent = user.username;
                cell2.textContent = user.totalXp;
            });
        }
    });

    xhr.open("POST", "https://api.intract.io/api/qv1/enterprise/leaderboard");
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.send(data);
}

// Invoke fetchLeaderboard on page load
window.onload = function() {
    fetchLeaderboard();
};
