import cartModel from "./models/cartModels.js";

class CartDao {
    async getAllCartDao() {
        return await cartModel.find().populate("products.product").lean();
    }

    async getCartByIdDao(cid) {  // Nombre corregido para ser consistente
        return await cartModel.findOne({ _id: cid }).populate("products.product").lean();
    }

    async createCartDao() {
        return await cartModel.create({});
    }

    async addProductToCartDao(cid, pid) {
        // Busca si el producto ya está en el carrito
        const cart = await cartModel.findOne({ _id: cid, "products.product": pid });

        if (cart) {
            // Si el producto existe, incrementa la cantidad
            return await cartModel.findOneAndUpdate(
                { _id: cid, "products.product": pid },
                { $inc: { "products.$.quantity": 1 } },
                { new: true }
            );
        } else {
            // Si el producto no existe, agrégalo con cantidad 1
            return await cartModel.findOneAndUpdate(
                { _id: cid },
                { $push: { products: { product: pid, quantity: 1 } } },
                { new: true, upsert: true }
            );
        }
    }

    async decrementQuantityDao(cid, pid) {
        const cart = await cartModel.findOne({ _id: cid, "products.product": pid });

        if (!cart) {
            throw new Error("El producto no está en el carrito.");
        }

        const product = cart.products.find(p => p.product.toString() === pid);
        if (product.quantity > 1) {
            return await cartModel.findOneAndUpdate(
                { _id: cid, "products.product": pid },
                { $inc: { "products.$.quantity": -1 } },
                { new: true }
            );
        } else {
            throw new Error("No se puede reducir la cantidad por debajo de 1.");
        }
    }

    async deleteProductToCartDao(cid, pid) {
        return await cartModel.findOneAndUpdate(
            { _id: cid },
            { $pull: { products: { product: pid } } },
            { new: true }
        );
    }

    async deleteCartDao(cid) {
        return await cartModel.deleteOne({ _id: cid });
    }
}

export default CartDao;
