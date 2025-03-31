import multer from 'multer';
import path from 'path';
import __dirname from './constants.js';

/* 
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let folder = 'public/otros'; // Carpeta por defecto

        // Verificar que category_name esté presente y no sea vacío
        if (req.body.category_product && req.body.category_product.trim()) {
            const categoryName = req.body.category_product.trim().toLowerCase(); // Asegurarnos de que esté en minúsculas
            folder = `public/products/${categoryName}`;
            console.log(`category_product recibido: ${categoryName}`);
        } else {
            console.log('category_product no está presente o es inválido');
        }

        const fullPath = path.join(__dirname, '../../', folder);
        console.log(`Ruta de carga de archivo: ${fullPath}`);
        cb(null, fullPath);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); // Mantiene el nombre original
    }
});

export const uploader = multer({ storage }); */

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let folder = 'public/otros'; // Carpeta por defecto

        // Verificar si se está cargando un archivo de tipo documento
        if (req.body.category_product && req.body.category_product.trim()) {
            const categoryName = req.body.category_product.trim().toLowerCase(); // Asegurarnos de que esté en minúsculas
            folder = `public/products/${categoryName}`;
            console.log(`category_product recibido: ${categoryName}`);
        } else if (file.mimetype.includes('pdf') || file.mimetype.includes('doc')) {
            // Si es un archivo de documento (puedes ajustar las extensiones según sea necesario)
            folder = 'public/documents';
            console.log('Archivo de tipo documento, cargando en la carpeta /public/documents');
        } else {
            console.log('category_product no está presente o es inválido, o archivo no es documento');
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
