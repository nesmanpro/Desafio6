

class UserController {

    async register(req, res) {
        if (!req.user) return res.status(400).send({ status: 'error', message: 'Credenciales invalidas!' });

        req.session.user = {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            email: req.user.email,
            age: req.user.age,
            role: req.user.role,
            cart: req.user.cart
        };

        req.session.login = true;

        res.redirect("/");

    }

    profile(req, res) {
        if (req.session.user) {
            res.render('profile', { user: req.session.user })
        } else {
            res.redirect('/login')
        }
    }

    filedRegister(req, res) {
        res.send({ error: 'Registro fallido, revisar user.routes.js' })
    }

}

module.exports = UserController;