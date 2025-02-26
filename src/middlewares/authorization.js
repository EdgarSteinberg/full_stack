
// const authorization = (roles) => {
//     return (req, res, next) => {
//         console.log('User role:', req.user?.role); // Verificar el rol del usuario
//         if (req.user && roles.includes(req.user.role)) {// Verificar que req.user exista y que el rol del usuario esté en la lista de roles permitidos
//             return next();
//         }

//         res.redirect('/api/notFound');
//     };
// };

// export default authorization;


const authorization = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            console.log('User not authenticated');
            return res.redirect('/api/notFound');
        }

        console.log('User role:', req.user?.role);  // Verificar el rol del usuario
        
        if (roles.includes(req.user.role)) {
            return next();
        } else {
            console.log('User role not authorized');
            return res.redirect('/api/notFound');
        }
    };
};

export default authorization;
