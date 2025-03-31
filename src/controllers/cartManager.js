import CartDao from "../dao/cartDao.js";
const cartDao = new CartDao();

class CartManager {
    async getAllCarts() {
        return await cartDao.getAllCartDao();
    }

    async getCartById(cid) {
        return await cartDao.getCartByIdDao(cid);
    }

    async createCart() {
        try {
            return await cartDao.createCartDao();
        } catch (error) {
            throw new Error(`Error al crear el carrito: ${error.message}`);
        }
    }

    async addProductToCart(cid, pid) {
        try {
            return await cartDao.addProductToCartDao(cid, pid);
        } catch (error) {
            throw new Error(`Error al agregar el producto al carrito: ${error.message}`);
        }
    }

    async decreaseProductQuantity(cid, pid) {
        try {
            return await cartDao.decrementQuantityDao(cid, pid);
        } catch (error) {
            throw new Error(`Error al decrementar cantidad: ${error.message}`);
        }
    }

    async deleteProductToCart(cid, pid) {
        try {
            const updatedCart = await cartDao.deleteProductToCartDao(cid, pid);
            if (!updatedCart) throw new Error("No se pudo eliminar el producto del carrito.");
            return updatedCart;
        } catch (error) {
            throw new Error(`Error al eliminar producto del carrito: ${error.message}`);
        }
    }

    async clearCart(cid) {
        try {
            // Llamamos directamente al DAO para vaciar los productos del carrito
            const updatedCart = await cartDao.clearCart(cid); 
    
            // Verificamos si el carrito fue actualizado (vacío)
            if (!updatedCart) {
                throw new Error("No se pudo vaciar el carrito.");
            }
    
            return updatedCart; // Devuelve el carrito vacío o actualizado
        } catch (error) {
            throw new Error(`Error al vaciar el carrito: ${error.message}`);
        }
    }
    async deleteCart(cid) {
        try {
            return await cartDao.deleteCartDao(cid);
        } catch (error) {
            throw new Error(`Error al eliminar el carrito: ${error.message}`);
        }
    }
}

export default CartManager;
