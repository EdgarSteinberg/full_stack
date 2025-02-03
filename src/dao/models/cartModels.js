import mongoose from "mongoose";

const cartCollection = "carts_urban";

const cartSchema = new mongoose.Schema({
    products: {
        type: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "products_urban",
                    required: true
                },
                quantity: {
                    type: Number,
                    default: 1
                }
            }
        ],
        default: [] // ✅ Colocado en el array `products`
    }
});

const cartModel = mongoose.model(cartCollection, cartSchema);

export default cartModel;
