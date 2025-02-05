/* import TicketDao from "../dao/ticketDao.js";
const ticketDao = new TicketDao();

import CartManager from './cartManager.js';
const cartManager = new CartManager();

import UserManager from './userManager.js';
const userManager = new UserManager();

class TicketManager {

    async getAllTickets() {
        return ticketDao.getAllTicketDao();
    }

    async getTicketById(tid) {
        return ticketDao.getTicketByIdDao(tid);
    }

    async createTicket(ticket){
        const { purchaser, cart } = ticket;

        if (!cart || !purchaser) {
            throw new Error('Error al crear el ticket');
        }

        // Buscamos al usuario y luego almacenamos su email
        const resultUserId = await userManager.getUserById(purchaser);
        if (!resultUserId) {
            throw new Error(`Error: usuario con ID ${purchaser} no encontrado`);
        }
        const resultUserEmail = resultUserId.email;

        // Buscamos al carrito y luego alamacenamos los productos
        const resultCartId = await cartManager.getCartById(cart);
        if (!resultCartId) {
            throw new Error(`Error: carrito con ID ${cart} no encontrado`);
        }
        const productsInCart = resultCartId.products;

        if (!productsInCart || productsInCart.length === 0) {
            throw new Error(`Error: el carrito está vacío`);
        }


        const amount = productsInCart.reduce((acc, cartItem) => acc + (cartItem.product.price * cartItem.quantity), 0);
        
        const code = await this.generateUniqueCode();

        const purchaser_dateTime = Date.now();
        try{
            const newTicket = {
                amount,
                code,
                purchaser_dateTime,
                purcharser : resultUserEmail
            }
            
            return await ticketDao.createTicketDao(newTicket);
        }catch(error){
            throw new Error("Error al crear el Ticket!", error.mesage);
        }
    }

    async deleteTicket(tid) {
        try {
            const ticket = await this.getTicketById(tid);
            if (!ticket) {
                throw new Error(`Ticket con ID ${tid} no encontrado!`);
            }

            return ticket;
        } catch (error) {
            throw new Error("Error al eliminar el producto");
        }
    }


    async generateUniqueCode(){
        try{
            const randomCode = Math.floor(Math.random() * 1000) + 1;
            return randomCode
        }catch(error){
            throw new Error(`Error al generar el codigo!`)
        }
    }
}

export default TicketManager; */

import mongoose from "mongoose";
import TicketDao from "../dao/ticketDao.js";
const ticketDao = new TicketDao();

import CartManager from './cartManager.js';
const cartManager = new CartManager();

import UserManager from './userManager.js';
const userManager = new UserManager();

class TicketManager {
    async getAllTickets() {
        return await ticketDao.getAllTicketDao();
    }

    async getTicketById(tid) {
        return await ticketDao.getTicketByIdDao(tid);
    }

    async createTicket(ticket) {
        const { purchaser, cart } = ticket;

        if (!cart || !purchaser) {
            throw new Error("Error: Faltan datos para crear el ticket.");
        }

        const user = await userManager.getUserById(purchaser);
        if (!user) {
            throw new Error(`Error: Usuario con ID ${purchaser} no encontrado.`);
        }

        const cartData = await cartManager.getCartById(cart);
        if (!cartData || cartData.products.length === 0) {
            throw new Error(`Error: Carrito con ID ${cart} no encontrado o vacío.`);
        }

        const amount = cartData.products.reduce((acc, cartItem) => 
            acc + (cartItem.product.price * cartItem.quantity), 0
        );

        const code = await this.generateUniqueCode();

        try {
            const newTicket = {
                code,
                amount,
                purchaser: new mongoose.Types.ObjectId(user._id),// Guardamos la referencia del usuario
                purchaser_dateTime :  Date.now(),
                cart: cartData.products.map(p => ({
                    product: p.product._id, // Referencia al producto
                    quantity: p.quantity
                }))
            };

            return await ticketDao.createTicketDao(newTicket);
        } catch (error) {
            throw new Error(`Error al crear el ticket: ${error.message}`);
        }
    }

    async deleteTicket(tid) {
        const ticket = await this.getTicketById(tid);
        if (!ticket) {
            throw new Error(`Ticket con ID ${tid} no encontrado.`);
        }
        return await ticketDao.deleteTicketDao(tid);
    }

    async generateUniqueCode() {
        return Math.random().toString(36).substring(2, 10).toUpperCase();
    }
}

export default TicketManager;
