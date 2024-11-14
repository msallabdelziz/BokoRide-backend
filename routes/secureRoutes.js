// routes/securedRoutes.js

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/protected-route', authMiddleware, (req, res) => {
    res.send('This is a protected route');
});

module.exports = router;
