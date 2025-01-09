let name = null;
let roomNo = null;
let chat= io.connect('/chat');
let news= io.connect('/news');

/**
 * Called by <body onload>. Initializes the interface and configures
 * the expected socket messages and associated actions.
 */
function init() {
    const params = getParamsFromURL();

    name = getUserName();
    roomNo = params.roomNo;
    const movieName = params.movieName;

    console.log(`[Client] Initialisation : Room = ${roomNo}, Movie = ${movieName}, User = ${name}`);

    if (roomNo) {
        connectToRoom();
    }

    const chatTitle = document.getElementById('chat_title');
    if (chatTitle) {
        chatTitle.innerHTML = `Film Chat: ${movieName}`;
    }

    initChatSocket();
    initNewsSocket();
}

/**
 * Retrieves parameters from the URL query string.
 *
 * @returns {Object} An object containing roomNo, name, and movieName parameters.
 */
function getParamsFromURL() {
    const params = new URLSearchParams(window.location.search);
    return {
        roomNo: params.get('roomNo'),
        name: params.get('name'),
        movieName: params.get('movieName'), // Ajout de movieName
    };
}

/**
 * it initialises the socket for /chat and sets up event listeners for chat interactions.
 */
function initChatSocket() {
    // Called when someone joins the room
    chat.on('joined', function (room, userId, timestamp) {
        if (userId === name) {
            // Current user joins the chat
            DisplayRoom(room, userId);
        } else {
            // Notify that someone else has joined the room
            writeOnChatHistory(userId, `joined room ${room}`, timestamp);
        }
    });

    // Called when a message is received
    chat.on('chat', function (room, userId, chatText, timestamp) {
        writeOnChatHistory(userId, chatText, timestamp);
    });
}

/**
 * it initialises the socket for /news and sets up event listeners for news updates.
 */
function initNewsSocket() {
    // Called when someone joins the general chat room
    news.on('joined', function (name, userId, timestamp) {
        if (userId !== name) {
            // Notify that someone else has joined the general room
            if (!timestamp) {
                timestamp = Date.now(); // Use current time if no timestamp is provided
            }
            writeOnNewsHistory(userId, 'joined the general room', timestamp);
        }
    });

    // Called when a news message is received
    news.on('news', function (userId, newsText, timestamp) {
        if (!timestamp) {
            timestamp = Date.now(); // Use current time if no timestamp is provided
        }
        writeOnNewsHistory(userId, newsText, timestamp);
    });
}

/**
 * Called when the Send button for chat is pressed.
 * Retrieves the input text from the interface and sends the message via the socket.
 */
function sendChatText() {
    let chatText = document.getElementById('chat_input').value;

    if (!chatText.trim()) {
        console.warn('[Client] Le champ de message est vide.');
        return;
    }

    console.log(`[Client] Envoi du message : Room: ${roomNo}, User: ${name}, Message: ${chatText}`);

    // Sends message via Socket.IO
    chat.emit('chat', roomNo, name, chatText);

    // Save the message in MongoDB
    saveMessageToMongoDB(roomNo, name, chatText);
}

/**
 * Called when the Send button for news is pressed.
 * Retrieves the input text from the interface and sends the message via the socket.
 */
function sendNewsText() {
    let newsText = document.getElementById('news_input').value;

    if (!newsText.trim()) {
        console.warn('[Client] Le champ de news est vide.');
        return;
    }

    console.log(`[Client] Envoi du message "news" : User: ${name}, Message: ${newsText}`);
    news.emit('news', name, newsText); // Real-time dispatch
    saveMessageToMongoDB('0', name, newsText); // Saving in room “0” (news)
    document.getElementById('news_input').value = '';
}

/**
 * Connects the user to a chat room by retrieving the user name and room number
 * from the interface. Establishes connections for both chat and news sockets.
 */
function connectToRoom() {
    name = getUserName();
    roomNo = document.getElementById('roomNo')?.value.trim() || roomNo;

    if (!name) {
        alert('Nom non défini. Veuillez entrer votre nom dans le menu.');
        return;
    }

    if (!roomNo) {
        alert('Numéro de room manquant.');
        return;
    }

    console.log(`[Client] Tentative de connexion : Room = ${roomNo}, Utilisateur = ${name}`);

    // Rejoint les rooms via Socket.IO
    chat.emit('create or join', roomNo, name);
    news.emit('create or join', name);

    console.log(`[Client] Connecté à la room : ${roomNo}, utilisateur : ${name}`);

    DisplayRoom(roomNo, name);

    loadChatHistory('0');
    loadChatHistory(roomNo);
}

