import {Router } from 'express';

const router = Router();

router.get("/", async (req,res) => {
    res.status(404).send({ status: "error", message: "Página no encontrada" });
});

export default router;
