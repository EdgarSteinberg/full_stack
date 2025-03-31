import { Router } from 'express';
import passport from 'passport';

const router = Router();

router.get('/', passport.authenticate('github', { scope: ['user:email'] }), (req, res) => {
    res.send({ status: 'success', message: 'success' });
});

 router.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/', session: false }), (req, res) => {
    if (req.user && req.user.token) {
        console.log("Token generado:", req.user.token);  // Verificar que el token se pasa correctamente
        //res.cookie('coderCookieToken', req.user.token, { maxAge: 60 * 60 * 1000, httpOnly: true }).redirect('http://localhost:5173/');
        res.cookie('coderCookieToken', req.user.token, {
            maxAge: 60 * 60 * 1000,  // 1 hora
            httpOnly: false, // Permite el acceso desde JavaScript
            secure: process.env.NODE_ENV === 'production',  // Asegúrate de usar `secure` en producción
            sameSite: 'Strict',      // Para proteger la cookie en sitios cruzados
        }).redirect('http://localhost:5173/');
        
    } else {
        console.log("No se encontró el token en req.user");
        res.redirect('http://localhost:5173/login');
    }
}); 




export default router;