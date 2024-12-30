function setUserName(userName) {
    if (userName) {
        sessionStorage.setItem('userName', userName);
        console.log(`[Client] Nom défini pour cet onglet : ${userName}`);
    } else {
        sessionStorage.removeItem('userName');
        console.log('[Client] Nom supprimé pour cet onglet.');
    }
}

function getUserName() {
    const userName = sessionStorage.getItem('userName') || '';
    if (!userName) {
        console.log('[Client] Aucun nom trouvé dans cet onglet.');
    }
    return userName;
}

// Handles chat redirection
function goToChat(roomId, movieName) {
    const userNameInput = document.getElementById('userName');
    let userName = userNameInput ? userNameInput.value.trim() : '';

    if (!userName) {
        userName = getUserName(); // Récupère le nom pour cet onglet
    }

    if (!userName) {
        alert('Veuillez entrer votre nom avant de rejoindre un chat.');
        return;
    }

    setUserName(userName);

    // Encode and redirects to chat page
    window.location.href = `/chat?roomNo=${roomId}&movieName=${encodeURIComponent(movieName)}&name=${encodeURIComponent(userName)}`;
}


// Updates userName field and synchronizes with sessionStorage
function updateUserName() {
    const userNameInput = document.getElementById('userName');
    const userName = userNameInput.value.trim();

    if (userName) {
        setUserName(userName); // Met à jour sessionStorage
    } else {
        sessionStorage.removeItem('userName'); // Supprime si vide
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const userNameInput = document.getElementById('userName');

    if (userNameInput) {
        const savedName = getUserName();
        if (savedName) {
            userNameInput.value = savedName;
        }

        // event to update sessionStorage each time it is entered
        userNameInput.addEventListener('input', () => {
            const newName = userNameInput.value.trim();
            setUserName(newName);
        });
    }
});
