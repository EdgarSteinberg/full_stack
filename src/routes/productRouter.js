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
            //const thumbnails1 = req.files['thumbnail']; // Si hay más de un archivo
            //console.log(thumbnails1); // Verifica que los archivos estén llegando correctamente

            // Mostrar los datos que has recibido
            console.log({ title, description, price, code, stock, status, category, category_product });

            // Obtener el usuario autenticado
            const userEmail = req.user.email;
            const userRole = req.user.role;

            // Solo se pasa el owner si viene del req.user
            const owner = userRole === 'premium' ? userEmail : 'admin';

            // Accede a los archivos con chequeo seguro
            const thumbnails1 = req.files?.['thumbnail'] || [];


            // Procesar imágenes (si hay)
            const thumbnails = thumbnails1.map(file => file.filename);

            // Procesar imágenes (si hay)
            //const thumbnails = req.files['thumbnail'] ? req.files['thumbnail'].map(file => file.filename) : [];

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

    console.log("req.user:", req.user);
    console.log("userRole:", userRole);

    try {
        //Obtener el producto de la base de datos
        const product = await productService.getProductById(pid);

        console.log("product.owner:", product.owner);
        if (!product) {
            return res.status(404).send({ status: "error", message: "Producto no encontrado" });
        }

        //Verificar si el usuario es admin o el dueño del producto
        if (userRole === "admin" || product.owner === userEmail) {
            // Eliminar el producto
            const result = await productService.deleteProduct(pid);
            return res.status(200).send({ status: "success", message: "Producto eliminado correctamente", payload: result });
        } else {
            return res.status(403).send({ status: "error", message: "No tienes permiso para eliminar este producto" });
        }

        // const product = await productService.getProductById(pid);
        // console.log("Producto obtenido:", product); // <= Siempre lo ves

        // if (!product) {
        //     return res.status(404).send({ status: "error", message: "Producto no encontrado" });
        // }

        // console.log("Propietario del producto:", product.owner);
        // console.log("Rol del usuario:", userRole);

        // if (userRole === 'admin') {
        //     await productService.deleteProduct(pid);
        //     console.log("producto delete admin");
        //     return res.status(200).send({ status: "success", message: "Producto eliminado correctamente" });
        // }

        // if (userRole === 'premium' && product.owner === userEmail) {
        //     await productService.deleteProduct(pid);
        //     console.log("producto delete premium");
        //     return res.status(200).send({ status: "success", message: "Producto eliminado correctamente" });
        // }

        // console.log("No autorizado para borrar este producto");
        // return res.status(403).send({ status: "error", message: "No tienes permiso para eliminar este producto" });


    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
});


export default router;




