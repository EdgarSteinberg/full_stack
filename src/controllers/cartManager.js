import ProductManager from "./productManager.js";


class CartManager {
    constructor() {
        this.carts = [];
    }


    async getAllCarts() {
        return this.carts;
    }

    async getCartById(cid) {
        const cartId = this.carts.find(cart => cart.id === parseInt(cid));
        if (!cartId) throw new Error(`El carrito con ID: ${cid} no se encuentra`);

        return cartId;
    }

    async createCart() {
        try {
            const newId = this.carts.length > 0 ? this.carts[this.carts.length - 1].id + 1 : 1;
            const nuevoCarrito = { id: newId, products: [] };
            this.carts.push(nuevoCarrito);
            return nuevoCarrito;
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    async addProductoToCart(cid, pid) {
        const cartId = this.carts.find(cart => cart.id == parseInt(cid));
        if (!cartId) throw new Error(`El carrito con ID: ${cid} no se encuentra`);

        const productId = ProductManager.products.find(pr => pr.id == parseInt(pid));
        if (!productId) throw new Error(`El producto con ID: ${pid} no se encuentra`);

        try {
            // Buscar si el producto ya está en el carrito
            const productInCart = cartId.products.find(pr => pr.productId === productId.id);

            if (productInCart) {
                // Si el producto ya está, aumentar cantidad
                productInCart.quantity += 1;
            } else {
                // Si no está, agregar nuevo producto con cantidad 1
                cartId.products.push({ productId: productId.id, quantity: 1 });
            }

            return cartId; // Retornar el carrito actualizado (opcional)
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    async decreaseProductQuantity(cid, pid) {
        const cartId = this.carts.find(cart => cart.id == parseInt(cid));
        if (!cartId) throw new Error(`El carrito con ID: ${cid} no se encuentra`);

        const productId = ProductManager.products.find(pr => pr.id == parseInt(pid));
        if (!productId) throw new Error(`El producto con ID: ${pid} no se encuentra`);

        try {
            const productInCart = cartId.products.find(pr => pr.productId === productId.id);
            if (!productInCart) throw new Error(`El producto con ID: ${pid} no está en el carrito`);

            if (productInCart.quantity > 1) {
                productInCart.quantity -= 1; // Disminuir cantidad si es mayor a 1
            } else {
                cartId.products = cartId.products.filter(pr => pr.productId !== productId.id); // Eliminar producto si queda en 0
            }

            return cartId; // Retornar el carrito actualizado
        } catch (error) {
            console.log(error);
            throw error;
        }
    }


    async deleteProductToCart(cid, pid) {
        const cartId = this.carts.find(cart => cart.id == parseInt(cid));
        if (!cartId) throw new Error(`El carrito con ID: ${cid} no se encuentra`);

        const productId = ProductManager.products.find(pr => pr.id == parseInt(pid));
        if (!productId) throw new Error(`El producto con ID: ${pid} no se encuentra`);

        try {
            // Filtrar solo el producto que queremos eliminar
            const updatedProducts = cartId.products.filter(pr => pr.productId !== productId.id);

            // Actualizar el carrito con los productos restantes
            cartId.products = updatedProducts;

            return cartId; // Retornar el carrito actualizado
        } catch (error) {
            console.log(error);
            throw error;
        }
    }


    async deleteCart(cid) {
        const cartFind = this.carts.find(cart => cart.id === parseInt(cid));
        if (!cartFind) throw new Error(`El carrito con ID: ${cid} no se encuentra`);

        try {
            this.carts = this.carts.filter(cart => cart.id !== parseInt(cid));
            return `El carrito con ID ${cid} fue eliminado correctamente`;
        } catch (error) {
            console.log(error)
            throw error
        }
    }
}

export default CartManager;