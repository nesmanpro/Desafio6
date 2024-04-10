// Middleware para verificar si el usuario es admin
function isAdmin(req, res, next) {
    if (req.user && req.user.role === 'admin') {
        // Si es admin, puede seguir adelante
        next();
    } else {
        // Si no es admin
        res.render('noAdmin');
    }
};

// Middleware para verificar si el usuario es usuario regular
function isUser(req, res, next) {
    if (req.user && req.user.role === 'user') {
        // Si es usuario regular, puede seguir adelante
        next();
    } else {
        // Si no es usuario regular
        res.render('noAdmin');
    }
};

function getRole(req) {
    return req.user ? req.user.role : null;
};

module.exports = { isAdmin, isUser, getRole };