
class SessionController {

    async login(req, res) {
        if (!req.user) return res.status(400).send({ status: 'error', message: 'Credenciales no validas!' });

        req.session.user = {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            email: req.user.email,
            age: req.user.age,
            role: req.user.role,
            cart: req.user.cart
        };

        req.session.login = true;

        res.redirect('/')
    }

    async failLogin(req, res) {
        console.log('Fallo la estrategia, revisar codigo')
        res.send({ error: 'No funciono la estrategia, hay q revistar session.router.js' })
    }

    async current(req, res) {

        if (!req.user) return res.status(400).send({ status: 'error', message: 'No hay usuario logeado en este momento' });

        res.json(req.user)
    }

    async github(req, res) { }

    async githubCallBack(req, res) {
        req.session.user = req.user;
        req.session.login = true;
        res.redirect('/products');
    }

    destroy(req, res) {
        if (req.session.login) {
            req.session.destroy();
        }
        res.redirect('/login')
    }

}

module.exports = SessionController;