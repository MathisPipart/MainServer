/**
 * Sets the user name in the session storage and logs the action.
 *
 * @param {string} userName - The user name to set. If null or empty, the user name is removed from session storage.
 */
function setUserName(userName) {
    if (userName) {
        sessionStorage.setItem('userName', userName);
        console.log(`[Client] Name set for this tab: ${userName}`);
    } else {
        sessionStorage.removeItem('userName');
        console.log('[Client] Name removed for this tab.');
    }
}

/**
 * Retrieves the user name from session storage.
 *
 * @returns {string} The user name, or an empty string if no name is found.
 */
function getUserName() {
    const userName = sessionStorage.getItem('userName') || '';
    if (!userName) {
        console.log('[Client] No name found for this tab.');
    }
    return userName;
}

/**
 * Redirects the user to the chat page after validating the user name and room details.
 *
 * @param {string} roomId - The ID of the chat room to join.
 * @param {string} movieName - The name of the movie associated with the chat room.
 */
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

/**
 * Updates the user name in session storage based on the input field value.
 * Removes the user name from session storage if the input is empty.
 */
function updateUserName() {
    const userNameInput = document.getElementById('userName');
    const userName = userNameInput.value.trim();

    if (userName) {
        setUserName(userName); // Updates sessionStorage
    } else {
        sessionStorage.removeItem('userName'); // Removes it if empty
    }
}

/**
 * Initializes the user name field and synchronizes it with session storage on page load.
 */
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
