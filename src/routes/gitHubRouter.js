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
            secure: true,  // Asegúrate de usar `secure` en producción
            sameSite: 'None',      // Para proteger la cookie en sitios cruzados
        }).redirect('https://mobilematrix.netlify.app//');
        
    } else {
        console.log("No se encontró el token en req.user");
        res.redirect('https://mobilematrix.netlify.app/login');
    }
}); 




export default router;