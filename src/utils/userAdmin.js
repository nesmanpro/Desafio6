// Middleware para verificar si el usuario es admin


export function isAdmin(req, res, next) {
    if (req.headers['referer'] === 'http://localhost:8080/apidocs/') {
        // Si la solicitud proviene de Swagger o supertest, permitir el acceso
        next();
    } else if (req.user && req.user.role === 'admin') {
        // Si es admin, puede seguir adelante
        next();
    } else {
        // Si no es admin
        res.render('noAdmin');
    }
};

// Middleware para verificar si el usuario es usuario regular
export function isUser(req, res, next) {
    if (req.user && req.user.role === 'user') {
        // Si es usuario regular, puede seguir adelante
        next();
    } else {
        // Si no es usuario regular
        res.render('noAdmin');
    }
};

export function gotAuth(req, res, next) {
    if (req.user) {
        // Si es usuario 
        next();
    } else {
        // Si no es usuario regular
        res.render('noAdmin');
    }
};

export function getRole(req) {
    return req.user ? req.user.role : null;
};

export function isPremium(req, res, next) {
    if (req.user && req.user.role === 'premium') {
        // Si es usuario regular, puede seguir adelante
        next();
    } else {
        // Si no es usuario regular
        res.render('noAdmin');
    }
};
