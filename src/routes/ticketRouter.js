import { Router } from 'express';
import TicketManager from '../controllers/ticketManager.js';

const ticketService = new TicketManager();

const router = Router();

router.get("/", async (req, res) => {
    try {
        const result = await ticketService.getAllTickets();
        res.status(200).send({ status: "success", payload: result });
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
});

router.get("/:tid", async (req, res) => {
    const { tid } = req.params;
    try {
        const result = await ticketService.getTicketById(tid);
        if (!result) {
            return res.status(404).send({ status: "error", error: "Ticket no encontrado" });
        }
        res.status(200).send({ status: "success", payload: result });
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
});

router.post("/", async (req, res) => {
    const { purchaser, cart } = req.body;
    if (!purchaser || !cart) {
        return res.status(400).send({ status: "error", error: "Faltan datos en la solicitud (purchaser o cart)" });
    }

    try {
        const result = await ticketService.createTicket({ purchaser, cart });
        res.status(201).send({ status: "success", payload: result })
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
})

router.delete("/:tid", async (req, res) => {
    const { tid } = req.params;

    try {
        const result = await ticketService.deleteTicket(tid);
        if (!result) {
            return res.status(404).send({ status: "error", error: "Ticket no encontrado" });
        }
        res.status(200).send({ status: "success", payload: result });
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
})


export default router;