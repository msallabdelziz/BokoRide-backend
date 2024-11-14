// src/socket.js
const socketIo = require('socket.io');
const Message = require('../models/messageModel'); // Assurez-vous que le chemin est correct

const initializeSocket = (server) => {
    const io = socketIo(server); // Initialiser Socket.IO avec le serveur

    io.on('connection', (socket) => {
        console.log('A user connected: ' + socket.id);

        // Écoute des messages
        socket.on('sendMessage', async (data) => {
            // Émettre le message à tous les clients
            io.emit('receiveMessage', data);

            // Enregistrer le message dans la base de données
            const message = new Message({
                senderId: data.senderId,
                receiverId: data.receiverId,
                content: data.content
            });
            await message.save();
        });

         // Écoute des mises à jour de position
         socket.on('sendLocation', async (data) => {
            // Enregistrer la position dans la base de données
            const newLocation = new Location({
                userId: data.userId, // ID de l'utilisateur
                latitude: data.latitude,
                longitude: data.longitude,
                timestamp: new Date() // Enregistrer l'heure de la mise à jour
            });

            try {
                await newLocation.save(); // Enregistrer la nouvelle position
                console.log('Location saved:', newLocation);

                // Optionnel : Émettre la position à tous les autres clients connectés
                io.emit('receiveLocation', data);

            } catch (error) {
                console.error('Error saving location:', error);
            }
        });
        
        socket.on('disconnect', () => {
            console.log('User disconnected: ' + socket.id);
        });
    });

    return io; // Retourner l'instance de io
};

module.exports = initializeSocket;
