// chat.js
const socket = io(); // Connexion à Socket.IO

// Fonction pour envoyer des messages
const sendMessage = () => {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value;
    if (message) {
        socket.emit('sendMessage', message); // Émettre le message
        messageInput.value = ''; // Réinitialiser le champ de saisie
    }
};

// Écouter les messages reçus
socket.on('receiveMessage', (message) => {
    const messageContainer = document.getElementById('messages');
    const messageElement = document.createElement('div');
    messageElement.innerText = 'Message reçu: ' + message;
    messageContainer.appendChild(messageElement);
});

// Événements pour le bouton envoyer
document.getElementById('sendButton').addEventListener('click', sendMessage);

// Fonction pour partager la localisation
const shareLocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const location = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            };
            socket.emit('shareLocation', location); // Émettre la localisation
        });
    } else {
        alert('La géolocalisation n\'est pas supportée par ce navigateur.');
    }
};

// Écouter les emplacements reçus
socket.on('receiveLocation', (location) => {
    const messageContainer = document.getElementById('messages');
    const locationElement = document.createElement('div');
    locationElement.innerText = `Localisation partagée: ${location.latitude}, ${location.longitude}`;
    messageContainer.appendChild(locationElement);
});
