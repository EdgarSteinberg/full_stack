import ProductService from "../dao/services/productService.js";
const productService = new ProductService();

class ProductManager {

    async getAllProducts() {
        return productService.getAllproductsService();
    }

    async getProductById(pid) {
        return productService.getproductByIdService(pid);
    }

    async createProduct(producto) {
        const { title, description, price, code, stock, status, category, thumbnails } = producto;

        if (!title || !description || !price || !code || !stock || !category || !thumbnails) {
            throw new Error(`Debes completar todos los campos`);
        }

        try {
            const createProducto = await productService.createProductService({ title, description, price, code, stock, status, category, thumbnails });

            return {
                message: "Producto creado correctamente",
                createProducto
            }
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async updateProducto(pid, update) {


        try {
            const updateProduct = await productService.updateProductService(pid, update);
            return updateProduct;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async deleteProduct(pid) {

        try {
            const deleteProduct = await productService.deleteProductService(pid);
            return deleteProduct;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}


export default ProductManager;