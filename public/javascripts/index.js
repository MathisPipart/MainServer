let name = null;
let roomNo = null;
let chat= io.connect('/chat');
let news= io.connect('/news');


/**
 * called by <body onload>
 * it initialises the interface and the expected socket messages
 * plus the associated actions
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


// Retrieves parameters from URL
function getParamsFromURL() {
    const params = new URLSearchParams(window.location.search);
    return {
        roomNo: params.get('roomNo'),
        name: params.get('name'),
        movieName: params.get('movieName'), // Ajout de movieName
    };
}


/**
 * it initialises the socket for /chat
 */
function initChatSocket() {
    // called when someone joins the room. If it is someone else it notifies the joining of the room
    chat.on('joined', function (room, userId) {
        if (userId === name) {
            // it enters the chat
            DisplayRoom(room, userId);
        } else {
            // notifies that someone has joined the room
            writeOnChatHistory('<b>' + userId + '</b>' + ' joined room ' + room);
        }
    });
    // called when a message is received
    chat.on('chat', function (room, userId, chatText) {
        let who = userId
        if (userId === name) who = 'Me';
        writeOnChatHistory('<b>' + who + ':</b> ' + chatText);
    });

}

/**
 * it initialises the socket for /news
 */
function initNewsSocket(){
    news.on('joined', function (name, userId) {
        if (userId !== name) {
            // notifies that someone has joined the room
            writeOnNewsHistory('<b>'+name+'</b>' + ' joined general room ');
        }
    });

    // called when some news is received (note: only news received by others are received)
    news.on('news', function (userId, newsText) {
        writeOnNewsHistory('<b>' + userId + ':</b> ' + newsText);
    });
}


/**
 * called when the Send button is pressed. It gets the text to send from the interface
 * and sends the message via  socket
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
 * called when the Send button is pressed for news. It gets the text to send from the interface
 * and sends the message via  socket
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
 * used to connect to a room. It gets the user name and room number from the
 * interface
 * It connects both chat and news at the same time
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
 * it appends the given html text to the history div
 * @param text: teh text to append
 */
function writeOnChatHistory(text) {
    let history = document.getElementById('chat_history');
    let paragraph = document.createElement('p');
    paragraph.innerHTML = text;
    history.appendChild(paragraph);
    document.getElementById('chat_input').value = '';
}

/**
 * it appends the given html text to the history div
 * @param text: teh text to append
 */
function writeOnNewsHistory(text) {
    let history = document.getElementById('news_history');
    let paragraph = document.createElement('p');
    paragraph.innerHTML = text;
    history.appendChild(paragraph);
    document.getElementById('news_input').value = '';
}

/**
 * it hides the initial form and shows the chat
 * @param room the selected room
 * @param userId the user name
 */
function DisplayRoom(room, userId) {
    document.getElementById('who_you_are').innerHTML= userId;
    document.getElementById('in_room').innerHTML= ' '+room;
}


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
                    if (room === '0') {
                        writeOnNewsHistory(`<b>${message.userId}:</b> ${message.message}`);
                    } else {
                        writeOnChatHistory(`<b>${message.userId}:</b> ${message.message}`);
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




function showChatLoading() {
    document.getElementById('chat_loading_message').style.display = 'block';
}

function hideChatLoading() {
    document.getElementById('chat_loading_message').style.display = 'none';
}

function showNewsLoading() {
    document.getElementById('news_loading_message').style.display = 'block';
}

function hideNewsLoading() {
    document.getElementById('news_loading_message').style.display = 'none';
}
