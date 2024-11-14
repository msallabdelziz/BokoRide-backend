
// controllers/chatController.js

const Message = require('../models/messageModel');

const sendMessage = async (req, res) => {
    const { receiverId, content } = req.body;

    try {
        const message = new Message({
            senderId: req.user.userId, // L'ID de l'utilisateur connecté
            receiverId,
            content
        });

        await message.save();
        res.status(201).json({ message: 'Message sent', data: message });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getMessages = async (req, res) => {
    const { userId } = req.params; // ID de l'utilisateur avec qui l'utilisateur authentifié discute

    try {
        const messages = await Message.find({
            $or: [
                { senderId: req.user.userId, receiverId: userId },
                { senderId: userId, receiverId: req.user.userId }
            ]
        }).populate('senderId receiverId'); // Peupler les champs avec les données utilisateur

        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    sendMessage,
    getMessages
};
