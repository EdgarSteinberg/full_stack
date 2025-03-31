import mongoose from "mongoose";

const userCollection = "users_urban";

const userSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    age: { type: Number, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, require: true, minlength: 6 },
    cart: { type: mongoose.Schema.Types.ObjectId, ref: "carts_urban", required: true },
   // cart: { type: mongoose.Schema.Types.ObjectId, ref: "carts_urban"},
    role: {
        type: String, enum: ['admin', 'premium', 'user'], default: 'user'
    },
    documents: {
        type: [
            {
                name: { 
                    type: String, 
                    required: [true, 'El nombre del documento es requerido'], 
                    trim: true // Esto elimina los espacios al principio y al final
                },
                reference: { 
                    type: String, 
                    required: [true, 'La referencia del documento es requerida'], 
                    trim: true // Lo mismo aquí
                }
            }
        ],
        default: [] // Asegura que sea un arreglo vacío por defecto si no hay documentos
    },
    last_connection: { type: Date, default: Date.now }

});

const userModel = mongoose.model(userCollection, userSchema);

export default userModel;

