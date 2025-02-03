import cartModel from "../models/cartModels.js";

class CartService {

    async getAllCartService() {
        try {
            return await cartModel.find().populate("products.product").lean();
        } catch (error) {
            throw new Error(`Error al obtener los carrito ${error.message}`);
        }
    }

    async getCartByIdService(cid) {
        try {
            const result = await cartModel.findOne({ _id: cid });
            if (!result) {
                throw new Error(`Carrito no encontrado`);
            }
            return result;
        } catch (error) {
            throw new Error(`Error al obtener el carrito ${error.message}`);
        }
    }

    async createCartService() {
        try {
            const result = await cartModel.create({});
            return result;
        } catch (error) {
            throw new Error(`Error al crear el carrito ${error.message}`);
        }
    }

    async addProductToCartService(cid, pid) {
        try {
            const result = await cartModel.findOneAndUpdate(
                { _id: cid, "products.product": pid }, // Busca el carrito con el producto ya existente
                { $inc: { "products.$.quantity": 1 } }, // Incrementa la cantidad si el producto ya está en el carrito
                { new: true }
            );
    
            if (!result) {
                // Si el producto no existe en el carrito, agrégalo con cantidad 1
                return await cartModel.findOneAndUpdate(
                    { _id: cid },
                    { $push: { products: { product: pid, quantity: 1 } } },
                    { new: true, upsert: true }
                );
            }
    
            return result;
        } catch (error) {
            throw new Error(`Error al agregar el producto al carrito: ${error.message}`);
        }
    }
    
    async decrementQuantityService(cid, pid) {
        try {
            // Primero verifica si la cantidad es mayor a 1
            const cart = await cartModel.findOne({ _id: cid, "products.product": pid });
            const product = cart.products.find(p => p.product.toString() === pid);
            
            if (product && product.quantity > 1) {
                const result = await cartModel.findOneAndUpdate(
                    { _id: cid, "products.product": pid },
                    { $inc: { "products.$.quantity": -1 } },
                    { new: true }
                );
                return result;
            } else {
                throw new Error("La cantidad no puede ser menor que 1");
            }
        } catch (error) {
            throw new Error(`Error al decrementar quantity: ${error.message}`);
        }
    }

    async deleteProductToCartService(cid, pid) {
        try {
            const result = await cartModel.updateOne(
                { _id: cid }, // Encuentra el carrito por su ID
                { $pull: { products: { product: pid } } } // Elimina el producto con el ID pid del array 'products'
            );
            return result;
        } catch (error) {
            throw new Error(`Error al eliminar el producto del carrito: ${error.message}`);
        }
    }
   
    
    async deleteCartService(cid) {
        try {
            const result = await cartModel.deleteOne({ _id: cid });
            if (!result) {
                throw new Error(`Carrito no encontrado`);
            }
            return result;
        } catch (error) {
            throw new Error(`Error al eliminar el producto ${error.message}`);
        }
    }
}

export default CartService;