// Enregistre le nom d'utilisateur pour cet onglet uniquement
function setUserName(userName) {
    if (userName) {
        sessionStorage.setItem('userName', userName);
        console.log(`[Client] Nom défini pour cet onglet : ${userName}`);
    } else {
        sessionStorage.removeItem('userName');
        console.log('[Client] Nom supprimé pour cet onglet.');
    }
}

// Récupère le nom d'utilisateur spécifique à cet onglet
function getUserName() {
    const userName = sessionStorage.getItem('userName') || '';
    if (!userName) {
        console.log('[Client] Aucun nom trouvé dans cet onglet.');
    }
    return userName;
}

// Gère la redirection vers le chat
function goToChat(roomId) {
    const userNameInput = document.getElementById('userName');
    let userName = userNameInput ? userNameInput.value.trim() : '';

    if (!userName) {
        userName = getUserName(); // Récupère le nom pour cet onglet
    }

    if (!userName) {
        alert('Veuillez entrer votre nom avant de rejoindre un chat.');
        return;
    }

    // Enregistre le nom dans cet onglet uniquement
    setUserName(userName);

    // Redirige vers la page de chat avec le nom et la room dans l'URL
    window.location.href = `/chat?roomNo=${roomId}&name=${encodeURIComponent(userName)}`;
}

// Met à jour le champ userName et synchronise avec sessionStorage
function updateUserName() {
    const userNameInput = document.getElementById('userName');
    const userName = userNameInput.value.trim();

    if (userName) {
        setUserName(userName); // Met à jour sessionStorage
    } else {
        sessionStorage.removeItem('userName'); // Supprime si vide
    }
}

// Initialisation lors du chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    const userNameInput = document.getElementById('userName');

    if (userNameInput) {
        const savedName = getUserName();
        if (savedName) {
            userNameInput.value = savedName; // Préremplit avec sessionStorage
        }

        // Ajoute un événement pour mettre à jour sessionStorage à chaque saisie
        userNameInput.addEventListener('input', () => {
            const newName = userNameInput.value.trim();
            setUserName(newName);
        });
    }
});
