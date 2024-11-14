// middlewares/roleMiddleware.js

const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        const userRole = req.user.role; // Récupérer le rôle de l'utilisateur connecté
        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({ message: 'Access denied.' });
        }
        next();
    };
};

module.exports = authorizeRoles;
