import { Router } from 'express';
import MessageManager from "../controllers/messageManager.js";
const messagerManager = new MessageManager();

const router = Router();

router.get('/', async (req, res) => {
    try {
        const result = await messagerManager.getMessage();
        res.status(200).send({ status: 'success', payload: result });
    } catch (error) {
        res.status(400).send({ status: 'error', message: error.message });
    }
});


router.get('/:mid', async (req, res) => {
    const { mid } = req.params;
    try {
        const result = await messagerManager.getMessageById(mid);
        res.status(200).send({ status: 'success', payload: result });
    } catch (error) {
        res.status(400).send({ status: 'error', message: error.message });
    }
});


router.post('/', async (req, res) => {
    const { first_name, last_name, email, message } = req.body;

    if (!first_name || !last_name || !email || !message) {
        return res.status(400).send({ status: 'error', message: 'Todos los campos son obligatorios' });
    }
    try {
        const result = await messagerManager.createMessage({ first_name, last_name, email, message });
        res.status(200).send({ status: 'success', payload: result });
    } catch (error) {
        res.status(400).send({ status: 'error', message: error.message })
    }
});


router.put('/:mid', async (req, res) => {
    const { mid } = req.params;
    const updated = req.body;

    try {
        const result = await messagerManager.updateMessage(mid, updated);
        res.status(200).send({ status: 'succcess', payload: result });
    } catch (error) {
        res.status(400).send({ status: 'error', message: error.message });
    }
});

router.delete('/:mid', async (req, res) => {
    const { mid } = req.params;

    try {
        const result = await messagerManager.deleteMessage(mid);
        res.status(200).send({ status: 'succcess', payload: result });
    } catch (error) {
        res.status(400).send({ status: 'error', message: error.message });
    }
});

export default router;