let name = null;
let roomNo = null;
let chat= io.connect('/chat');
let news= io.connect('/news');


/**
 * called by <body onload>
 * it initialises the interface and the expected socket messages
 * plus the associated actions
 */
// Initialisation de la page chat
function init() {
    const params = getParamsFromURL();

    // Récupère le nom depuis sessionStorage
    name = getUserName();
    roomNo = params.roomNo;

    if (!name) {
        console.warn('[Client] Aucun nom défini. Veuillez remplir le champ dans le menu pour continuer.');
        document.getElementById('initial_form').style.display = 'block';
        document.getElementById('chat_interface').style.display = 'none';
        return;
    }

    console.log(`[Client] Initialisation : Room = ${roomNo}, Utilisateur = ${name}`);

    // Si une room est définie, connecte automatiquement
    if (roomNo) {
        connectToRoom();
    }

    // Affiche ou masque les éléments en fonction de la connexion
    document.getElementById('initial_form').style.display = roomNo ? 'none' : 'block';
    document.getElementById('chat_interface').style.display = roomNo ? 'block' : 'none';

    initChatSocket();
    initNewsSocket();
}

// Récupère les paramètres depuis l'URL
function getParamsFromURL() {
    const params = new URLSearchParams(window.location.search);
    return {
        roomNo: params.get('roomNo'),
        name: params.get('name'),
    };
}


/**
 * called to generate a random room number
 * This is a simplification. A real world implementation would ask the server to generate a unique room number
 * so to make sure that the room number is not accidentally repeated across uses
 */
function generateRoom() {
    const min = 1000001;
    const max = 1941597;

    // Génère un numéro de room aléatoire
    roomNo = Math.floor(Math.random() * (max - min + 1)) + min;

    // Remplit le champ roomNo avec la valeur générée
    document.getElementById('roomNo').value = roomNo;

    console.log(`[Client] Numéro de room généré : ${roomNo}`);
}


/**
 * it initialises the socket for /chat
 */

function initChatSocket() {
    // called when someone joins the room. If it is someone else it notifies the joining of the room
    chat.on('joined', function (room, userId) {
        if (userId === name) {
            // it enters the chat
            hideLoginInterface(room, userId);
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

    // Envoie le message via Socket.IO
    chat.emit('chat', roomNo, name, chatText);

    // Sauvegarde le message dans MongoDB
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
    news.emit('news', name, newsText); // Envoi en temps réel
    saveMessageToMongoDB('0', name, newsText); // Sauvegarde dans la room "0" (news)
    document.getElementById('news_input').value = '';
}


/**
 * used to connect to a room. It gets the user name and room number from the
 * interface
 * It connects both chat and news at the same time
 */
function connectToRoom() {
    // Récupère le nom uniquement depuis localStorage
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

    // Cache le formulaire et affiche l'interface de chat
    hideLoginInterface(roomNo, name);

    // Charge les historiques
    loadChatHistory('0'); // Historique général
    loadChatHistory(roomNo); // Room spécifique
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
function hideLoginInterface(room, userId) {
    document.getElementById('initial_form').style.display = 'none';
    document.getElementById('chat_interface').style.display = 'block';
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
    }
}