import mongoose from "mongoose";

const categorieCollection = "urban_category";

const categorieSchema = new mongoose.Schema({
    category_name: { type: String, required: true },
    category_image: { type: [String], required: true } // Ahora acepta un array de strings
});



const categorieModels = mongoose.model(categorieCollection, categorieSchema);

export default categorieModels;