

import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true }, // Código único del ticket generado al momento de la compra
    amount: { type: Number, required: true }, // Monto total de la compra
    purchaser: { type: mongoose.Schema.Types.ObjectId, ref: "users_urban", required: true },  // Referencia al usuario que realizó la compra
    cart: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: "products_urban", required: true }, // Producto que fue comprado (referencia al modelo de producto)
            quantity: { type: Number, required: true } // Cantidad del producto comprado
        }
    ],
    purchaseDateTime: { type: Date, default: Date.now },  // Fecha y hora en la que se generó el ticket de compra
    

});

const ticketModel = mongoose.model("Ticket", ticketSchema);
export default ticketModel;
