import { Router } from "express";

import CartManager from "../controllers/cartManager.js";

const cartServices = new CartManager();

const router = Router();

router.get("/", async (req, res) => {
    try {
        const result = await cartServices.getAllCarts();
        res.status(200).send({ status: "Succes", payload: result });
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
});


router.get("/:cid", async (req, res) => {
    const { cid } = req.params;
    try {
        const result = await cartServices.getCartById(cid);
        res.status(200).send({ status: "Succes", payload: result });

    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
});

router.post("/", async (req, res) => {
    try {
        const result = await cartServices.createCart();
        res.status(200).send({ status: "Succes", payload: result });

    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
});


router.post("/:cid/products/:pid", async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity = 1 } = req.body; // si no mandan nada, agrega 1 por defecto

    try {
        const result = await cartServices.addProductToCart(cid, pid, quantity);
        res.status(200).send({ status: "Success", payload: result });
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
});

router.put("/:cid/products/:pid/decrease", async (req, res) => {
    const { cid, pid } = req.params;

    try {
        const result = await cartServices.decreaseProductQuantity(cid, pid);
        res.status(200).send({ status: "Success", payload: result });
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
});


router.delete("/:cid/products/:pid", async (req, res) => {
    const { cid, pid } = req.params;

    try {
        const result = await cartServices.deleteProductToCart(cid, pid);
        res.status(200).send({ status: "Succes", payload: result });

    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
});

router.delete("/:cid", async (req, res) => {
    const { cid } = req.params;
    try {
        const result = await cartServices.deleteCart(cid);
        res.status(200).send({ status: "Succes", payload: result });

    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
});


export default router;