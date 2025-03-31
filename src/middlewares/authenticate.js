import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const authenticate = async (req, res, next) => {
    // Verifica si el token JWT está presente en las cookies
    const token = req.cookies.coderCookieToken; 

    if (!token) {
        // Si no hay token, redirige a la página de login
        return res.redirect('/login');
    }

    try {
        // Verifica el token usando la clave secreta
        const decoded = jwt.verify(token, process.env.SECRET_KEY);  // Verifica el token
        req.user = decoded;  // Añade los datos del usuario a req.user

        next();  // Si el token es válido, continúa con la siguiente función en la ruta
    } catch (err) {
        // Si el token no es válido o ha expirado, redirige al login
        console.error('Error al verificar el token:', err);
        return res.redirect('/login');
    }
};