/**
 * Appends the given chat message to the chat history display.
 *
 * @param {string} userId - The ID of the user who sent the message.
 * @param {string} message - The message text.
 * @param {number} timestamp - The timestamp of the message.
 */
function writeOnChatHistory(userId, message, timestamp) {
    const history = document.getElementById('chat_history');
    const container = document.createElement('div');
    container.classList.add('message-container');

    const formattedDate = formatDate(timestamp);

    container.innerHTML = `
        <div class="message-date">${formattedDate}</div>
        <div class="message-text"><b>${userId}:</b> ${message}</div>
    `;
    history.appendChild(container);
    document.getElementById('chat_input').value = '';
}

/**
 * Appends the given news message to the news history display.
 *
 * @param {string} userId - The ID of the user who sent the news.
 * @param {string} message - The news text.
 * @param {number} timestamp - The timestamp of the news.
 */
function writeOnNewsHistory(userId, message, timestamp) {
    const history = document.getElementById('news_history');
    const container = document.createElement('div');
    container.classList.add('message-container');

    const formattedDate = formatDate(timestamp);

    container.innerHTML = `
        <div class="message-date">${formattedDate}</div>
        <div class="message-text"><b>${userId}:</b> ${message}</div>
    `;
    history.appendChild(container);
    document.getElementById('news_input').value = '';
}

/**
 * Displays the chat interface for the given room and user.
 *
 * @param {string} room - The room to display.
 * @param {string} userId - The user ID to display.
 */
function DisplayRoom(room, userId) {
    document.getElementById('who_you_are').innerHTML= userId;
    document.getElementById('in_room').innerHTML= ' '+room;
}

/**
 * Saves the given message to MongoDB for persistence.
 *
 * @param {string} room - The room where the message was sent.
 * @param {string} userId - The ID of the user who sent the message.
 * @param {string} message - The message text.
 */
async function saveMessageToMongoDB(room, userId, message) {
    console.log(`[MongoDB] Tentative de sauvegarde du message dans la room: ${room}, Utilisateur: ${userId}, Message: ${message}`);
    try {
        const response = await fetch('http://localhost:3001/chat/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ room, userId, message }),
        });
        if (response.ok) {
            console.log('[MongoDB] Message sauvegardé avec succès dans MongoDB.');
        } else {
            console.error('[MongoDB] Échec de la sauvegarde du message dans MongoDB. Réponse du serveur:', response.status);
        }
    } catch (error) {
        console.error('[MongoDB] Erreur lors de la sauvegarde du message dans MongoDB:', error);
    }
}

/**
 * Loads the chat history for the given room from MongoDB and displays it.
 *
 * @param {string} room - The room for which to load the chat history.
 */
async function loadChatHistory(room) {
    console.log(`[MongoDB] Chargement de l'historique pour la room: ${room}`);

    // Affiche le message de chargement
    if (room === '0') {
        showNewsLoading();
    } else {
        showChatLoading();
    }

    try {
        const response = await fetch(`http://localhost:3001/chat/history/${room}`);
        if (response.ok) {
            const messages = await response.json();
            if (messages.length === 0) {
                console.log(`[Client] Aucun message trouvé pour la room : ${room}`);
            } else {
                console.log('[MongoDB] Historique chargé avec succès. Messages:', messages);
                messages.forEach(message => {
                    const { userId, message: msgText, timestamp } = message;

                    if (room === '0') {
                        writeOnNewsHistory(userId, msgText, timestamp);
                    } else {
                        writeOnChatHistory(userId, msgText, timestamp);
                    }
                });

            }
        } else {
            console.error('[MongoDB] Échec du chargement de l\'historique. Réponse du serveur :', response.status);
        }
    } catch (error) {
        console.error('[MongoDB] Erreur lors du chargement de l\'historique depuis MongoDB :', error);
    } finally {
        // Cache le message de chargement
        if (room === '0') {
            hideNewsLoading();
        } else {
            hideChatLoading();
        }
    }
}

/**
 * Displays the loading message for the chat history.
 */
function showChatLoading() {
    document.getElementById('chat_loading_message').style.display = 'block';
}

/**
 * Hides the loading message for the chat history.
 */
function hideChatLoading() {
    document.getElementById('chat_loading_message').style.display = 'none';
}

/**
 * Displays the loading message for the news history.
 */
function showNewsLoading() {
    document.getElementById('news_loading_message').style.display = 'block';
}

/**
 * Hides the loading message for the news history.
 */
function hideNewsLoading() {
    document.getElementById('news_loading_message').style.display = 'none';
}

/**
 * Formats a timestamp into a human-readable date and time string.
 *
 * @param {number} timestamp - The timestamp to format.
 * @returns {string} The formatted date and time string.
 */
function formatDate(timestamp) {
    const date = new Date(timestamp);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
}
