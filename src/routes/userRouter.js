import { Router } from 'express';

import UserManager from '../controllers/userManager.js';
const userServices = new UserManager();

const router = Router();

router.get("/", async (req, res) => {
    try {
        const result = await userServices.getAllUsers();
        res.status(200).send({ status: "succes", payload: result });
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
});

router.get("/:uid", async (req, res) => {
    const { uid } = req.params;

    try {
        const result = await userServices.getUserById(uid);
        res.status(200).send({ status: "succes", payload: result });
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
});

router.post("/register", async (req, res) => {
    const { first_name, last_name, email, password } = req.body;

    if (!first_name || !last_name || !email || !password) {
        return res.status(500).send({ status: "error", error: "faltan campos que completar!" });
    }

    try {
        const result = await userServices.register({ first_name, last_name, email, password });
        res.status(201).send({ status: "succes", payload: result });
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send({ status: "error", error: "Email y contraseña son requeridos" });
    }
    try {
        const result = await userServices.loginUser(email, password);
        res.status(201).send({ status: "succes", payload: result });
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
})

router.put("/:uid", async (req, res) => {
    const { uid } = req.params;
    const update = req.body
    try {
        const result = await userServices.updateUser(uid, update);
        res.status(200).send({ status: "succes", payload: result });
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
});

router.delete("/:uid", async (req, res) => {
    const { uid } = req.params;

    try {
        const result = await userServices.deleteUser(uid);
        res.status(200).send({ status: "succes", payload: result });
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
})

export default router;