const passport = require('passport');
const local = require('passport-local');
const UserModel = require('../dao/models/user.model.js');
const { createHash, isValidPassword } = require('../utils/hashBcrypt.js');
const GitHubStrategy = require('passport-github2');

const LocalStrategy = local.Strategy;

const initializePassport = () => {

    passport.use('register', new LocalStrategy({

        passReqToCallback: true,
        usernameField: 'email'
    }, async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;
        try {

            let user = await UserModel.findOne({ email });
            if (user) return done(null, false);

            let newUser = {
                first_name,
                last_name,
                email,
                age,
                password: createHash(password)
            }

            let result = await UserModel.create(newUser);

            return done(null, result);
        } catch (error) {
            return done(error);
        }
    }));

    passport.use('login', new LocalStrategy({
        usernameField: 'email'
    }, async (email, password, done) => {
        try {
            const user = await UserModel.findOne(({ email }));

            //Verifica si existe usuario
            if (!user) {
                console.log('Usuario inexistente!');
                return done(null, false)
            }
            //Verifica si constraseña es valida
            if (!isValidPassword(password, user)) return done(null, false);
            //retorna usuario si todo esta ok
            return done(null, user);

        } catch (error) {
            return done(error)
        }

    }));

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        let user = await UserModel.findOne({ _id: id });
        done(null, user)
    })

    // Estrategia GitHub
    passport.use('github', new GitHubStrategy({
        clientID: 'Iv1.327a724aa4f2dcba',
        clientSecret: '5fec1c5705a3be6be4548b38e46514b06b4e4ab5',
        callbackURL: 'http://localhost:8080/api/sessions/githubcallback'
    }, async (accessToken, refreshToken, profile, done) => {
        console.log('profile', profile);
        try {
            let user = await UserModel.findOne({ email: profile._json.email });
            let splitName = profile._json.name.split(' ');


            if (!user) {
                let newUser = {
                    first_name: splitName[0],
                    last_name: splitName[1],
                    email: profile._json.email,
                    age: 18,
                    password: ''
                }
                let result = await UserModel.create(newUser);
                done(null, result)
            } else {
                done(null, user);
            }


        } catch (error) {
            return done(error)
        }

    }))

}



module.exports = initializePassport;