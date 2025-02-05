import { Router } from 'express';

import passport from 'passport';
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


router.post("/",  passport.authenticate('jwt', { session: false }), authorization(["admin", "premium"]), async (req, res, next) => {
    const { title, description, price, code, stock, status, category, thumbnails } = req.body;
    try {
        const result = await productService.createProduct({ title, description, price, code, stock, status, category, thumbnails });
        res.status(200).send({ status: "success", payload: result });

    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
});

router.put("/:pid", async (req, res) => {
    const { pid } = req.params;
    const  update  = req.body;

    try {
        const result = await productService.updateProduct(pid, update);
        res.status(200).send({ status: "success", payload: result });

    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
})


router.delete("/:pid", passport.authenticate('jwt', { session: false }), authorization(["admin", "premium"]), async (req, res) => {
    const { pid } = req.params;

    try {
        const result = await productService.deleteProduct(pid);
        res.status(200).send({ status: "success", payload: result });
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
});

export default router;




