import CartService from "../dao/services/cartService.js";
const cartService = new CartService();
//import ProductManager from "./productManager.js";


class CartManager {

    async getAllCarts() {
        return cartService.getAllCartService();
    }

    async getCartById(cid) {
        return cartService.getCartByIdService(cid);
    }

    async createCart() {
        try {
            const result = await cartService.createCartService();
            return result;
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    async addProductoToCart(cid, pid) {
        try {
            const updatedCart = await cartService.addProductToCartService(cid, pid);
    
            if (!updatedCart) {
                throw new Error("No se pudo agregar el producto al carrito");
            }
    
            return updatedCart;
        } catch (error) {
            console.error("Error al agregar producto al carrito:", error.message);
            throw error;
        }
    }
    

    async decreaseProductQuantity(cid, pid) {
        try{
            const updatedCart = await cartService.decrementQuantityService(cid,pid);
            if (!updatedCart) {
                throw new Error("No se pudo disminuir la cantidad del producto al carrito");
            }
    
            return updatedCart;
        }catch (error) {
            console.log(error);
            throw error;
        }
    }


    async deleteProductToCart(cid, pid) {
        try {
           const updatedCart = await cartService.deleteProductToCartService(cid,pid);
           if(!updatedCart){
            throw new Error("No se pudo eliminar el producto del carrito");
           }

           return updatedCart;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }


    async deleteCart(cid) {
        try {
            const result = await cartService.deleteCartService(cid);
            return result;
        } catch (error) {
            console.log(error)
            throw error
        }
    }
}

export default CartManager;