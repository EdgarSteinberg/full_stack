class ProductManager {
    static products = [];

    async getAllProducts() {
        return ProductManager.products;
    }

    async getProductById(pid) {
        const productId = ProductManager.products.find(pr => pr.id === parseInt(pid));

        if (!productId) throw new Error(`El Producto con ID: ${pid} no se encuentra`);

        return productId;
    }

    async createProduct(producto) {
        const { title, description, price, code, stock, status , category, thumbnails } = producto;

        if (!title || !description || !price || !code || !stock|| !category || !thumbnails) {
            throw new Error(`Debes completar todos los campos`);
        }

        try {
            const newId = ProductManager.products.length > 0 ? ProductManager.products[ProductManager.products.length - 1].id + 1 : 1;

            const newProducto = {
                id: newId,
                title,
                description,
                price,
                code,
                stock,
                status,
                category,
                thumbnails
            };

            ProductManager.products.push(newProducto);

            return newProducto;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async updateProducto(pid, update) {
        const productoEnArray = ProductManager.products.find(pr => pr.id === parseInt(pid));

        if (!productoEnArray) throw new Error(`El Producto con ID: ${pid} no se encuentra`);

        try {
            for (const key in update) {
                productoEnArray[key] = update[key];  
            }

            return productoEnArray;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async deleteProduct(pid) {
       
        const productoExistente = ProductManager.products.find(pr => pr.id === parseInt(pid));
        if (!productoExistente) throw new Error(`El Producto con ID: ${pid} no se encuentra`);

        try {
            ProductManager.products = ProductManager.products.filter(pr => pr.id !== parseInt(pid));
            return `Producto con ID ${pid} eliminado correctamente`;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}


export default ProductManager;