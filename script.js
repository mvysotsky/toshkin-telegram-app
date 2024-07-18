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
