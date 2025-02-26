import multer from 'multer';
import path from 'path';
import __dirname from './constants.js';


// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         // Asegurarnos de que req.body.category existe y tiene un valor válido
//         const category = req.body.category ? req.body.category.toLowerCase() : 'otros';

//         // Ruta de almacenamiento en función de la categoría
//         let folder = `public/products/${category}`;

//         // Construir la ruta completa
//         const fullPath = path.join(__dirname, '../../', folder);

//         // Verificar si la carpeta existe, si no, crearla
//         // if (!fs.existsSync(fullPath)) {
//         //     fs.mkdirSync(fullPath, { recursive: true });
//         // }

//         console.log(`Ruta de carga de archivo: ${fullPath}`);
//         cb(null, fullPath);
//     },
//     filename: (req, file, cb) => {
//         cb(null, file.originalname);  // Mantiene el nombre original del archivo
//     }
// });

// export const uploader = multer({ storage });


// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         let folder = 'public/otros'; // Carpeta por defecto

//         // Si la solicitud contiene "category_name", asumimos que es una categoría
//         if (req.body.category_name) {
//             folder = 'public/img';
//         } 
//         // Si la solicitud contiene "category", asumimos que es un producto
//         else if (req.body.category) {
//             folder = `public/products/${req.body.category.toLowerCase()}`;
//         }

//         const fullPath = path.join(__dirname, '../../', folder);

//         console.log(`Ruta de carga de archivo: ${fullPath}`);
//         cb(null, fullPath);
//     },
//     filename: (req, file, cb) => {
//         cb(null, file.originalname); // Mantiene el nombre original
//     }
// });



const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let folder = 'public/otros'; // Carpeta por defecto

        // Verificar que category_name esté presente y no sea vacío
        if (req.body.category_name && req.body.category_name.trim()) {
            const categoryName = req.body.category_name.trim().toLowerCase(); // Asegurarnos de que esté en minúsculas
            folder = `public/products/${categoryName}`;
            console.log(`category_name recibido: ${categoryName}`);
        } else {
            console.log('category_name no está presente o es inválido');
        }

        const fullPath = path.join(__dirname, '../../', folder);
        console.log(`Ruta de carga de archivo: ${fullPath}`);
        cb(null, fullPath);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); // Mantiene el nombre original
    }
});

export const uploader = multer({ storage });
