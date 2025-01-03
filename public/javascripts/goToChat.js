function setUserName(userName) {
    if (userName) {
        sessionStorage.setItem('userName', userName);
        console.log(`[Client] Name set for this tab: ${userName}`);
    } else {
        sessionStorage.removeItem('userName');
        console.log('[Client] Name removed for this tab.');
    }
}

function getUserName() {
    const userName = sessionStorage.getItem('userName') || '';
    if (!userName) {
        console.log('[Client] No name found for this tab.');
    }
    return userName;
}

// Handles chat redirection
function goToChat(roomId, movieName) {
    const userNameInput = document.getElementById('userName');
    let userName = userNameInput ? userNameInput.value.trim() : '';

    if (!userName) {
        userName = getUserName(); // Retrieves the name for this tab
    }

    if (!userName) {
        alert('Please enter your name to the right of the menu before joining a chat.');
        return;
    }

    setUserName(userName);

    // Encodes and redirects to the chat page
    window.location.href = `/chat?roomNo=${roomId}&movieName=${encodeURIComponent(movieName)}&name=${encodeURIComponent(userName)}`;
}


// Updates userName field and synchronizes with sessionStorage
function updateUserName() {
    const userNameInput = document.getElementById('userName');
    const userName = userNameInput.value.trim();

    if (userName) {
        setUserName(userName); // Updates sessionStorage
    } else {
        sessionStorage.removeItem('userName'); // Removes it if empty
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
