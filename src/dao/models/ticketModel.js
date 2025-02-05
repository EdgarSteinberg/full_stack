// import mongoose from "mongoose";


// const ticketCollection = "ticket_urban";


// const ticketSchema = new mongoose.Schema({
//     code: { type: String, unique: true },
//     purchase_datetime: { type: Date, default: Date.now() },
//     amount: { type: Number },
//     purchaser: { type: String }
// })

// const ticketModel = mongoose.model(ticketCollection, ticketSchema);

// export default ticketModel;


import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    purchaser: { type: mongoose.Schema.Types.ObjectId, ref: "users_urban", required: true }, // Referencia a usuario
    cart: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: "products_urban", required: true },
            quantity: { type: Number, required: true }
        }
    ],
    purchaseDateTime: { type: Date, default: Date.now }
});

const ticketModel = mongoose.model("Ticket", ticketSchema);
export default ticketModel;
