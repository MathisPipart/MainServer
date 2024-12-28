function goToChat(roomId) {
    const userNameInput = document.getElementById('userName');
    let userName = userNameInput ? userNameInput.value.trim() : '';

    if (!userName) {
        userName = getUserName(); // Récupère le nom depuis localStorage
    }

    if (!userName) {
        alert('Veuillez entrer votre nom avant de rejoindre un chat.');
        return;
    }

    // Stocke le nom pour les futures interactions
    localStorage.setItem('userName', userName);

    // Redirige vers la page de chat avec le nom et la room dans l'URL
    window.location.href = `/chat?roomNo=${roomId}&name=${encodeURIComponent(userName)}`;
}


function updateUserName() {
    const userNameInput = document.getElementById('userName');
    const userName = userNameInput.value.trim();

    if (userName) {
        localStorage.setItem('userName', userName);
        console.log(`[Client] Nom défini : ${userName}`);
    } else {
        localStorage.removeItem('userName');
        console.log('[Client] Nom supprimé du localStorage.');
    }
}


function getUserName() {
    const userName = localStorage.getItem('userName') || '';
    if (!userName) {
        console.log('[Client] Aucun nom trouvé dans localStorage. Veuillez le définir dans le menu.');
    }
    return userName;
}


document.addEventListener('DOMContentLoaded', () => {
    const userNameInput = document.getElementById('userName');
    if (userNameInput) {
        const savedName = getUserName();
        if (savedName) {
            userNameInput.value = savedName;
        }
        userNameInput.addEventListener('input', () => {
            const newName = userNameInput.value.trim();
            if (newName) {
                localStorage.setItem('userName', newName);
                console.log(`[Client] Nom mis à jour : ${newName}`);
            }
        });
    }
});




