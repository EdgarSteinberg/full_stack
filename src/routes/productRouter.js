import { Router } from 'express';
import ProductManager from '../controllers/productManager.js';

const productService = new ProductManager();
const router = Router();

// Obtener todos los productos
router.get("/", async (req, res) => {
    try {
        const products = await productService.getAllProducts();
        return res.status(200).send({ status: "Success", payload: products });
    } catch (error) {
        res.status(500).send({ status: "Error", error: error.message });
    }
});

// Obtener un producto por ID
router.get("/:pid", async (req, res) => {
    const { pid } = req.params; // accedemos directamente a req.params.pid
    if (!pid) {
        return res.status(400).send({ status: "Error", error: "El producto con ese ID no existe" });
    }

    try {
        const result = await productService.getProductById(pid);
        if (!result) {
            return res.status(404).send({ status: "Error", error: "Producto no encontrado" });
        }
        res.status(200).send({ status: "Success", payload: result });
    } catch (error) {
        res.status(500).send({ status: "Error", error: error.message });
    }
});

// Crar un producto
router.post("/",async  (req, res) => {
    const { title, description, code, price, stock, status, category, thumbnails } = req.body;
    
    // Verifica los datos recibidos en la consola
    console.log(req.body);

    if (!title || !description || !code || !price || !stock || !status || !category || !thumbnails) {
        return res.status(400).send({ status: "Error", error: "Todos los campos son obligatorios!" });
    }

    try {
        const result = await productService.createProduct({ title, description, code, price, stock, status, category, thumbnails });
        return res.status(200).send({ status: "Success", payload: result });
    } catch (error) {
        res.status(500).send({ status: "Error", error: error.message });
    }
});



// Actualizar un producto por ID
router.put("/:pid", async (req, res) => {
    const { pid } = req.params;
    const updates = req.body;

    if (!pid || !updates) {
        return res.status(400).send({ status: "Error", error: "Faltan parámetros para actualizar" });
    }

    try {
        const result = await productService.updateProduct(pid, updates);
        res.status(200).send({ status: "Success", payload: result });
    } catch (error) {
        res.status(500).send({ status: "Error", error: error.message });
    }
});

// Eliminar un producto por ID
router.delete("/:pid", async (req, res) => {
    const { pid } = req.params;
    if (!pid) {
        return res.status(400).send({ status: "Error", error: "Se debe proporcionar un ID válido" });
    }

    try {
        const result = await productService.deleteProduct(pid);
        res.status(200).send({ status: "Success", payload: result });
    } catch (error) {
        res.status(500).send({ status: "Error", error: error.message });
    }
});

export default router;
