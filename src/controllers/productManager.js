import ProductDao from "../dao/productDao.js";
const productDao = new ProductDao();

class ProductManager {
    async getAllProducts() {
        return await productDao.getAllProductsDao();
    }

    async getProductById(pid) {
        return await productDao.getProductByIdDao(pid);
    }

    async getAllCategoryProduct(){
        return await productDao.getALLCategoryProductDao();
    }
 
    async getCategoryProduct(category){
        return await productDao.getALLCategoryProductByIdDao(category);
    }

    async createProduct(product) {
        const { title, description, price, code, stock, category, thumbnails, status = true , owner,  category_product  } = product;

        if (!title || !description || !price || !code || !stock || !category || !thumbnails || !category_product) {
            throw new Error("Debes completar todos los campos obligatorios.");
        }

        try {
            const createdProduct = await productDao.createProductDao({ title, description, price, code, stock, category, thumbnails, status , owner , category_product });

            return {
                message: "Producto creado correctamente",
                product: createdProduct
            };
        } catch (error) {
            throw new Error(`Error al crear el producto: ${error.message}`);
        }
    }

    async updateProduct(pid, update) {
        try {
            const updatedProduct = await productDao.updateProductDao(pid, update);
            return updatedProduct;
        } catch (error) {
            throw new Error(`Error al actualizar el producto: ${error.message}`);
        }
    }

    async deleteProduct(pid) {
        try {
            const deletedProduct = await productDao.deleteProductDao(pid);
            return deletedProduct;
        } catch (error) {
            throw new Error(`Error al eliminar el producto: ${error.message}`);
        }
    }
}

export default ProductManager;
