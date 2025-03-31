import { Router } from 'express';
import passport from 'passport';
import { uploader } from '../utils/multer.js';

import ProductManager from '../controllers/productManager.js';
import authorization from '../middlewares/authorization.js';

const productService = new ProductManager();

const router = Router();


router.get("/", async (req, res) => {
    try {
        const result = await productService.getAllProducts();
        res.status(200).send({ status: "success", payload: result });
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
});


router.get("/:pid", async (req, res) => {
    const { pid } = req.params;

    try {
        const result = await productService.getProductById(pid);
        res.status(200).send({ status: "success", payload: result });
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
});

router.get("/products/category", async (req, res) => {
    try {
        const result = await productService.getAllCategoryProduct();
        res.status(200).send({ status: "success", payload: result });
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
})

router.get("/category/:category", async (req, res) => {
    const { category } = req.params;
    try {
        const result = await productService.getCategoryProduct(category);

        if (result.length === 0) {
            return res.status(404).send({ status: "error", message: "No se encontraron productos para esta categoría." });
        }
        res.status(200).send({ status: "success", payload: result });
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
});



router.post("/", passport.authenticate('jwt', { session: false }), authorization(["admin", "premium"]),
    uploader.fields([{ name: 'thumbnail', maxCount: 5 }]),
    async (req, res) => {
        try {
            let { title, description, price, code, stock, status, category, category_product } = req.body;

            // Asignar 'true' a status si no está definido
            status = status !== undefined ? status : true;

            // Accede a los archivos
            const thumbnails1 = req.files['thumbnail']; // Si hay más de un archivo
            console.log(thumbnails1); // Verifica que los archivos estén llegando correctamente

            // Mostrar los datos que has recibido
            console.log({ title, description, price, code, stock, status, category, category_product });

            // Obtener el usuario autenticado
            const userEmail = req.user.email;
            const userRole = req.user.role;

            // Solo se pasa el owner si viene del req.user
            const owner = userRole === 'premium' ? userEmail : 'admin';

            // Procesar imágenes (si hay)
            const thumbnails = req.files['thumbnail'] ? req.files['thumbnail'].map(file => file.filename) : [];

            // Crear el producto con owner
            const result = await productService.createProduct({
                title,
                description,
                price,
                code,
                stock,
                status,  // status ahora está asegurado con valor predeterminado
                category,
                thumbnails,
                owner,  // Aquí se envía explícitamente el owner
                category_product
            });

            // res.redirect('http://localhost:5173/postProduct')
            res.status(200).send({ status: "success", payload: result });
        } catch (error) {
            console.error("Error en la creación del producto:", error); // Detalles del error en la consola
            res.status(500).send({ status: "error", error: error.message });
        }
    }
);

router.put("/:pid", async (req, res) => {
    const { pid } = req.params;
    const update = req.body;

    try {
        const result = await productService.updateProduct(pid, update);
        res.status(200).send({ status: "success", payload: result });

    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
})


router.delete("/:pid", passport.authenticate('jwt', { session: false }), authorization(["admin", "premium"]), async (req, res) => {
    //console.log("Token recibido:", req.headers.authorization);

    const { pid } = req.params;
    const userEmail = req.user.email; // El email del usuario autenticado
    const userRole = req.user.role;   // El rol del usuario (admin o premium)

    try {
        // Obtener el producto de la base de datos
        const product = await productService.getProductById(pid);

        if (!product) {
            return res.status(404).send({ status: "error", message: "Producto no encontrado" });
        }

        // Verificar si el usuario es admin o el dueño del producto
        if (userRole === "admin" || product.owner === userEmail) {
            // Eliminar el producto
            const result = await productService.deleteProduct(pid);
            return res.status(200).send({ status: "success", message: "Producto eliminado correctamente", payload: result });
        } else {
            return res.status(403).send({ status: "error", message: "No tienes permiso para eliminar este producto" });
        }
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
});


export default router;




