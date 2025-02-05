import mongoose from 'mongoose';

const productCollection = "products_urban";

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    code: { type: String, required: true }, // Evita códigos duplicados
    stock: { type: Number, required: true },
    status: { type: Boolean, required: true, default: true }, // Default en true
    category: { type: String, required: true },
    thumbnails: { type: [String], default: [] } // ✅ Corregido: Array de strings
});

const productModel = mongoose.model(productCollection, productSchema);

export default productModel;
