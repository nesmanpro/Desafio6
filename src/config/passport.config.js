import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import UserModel from '../models/user.model.js';
import { createHash, isValidPassword } from '../utils/hashBcrypt.js';
import GitHubStrategy from 'passport-github2';
import configObj from './dotenv.config.js';
import CartRepository from '../repositories/cartRepository.js';

// Servide and Controller 
const cartService = new CartRepository();

// importacion dotenv.config
const { GITclientID, GITclientSecret, GITcallbackURL } = configObj;



const initializePassport = () => {

    passport.use('register', new LocalStrategy({

        passReqToCallback: true,
        usernameField: 'email'
    }, async (req, username, password, done) => {
        const { first_name, last_name, email, age, role = 'user' } = req.body;
        try {

            let user = await UserModel.findOne({ email });

            if (user) return done(null, false);

            const newCart = await cartService.createCart();

            let newUser = {
                first_name,
                last_name,
                email,
                age,
                role,
                cart: newCart._id,
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
        clientID: GITclientID,
        clientSecret: GITclientSecret,
        callbackURL: GITcallbackURL
    }, async (accessToken, refreshToken, profile, done) => {
        console.log('profile', profile);
        try {
            let user = await UserModel.findOne({ email: profile._json.email });
            let splitName = profile._json.name.split(' ');

            const newCart = await cartService.createCart();


            if (!user) {
                let newUser = {
                    first_name: splitName[0],
                    last_name: splitName[1],
                    email: profile._json.email,
                    age: 18,
                    password: '',
                    cart: newCart._id,
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

export default initializePassport;