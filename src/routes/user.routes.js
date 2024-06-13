
import express from 'express';
import passport from 'passport';

// desafio 4ta integradora
import upload from '../config/multer.js';
import UserRepository from '../repositories/userRepository.js';
const userRepo = new UserRepository();

// Service / controller
import UserController from '../controller/userController.js';
const userController = new UserController();

const router = express.Router();

//Version con Passport
router.post('/register', passport.authenticate('register', {
    failureRedirect: '/failedregister'
}), userController.register);
// Endpoint ver el perfil
router.get('/profile', userController.profile);
// Endpoint si falla registro
router.get('/failedregister', userController.filedRegister);
//endpoint cambiar roll premium
router.put("/premium/:uid", userController.becomePremium);
// Endpoint subir archivos con multer
router.post('/:ui/documents', upload.fields([
    { name: 'document' }, { name: 'products' }, { name: 'profile' }]), async (req, res) => {
        const { uid } = req.params;
        const uploadedDocs = req.files;

        try {
            const user = await userRepo.findByEmail(uid);

            if (!user) {
                return res.status(404).send('Usuario no encontrado');
            }

            if (uploadedDocs) {
                if (uploadedDocs.document) {
                    user.documents = user.documents.concat(uploadedDocs.document.map(d => ({
                        name: d.originalname,
                        reference: d.path
                    })));
                }

                if (uploadedDocs.products) {
                    user.documents = user.documents.concat(uploadedDocs.products.map(d => ({
                        name: d.originalname,
                        reference: d.path
                    })));
                }

                if (uploadedDocs.profile) {
                    user.documents = user.documents.concat(uploadedDocs.profile.map(d => ({
                        name: d.originalname,
                        reference: d.path
                    })));
                }

                await user.save();

                res.status(200).send('Documentos correctamente guardados')

            }
        } catch (error) {
            console.error(error);
            res.status(500).send('Error interno del servidor')

        }

    })




export default router;
